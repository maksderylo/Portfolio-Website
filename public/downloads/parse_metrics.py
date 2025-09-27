import csv
import json
import argparse
from pathlib import Path
from statistics import mean
from typing import Dict, Any, List, Optional, Tuple, Union

Numeric = Union[int, float]

DEFAULT_THRESHOLDS = { # According to SEP guidelines
    "module_sloc_max": 400,
    "cyclomatic_avg_max": 10,
    "cyclomatic_max_max": 20,
    "wmc_max": 20,
    "functions_per_module_max": 20,
    "comment_percent_min": 15.0,
}

FUNCTION_TYPES = {
    "Function", "Public Method", "Ambiguous Method",
    "Unnamed Function", "Method"
}

CLASS_TYPES = {"Class"}

FILE_TYPES = {"File"}

def parse_args():
    ap = argparse.ArgumentParser(description="Parse raw metrics CSV into project quality metrics.")
    ap.add_argument("--input", required=True, help="Path to metrics CSV (e.g. frontend_metrics.csv)")
    ap.add_argument("--config", help="JSON mapping file (column indices)")
    ap.add_argument("--output", help="Write aggregated JSON report")
    ap.add_argument("--markdown", action="store_true", help="Print markdown summary")
    ap.add_argument("--debug", action="store_true", help="Print debug samples")
    # Threshold overrides
    for k, v in DEFAULT_THRESHOLDS.items():
        ap.add_argument(f"--{k.replace('_','-')}", type=float, help=f"Override threshold {k} (default {v})")
    return ap.parse_args()

def load_config(path: Optional[str]) -> Dict[str, Any]:
    if not path:
        return {}
    with open(path, "r", encoding="utf-8") as f:
        return json.load(f)

def get_idx(spec: Union[int, str], length: int) -> int:
    if isinstance(spec, int):
        return spec if spec >= 0 else length + spec
    raise ValueError("Index spec must be int (supports negative)")

def safe_number(val: str) -> Optional[Numeric]:
    if val is None or val.strip() == "":
        return None
    try:
        if "." in val:
            return float(val)
        return int(val)
    except ValueError:
        return None

def extract_by_mapping(row: List[str], mapping: Dict[str, int]) -> Dict[str, Numeric]:
    out = {}
    for key, idx_spec in mapping.items():
        if key in ("type", "name"):
            continue
        try:
            idx = get_idx(idx_spec, len(row))
            if 0 <= idx < len(row):
                num = safe_number(row[idx])
                if num is not None:
                    out[key] = num
        except Exception:
            pass
    return out

def heuristic_numbers(row: List[str]) -> Dict[str, Numeric]:
    """Fallback heuristic if no mapping provided: pick largest int as sloc; max small int as cyclomatic."""
    nums: List[Tuple[int, Numeric]] = []
    for i, v in enumerate(row):
        n = safe_number(v)
        if n is not None:
            nums.append((i, n))
    if not nums:
        return {}
    ints = [n for i, n in nums if isinstance(n, int)]
    result = {}
    if ints:
        sloc = max(ints)
        result["sloc"] = sloc
        small = [x for x in ints if 0 < x <= 50]
        if small:
            result["cyclomatic"] = max(small)
            result["wmc"] = result["cyclomatic"]
    return result

def evaluate_thresholds(agg: Dict[str, Any], thresholds: Dict[str, float]) -> Dict[str, Dict[str, Any]]:
    checks = {}
    # Module SLOC
    for mod, sloc in agg["modules"]["sloc"].items():
        checks[f"module_sloc::{mod}"] = {
            "value": sloc,
            "threshold": thresholds["module_sloc_max"],
            "pass": sloc <= thresholds["module_sloc_max"]
        }
    # Cyclomatic avg / max
    c_avg = agg["functions"]["cyclomatic_avg"]
    c_max = agg["functions"]["cyclomatic_max"]
    checks["cyclomatic_avg"] = {
        "value": c_avg, "threshold": thresholds["cyclomatic_avg_max"],
        "pass": c_avg <= thresholds["cyclomatic_avg_max"]
    }
    checks["cyclomatic_max"] = {
        "value": c_max, "threshold": thresholds["cyclomatic_max_max"],
        "pass": c_max <= thresholds["cyclomatic_max_max"]
    }
    # WMC
    for cls, w in agg["classes"]["wmc"].items():
        checks[f"wmc::{cls}"] = {
            "value": w, "threshold": thresholds["wmc_max"],
            "pass": w <= thresholds["wmc_max"]
        }
    # Functions per module (approx)
    for mod, count in agg["modules"]["function_counts"].items():
        checks[f"functions_per_module::{mod}"] = {
            "value": count, "threshold": thresholds["functions_per_module_max"],
            "pass": count <= thresholds["functions_per_module_max"]
        }

    # Comment %
    if agg["global"].get("comment_percent") is not None:
        checks["comment_percent"] = {
            "value": agg["global"]["comment_percent"],
            "threshold": thresholds["comment_percent_min"],
            "pass": agg["global"]["comment_percent"] >= thresholds["comment_percent_min"]
        }
    # Per-file comment %
    for fname, cp in agg["modules"].get("comment_percent", {}).items():
        checks[f"comment_percent::{fname}"] = {
            "value": cp,
            "threshold": thresholds["comment_percent_min"],
            "pass": cp >= thresholds["comment_percent_min"]
        }
    return checks

def build_markdown(report: Dict[str, Any]) -> str:
    checks = report["checks"]
    lines = []
    lines.append("### Code Quality Metrics Summary")
    lines.append("")
    lines.append("| Metric | Value | Threshold | Pass |")
    lines.append("|--------|-------|-----------|------|")
    for k, v in sorted(checks.items()):
        val = v["value"]
        thr = v["threshold"]
        ok = "✅" if v["pass"] else "❌"
        lines.append(f"| {k} | {val} | {thr} | {ok} |")

    lines.append("")
    lines.append("SLOC - Software Lines of Code")
    lines.append("WMC - Weighted Methods per Class")
    lines.append("Importantly:")
    lines.append("This report doesn't contain code duplication, coupling and cyclic dependencies.")
    lines.append("For that, install the artifact uploaded and open index.html")

    if report["notes"]:
        lines.append("")
        lines.append("> Notes:")
        for n in report["notes"]:
            lines.append(f"> - {n}")

    return "\n".join(lines)

def main():
    args = parse_args()
    config = load_config(args.config)
    mapping = config.get("columns", {}) if config else {}
    thresholds = DEFAULT_THRESHOLDS.copy()
    for k in list(thresholds.keys()):
        cli_val = getattr(args, k, None)
        if cli_val is not None:
            thresholds[k] = cli_val

    header: Optional[List[str]] = None
    idx_code: Optional[int] = None
    idx_comment: Optional[int] = None
    rows: List[List[str]] = []
    with open(args.input, newline="", encoding="utf-8") as f:
        reader = csv.reader(f)
        for r in reader:
            if not any(c.strip() for c in r):
                continue
            if header is None:
                header = r
                # Detect indices for required columns
                try:
                    idx_code = header.index("CountLineCode")
                    idx_comment = header.index("CountLineComment")
                except ValueError:
                    idx_code = idx_comment = None
                # Skip header
                continue
            rows.append(r)

    modules = {
        "sloc": {},
        "function_counts": {},
        "comment_percent": {},
    }
    classes = {
        "wmc": {},
    }
    functions_cyclo: List[float] = []
    notes: List[str] = []
    FUNC_BUCKET = "<all>"

    total_comment_lines = 0
    total_code_lines = 0

    for row in rows:
        if len(row) < 2:
            continue
        etype = row[mapping.get("type", 0)] if mapping.get("type", 0) < len(row) else row[0]
        name = row[mapping.get("name", 1)] if mapping.get("name", 1) < len(row) else row[1]

        metrics = extract_by_mapping(row, mapping) if mapping else heuristic_numbers(row)

        if etype == "File" and idx_code is not None and idx_comment is not None:
            code_val = safe_number(row[idx_code]) or 0
            comment_val = safe_number(row[idx_comment]) or 0
            if code_val > 0:
                total_code_lines += int(code_val)
                total_comment_lines += int(comment_val)
                modules["comment_percent"][name] = (comment_val / code_val) * 100.0
            else:
                if comment_val > 0:
                    notes.append(f"Ignored comment-only file {name} in global comment percentage.")
        if etype in FILE_TYPES:
            sloc = metrics.get("sloc")
            if sloc is not None:
                modules["sloc"][name] = int(sloc)
            else:
                if etype == "File" and idx_code is not None:
                    code_val = safe_number(row[idx_code])
                    if code_val is not None:
                        modules["sloc"][name] = int(code_val)
                if name not in modules["sloc"]:
                    notes.append(f"No SLOC found for file {name}")

        if etype in CLASS_TYPES:
            if "wmc" in metrics:
                classes["wmc"][name] = int(metrics["wmc"])
            elif "cyclomatic" in metrics:
                classes["wmc"][name] = int(metrics["cyclomatic"])

        if etype in FUNCTION_TYPES:
            cy = metrics.get("cyclomatic")
            if cy is not None:
                functions_cyclo.append(float(cy))
            modules["function_counts"].setdefault(FUNC_BUCKET, 0)
            modules["function_counts"][FUNC_BUCKET] += 1

    if not modules["sloc"]:
        modules["sloc"][FUNC_BUCKET] = max(functions_cyclo) if functions_cyclo else 0
        notes.append("Synthetic module SLOC used (no file SLOC columns mapped).")

    cyclomatic_avg = mean(functions_cyclo) if functions_cyclo else 0.0
    cyclomatic_max = max(functions_cyclo) if functions_cyclo else 0.0

    if not classes["wmc"] and functions_cyclo:
        classes["wmc"]["<aggregate>"] = int(round(cyclomatic_avg))
        notes.append("WMC derived from average cyclomatic (no class WMC column mapped).")

    if idx_code is None or idx_comment is None:
        comment_percent_global = None
        notes.append("Comment percentage columns (CountLineCode / CountLineComment) not found in header.")
    else:
        if total_code_lines > 0:
            comment_percent_global = (total_comment_lines / total_code_lines) * 100.0
        else:
            comment_percent_global = None
            notes.append("No code lines found to compute comment percentage.")

    aggregated = {
        "modules": modules,
        "classes": classes,
        "functions": {
            "cyclomatic_avg": cyclomatic_avg,
            "cyclomatic_max": cyclomatic_max,
            "count": len(functions_cyclo)
        },
        "global": {
            "comment_percent": comment_percent_global
        }
    }

    checks = evaluate_thresholds(aggregated, DEFAULT_THRESHOLDS)
    report = {
        "aggregated": aggregated,
        "checks": checks,
        "notes": notes,
        "thresholds": DEFAULT_THRESHOLDS
    }

    print(build_markdown(report))

if __name__ == "__main__":
    main()


// Automatic Markdown Post Loader
// Dynamically discovers and loads all markdown files in src/posts using webpack's require.context.
// New .md files added to src/posts will automatically appear on the blog.

// Lightweight frontmatter parser (YAML-like subset) to avoid gray-matter + js-yaml bundle bloat & node polyfills
// Supports lines: key: value, quoted strings, arrays [a, b], JSON arrays, and tags: ["a", "b"].
function parseFrontMatter(raw) {
  const fmMatch = raw.match(/^---\n([\s\S]*?)\n---\n?/);
  if (!fmMatch) {
    return { data: {}, content: raw };
  }
  const fmBlock = fmMatch[1];
  const content = raw.slice(fmMatch[0].length);
  const data = {};
  fmBlock.split(/\r?\n/).forEach(line => {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) return;
    const idx = trimmed.indexOf(':');
    if (idx === -1) return;
    const key = trimmed.slice(0, idx).trim();
    let value = trimmed.slice(idx + 1).trim();
    if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
      value = value.slice(1, -1);
    } else if (/^\[.*\]$/.test(value)) {
      // Try JSON parse for arrays
      try {
        value = JSON.parse(value.replace(/(['\"])?([A-Za-z0-9_\-]+)(['\"])?/g, (m, q1, word, q2) => {
          // ensure strings are quoted properly for JSON parse when missing quotes and not numbers
          if (q1 || q2) return m; // already quoted
          if (/^-?\d+(\.\d+)?$/.test(word)) return word; // number
          return `"${word}"`;
        }));
      } catch {
        value = value.slice(1, -1).split(',').map(v => v.trim().replace(/^['\"]|['\"]$/g, ''));
      }
    }
    data[key] = value;
  });
  return { data, content };
}

// Create a safe markdown context (works in CRA / Webpack). Provide fallback for non-webpack environments.
let markdownContext;
try {
  // eslint-disable-next-line no-undef
  markdownContext = require.context('../posts', false, /\.md$/);
} catch (e) {
  console.warn('Markdown dynamic loader: require.context not available. No posts will be loaded in this environment.');
  const empty = (key) => { throw new Error(`No markdown context available for key ${key}`); };
  empty.keys = () => [];
  markdownContext = empty;
}

// Helper: load raw text of a code asset (py/js/ts/sh/txt) from posts directory
let codeContext;
try {
  // eslint-disable-next-line no-undef
  codeContext = require.context('../posts', false, /\.(py|js|ts|sh|txt)$/);
} catch (e) {
  const empty = (k) => { throw new Error('no code context'); }; empty.keys = () => []; codeContext = empty;
}

// In-memory cache so we only fetch/parse each post once per session
const postCache = {};

// Utility: derive an excerpt if not provided in frontmatter
const deriveExcerpt = (content) => {
  if (!content) return '';
  const cleaned = content.replace(/^---[\s\S]*?---/, '').trim();
  const paragraph = cleaned.split(/\n\s*\n/).find(p => p.trim().length > 0) || '';
  const noMd = paragraph
    .replace(/`{1,3}[^`]*`{1,3}/g, '')
    .replace(/\*\*([^*]+)\*\*/g, '$1')
    .replace(/\*([^*]+)\*/g, '$1')
    .replace(/\[(.*?)\]\([^)]*\)/g, '$1')
    .replace(/#+\s*(.*)/g, '$1')
    .replace(/>\s?/g, '')
    .replace(/`/g, '')
    .trim();
  return noMd.length > 240 ? noMd.slice(0, 237) + '...' : noMd;
};

const loadCodeAsset = async (filename, visited = new Set()) => {
  const safe = filename.trim();
  if (!safe) return '';
  if (visited.has(safe)) return `// Skipped recursive include ${safe}`;
  const key = `./${safe}`;
  if (!codeContext.keys().includes(key)) return `// Include not found: ${safe}`;
  try {
    const imported = codeContext(key);
    let raw;
    const looksLikeUrl = typeof imported === 'string' && !imported.includes('\n');
    if (looksLikeUrl) {
      try { const res = await fetch(imported); if (res.ok) { raw = await res.text(); } else raw = imported; } catch { raw = imported; }
    } else { raw = imported; }
    if (typeof raw !== 'string') return `// Unsupported asset for include: ${safe}`;
    visited.add(safe);
    // Support nested includes inside code? Probably not necessary; skip to avoid confusion.
    return raw;
  } catch (err) {
    return `// Error loading include ${safe}: ${err.message}`;
  }
};

function guessLanguage(filename) {
  if (/\.tsx?$/.test(filename)) return 'ts';
  if (/\.py$/.test(filename)) return 'python';
  if (/\.sh$/.test(filename)) return 'bash';
  if (/\.jsx?$/.test(filename)) return 'javascript';
  if (/\.txt$/.test(filename)) return 'text';
  return '';
}

async function expandIncludes(markdown) {
  if (!markdown) return markdown;

  // Pattern 1: {{include:filename.ext}}
  const includePattern = /\{\{include:([^}]+)\}\}/g;
  let result = markdown;
  const pending = [];
  const replacements = [];
  let match;
  while ((match = includePattern.exec(markdown)) !== null) {
    const full = match[0];
    const fname = match[1].trim();
    pending.push(loadCodeAsset(fname).then(code => {
      const lang = guessLanguage(fname);
      const fenced = `\n\n\`\`\`${lang ? lang : ''}\n${code.replace(/`/g, '`')}\n\`\`\`\n\n`;
      replacements.push({ full, fenced });
    }));
  }
  await Promise.all(pending);
  replacements.forEach(r => { result = result.split(r.full).join(r.fenced); });

  // Pattern 2: fenced block style: ```include filename.ext```
  const fencedRegex = /```include\s+([^\n`]+)```/g;
  match = null;
  const fencedReplacements = [];
  while ((match = fencedRegex.exec(result)) !== null) {
    const token = match[0];
    const fname = match[1].trim();
    fencedReplacements.push({ token, fname });
  }
  for (const fr of fencedReplacements) {
    const code = await loadCodeAsset(fr.fname);
    const lang = guessLanguage(fr.fname);
    const fenced = `\n\n\`\`\`${lang ? lang : ''}\n${code.replace(/`/g, '`')}\n\`\`\`\n\n`;
    result = result.split(fr.token).join(fenced);
  }

  return result;
}

const loadPostFromKey = async (key) => {
  const slug = key.replace('./', '').replace(/\.md$/, '');
  if (postCache[slug]) return postCache[slug];
  try {
    const imported = markdownContext(key);
    let raw;
    const looksLikeUrl = typeof imported === 'string' && /\.(md)(\?|$)/.test(imported) && !imported.includes('\n');
    if (looksLikeUrl) {
      try {
        const res = await fetch(imported);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        raw = await res.text();
      } catch (fetchErr) {
        console.warn(`Fetch failed for ${imported}, treating value as raw content fallback.`, fetchErr);
        raw = imported;
      }
    } else {
      raw = imported;
    }
    if (typeof raw !== 'string') {
      console.error('Markdown content not a string for', key, 'value:', raw);
      return null;
    }
    const { data, content } = parseFrontMatter(raw);
    // Expand include directives in content
    const expanded = await expandIncludes(content);
    let tags = data.tags;
    if (typeof tags === 'string') {
      if (tags.startsWith('[') && tags.endsWith(']')) {
        try { tags = JSON.parse(tags); } catch { tags = tags.slice(1, -1).split(',').map(t => t.trim()); }
      } else {
        tags = tags.split(/[,;]/).map(t => t.trim()).filter(Boolean);
      }
    }
    if (!Array.isArray(tags)) tags = [];
    const post = {
      slug,
      title: data.title || slug,
      date: data.date ? new Date(data.date) : new Date(),
      tags,
      excerpt: data.excerpt || deriveExcerpt(content),
      content: expanded.trim()
    };
    postCache[slug] = post;
    return post;
  } catch (err) {
    console.error(`Error loading post ${key}:`, err);
    return null;
  }
};

// Helper: load static postsIndex.json (build-time generated) – primary source in production
let staticIndexPromise = null;
async function loadStaticIndex() {
  if (staticIndexPromise) return staticIndexPromise;
  const base = (process.env.PUBLIC_URL && process.env.PUBLIC_URL !== '/') ? process.env.PUBLIC_URL.replace(/\/$/, '') : '';
  const url = base ? `${base}/postsIndex.json` : 'postsIndex.json';
  staticIndexPromise = fetch(url, { cache: 'no-cache' })
    .then(res => {
      if (!res.ok) throw new Error(`postsIndex.json status ${res.status}`);
      return res.json();
    })
    .then(list => {
      if (!Array.isArray(list)) throw new Error('postsIndex.json malformed (not array)');
      list.forEach(p => { postCache[p.slug] = { ...p, date: p.date ? new Date(p.date) : new Date() }; });
      return list.map(p => ({ ...p, date: p.date ? new Date(p.date) : new Date() }));
    })
    .catch(err => {
      console.warn('[postLoader] loadStaticIndex failed:', err);
      staticIndexPromise = null; // allow retry
      return null;
    });
  return staticIndexPromise;
}

export const loadAllPosts = async () => {
  try {
    // In production prefer static index to avoid CORS/relative path issues with emitted .md assets
    if (process.env.NODE_ENV === 'production') {
      const staticList = await loadStaticIndex();
      if (staticList && staticList.length) {
        return staticList.sort((a, b) => b.date - a.date);
      }
      // fall through to dynamic if static failed
    }

    const keys = markdownContext.keys();
    console.log('[postLoader] Discovered markdown keys:', keys);
    let posts = await Promise.all(keys.map(loadPostFromKey));
    posts = posts.filter(Boolean);
    console.log('[postLoader] Parsed posts from require.context:', posts.map(p => ({ slug: p.slug, title: p.title, date: p.date })));

    if (!posts.length) {
      // Fallback: try static JSON index generated at build time (also for development if dynamic failed)
      const fallbackList = await loadStaticIndex();
      if (fallbackList) return fallbackList.sort((a, b) => b.date - a.date);
    }

    return posts.sort((a, b) => b.date - a.date);
  } catch (error) {
    console.error('Failed to load posts:', error);
    const staticList = await loadStaticIndex();
    return staticList ? staticList.sort((a, b) => b.date - a.date) : [];
  }
};

export const loadPostBySlug = async (slug) => {
  // If already cached return
  if (postCache[slug]) return postCache[slug];

  // Production: try static index first (ensures consistent content on GH Pages)
  if (process.env.NODE_ENV === 'production') {
    const staticList = await loadStaticIndex();
    if (staticList) {
      return postCache[slug] || null;
    }
  }

  const key = `./${slug}.md`;
  if (markdownContext.keys().includes(key)) {
    const loaded = await loadPostFromKey(key);
    if (loaded) return loaded;
  }
  // Fallback: attempt static index (dev path)
  const staticList = await loadStaticIndex();
  if (staticList) return postCache[slug] || null;
  return null;
};

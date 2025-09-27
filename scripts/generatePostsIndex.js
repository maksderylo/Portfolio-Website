#!/usr/bin/env node
/*
 Generates public/postsIndex.json by scanning src/posts/*.md
 Allows runtime code to fall back to a static index if webpack require.context fails to load markdown as expected.
*/
const fs = require('fs');
const path = require('path');

const POSTS_DIR = path.join(__dirname, '..', 'src', 'posts');
const OUTPUT_FILE = path.join(__dirname, '..', 'public', 'postsIndex.json');

function parseFrontMatter(raw) {
  const fmMatch = raw.match(/^---\n([\s\S]*?)\n---\n?/);
  if (!fmMatch) return { data: {}, content: raw };
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
      try { value = JSON.parse(value); } catch { value = value.slice(1, -1).split(',').map(v => v.trim()); }
    }
    data[key] = value;
  });
  return { data, content };
}

function deriveExcerpt(content) {
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
}

function guessLang(filename) {
  if (/\.py$/.test(filename)) return 'python';
  if (/\.tsx?$/.test(filename)) return 'ts';
  if (/\.jsx?$/.test(filename)) return 'javascript';
  if (/\.sh$/.test(filename)) return 'bash';
  if (/\.txt$/.test(filename)) return 'text';
  return '';
}

function expandIncludesSync(markdown, baseDir, visited = new Set()) {
  if (!markdown) return markdown;
  let result = markdown;

  // Pattern 1: {{include:filename.ext}}
  const includePattern = /\{\{include:([^}]+)\}\}/g;
  let match;
  while ((match = includePattern.exec(result)) !== null) {
    const full = match[0];
    const fname = match[1].trim();
    const replaced = loadIncludeFile(fname, baseDir, visited);
    result = result.replace(full, replaced);
  }

  // Pattern 2: ```include filename.ext```
  const fencedPattern = /```include\s+([^\n`]+)```/g;
  while ((match = fencedPattern.exec(result)) !== null) {
    const full = match[0];
    const fname = match[1].trim();
    const replaced = loadIncludeFile(fname, baseDir, visited);
    result = result.replace(full, replaced);
  }

  return result;
}

function loadIncludeFile(fname, baseDir, visited) {
  const safe = fname.replace(/\.+/g, '.');
  if (visited.has(safe)) return `\n\n\`\`\`text\n// Skipped recursive include ${safe}\n\`\`\`\n\n`;
  const fullPath = path.join(baseDir, safe);
  if (!fs.existsSync(fullPath)) {
    return `\n\n\`\`\`text\n// Include not found: ${safe}\n\`\`\`\n\n`;
  }
  try {
    visited.add(safe);
    const raw = fs.readFileSync(fullPath, 'utf8');
    // (Optional) Nested includes inside included file are NOT expanded to keep things predictable
    const lang = guessLang(safe);
    return `\n\n\`\`\`${lang}\n${raw.replace(/`/g, '`')}\n\`\`\`\n\n`;
  } catch (e) {
    return `\n\n\`\`\`text\n// Error including ${safe}: ${e.message}\n\`\`\`\n\n`;
  }
}

function buildIndex() {
  if (!fs.existsSync(POSTS_DIR)) {
    console.error('Posts directory does not exist:', POSTS_DIR);
    process.exit(0);
  }
  const files = fs.readdirSync(POSTS_DIR).filter(f => f.endsWith('.md'));
  const posts = files.map(filename => {
    const full = path.join(POSTS_DIR, filename);
    let raw = fs.readFileSync(full, 'utf8');
    raw = expandIncludesSync(raw, POSTS_DIR); // expand includes before parsing frontmatter
    const { data, content } = parseFrontMatter(raw);
    let tags = data.tags;
    if (typeof tags === 'string') {
      if (tags.startsWith('[') && tags.endsWith(']')) {
        try { tags = JSON.parse(tags); } catch { tags = tags.slice(1, -1).split(',').map(t => t.trim()); }
      } else {
        tags = tags.split(/[,;]/).map(t => t.trim()).filter(Boolean);
      }
    }
    if (!Array.isArray(tags)) tags = [];
    const slug = filename.replace(/\.md$/, '');
    return {
      slug,
      title: data.title || slug,
      date: data.date || new Date().toISOString(),
      tags,
      excerpt: data.excerpt || deriveExcerpt(content),
      content: content.trim()
    };
  });
  posts.sort((a, b) => new Date(b.date) - new Date(a.date));
  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(posts, null, 2));
  console.log(`Generated postsIndex.json with ${posts.length} posts at ${OUTPUT_FILE}`);
}

buildIndex();

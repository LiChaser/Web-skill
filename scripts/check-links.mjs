#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');
const markdownFiles = [];

function walk(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.name === '.git' || entry.name === 'node_modules' || entry.name === 'source' || entry.name === 'references') continue;
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      walk(fullPath);
      continue;
    }
    if (entry.name.endsWith('.md')) markdownFiles.push(fullPath);
  }
}

walk(root);

const linkPattern = /\[[^\]]*\]\(([^)]+)\)/g;
const errors = [];
const skippedSchemes = ['http://', 'https://', 'mailto:', 'tel:', 'codex:', 'app:', 'data:', 'javascript:'];

for (const fullPath of markdownFiles) {
  const relative = path.relative(root, fullPath).replace(/\\/g, '/');
  const lines = fs.readFileSync(fullPath, 'utf8').split(/\r?\n/);
  let inFence = false;
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const trimmed = line.trim();
    if (trimmed.startsWith(String.fromCharCode(96).repeat(3)) || trimmed.startsWith('~~~')) {
      inFence = !inFence;
      continue;
    }
    if (inFence) continue;
    let match;
    linkPattern.lastIndex = 0;
    while ((match = linkPattern.exec(line)) !== null) {
      let target = match[1].trim();
      if (target.startsWith('<') && target.endsWith('>')) target = target.slice(1, -1);
      if (!target || target.startsWith('#') || skippedSchemes.some((scheme) => target.startsWith(scheme))) continue;
      const withoutAnchor = target.split('#')[0].split('?')[0];
      if (!withoutAnchor) continue;
      let decoded;
      try {
        decoded = decodeURIComponent(withoutAnchor);
      } catch {
        decoded = withoutAnchor;
      }
      const resolved = path.resolve(path.dirname(fullPath), decoded);
      if (!fs.existsSync(resolved)) {
        errors.push(relative + ':' + (i + 1) + ' -> ' + target);
      }
    }
  }
}

if (errors.length > 0) {
  console.error('发现无效的本地链接：');
  for (const error of errors) console.error('- ' + error);
  process.exit(1);
}

console.log('本地 Markdown 链接检查通过（' + markdownFiles.length + ' 个文件）。');

#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');
const rawArgs = process.argv.slice(2);
const dryRun = rawArgs.includes('--dry-run');
const positional = rawArgs.filter((arg) => !arg.startsWith('--'));
const owner = positional[0];
const repo = positional[1] || 'web-ctf-playbook';

if (!owner || !/^[A-Za-z0-9_.-]+$/.test(owner) || !/^[A-Za-z0-9_.-]+$/.test(repo)) {
  console.error('用法：node scripts/configure-repo.mjs <github-owner> [repo-name] [--dry-run]');
  console.error('示例：node scripts/configure-repo.mjs your-name web-ctf-playbook');
  process.exit(1);
}

const cloneUrl = 'https://github.com/' + owner + '/' + repo + '.git';
const webUrl = 'https://github.com/' + owner + '/' + repo;
const replacements = [
  ['<your-repo-url>', cloneUrl],
  ['<repo-url>', webUrl],
  ['<owner>', owner],
];

const targets = [
  'README.md',
  'README.en.md',
  'index.md',
  'docs/launch-kit.md',
  'docs/publishing.md',
];

for (const target of targets) {
  const fullPath = path.join(root, target);
  if (!fs.existsSync(fullPath)) continue;
  let content = fs.readFileSync(fullPath, 'utf8');
  for (const [from, to] of replacements) content = content.split(from).join(to);
  if (!dryRun) fs.writeFileSync(fullPath, content, 'utf8');
  console.log((dryRun ? 'would update ' : 'updated ') + target);
}

console.log((dryRun ? '将配置为：' : '仓库地址已配置为：') + webUrl);
console.log('下一步：运行 npm run check，然后创建 GitHub 仓库并推送 main。');

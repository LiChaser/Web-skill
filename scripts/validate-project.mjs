#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');
const errors = [];
const requiredFiles = [
  'SKILL.md',
  'README.md',
  'README.en.md',
  'index.md',
  'package.json',
  '.gitattributes',
  'agents/openai.yaml',
  'source/本科web笔记.md',
  'references/00-recon-and-tricks.md',
  'references/01-rce-and-files.md',
  'references/02-sqli-ssrf-and-protocols.md',
  'references/03-ssti-xss-node.md',
  'references/04-python-and-deserialization.md',
  'references/05-php-and-pear.md',
  'references/06-php-functions.md',
  'references/07-comprehensive-and-src.md',
  'docs/recipes.md',
  'docs/launch-kit.md',
  'docs/quickstart.md',
  'docs/knowledge-map.md',
  'docs/cheatsheet.md',
  'docs/reference-index.md',
  'assets/banner.svg',
  'assets/logo.svg',
  'assets/demo.svg',
  'assets/social-preview.svg',
  'assets/social-preview.png',
  'scripts/search-notes.mjs',
  'scripts/rebuild-references.mjs',
  'scripts/validate-project.mjs',
  'scripts/generate-social-preview.py',
  'scripts/check-links.mjs',
  'scripts/configure-repo.mjs',
];

for (const file of requiredFiles) {
  if (!fs.existsSync(path.join(root, file))) errors.push(`缺少文件：${file}`);
}

const skillPath = path.join(root, 'SKILL.md');
if (fs.existsSync(skillPath)) {
  const skill = fs.readFileSync(skillPath, 'utf8');
  if (!skill.startsWith('---\n')) errors.push('SKILL.md 缺少 YAML frontmatter');
  if (!/^name:\s*web-ctf-playbook\s*$/m.test(skill)) errors.push('SKILL.md 的 name 应为 web-ctf-playbook');
  if (!/^description:\s*.+$/m.test(skill)) errors.push('SKILL.md 缺少 description');
}

const sourcePath = path.join(root, 'source', '本科web笔记.md');
if (fs.existsSync(sourcePath)) {
  const source = fs.readFileSync(sourcePath, 'utf8');
  const sourceHeadings = source.split(/\r?\n/).filter((line) => /^##\s/.test(line));
  const refsDir = path.join(root, 'references');
  const refsText = fs.readdirSync(refsDir)
    .filter((file) => file.endsWith('.md'))
    .map((file) => fs.readFileSync(path.join(refsDir, file), 'utf8'))
    .join('\n');
  for (const heading of sourceHeadings) {
    if (!refsText.includes(heading)) errors.push(`references 缺少原章节：${heading}`);
  }
  if (sourceHeadings.length !== 33) errors.push(`source 一级章节数应为 33，当前为 ${sourceHeadings.length}`);
}

const textExtensions = new Set(['.md', '.json', '.yml', '.yaml', '.mjs', '.js', '.py', '.svg', '.txt']);
const textNames = new Set(['LICENSE', '.editorconfig', '.gitignore']);
const textFiles = [];
function collectTextFiles(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.name === '.git' || entry.name === 'node_modules') continue;
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      collectTextFiles(fullPath);
      continue;
    }
    if (textExtensions.has(path.extname(entry.name)) || textNames.has(entry.name)) {
      textFiles.push(path.relative(root, fullPath).replace(/\\/g, '/'));
    }
  }
}
collectTextFiles(root);

for (const file of textFiles) {
  const buffer = fs.readFileSync(path.join(root, file));
  if (buffer.length >= 3 && buffer[0] === 0xef && buffer[1] === 0xbb && buffer[2] === 0xbf) {
    errors.push(`文件包含 UTF-8 BOM：${file}`);
  }
  const text = buffer.toString('utf8');
  if (text.includes('\r\n')) errors.push(`文件包含 CRLF：${file}`);
}

const indexPath = path.join(root, 'index.md');
if (fs.existsSync(indexPath) && !fs.readFileSync(indexPath, 'utf8').startsWith('---\n')) {
  errors.push('index.md 缺少 YAML frontmatter');
}

const recipesPath = path.join(root, 'docs', 'recipes.md');
if (fs.existsSync(recipesPath)) {
  const recipes = fs.readFileSync(recipesPath, 'utf8');
  const recipeCount = (recipes.match(/^## \d+\./gm) || []).length;
  if (recipeCount !== 12) errors.push(`docs/recipes.md 应有 12 条场景，当前为 ${recipeCount}`);
}

try {
  JSON.parse(fs.readFileSync(path.join(root, 'package.json'), 'utf8'));
} catch (error) {
  errors.push(`package.json 不是有效 JSON：${error.message}`);
}

if (errors.length > 0) {
  console.error('项目校验失败：');
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}

console.log('项目校验通过：结构、frontmatter、章节覆盖、编码和 package.json 均正常。');

#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');
const refsDir = path.join(root, 'references');
const args = process.argv.slice(2);

let list = false;
let stats = false;
let json = false;
let caseSensitive = false;
let context = 0;
const queryParts = [];

for (let i = 0; i < args.length; i++) {
  const arg = args[i];
  if (arg === '--list') list = true;
  else if (arg === '--stats') stats = true;
  else if (arg === '--json') json = true;
  else if (arg === '--case-sensitive') caseSensitive = true;
  else if (arg === '--context') {
    context = Number(args[++i] ?? 0);
    if (!Number.isInteger(context) || context < 0) {
      console.error('--context 需要一个大于等于 0 的整数。');
      process.exit(1);
    }
  } else if (arg === '--help' || arg === '-h') {
    console.log('用法：node scripts/search-notes.mjs <关键词> [--context N] [--json] [--case-sensitive]');
    console.log('      node scripts/search-notes.mjs --list');
    console.log('      node scripts/search-notes.mjs --stats');
    process.exit(0);
  } else {
    queryParts.push(arg);
  }
}

const files = fs.readdirSync(refsDir).filter((file) => file.endsWith('.md')).sort();

if (stats) {
  const rows = files.map((file) => {
    const text = fs.readFileSync(path.join(refsDir, file), 'utf8');
    const lines = text.split(/\r?\n/);
    const headings = lines.filter((line) => /^#{1,6}\s/.test(line)).length;
    return { file, lines: lines.length, headings, chars: text.length };
  });
  const totals = rows.reduce((acc, row) => {
    acc.files += 1;
    acc.lines += row.lines;
    acc.headings += row.headings;
    acc.chars += row.chars;
    return acc;
  }, { files: 0, lines: 0, headings: 0, chars: 0 });
  if (json) {
    console.log(JSON.stringify({ totals, files: rows }, null, 2));
  } else {
    console.log('Web CTF Playbook stats');
    console.log('files=' + totals.files + ' lines=' + totals.lines + ' headings=' + totals.headings + ' chars=' + totals.chars);
    for (const row of rows) {
      console.log(row.file + '  lines=' + row.lines + ' headings=' + row.headings + ' chars=' + row.chars);
    }
  }
  process.exit(0);
}

if (list) {
  const wrapperHeadings = new Set([
    '原文前置信息与知识地图',
    '一、通用技巧',
    '二、HTTP 请求基础',
    '四、Web 题目常见 Trick',
    '五、SSI 注入',
    '二十一、其他小专题',
    '三、PHP 版本相关',
    '六、命令执行（RCE）',
    '七、代码执行',
    '八、文件包含',
    '九、文件上传',
    '十、Java 命令执行与 OQL 查询',
    '十一、SQL 注入',
    '十三、Git 题目',
    '十四、Java 题目',
    '十五、JWT 题目',
    '十六、XXE 题目',
    '十七、SSRF 题目',
    '十八、服务端模板注入（SSTI）',
    '十九、XSS 专题',
    '二十、Node.js 题目',
    '十二、Flask 题目',
    '二十二、Python 用法',
    '二十三、Pickle 反序列化',
    '二十八、FastAPI',
    '二十九、XPath 注入',
    '二十四、PHP 题目',
    '二十五、PEAR 包含',
    '二十七、PHP 反序列化',
    '二十六、PHP 函数速查',
    '三十、综合例题',
    '三十一、常见问题',
    '三十二、SRC 挖洞之路'
  ]);
  for (const file of files) {
    console.log(file);
    const lines = fs.readFileSync(path.join(refsDir, file), 'utf8').split(/\r?\n/);
    for (const line of lines) {
      if (/^##\s/.test(line)) {
        const heading = line.replace(/^##\s+/, '');
        if (!wrapperHeadings.has(heading)) console.log('  ' + heading);
      }
    }
  }
  process.exit(0);
}

const query = queryParts.join(' ').trim();
if (!query) {
  console.error('用法：node scripts/search-notes.mjs <关键词> [--context N] [--json] [--case-sensitive]');
  console.error('      node scripts/search-notes.mjs --list');
  console.error('      node scripts/search-notes.mjs --stats');
  process.exit(1);
}

const normalize = (value) => caseSensitive ? value : value.toLowerCase();
const needle = normalize(query);
const results = [];

for (const file of files) {
  const fullPath = path.join(refsDir, file);
  const lines = fs.readFileSync(fullPath, 'utf8').split(/\r?\n/);
  for (let i = 0; i < lines.length; i++) {
    if (normalize(lines[i]).includes(needle)) {
      results.push({
        file,
        line: i + 1,
        text: lines[i].trim(),
        before: context > 0 ? lines.slice(Math.max(0, i - context), i) : [],
        after: context > 0 ? lines.slice(i + 1, Math.min(lines.length, i + 1 + context)) : [],
      });
    }
  }
}

if (json) {
  console.log(JSON.stringify({ query, count: results.length, results }, null, 2));
} else if (results.length > 0) {
  for (const hit of results) {
    if (context > 0 && hit.before.length > 0) {
      for (const line of hit.before) console.log('  ' + line);
    }
    console.log(hit.file + ':' + hit.line + ': ' + hit.text);
    if (context > 0 && hit.after.length > 0) {
      for (const line of hit.after) console.log('  ' + line);
    }
    if (context > 0) console.log('');
  }
} else {
  console.log('未找到：' + query);
  process.exitCode = 2;
}

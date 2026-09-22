#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');
const args = process.argv.slice(2);
const check = args.includes('--check');
const sourceArg = args.find((arg) => !arg.startsWith('--'));
const sourcePath = sourceArg ? path.resolve(process.cwd(), sourceArg) : path.join(root, 'source', '本科web笔记.md');
const refsDir = path.join(root, 'references');

if (!fs.existsSync(sourcePath)) {
  console.error(`找不到 source 文件：${sourcePath}`);
  process.exit(1);
}

const source = fs.readFileSync(sourcePath, 'utf8');
const lines = source.split(/\r?\n/);
const starts = [];
for (let i = 0; i < lines.length; i++) {
  if (/^##\s/.test(lines[i])) starts.push(i);
}

if (starts.length !== 33) {
  console.error(`source 的一级章节数应为 33，当前为 ${starts.length}。请更新 scripts/rebuild-references.mjs 的分组映射。`);
  process.exit(1);
}

const range = (n) => ({ start: starts[n - 1], end: n < starts.length ? starts[n] : lines.length });
const text = (r) => lines.slice(r.start, r.end).join('\n');

const groups = [
  {
    file: '00-recon-and-tricks.md',
    title: 'Web CTF Notes — 知识地图、通用技巧与杂项',
    parts: [
      ['原文前置信息与知识地图', { start: 0, end: range(1).end }],
      ['一、通用技巧', range(2)],
      ['二、HTTP 请求基础', range(3)],
      ['四、Web 题目常见 Trick', range(5)],
      ['五、SSI 注入', range(6)],
      ['二十一、其他小专题', range(22)],
    ],
  },
  {
    file: '01-rce-and-files.md',
    title: 'Web CTF Notes — RCE、代码执行、文件漏洞与 Java 命令执行',
    parts: [
      ['三、PHP 版本相关', range(4)],
      ['六、命令执行（RCE）', range(7)],
      ['七、代码执行', range(8)],
      ['八、文件包含', range(9)],
      ['九、文件上传', range(10)],
      ['十、Java 命令执行与 OQL 查询', range(11)],
    ],
  },
  {
    file: '02-sqli-ssrf-and-protocols.md',
    title: 'Web CTF Notes — SQLi、SSRF、XXE、JWT、Git 与 Java',
    parts: [
      ['十一、SQL 注入', range(12)],
      ['十三、Git 题目', range(14)],
      ['十四、Java 题目', range(15)],
      ['十五、JWT 题目', range(16)],
      ['十六、XXE 题目', range(17)],
      ['十七、SSRF 题目', range(18)],
    ],
  },
  {
    file: '03-ssti-xss-node.md',
    title: 'Web CTF Notes — SSTI、XSS 与 Node.js',
    parts: [
      ['十八、服务端模板注入（SSTI）', range(19)],
      ['十九、XSS 专题', range(20)],
      ['二十、Node.js 题目', range(21)],
    ],
  },
  {
    file: '04-python-and-deserialization.md',
    title: 'Web CTF Notes — Flask、Python、Pickle、FastAPI 与 XPath',
    parts: [
      ['十二、Flask 题目', range(13)],
      ['二十二、Python 用法', range(23)],
      ['二十三、Pickle 反序列化', range(24)],
      ['二十八、FastAPI', range(29)],
      ['二十九、XPath 注入', range(30)],
    ],
  },
  {
    file: '05-php-and-pear.md',
    title: 'Web CTF Notes — PHP 题目、PEAR 包含与 PHP 反序列化',
    parts: [
      ['二十四、PHP 题目', range(25)],
      ['二十五、PEAR 包含', range(26)],
      ['二十七、PHP 反序列化', range(28)],
    ],
  },
  {
    file: '06-php-functions.md',
    title: 'Web CTF Notes — PHP 函数速查',
    parts: [
      ['二十六、PHP 函数速查', range(27)],
    ],
  },
  {
    file: '07-comprehensive-and-src.md',
    title: 'Web CTF Notes — 综合例题、常见问题与 SRC',
    parts: [
      ['三十、综合例题', range(31)],
      ['三十一、常见问题', range(32)],
      ['三十二、SRC 挖洞之路', range(33)],
    ],
  },
];

const sourceNote = '> 来源：source/本科web笔记.md\n> 内容按原笔记保留，仅添加本分组标题。\n\n';
const outputs = new Map();
for (const group of groups) {
  const body = group.parts.map(([label, r]) => `## ${label}\n\n${text(r)}`).join('\n\n');
  outputs.set(group.file, `# ${group.title}\n\n${sourceNote}${body}\n`);
}

if (check) {
  const mismatches = [];
  for (const [file, expected] of outputs) {
    const target = path.join(refsDir, file);
    if (!fs.existsSync(target)) {
      mismatches.push(`缺少 ${file}`);
      continue;
    }
    const actual = fs.readFileSync(target, 'utf8');
    if (actual !== expected) mismatches.push(`内容不一致：${file}`);
  }
  if (mismatches.length > 0) {
    console.error('references 与 source 不一致：');
    for (const item of mismatches) console.error(`- ${item}`);
    console.error('请运行 node scripts/rebuild-references.mjs 重新生成。');
    process.exit(1);
  }
  console.log(`references 与 source 一致（${outputs.size} 个文件）。`);
} else {
  for (const [file, content] of outputs) {
    fs.writeFileSync(path.join(refsDir, file), content, 'utf8');
    console.log(`已生成 ${file}`);
  }
  console.log(`完成：从 ${sourcePath} 重新生成 ${outputs.size} 个 references。`);
}

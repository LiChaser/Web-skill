# 快速开始

## 1. 你需要什么

- Node.js 18 或更高版本
- 一个 Markdown 编辑器，例如 VS Code、Obsidian 或 Typora
- 只在 CTF、靶场、比赛或已获授权的环境中使用

## 2. 先读什么

推荐顺序：

1. [场景手册](recipes.md)：按题目入口查下一步。
2. [知识地图](knowledge-map.md)：理解 Web CTF 的分类和决策树。
3. [5 分钟速查](cheatsheet.md)：比赛或练习时快速浏览。
4. [章节索引](reference-index.md)：进入具体主题文件。

如果你已经拿到一道题，优先打开场景手册，不要从第一页开始顺序读完整份笔记。

## 3. 命令行搜索

在仓库根目录运行：

~~~bash
node scripts/search-notes.mjs gopher
node scripts/search-notes.mjs 反序列化 --context 2
node scripts/search-notes.mjs parse_url --json
node scripts/search-notes.mjs --list
node scripts/search-notes.mjs --stats
~~~

参数说明：

| 参数 | 作用 |
|---|---|
| <code>--context N</code> | 显示命中行前后各 N 行 |
| <code>--json</code> | 输出 JSON，方便接入其他工具 |
| <code>--list</code> | 列出 references 文件和章节标题 |
| <code>--stats</code> | 输出文件数、行数、标题数和字符数 |
| <code>--case-sensitive</code> | 区分大小写 |

## 4. 作为 Codex skill 使用

把整个仓库复制到目标环境的 skills 目录，并保持目录名为 <code>web-ctf-playbook</code>：

~~~text
<CODEX_HOME>/skills/web-ctf-playbook/
├── SKILL.md
├── agents/openai.yaml
└── references/
~~~

Codex 会先读取 <code>SKILL.md</code>，再按题型只加载相关的 references 文件。这样做可以减少无关上下文，让回答更聚焦。

## 5. 作为普通知识库使用

直接打开 <code>references/</code> 目录，按主题阅读。也可以把整个仓库导入 Obsidian、VS Code 或自己的知识库系统。

推荐把常用入口固定为：

- <code>docs/recipes.md</code>
- <code>docs/cheatsheet.md</code>
- <code>references/01-rce-and-files.md</code>
- <code>references/02-sqli-ssrf-and-protocols.md</code>
- <code>references/05-php-and-pear.md</code>

## 6. 更新笔记

原始笔记位于 <code>source/本科web笔记.md</code>。修改后运行：

~~~bash
node scripts/rebuild-references.mjs
~~~

检查 references 是否与 source 一致：

~~~bash
node scripts/rebuild-references.mjs --check
~~~

如果新增一级章节，需要同步更新 <code>scripts/rebuild-references.mjs</code> 的分组映射。

## 7. 提交前校验

~~~bash
npm run check
~~~

或者分开运行：

~~~bash
node scripts/rebuild-references.mjs --check
node scripts/validate-project.mjs
node scripts/search-notes.mjs --list
~~~

## 8. 推荐排查流程

1. 找入口：URL 参数、表单、上传点、请求体、Header、Cookie。
2. 找语言 / 框架 / 版本：PHP、Java、Python、Node.js、Flask、FastAPI、ThinkPHP、Spring 等。
3. 找反馈：回显、报错、时间差异、状态码、响应长度、DNS/HTTP 外带。
4. 找过滤：黑名单、长度、字符集、协议、路径、大小写、编码。
5. 先最小验证，再构造完整利用链。
6. 记录请求、响应、报错、payload 和 flag。
7. 写出修复建议，把一次练习变成可复用资料。

## 9. 常见问题

### 为什么不能直接复制 payload？

因为 payload 依赖语言、版本、参数位置、过滤条件、编码和回显方式。直接复制通常只能在原题复现，换一题就会失效。

### 为什么 source 和 references 内容重复？

<code>source/</code> 是原始笔记，<code>references/</code> 是自动生成的主题副本。source 保持单一来源，references 提供渐进式加载和搜索。

### 可以直接对真实网站测试吗？

不可以。只有在 CTF、靶场、比赛或已获明确授权的环境中才能使用本项目。

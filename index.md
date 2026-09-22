---
layout: default
title: Web CTF Playbook
description: 面向授权 Web CTF 练习的场景式知识库与 payload 路由手册。
---

<div align="center">
  <img src="assets/banner.svg" alt="Web CTF Playbook" width="100%" />
  <h1>Web CTF Playbook</h1>
  <p><strong>从题目入口到利用链，先判断，再验证，最后查 payload。</strong></p>
  <p>
    <a href="docs/quickstart.md">快速开始</a> ·
    <a href="docs/recipes.md">场景手册</a> ·
    <a href="docs/knowledge-map.md">知识地图</a> ·
    <a href="docs/cheatsheet.md">5 分钟速查</a> ·
    <a href="https://github.com/LiChaser/Web-skill">GitHub</a>
  </p>
</div>

> [!IMPORTANT]
> 仅用于 CTF、靶场、比赛或已获明确授权的安全测试。

## 它解决什么问题

Web CTF 笔记常见的问题不是“没有内容”，而是内容太多、入口太散、payload 缺少上下文。这个项目把笔记整理成 **8 个主题模块 + 场景式分流 + 零依赖搜索 CLI + Codex skill 路由**。

## 先看这三个入口

| 入口 | 什么时候用 |
|---|---|
| [场景手册](docs/recipes.md) | 已经拿到题目，想知道下一步查什么 |
| [知识地图](docs/knowledge-map.md) | 想理解 Web CTF 的整体分类和决策树 |
| [5 分钟速查](docs/cheatsheet.md) | 比赛或练习时快速扫一遍 |

## 30 秒开始

~~~bash
git clone git@github.com:LiChaser/Web-skill.git
cd Web-skill
node scripts/search-notes.mjs gopher
node scripts/search-notes.mjs 反序列化 --context 2
node scripts/search-notes.mjs --stats
~~~

## 内容导航

| 主题 | 文件 |
|---|---|
| 侦察、HTTP、通用 Trick、SSI | [references/00-recon-and-tricks.md](references/00-recon-and-tricks.md) |
| RCE、文件包含、上传、PHP 版本 | [references/01-rce-and-files.md](references/01-rce-and-files.md) |
| SQLi、SSRF、XXE、JWT、Java | [references/02-sqli-ssrf-and-protocols.md](references/02-sqli-ssrf-and-protocols.md) |
| SSTI、XSS、Node.js | [references/03-ssti-xss-node.md](references/03-ssti-xss-node.md) |
| Flask、Python、Pickle、FastAPI | [references/04-python-and-deserialization.md](references/04-python-and-deserialization.md) |
| PHP 题目、PEAR、PHP 反序列化 | [references/05-php-and-pear.md](references/05-php-and-pear.md) |
| PHP 函数速查 | [references/06-php-functions.md](references/06-php-functions.md) |
| 综合例题、FAQ、SRC | [references/07-comprehensive-and-src.md](references/07-comprehensive-and-src.md) |

## 贡献

欢迎补充技巧、修正版本差异、增加本地靶场 writeup 或改进脚本。请先阅读 [CONTRIBUTING.md](CONTRIBUTING.md) 和 [SECURITY.md](SECURITY.md)。

<div align="center">
  <strong>如果这个项目帮你少走弯路，欢迎 Star ⭐</strong>
</div>

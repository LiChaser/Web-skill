---
name: web-ctf-playbook
description: Analyze and solve authorized Web CTF and lab challenges using a structured, searchable Web exploitation playbook; retrieve vulnerability-specific payloads, bypasses, and checklists for PHP, Java, Python, Node.js, SQLi, RCE, SSRF, XXE, SSTI, JWT, upload, and deserialization. Use only for CTF, lab, or explicitly authorized targets.
metadata:
  short-description: Searchable Web CTF exploitation playbook
---

# Web CTF Playbook

## 适用场景

用于 Web CTF、靶场、比赛或已获明确授权的目标。遇到 PHP、Java、Python、Node.js、SQL 注入、RCE、SSRF、XXE、SSTI、JWT、文件上传、反序列化、协议利用等题目时，先读取本 skill。

## 工作方式

1. 先识别入口、语言、框架、版本、回显方式、过滤条件和可用协议，不要先套 payload。
2. 按下表只读取与当前题目相关的 reference，避免一次加载全部笔记。
3. 将笔记中的 payload 与当前版本、参数位置、过滤规则对照，必要时调整编码、大小写、分隔符、换行或协议封装。
4. 先做最小验证，确认漏洞点后再构造完整利用链；记录请求、响应、关键报错和 flag。
5. 如果 reference 中缺少细节，再回到原始笔记检索；不要修改原始笔记。

## 参考文件路由

| 当前情况 | 读取文件 |
|---|---|
| 知识地图、通用技巧、HTTP、常见 Trick、SSI、杂项 | `references/00-recon-and-tricks.md` |
| RCE、命令执行、代码执行、文件包含、文件上传、PHP 版本、Java 命令执行 | `references/01-rce-and-files.md` |
| SQL 注入、SSRF、XXE、JWT、Git、Java 题目 | `references/02-sqli-ssrf-and-protocols.md` |
| SSTI、XSS、Node.js | `references/03-ssti-xss-node.md` |
| Flask、Python、Pickle、FastAPI、XPath | `references/04-python-and-deserialization.md` |
| PHP 题目、PEAR 包含、PHP 反序列化 | `references/05-php-and-pear.md` |
| PHP 函数速查 | `references/06-php-functions.md` |
| 综合例题、常见问题、SRC 挖洞之路 | `references/07-comprehensive-and-src.md` |

## 使用纪律

- 仅在 CTF、靶场、比赛或已获明确授权的目标上使用；不要对未授权真实系统执行利用。
- 笔记中的 payload 是历史记录，不是通用答案；先验证版本、上下文、编码和过滤条件。
- 优先使用最小、可复现、可解释的利用步骤，避免无目的扫描或破坏性命令。
- 把 flag、回显、报错、响应差异作为验证依据，而不是只凭 payload 成功执行判断。

## 维护

- 原始笔记：`source/本科web笔记.md`
- references 是原笔记按主题拆分后的副本；更新 source 后运行 `node scripts/rebuild-references.mjs`。
- 提交前运行 `node scripts/validate-project.mjs` 和 `node scripts/rebuild-references.mjs --check`。

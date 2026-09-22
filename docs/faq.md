# FAQ

## 怎么快速定位题目类型？

先看 [场景手册](recipes.md)。它按 file/page/path、上传、SSRF、XML、JWT、SSTI、JSON body、反序列化、无回显等入口组织，直接告诉你下一步应该验证什么。

## 这是课程吗？

不是。它是一个可搜索的实战知识库和 payload 路由手册，适合在 CTF、靶场和授权测试中查阅。

## 可以直接复制 payload 吗？

不建议直接复制。先确认目标语言、版本、参数位置、过滤规则、回显方式和协议支持，再做最小验证。

## 为什么拆成多个 reference？

因为整份笔记很长。拆分后，Codex skill 和人类读者都可以只加载当前题型相关的内容，减少干扰。

## 如何作为 Codex skill 安装？

把整个仓库复制到 `<CODEX_HOME>/skills/web-ctf-playbook/`，保持 `SKILL.md`、`agents/` 和 `references/` 在一起。

## 如何发布到 GitHub？

先运行 <code>node scripts/configure-repo.mjs &lt;github-owner&gt;</code> 替换文档中的仓库占位符，再阅读 [publishing.md](publishing.md) 和 [launch-kit.md](launch-kit.md)。

## 如何贡献新技巧？

先阅读 [CONTRIBUTING.md](../CONTRIBUTING.md)。推荐补充：适用环境、版本、入口、过滤条件、最小验证、完整 payload、预期结果、修复建议和参考链接。

## 为什么有 source 和 references 两份内容？

`source/` 是单一来源，`references/` 是自动生成的主题副本。这样既能保持原笔记结构，又能提供渐进式加载。

## 可以在未授权目标上测试吗？

不可以。本项目只允许用于 CTF、靶场、比赛或已获明确授权的安全测试。

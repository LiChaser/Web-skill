# Web CTF Playbook 设计文档

- 日期：2026-09-22
- 目标：把个人 Web CTF 笔记升级成可发布、可贡献、可搜索的开源项目
- 形态：Codex skill + Markdown 知识库 + 零依赖 CLI

## 目标用户

- 正在刷 Web CTF 的学习者
- 需要快速查 payload 和绕过技巧的参赛者
- 想整理自己笔记并参与开源贡献的安全从业者

## 成功标准

- 新用户 30 秒内知道项目能解决什么问题。
- 任意主题能在 2 次点击内进入对应 reference。
- 修改 source 后可以一条命令重建 references。
- CI 能发现章节缺失、frontmatter 错误和编码问题。
- 贡献者知道如何提交新技巧和 writeup。

## 架构

```text
source -> rebuild-references -> references -> SKILL.md / search CLI / docs
```

## 核心组件

| 组件 | 作用 |
|---|---|
| `SKILL.md` | 面向 Codex 的路由和纪律 |
| `references/` | 面向阅读和检索的主题内容 |
| `scripts/` | 搜索、重建、校验 |
| `docs/` | 快速开始、知识地图、速查表、架构和发布说明 |
| `.github/` | CI、Issue、PR 协作 |
| `templates/` | 降低贡献门槛 |

## 错误处理

- 搜索无结果时返回非零退出码，便于脚本使用。
- references 与 source 不一致时，`--check` 返回失败。
- 校验脚本发现缺文件、缺 frontmatter、缺章节或编码问题时输出明确错误。

## 测试策略

- `node scripts/validate-project.mjs`
- `node scripts/rebuild-references.mjs --check`
- `node scripts/search-notes.mjs --list`
- GitHub Actions 在 push 和 PR 时运行以上命令

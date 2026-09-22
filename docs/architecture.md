# 项目架构

## 设计目标

- 单一来源：所有内容来自 `source/本科web笔记.md`。
- 渐进式加载：`SKILL.md` 只做路由，细节在 `references/`。
- 可检索：提供零依赖搜索脚本。
- 可验证：脚本和 CI 检查章节覆盖、编码和 references 一致性。
- 可贡献：模板、指南和 Issue/PR 模板齐全。

## 数据流

```text
source/本科web笔记.md
        │
        │ node scripts/rebuild-references.mjs
        ▼
references/*.md
        │
        ├── node scripts/search-notes.mjs
        ├── SKILL.md 路由
        └── docs/ 导航
```

## 目录职责

| 目录 | 职责 |
|---|---|
| `SKILL.md` | Codex skill 入口、路由表、使用纪律 |
| `references/` | 按主题拆分的完整笔记内容 |
| `source/` | 原始笔记，单一来源 |
| `scripts/` | 搜索、重建、校验工具 |
| `docs/` | 人类可读的指南、索引和设计文档 |
| `templates/` | writeup 和 payload 笔记模板 |
| `.github/` | CI、Issue 模板、PR 模板 |

## 生成与校验

| 命令 | 作用 |
|---|---|
| `node scripts/rebuild-references.mjs` | 从 source 重新生成 references |
| `node scripts/rebuild-references.mjs --check` | 检查 references 是否与 source 一致 |
| `node scripts/search-notes.mjs <keyword>` | 搜索 references |
| `node scripts/validate-project.mjs` | 校验目录、frontmatter、章节覆盖和编码 |

## 扩展方式

1. 在 `source/本科web笔记.md` 中新增或修改内容。
2. 如果新增一级章节，更新 `scripts/rebuild-references.mjs` 的分组映射。
3. 运行 `node scripts/rebuild-references.mjs`。
4. 运行 `node scripts/validate-project.mjs`。
5. 提交 PR，并说明新增内容的目标、适用版本和安全边界。

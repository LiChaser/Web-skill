# Contributing

感谢你愿意贡献。这个项目希望成为 Web CTF 学习者真正会查阅、会复用的实战知识库。

## 可以贡献什么

- 新增 Web CTF 技巧、绕过方法或 payload 说明
- 修正错误、补充版本差异或过滤条件
- 增加本地靶场 writeup
- 改进场景手册、知识地图、速查表和索引
- 改进搜索、重建、校验脚本
- 翻译文档或补充英文索引

## 内容标准

新增内容请尽量包含：

- [ ] 适用语言 / 框架 / 版本
- [ ] 入口参数或触发位置
- [ ] 过滤条件与绕过思路
- [ ] 最小验证请求
- [ ] 完整 payload 或利用链
- [ ] 预期结果
- [ ] 修复建议
- [ ] 参考链接（如有）

不要只粘贴一段 payload。请说明它为什么有效、适用于什么场景、如何验证，以及失败时会出现什么现象。

## 推荐贡献路径

### 新手友好

- 修正错别字或失效链接
- 给场景手册补充一个“先做什么”
- 增加一个本地靶场 writeup 的元数据
- 把已有 payload 补充版本和过滤条件

### 进阶

- 增加一个主题的决策树
- 把重复技巧抽象成通用验证流程
- 改进搜索脚本的 JSON 输出
- 增加英文索引或翻译

### 维护者

- 审核安全和授权边界
- 复核版本差异
- 处理 Issue 和 PR
- 发布小版本和更新 Roadmap

## 更新流程

1. Fork 仓库并创建分支。
2. 修改 <code>source/本科web笔记.md</code>，或在 <code>docs/</code>、<code>examples/</code> 中新增文档。
3. 如果新增一级章节，更新 <code>scripts/rebuild-references.mjs</code> 的分组映射。
4. 运行 <code>node scripts/rebuild-references.mjs</code>。
5. 运行 <code>npm run check</code>。
6. 提交 PR，并说明变更目标、适用环境和安全边界。

## 代码贡献

- 使用 Node.js 18+。
- 不引入不必要的运行时依赖。
- 脚本保持跨平台，优先使用 Node 内置模块。
- 修改脚本后，至少运行 <code>npm run check</code>。
- 新增 CLI 参数时，同时更新 README、quickstart 和 help 输出。

## PR 检查清单

- [ ] 内容只用于授权测试场景
- [ ] 没有包含真实目标、私有 IP、凭据或未脱敏数据
- [ ] 新增内容说明了版本和过滤条件
- [ ] references 已重建
- [ ] <code>npm run check</code> 通过
- [ ] 必要的 README、docs 或模板已同步更新

## 行为准则

参与本项目即表示你同意遵守 [CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md)。

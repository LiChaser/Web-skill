# GitHub 发布与增长工具包

这份文档不是“刷 Star 教程”，而是把项目发布成**别人看得懂、愿意收藏、愿意贡献**的开源仓库。真正稳定的 Star 来自持续有用的内容和清晰的入口。

## 1. 仓库信息

推荐仓库名：

~~~text
web-ctf-playbook
~~~

推荐 Description：

~~~text
Scenario-first Web CTF playbook for authorized practice: payload routing, bypasses, decision trees, and searchable references.
~~~

推荐 Topics：

~~~text
ctf, web-security, penetration-testing, payloads, playbook, sqli, ssrf, xxe, ssti, jwt, deserialization, php-security, application-security
~~~

推荐 About 链接：

- 项目首页：仓库 README
- 在线文档：GitHub Pages 地址
- 安全边界：SECURITY.md

## 2. GitHub 设置

- [ ] 开启 Issues
- [ ] 开启 Discussions（可选，但有利于收集问题和 writeup）
- [ ] 开启 GitHub Pages，Source 选择 root
- [ ] 上传 <code>assets/social-preview.png</code> 作为 Social preview
- [ ] 添加 Topics
- [ ] 创建 <code>v0.2.0</code> Release
- [ ] 给仓库加上 About 描述和主页链接
- [ ] 在仓库根目录确认 README、LICENSE、CONTRIBUTING、SECURITY 可见

## 3. 首次发布步骤

1. 创建 GitHub 仓库，不要自动生成 README。
2. 在本地运行 <code>node scripts/configure-repo.mjs &lt;github-owner&gt;</code>，替换文档中的仓库占位符。
3. 在本地运行 <code>npm run check</code>。
4. 推送 <code>main</code>。
5. 确认 Actions 中的 CI 通过。
6. 创建 <code>v0.2.0</code> tag 和 Release。
7. Release 说明中写清楚：8 个主题、场景手册、搜索 CLI、Codex skill 结构、安全边界。
8. 上传 social preview，确认移动端和桌面端展示正常。

## 4. Release 说明模板

~~~markdown
## Web CTF Playbook v0.2.0

A scenario-first Web CTF knowledge base for authorized practice.

### Highlights

- 8 focused reference modules and 33 source chapters
- Scenario recipes for file paths, uploads, SSRF, XXE, JWT, SSTI, JSON pollution, deserialization, blind output, and source leaks
- Dependency-free search CLI with list, context, JSON, and stats modes
- Codex skill routing through SKILL.md
- CI validation for section coverage, encoding, and generated references
- GitHub Pages landing page and social preview

### Safety

Only use this project for CTF, labs, competitions, or explicitly authorized testing.

### Quick start

~~~bash
git clone <repo-url>
cd web-ctf-playbook
npm run check
node scripts/search-notes.mjs gopher
~~~
~~~

## 5. 中文首发文案

可以直接修改后发到技术社区、朋友圈或交流群：

~~~text
我把自己的 Web CTF 笔记重构成了一个场景式开源知识库：Web CTF Playbook。

它不是“payload 大全”，而是从题目入口出发的导航系统：
- ?file= 该先看什么
- 上传返回路径后怎么判断解析差异
- SSRF 无回显怎么建立验证通道
- JWT、XXE、SSTI、反序列化分别先查什么
- 8 个主题 references + 零依赖搜索 CLI + Codex skill 路由

只面向 CTF、靶场和授权测试。欢迎补充技巧、修正版本差异或提交本地靶场 writeup。

仓库：<repo-url>
如果你也经常在“知道很多技巧但不知道先用哪个”上卡住，欢迎 Star 收藏。
~~~

## 6. 英文首发文案

~~~text
I rebuilt my Web CTF notes into a scenario-first open-source playbook: Web CTF Playbook.

It is not a payload dump. It routes you from the challenge entry point to the right vulnerability class, minimal validation, and deeper references:
- file/path parameters
- uploads and parser differences
- SSRF without echo
- JWT, XXE, SSTI, deserialization
- 8 focused modules + dependency-free search CLI + Codex skill routing

For CTF, labs, and authorized testing only. Contributions, corrections, and local-lab writeups are welcome.

Repo: <repo-url>
Star it if it helps you spend less time guessing and more time validating.
~~~

## 7. 前 30 天内容计划

| 时间 | 内容 | 目的 |
|---|---|---|
| 第 1 周 | 发布 v0.2.0，补充 3 条场景手册 | 让访客看到项目不是空壳 |
| 第 2 周 | 发布一个本地靶场 writeup | 证明知识库能落地 |
| 第 3 周 | 增加英文索引或英文 recipe 摘要 | 扩大可发现性 |
| 第 4 周 | 根据 Issue 修正 5 条内容并发布 v0.2.1 | 建立可信度和维护节奏 |

## 8. 适合分享的地方

- CTF 战队内部知识库或交流群
- 学校信息安全社团
- Web 安全学习社区
- GitHub Discussions 或 Issues
- 个人博客、公众号、知乎、掘金等平台

分享时请遵守平台规则，不要批量私信、刷屏或购买 Star。

## 9. 真正提高 Star 的动作

- 保持 README 的前 30 秒可运行。
- 每条新增内容都写清楚适用版本、过滤条件和验证方式。
- 及时回复 Issue 和 PR。
- 为新手标记 good first issue。
- 定期发布小版本，而不是长期不更新。
- 不把未授权目标、真实凭据或未脱敏数据放进仓库。

## 10. 发布前最终检查

- [ ] <code>npm run check</code> 通过
- [ ] README 中文和英文链接可用
- [ ] GitHub Pages 首页可访问
- [ ] Social preview 已上传
- [ ] Topics 和 Description 已填写
- [ ] Release 和 tag 已创建
- [ ] SECURITY、CONTRIBUTING、LICENSE 可见
- [ ] 没有真实目标、凭据或未授权数据

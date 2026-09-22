# GitHub 发布清单

这份清单用于把仓库发布成一个容易被发现、理解和贡献的项目。完整的发布文案和 30 天计划见 [launch-kit.md](launch-kit.md)。

## 仓库信息

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

## README 检查

- [ ] 顶部有 banner 和一句话价值主张
- [ ] 有 30 秒快速开始
- [ ] 有 demo 或截图
- [ ] 有场景式入口，而不是只有目录
- [ ] 有内容导航表
- [ ] 有贡献入口
- [ ] 有安全边界和 License
- [ ] 有英文 README 或英文摘要

## GitHub 设置

- [ ] 开启 Issues
- [ ] 开启 Discussions（可选）
- [ ] 开启 GitHub Pages，Source 选择 root
- [ ] 上传 <code>assets/social-preview.png</code> 作为 Social preview
- [ ] 添加仓库 Topics
- [ ] 创建 <code>v0.2.0</code> Release
- [ ] 在 About 中填写 Description 和主页链接

## GitHub Pages

仓库根目录的 <code>index.md</code> 是 Pages 首页，<code>_config.yml</code> 使用 <code>jekyll-theme-cayman</code>。启用 Pages 后，首页应该能访问：

~~~text
https://<owner>.github.io/web-ctf-playbook/
~~~

如果页面没有更新，检查：

1. Pages 是否选择了正确的分支和 root 目录。
2. Actions 是否有权限部署 Pages。
3. <code>index.md</code> 的 frontmatter 是否保留。
4. 资源路径是否使用相对路径。

## Social preview

推荐上传：

~~~text
assets/social-preview.png
~~~

SVG 源文件保留在 <code>assets/social-preview.svg</code>，方便后续修改。上传前确认：

- 尺寸为 1280 × 640
- 标题在移动端和桌面端都能看清
- 不包含真实目标、凭据或未授权内容
- 与 README 的一句话定位一致

## 首次发布建议

1. 运行 <code>node scripts/configure-repo.mjs &lt;github-owner&gt;</code>，把 README 和文档里的仓库占位符替换掉。
2. 创建 GitHub 仓库并推送 <code>main</code>。
3. 确认 Actions 中的 CI 通过。
4. 创建 <code>v0.2.0</code> tag。
5. 在 Release 中说明：8 大主题、场景手册、搜索脚本、校验脚本、Codex skill 结构。
6. 到 CTF / Web 安全社区分享时，明确说明适用场景和安全边界。
7. 发布后 48 小时内及时回复第一批 Issue 和讨论。

## 提升可发现性

- 保持 README 的快速开始可复制、可运行。
- 每个新增技巧都写清楚适用版本和验证方式。
- 及时处理 Issue 和 PR。
- 增加真实靶场 writeup 时，先确认平台规则允许公开。
- 不要刷 Star；持续提供有用内容比短期增长更重要。
- 优先补充“场景手册”中的空白分支，而不是重复粘贴 payload。

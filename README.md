<div align="center">
  <img src="assets/banner.svg" alt="Web CTF Playbook" width="100%" />
  <h1>Web CTF Playbook</h1>
  <p><strong>把零散 payload 变成从题目入口到利用链的实战导航系统。</strong></p>
  <p>
    <img alt="License" src="https://img.shields.io/badge/license-MIT%20%2B%20CC%20BY%204.0-blue">
    <img alt="PRs Welcome" src="https://img.shields.io/badge/PRs-welcome-brightgreen">
    <img alt="Made for CTF" src="https://img.shields.io/badge/Made%20for-CTF-red">
  </p>
  <p>
    <a href="README.md">简体中文</a> ·
    <a href="README.en.md">English</a> ·
    <a href="docs/quickstart.md">快速开始</a> ·
    <a href="docs/recipes.md">场景手册</a> ·
    <a href="docs/knowledge-map.md">知识地图</a> ·
    <a href="docs/cheatsheet.md">5 分钟速查</a>
  </p>
</div>

> [!IMPORTANT]
> 本项目只用于 CTF、靶场、比赛或已获明确授权的安全测试。不要对未授权真实系统执行任何 payload、扫描或利用。

## 为什么值得收藏

很多 Web CTF 笔记的问题是：内容很多，但真正做题时不知道从哪一页开始；payload 很多，却缺少“适用版本、过滤条件、回显方式、最小验证”这些关键上下文。

**Web CTF Playbook** 解决的不是“再多背一个 payload”，而是：

- **先定位题型**：从 URL 参数、上传点、请求体、Cookie、文件路径等入口快速分流。
- **再选择验证**：先做最小可复现请求，再决定是否进入完整利用链。
- **最后查细节**：按 PHP、Java、Python、Node.js、SQLi、SSRF、XXE、SSTI、JWT、反序列化等主题渐进式加载。
- **保持可维护**：原笔记是单一来源，references 自动生成，CI 检查章节覆盖和编码一致性。

## 30 秒看演示

![Web CTF Playbook terminal demo](assets/demo.svg)

~~~bash
git clone git@github.com:LiChaser/Web-skill.git
cd Web-skill

# 按关键词搜索 payload、函数名、协议名或绕过技巧
node scripts/search-notes.mjs gopher
node scripts/search-notes.mjs 反序列化 --context 2

# 查看主题文件和章节
node scripts/search-notes.mjs --list

# 查看内容规模
node scripts/search-notes.mjs --stats
~~~

## 你会得到什么

| 能力 | 说明 |
|---|---|
| 场景式入口 | 遇到 <code>?file=</code>、上传、SSRF、JWT、XML、反序列化等入口时，先读什么、先验证什么 |
| 主题化 references | 8 个主题文件，覆盖 33 个原章节，避免一次加载整份长笔记 |
| 零依赖搜索 CLI | 用 Node.js 18+ 直接搜索关键词、函数、协议、payload 和章节 |
| Codex skill 结构 | <code>SKILL.md</code> 负责路由，<code>references/</code> 负责细节，适合渐进式加载 |
| 可维护流程 | source 到 references 自动重建，脚本和 CI 校验一致性 |
| 社区协作模板 | 贡献指南、Issue 模板、PR 模板、writeup 模板和安全边界 |

## 适合谁

- 正在准备 Web CTF、CTF 靶场或课程实验的学习者。
- 想把零散笔记整理成可搜索知识库的安全爱好者。
- 需要在授权测试中快速查协议、绕过和验证思路的从业者。
- 想把个人笔记升级为开源项目的维护者。

> 如果你只想复制 payload，这个项目可能不适合你。它的核心价值是**判断顺序、适用条件和验证路径**。

## 快速开始

### 1. 直接阅读

推荐顺序：

1. [场景手册](docs/recipes.md)：按题目入口查下一步。
2. [知识地图](docs/knowledge-map.md)：理解漏洞分类和决策树。
3. [5 分钟速查](docs/cheatsheet.md)：比赛时快速扫一遍。
4. [章节索引](docs/reference-index.md)：进入具体主题文件。

### 2. 使用搜索 CLI

需要 Node.js 18 或更高版本，不需要安装第三方依赖。

~~~bash
node scripts/search-notes.mjs gopher
node scripts/search-notes.mjs 反序列化 --context 2
node scripts/search-notes.mjs parse_url --json
node scripts/search-notes.mjs --list
node scripts/search-notes.mjs --stats
~~~

| 参数 | 作用 |
|---|---|
| <code>--context N</code> | 显示命中行前后各 N 行 |
| <code>--json</code> | 输出 JSON，方便接入其他工具 |
| <code>--list</code> | 列出 references 文件和章节标题 |
| <code>--stats</code> | 输出文件数、行数、标题数和字符数 |
| <code>--case-sensitive</code> | 区分大小写 |

### 3. 作为 Codex skill 使用

把整个仓库复制到目标环境的 skills 目录，并保持目录名为 <code>web-ctf-playbook</code>：

~~~text
<CODEX_HOME>/skills/web-ctf-playbook/
├── SKILL.md
├── agents/openai.yaml
└── references/
~~~

Codex 会先读取 <code>SKILL.md</code> 做路由，再按当前题型只加载相关 reference。

## 场景式入口

完整手册见 [docs/recipes.md](docs/recipes.md)。下面是最短分流：

| 题目信号 | 优先方向 | 先做什么 |
|---|---|---|
| <code>?file=</code>、<code>?page=</code>、<code>?path=</code> | 文件包含 / 任意文件读取 | 确认路径是否被拼接、是否支持伪协议、是否有日志或 Session 可利用 |
| 上传后返回路径 | 文件上传 / 解析差异 | 确认扩展名、MIME、内容检测、保存目录是否可执行 |
| <code>?url=</code>、<code>?uri=</code>、<code>?target=</code> | SSRF | 判断是否只允许 HTTP、是否支持 <code>file</code>、<code>dict</code>、<code>gopher</code> |
| XML 请求体被解析 | XXE | 先测试外部实体是否启用，再判断文件读取或 SSRF |
| Cookie 里有三段式 JWT | JWT | 检查算法、<code>none</code>、弱密钥、<code>kid</code> 和签名校验 |
| 输入被模板计算 | SSTI | 用无害表达式确认模板引擎，再研究沙盒逃逸 |
| JSON body 影响对象属性 | 原型链 / Node.js | 观察属性是否被合并，再判断能否触发 gadget |
| 反序列化入口 | PHP / Pickle / Java | 先确认语言和对象格式，再寻找 POP 链或 <code>__reduce__</code> |
| 页面没有回显 | 盲注 / 时间 / 外带 | 建立基线，观察时间、状态码、响应长度或 DNS/HTTP 外带 |
| 源码或配置泄露 | Git / 源码审计 | 恢复源码后按路由、参数、依赖和版本重新建模 |

## 知识地图

~~~mermaid
flowchart TD
    A["拿到一道 Web 题"] --> B{"入口是什么？"}
    B -->|URL 参数 / 表单| C{"有回显或报错吗？"}
    B -->|上传点| D["文件上传 / 解析差异 / .htaccess"]
    B -->|请求体 / Header / Cookie| E["SSRF / XXE / 反序列化 / JWT"]
    B -->|登录 / 权限| F["认证绕过 / JWT / 逻辑漏洞"]
    B -->|文件路径| G["文件包含 / 任意文件读取"]
    C -->|SQL 报错| H["SQL 注入"]
    C -->|模板表达式| I["SSTI"]
    C -->|命令拼接| J["RCE / 命令注入"]
    C -->|无回显| K["盲注 / 时间盲注 / 外带"]
    E --> L["协议利用 / 内网服务 / 对象注入"]
    D --> M["上传绕过 / 配置利用 / 二次利用"]
~~~

更完整的决策树见 [docs/knowledge-map.md](docs/knowledge-map.md)。

## 内容覆盖

| 主题文件 | 内容 |
|---|---|
| [references/00-recon-and-tricks.md](references/00-recon-and-tricks.md) | 知识地图、通用技巧、HTTP、常见 Trick、SSI、其他小专题 |
| [references/01-rce-and-files.md](references/01-rce-and-files.md) | PHP 版本、RCE、代码执行、文件包含、文件上传、Java 命令执行 |
| [references/02-sqli-ssrf-and-protocols.md](references/02-sqli-ssrf-and-protocols.md) | SQL 注入、Git、Java、JWT、XXE、SSRF |
| [references/03-ssti-xss-node.md](references/03-ssti-xss-node.md) | SSTI、XSS、Node.js |
| [references/04-python-and-deserialization.md](references/04-python-and-deserialization.md) | Flask、Python、Pickle、FastAPI、XPath |
| [references/05-php-and-pear.md](references/05-php-and-pear.md) | PHP 题目、PEAR 包含、PHP 反序列化 |
| [references/06-php-functions.md](references/06-php-functions.md) | PHP 函数速查 |
| [references/07-comprehensive-and-src.md](references/07-comprehensive-and-src.md) | 综合例题、常见问题、SRC 挖洞之路 |

当前内容规模：**8 个主题模块、33 个原章节、200+ 标题、4,000+ 行、118 个代码块**。数字会随贡献继续增长。

## 项目结构

~~~text
web-ctf-playbook/
├── SKILL.md                 Codex skill 入口与路由
├── README.md / README.en.md 中英文说明
├── index.md                 GitHub Pages 首页
├── agents/openai.yaml       skill 元数据
├── assets/                  banner、logo、demo、social preview
├── docs/                    场景手册、知识地图、速查、发布清单
├── references/              按主题拆分的完整内容
├── source/                  原始笔记，单一来源
├── scripts/                 搜索、重建、校验脚本
├── templates/               writeup 与 payload 模板
└── examples/                示例和写作规范
~~~

## 质量保证

~~~bash
npm run check
~~~

等价于：

~~~bash
node scripts/rebuild-references.mjs --check
node scripts/validate-project.mjs
node scripts/search-notes.mjs --list
~~~

CI 会检查：

- 必需文件和目录是否存在
- <code>SKILL.md</code> frontmatter 是否合法
- source 的 33 个一级章节是否都进入 references
- UTF-8 无 BOM、纯 LF
- <code>package.json</code> 是否为合法 JSON
- references 是否与 source 完全一致

## 维护与发布

- 修改内容：编辑 <code>source/本科web笔记.md</code>，再运行 <code>npm run rebuild</code>。
- 提交前：运行 <code>npm run check</code>。
- 配置仓库地址：运行 <code>node scripts/configure-repo.mjs LiChaser</code>。
- 准备发布：阅读 [docs/publishing.md](docs/publishing.md) 和 [docs/launch-kit.md](docs/launch-kit.md)。
- 贡献内容：阅读 [CONTRIBUTING.md](CONTRIBUTING.md)。

## Roadmap

- [x] 8 大主题 references
- [x] 零依赖搜索、重建、校验脚本
- [x] GitHub Actions CI、Issue/PR 模板
- [x] 场景手册与 GitHub Pages 首页
- [ ] 更多本地靶场 writeup
- [ ] 英文主题索引
- [ ] 主题标签、难度标签和全文搜索页面
- [ ] 多人复核的 v1.0 community edition

完整路线见 [ROADMAP.md](ROADMAP.md)。

## 安全声明

本项目只用于 CTF、靶场、比赛或已获明确授权的安全测试。payload 是历史记录，不是通用答案；使用前必须确认目标授权范围、语言、版本、参数位置、过滤条件和回显方式。

## License

- 代码（<code>scripts/</code>）：MIT
- 文档与笔记内容：CC BY 4.0

详见 [LICENSE](LICENSE)。

<div align="center">
  <strong>如果这个项目帮你少走弯路，欢迎 Star ⭐</strong>
  <br />
  <sub>持续更新，比短期刷 Star 更重要。</sub>
</div>

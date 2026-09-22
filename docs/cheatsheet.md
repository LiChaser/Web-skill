# 5 分钟速查表

这是一页“拿到题后先看什么”的速查表。具体 payload 请进入对应 reference。

## 第一步：收集信息

| 观察点 | 问题 |
|---|---|
| URL | 参数名是否暗示功能：`file`、`url`、`cmd`、`id`、`page`、`path`、`debug`？ |
| 响应 | 是否有报错、版本、框架、路径、堆栈？ |
| Header | 是否有 `Server`、`X-Powered-By`、`Set-Cookie`、JWT？ |
| 源码 | 是否泄露 `index.php`、`app.py`、`Dockerfile`、`.git`？ |
| 上传 | 是否返回文件名、路径、预览、解析结果？ |
| 依赖 | 是否出现 ThinkPHP、Flask、FastAPI、Spring、Node 模板引擎？ |

## 第二步：按漏洞类型速查

| 类型 | 第一检查 | 常见入口 | reference |
|---|---|---|---|
| RCE | 命令拼接、参数注入、无参数读取 | `cmd`、`ping`、`exec` | [`01`](../references/01-rce-and-files.md) |
| 文件包含 | 伪协议、日志包含、Session 包含 | `file`、`page`、`path` | [`01`](../references/01-rce-and-files.md) |
| 文件上传 | 扩展名、MIME、内容、`.htaccess` | `upload` | [`01`](../references/01-rce-and-files.md) |
| SQL 注入 | 联合、报错、布尔、时间、堆叠 | `id`、`q`、`search` | [`02`](../references/02-sqli-ssrf-and-protocols.md) |
| SSRF | `file`、`dict`、`gopher`、内网探测 | `url`、`uri`、`target` | [`02`](../references/02-sqli-ssrf-and-protocols.md) |
| XXE | 外部实体、文件读取、SSRF | XML body | [`02`](../references/02-sqli-ssrf-and-protocols.md) |
| JWT | `none`、弱密钥、`kid`、算法混淆 | Cookie / Authorization | [`02`](../references/02-sqli-ssrf-and-protocols.md) |
| SSTI | 模板表达式、沙盒逃逸 | 姓名、搜索、模板参数 | [`03`](../references/03-ssti-xss-node.md) |
| XSS | 标签、事件、编码、CSP | 评论区、搜索框 | [`03`](../references/03-ssti-xss-node.md) |
| Node.js | 原型链、`eval`、模板引擎 | JSON body、参数 | [`03`](../references/03-ssti-xss-node.md) |
| Pickle | `__reduce__`、RCE、敏感字符绕过 | Cookie / session | [`04`](../references/04-python-and-deserialization.md) |
| PHP 反序列化 | POP 链、字符逃逸、`__wakeup` | Cookie / 参数 | [`05`](../references/05-php-and-pear.md) |

## 第三步：写结论

```text
入口：
语言 / 框架：
漏洞类型：
过滤条件：
最小验证：
利用链：
关键请求：
结果 / flag：
修复建议：
```

## 安全边界

只在 CTF、靶场、比赛或已获明确授权的环境中使用本速查表。

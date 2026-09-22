# 场景手册：从题目信号到下一步

这份手册按“你看到了什么”组织，而不是按漏洞百科分类。每条路线只负责把你送到正确的 reference，不替代具体 payload 和版本说明。

> 安全边界：仅用于 CTF、靶场、比赛或已获明确授权的测试环境。

## 1. URL 参数像文件名：file、page、path

**信号**

- 参数名像 <code>file</code>、<code>page</code>、<code>path</code>、<code>template</code>。
- 修改参数后，页面内容、报错或响应长度发生变化。
- 返回内容像文件内容、模板片段或服务器路径。

**先做**

~~~http
GET /?file=index.php HTTP/1.1
Host: target.local
~~~

1. 用正常文件名建立基线。
2. 测试不存在的文件名，观察报错是否泄露绝对路径。
3. 判断是否支持伪协议、目录穿越、日志包含或 Session 包含。

**分支**

- 如果直接回显文件内容：进入文件读取 / 文件包含。
- 如果只能包含本地文件：尝试日志、Session、上传文件等可控内容。
- 如果被黑名单拦截：检查编码、路径拼接、双写、大小写和伪协议差异。

**去读**

- [文件包含与 RCE](../references/01-rce-and-files.md)
- [PHP 函数速查](../references/06-php-functions.md)

## 2. 上传后返回路径，但不确定能否执行

**信号**

- 页面返回文件名、URL、预览图或保存目录。
- 存在扩展名、MIME、文件头、图片尺寸等检查。
- 上传目录可能可访问，也可能只能通过文件包含利用。

**先做**

1. 上传一个无害文本文件，确认保存路径和访问方式。
2. 测试服务端到底检查扩展名、MIME、文件头还是内容。
3. 观察上传文件是否被重命名、压缩、转码或移动到其他目录。

**分支**

- 如果扩展名黑名单不完整：检查解析差异和后缀组合。
- 如果只检查 MIME：确认请求中的 Content-Type 是否被信任。
- 如果图片会被二次渲染：考虑图片马、元数据或解析链。
- 如果上传目录不可执行：把上传文件当作文件包含或 XXE 的跳板。

**去读**

- [文件上传](../references/01-rce-and-files.md)
- [文件包含](../references/01-rce-and-files.md)

## 3. url、uri、target 参数让服务器发起请求

**信号**

- 参数名像 <code>url</code>、<code>uri</code>、<code>target</code>、<code>callback</code>、<code>webhook</code>。
- 页面没有直接回显，但请求时间、状态码或 DNS 记录有变化。
- 目标可能访问内网服务、云元数据或本地文件。

**先做**

1. 先用你自己的可控 HTTP 服务或本地靶场接收请求。
2. 测试协议白名单：只允许 HTTP，还是也允许 <code>file</code>、<code>dict</code>、<code>gopher</code>。
3. 建立基线：同一 URL 的成功、失败和超时分别是什么表现。

**分支**

- 有回显：检查响应内容、重定向和响应头。
- 无回显：用 DNS/HTTP 外带、时间差异或状态码判断。
- 支持 gopher：研究能否构造内网协议请求或 Redis/MySQL 等服务的交互。

**去读**

- [SSRF](../references/02-sqli-ssrf-and-protocols.md)
- [协议利用](../references/02-sqli-ssrf-and-protocols.md)

## 4. XML 请求体被解析

**信号**

- 请求体是 XML、SOAP、SVG 或 Office XML。
- 服务器返回解析错误、实体展开结果或文件内容。
- 参数可能被拼进 XML，而不是直接作为文本处理。

**先做**

1. 提交一个合法 XML，确认解析器和命名空间。
2. 测试外部实体是否启用。
3. 区分文件读取、SSRF、拒绝服务和错误回显四种表现。

**分支**

- 有文件读取：检查目标文件、编码和过滤。
- 无文件读取但有请求：尝试 SSRF 或内网服务探测。
- 有 WAF：检查实体编码、参数实体、DTD 位置和大小写。

**去读**

- [XXE](../references/02-sqli-ssrf-and-protocols.md)
- [Java 题目](../references/02-sqli-ssrf-and-protocols.md)

## 5. Cookie 里是三段式 JWT

**信号**

- Cookie 或 Authorization 头中出现 <code>xxxxx.yyyyy.zzzzz</code>。
- 页面根据 JWT 中的用户名、角色或权限显示内容。
- 修改 payload 后出现签名错误、权限变化或直接接受。

**先做**

1. 解码 header 和 payload，记录算法、kid、iss、aud、exp 和角色字段。
2. 先测试签名是否真的被校验，再测试算法混淆。
3. 检查弱密钥、kid 路径穿越和公钥泄露。

**分支**

- 算法为 none：确认服务端是否接受无签名 token。
- 有 kid：检查是否被用于文件读取、SQL 查询或密钥选择。
- 有公钥：检查 RS256 到 HS256 的算法混淆。

**去读**

- [JWT](../references/02-sqli-ssrf-and-protocols.md)

## 6. 输入被模板计算或回显

**信号**

- 输入 <code>name</code>、<code>search</code>、<code>template</code> 后返回计算结果。
- 页面出现模板引擎特有的语法错误或堆栈。
- 输入数学表达式时，结果被计算而不是原样显示。

**先做**

1. 用无害表达式确认模板引擎，例如只测试算术结果。
2. 区分 SSTI、前端模板、表达式语言和普通反射。
3. 找到模板上下文、可用对象和沙盒限制。

**分支**

- Python/Jinja：检查 Flask 配置、对象链和过滤器。
- Java：检查 SpEL、OGNL、Freemarker 或 Thymeleaf。
- Node.js：检查模板引擎和原型链 gadget。

**去读**

- [SSTI](../references/03-ssti-xss-node.md)
- [Flask](../references/04-python-and-deserialization.md)
- [Java 题目](../references/02-sqli-ssrf-and-protocols.md)

## 7. JSON body 能影响对象属性

**信号**

- 接口接收 JSON，字段被合并到配置、用户对象或模板上下文。
- 输入 <code>__proto__</code>、<code>constructor</code> 或嵌套对象后行为变化。
- Node.js 服务出现模板渲染、命令执行或权限判断异常。

**先做**

1. 记录服务端接受哪些字段、哪些字段会被忽略。
2. 测试浅层合并和深层合并的区别。
3. 判断污染后的属性是否能到达危险 sink。

**分支**

- 模板渲染：检查模板引擎 gadget。
- 子进程调用：检查环境变量、命令参数和 shell 选项。
- 权限判断：检查 isAdmin、role 等属性是否被继承。

**去读**

- [Node.js 题目](../references/03-ssti-xss-node.md)

## 8. 有反序列化入口，但不知道语言

**信号**

- Cookie、参数或请求体中出现序列化字符串、Base64 或二进制数据。
- 参数名像 <code>data</code>、<code>token</code>、<code>session</code>、<code>object</code>。
- 修改数据后出现类不存在、反序列化失败或对象方法调用错误。

**先做**

1. 确认语言：PHP、Python Pickle、Java、Node.js 或 .NET。
2. 记录对象格式、编码方式和可控制字段。
3. 先寻找可直接触发的魔术方法或 reduce 链。

**分支**

- PHP：检查 <code>__wakeup</code>、<code>__destruct</code>、<code>__toString</code> 和 POP 链。
- Python：检查 <code>__reduce__</code> 和可导入模块。
- Java：检查 CommonsCollections、URLDNS 等依赖和 gadget 链。

**去读**

- [PHP 反序列化](../references/05-php-and-pear.md)
- [Pickle](../references/04-python-and-deserialization.md)
- [Java 题目](../references/02-sqli-ssrf-and-protocols.md)

## 9. 页面没有回显，但输入可能影响后端

**信号**

- 提交 payload 后页面正常返回，没有报错或内容差异。
- 可能有 SQL、命令、SSRF 或模板注入，但结果不可见。
- 响应时间、状态码、长度、Cookie 或 DNS 请求可能变化。

**先做**

1. 建立稳定基线，重复请求多次，记录时间和响应长度。
2. 只改变一个条件，确认差异是否可重复。
3. 选择一种外带或时间通道，不要同时改多个变量。

**分支**

- SQL：布尔、时间、报错或 DNS 外带。
- 命令：时间延迟、HTTP/DNS 外带、写文件后访问。
- SSRF：DNS、HTTP 回连、状态码和响应时间。

**去读**

- [SQL 注入](../references/02-sqli-ssrf-and-protocols.md)
- [RCE](../references/01-rce-and-files.md)
- [SSRF](../references/02-sqli-ssrf-and-protocols.md)

## 10. 泄露了 Git、源码或配置

**信号**

- 可以访问 <code>.git/</code>、备份文件、源码压缩包或编辑器临时文件。
- 报错中出现框架路径、依赖版本或环境变量名。
- 页面行为与公开源码不一致，可能存在二次开发或隐藏路由。

**先做**

1. 先恢复最小可运行源码，不要急着找 payload。
2. 搜索路由、参数绑定、认证中间件、文件操作和依赖版本。
3. 把源码中的过滤逻辑和实际请求行为对照。

**分支**

- 有版本信息：检查已知漏洞和框架特性。
- 有路由：从入口参数反推调用链。
- 有配置：检查调试模式、密钥、数据库和对象存储。

**去读**

- [Git 题目](../references/02-sqli-ssrf-and-protocols.md)
- [代码执行](../references/01-rce-and-files.md)
- [综合例题](../references/07-comprehensive-and-src.md)

## 11. 登录、权限或状态机异常

**信号**

- 修改用户 ID、角色、订单号或步骤参数后能访问其他资源。
- 登录成功、失败、验证码、重置密码的响应存在差异。
- 前端隐藏字段和实际请求参数不一致。

**先做**

1. 画清楚状态流：注册、登录、验证、重置、支付、查看。
2. 记录每个步骤服务端真正校验的字段。
3. 测试越权、参数污染、重放和竞态。

**分支**

- 水平越权：替换资源 ID。
- 垂直越权：修改角色或直接访问管理接口。
- 逻辑绕过：跳过步骤、重复提交或篡改状态。

**去读**

- [常见 Trick](../references/00-recon-and-tricks.md)
- [JWT](../references/02-sqli-ssrf-and-protocols.md)

## 12. 完全不知道从哪里开始

**先做**

1. 收集入口：URL、表单、上传、Header、Cookie、JS、静态资源。
2. 收集指纹：Server、框架、语言、版本、报错、依赖。
3. 收集反馈：回显、时间、状态码、长度、外带。
4. 收集限制：黑名单、长度、字符集、协议、权限。
5. 选择一个最小验证，不要同时尝试五种漏洞。

**去读**

- [5 分钟速查](cheatsheet.md)
- [知识地图](knowledge-map.md)
- [章节索引](reference-index.md)

## 写结论的固定格式

~~~text
入口：
语言 / 框架：
漏洞类型：
过滤条件：
最小验证：
利用链：
关键请求：
结果 / flag：
修复建议：
~~~

把这条格式复制到 [writeup 模板](../templates/challenge-writeup.md)，你的每次练习都会变成可复用资料。

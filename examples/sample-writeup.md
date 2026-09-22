# Sample Writeup: Local PHP Upload Lab

> 这是一个用于展示模板结构的虚构本地靶场示例，不对应任何真实目标。

## Metadata

| Field | Value |
|---|---|
| Platform | Local Docker lab |
| Category | File upload |
| Difficulty | Beginner |
| Authorization | Local lab only |

## Recon

- Entry point: `/upload.php`
- Language / framework: PHP
- Response behavior: returns uploaded filename
- Filters: extension blacklist

## Hypothesis

黑名单可能没有覆盖可执行扩展名，或服务器解析配置允许其他后缀执行。

## Minimal verification

上传一个无害的文本文件，确认响应和保存路径。再测试被允许的扩展名与解析行为。

## Exploitation

在本地靶场中验证扩展名绕过、MIME 绕过或 `.htaccess` 配置利用。具体 payload 见 [`references/01-rce-and-files.md`](../references/01-rce-and-files.md)。

## Result

- Evidence: 上传成功并可通过 Web 访问
- Why it worked: 服务端只检查扩展名黑名单

## Remediation

- 使用白名单校验扩展名和 MIME
- 重命名上传文件
- 上传目录禁止脚本执行
- 将文件存储到 Web 根目录之外

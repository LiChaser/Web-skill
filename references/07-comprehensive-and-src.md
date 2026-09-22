# Web CTF Notes — 综合例题、常见问题与 SRC

> 来源：source/本科web笔记.md
> 内容按原笔记保留，仅添加本分组标题。

## 三十、综合例题

## 🧮 三十、综合例题

> [!summary] 速览
> - **待补充**：本章目前为空，只有标题占位

---


## 三十一、常见问题

## ❓ 三十一、常见问题

> [!summary] 速览
> - 读文件读不到 → 用 PHP 协议：`file=php://filter/convert.base64-encode/resource=flag.php`
> - MD5 长度扩展攻击（hashpump）：填入现有哈希值、已知字符串、salt 长度、要追加的字符串

1.读取文件读不到？

尝试PHP协议读取

File=php://filter/convert.base64-encode/resource=flag.php

3. MD5拓展长度攻击(hashpump)

Input Signature           #现有哈希值（题目给的MD5）

Input Data             #已知字符串

Input Key Length          #为密文（salt）长度

Input Data to Add          #为补位后自己加的字符串（自定义）

---


## 三十二、SRC 挖洞之路

## 🏴‍☠️ 三十二、SRC 挖洞之路

> [!summary] 速览
> - 入门：AWVS 安装、thinkphp 漏洞检测（`java -javaagent:rexha.jar -jar rexha.jar`）
> - 查询平台汇总见下方表格；Google 语法：`公司 inurl:php?id=`、`inurl:/admin/login.php`、`inurl:'Product.asp?BigClassName'`

新手入门：

[开挖之路心得入门](https://blog.csdn.net/weixin_50464560/article/details/115361071?ops_request_misc=%257B%2522request%255Fid%2522%253A%2522170589371316800192257195%2522%252C%2522scm%2522%253A%252220140713.130102334..%2522%257D&request_id=170589371316800192257195&biz_id=0&utm_medium=distribute.pc_search_result.none-task-blog-2~all~top_positive~default-1-115361071-null-null.142^v99^pc_search_result_base7&utm_term=%E5%85%AC%E7%9B%8Asrc&spm=1018.2226.3001.4187)

1.[AVWS的安装](https://www.ddosi.org/awvs-15-2/#1%E5%AE%89%E8%A3%85awvs152)

2.thinkphp检测漏洞

java -javaagent:rexha.jar -jar rexha.jar

### 查询平台

| 用途 | 地址 |
| --- | --- |
| ICP 备案 / 子域名查询 | https://beian.miit.gov.cn/#/Integrated/recordQuery |
| whois 域名反查 | https://whois.chinaz.com/ |
| 子域名查询 | https://chaziyu.com 、https://site.ip138.com/xxx.com/domain.htm |
| 站长之家（权重 / 排名） | https://rank.chinaz.com/ |
| 备案查询 + 资产搜索（Hunter） | https://beian.miit.gov.cn/ 、https://hunter.qianxin.com/ |
| IP 地址查询 | https://tool.lu/ip/ 、https://www.ip138.com/ |
| 钟馗之眼（空间测绘） | https://www.zoomeye.hk/ |
| 子域名收集 OneForAll | https://github.com/shmilylty/OneForAll |
| JS 接口发现 JSFinder | https://github.com/Threezh1/JSFinder |
| 旁站查询 | https://www.webscan.cc/ |

### SQL 漏洞

 **google语法：**

         公司inurl:php?id=

         公司inurl:asp?id=

         公司inurl:aspx?id=

         后台：inurl：/admin/login.php

 		inurl:'Product.asp?BigClassName'

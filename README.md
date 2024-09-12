# script

一些简单的 JS 脚本。Some simple JS scripts.

## checkPassword.js

使用 7-Zip 检查压缩包的密码

### 配置你的 7-Zip 路径

打开 js 文件，将这一行修改为你的 7-Zip 安装路径下的 `7z.exe`（Linux、Mac 用户可以改为对应的命令行程序路径）：

```JS
// 7-Zip 的路径
const exePath = 'D:\\Program Files\\7-Zip\\7z.exe';
```

### 配置你的密码本

格式为按行分割，一行一条密码，比如说你在 `D:\pw.txt` 里面写入：

```plain
123
...其他密码...
789
```

### 使用命令行调用

```shell
node checkPassword.js <你的压缩包路径> <你的密码本路径>
```

假设你的压缩包路径是 `D:\zip.7z` 

```shell
node checkPassword.js D:\zip.7z D:\pw.txt
```

可以使用相对路径等路径方式调用

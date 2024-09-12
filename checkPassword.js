const { exec } = require('child_process');
const fs = require('fs');
const readline = require('readline');

// 7-Zip 的路径
const exePath = 'D:\\Program Files\\7-Zip\\7z.exe';

function defer() {
  const res = {};
  res.promise = new Promise((resolve, reject) => {
    res.resolve = resolve;
    res.reject = reject;
  });
  return res;
}

function tryPassword(archivePath, password) {
  const dfd = defer();
  exec(`"${exePath}" t -p"${password}" "${archivePath}"`, (error, stdout, stderr) => {
    // console.log('error\n', error);
    // console.log('stderr\n', stderr);
    if (error) {
      // 检查错误输出来确定是否因为密码不对
      if (/Wrong password/i.test(stderr)) {
        dfd.resolve(false); // 密码不正确，继续尝试下一个密码
      } else {
        dfd.reject(error);
      }
    } else {
      // 密码正确
      dfd.resolve(true);
    }
  });
  return dfd.promise;
}

async function checkPassword(archivePath, passwordsFilePath) {
  // 检查有无密码
  if (await tryPassword(archivePath, '')) {
    console.log(`目标压缩包没有密码保护`);
    return;
  }
  // 有密码，尝试密码本
  const fileStream = fs.createReadStream(passwordsFilePath);
  const rl = readline.createInterface({
    input: fileStream,
    // crlfDelay: Infinity,
  });
  let line_num = 1;
  // 同步方式，读取每一行的内容
  for await (const password of rl) {
    console.log(`正在尝试第 ${line_num++} 个密码: ${password}`);
    const res = await tryPassword(archivePath, password);
    if (res) {
      console.log(`找到正确的密码: ${password}`);
      rl.close();
      process.exit(0);
    }
  }
}

// 获取命令行参数中的压缩包路径和密码本路径
const args = process.argv.slice(2);
if (args.length !== 2) {
  console.error('使用方法: node checkPassword.js <压缩包路径> <密码本路径>');
  process.exit(1);
}

const archivePath = args[0];
const passwordsFilePath = args[1];

checkPassword(archivePath, passwordsFilePath);

import {Injectable} from '@angular/core';
import {ServiceModule} from '../service.module';

// npm i crypto-js
// npm i --save-dev @types/crypto-js
import {AES, enc, pad, mode} from 'crypto-js';

@Injectable({
  providedIn: ServiceModule
})
/*
* @Author: eter
* @Date: 2021/12/26 下午5:56
* 生产环境中，重要数据建议多加一层服务端加密,并且客户端和服务器加密方式不要一致
* 记住密码：(假设用户设备不会丢失，授权登陆信息的设备可登陆系统，否则需要参考使用类似微信网页端登陆，在手机APP上进行确认的模式)
* 本地 aes: key iv 从服务端获取
* 加密后传服务器进行 aes解密 再进行两次不同加密；
* 一次不可逆加密，将密码加密存储到数据库，用于验证登陆；
* 另一次使用一个GUID（保存到服务器，用于主动失效），混合用户客户端信息，ip，设备号，浏览器版本，过期时间等进行 RSA 加密，用于客户端记住密码功能（返回给客户端存储到 localStorage）；
* 即使客户端木马程序拿到密文密码信息，也抓包得到 aes: key iv，但解密后得到的为服务 RSA 加密的一种 TOKEN；该 TOKEN 只在指定设备，有效期内受信任；无法解密得到明文密码，降低用户损失（用户常常不同网站会使用相同密码，服务端加密方式不同，即使密文密码泄露，也能保证其他网站安全）
* 客户端永远不要存密码相关数据，密文也不建议。
* 服务端数据库存不可逆加密后密码，对用户负责，除了用户，谁也不要知道明文密码。
* */
export class CryptoService {
  private key = enc.Utf8.parse('1234123412ABCDEF');  // 十六位十六进制数作为密钥
  private iv = enc.Utf8.parse('ABCDEF1234123412');   // 十六位十六进制数作为密钥偏移量

  constructor() {
  }

  // 解密方法
  decrypt(word: string): string {
    const encryptedHexStr = enc.Hex.parse(word);
    const srcs = enc.Base64.stringify(encryptedHexStr);
    const decrypt = AES.decrypt(srcs, this.key, {iv: this.iv, mode: mode.CBC, padding: pad.Pkcs7});
    const decryptedStr = decrypt.toString(enc.Utf8);
    return decryptedStr.toString();
  }


  // 加密方法
  encrypt(word: string): string {
    const srcs = enc.Utf8.parse(word);
    const encrypted = AES.encrypt(srcs, this.key, {iv: this.iv, mode: mode.CBC, padding: pad.Pkcs7});
    return encrypted.ciphertext.toString().toUpperCase();
  }

}

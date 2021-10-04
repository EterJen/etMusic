/*
* 开发环境中可以指定配置文件： ng serve -c eter
* 但不建议这样使用，因为热更新会非常慢，建议直接将对应配置文件复制到此处，再使用 ng serve 命令进行开发调试
* 多环境配置文件主要用于打包事指定加载目标配置文件 命令： ng build -c eter
* */

export const environment = {
  production: false,
  baseUri: 'http://localhost:3000',
  storeDevtools: {
    logOnly: false
  }
};


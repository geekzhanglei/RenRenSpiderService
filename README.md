# node 接口服务器的简单实现

## 项目目标与意义

-   使用爬虫获取人人字幕组网站的部分数据，通过接口服务提供给前端
-   使前端能初步理解后端接口服务的运行原理

## 功能描述

1. 用 node 作为服务器对外提供接口服务
2. 使用爬虫爬取网站数据作为数据源
3. 需要定时运行爬虫，保证数据新鲜

## 技术栈

-   [x] 谷歌爬虫插件 puppeteer 简单使用
-   [x] node 的 http、fs 模块使用
-   [x] node-schedule 用来定时启用爬虫

## 使用方法

### 本地运行

1. 安装依赖

```
yarn install
```

2. 运行主文件

-   测试

```
node server
```

-   实际运行
    > 为了解决终端断开 node 进程中断的问题，使用[forever](https://github.com/foreverjs/forever)（node 进程管理工具）来管理

```
npm install forever -g
forever start server.js
```

### 修改配置

-   config.js 中修改 node 服务的域名和端口号
    -   实测表明人人经常更换域名，这里统一将域名写在 config 中
-   服务器中实现
    本例使用 nginx 端口转发给本地端口，实现 nginx 和 node 服务共存

```
<!-- nginx配置，proxy_pass地址为node的web服务ip和端口号 -->
server {
    listen 443;
    server_name api.xxx.com;
    location /node/ {
    proxy_pass http://127.0.0.1:1337;
    }
}
```

-   getApiData 文件夹下是 puppeteer 爬虫业务代码

## 项目缺陷

-   只是简单跑通流程，没考虑接口安全性

## 注意事项

1. 由于人人影视对资源内容进行了加密，无账号状态已经不可获取，故移除获取资源接口

## todo
[ ] 将本地文件存储更换为mysql数据库

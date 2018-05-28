# node接口服务器的简单实现
## 项目目标与意义
- 使用爬虫获取人人字幕组网站的部分数据，通过接口服务提供给前端
- 使前端能初步理解后端接口服务的运行原理
## 功能描述
1. 用node作为服务器对外提供接口服务
2. 使用爬虫爬取网站数据作为数据源
3. 需要定时运行爬虫，保证数据新鲜
## 技术栈
- [x] 谷歌爬虫插件puppeteer简单使用
- [x] node的http、fs模块使用
- [x] node-schedule用来定时启用爬虫
## 使用方法
### 本地运行
1. 安装依赖
```
npm install
```
2. 运行主文件
```
node server
```
### 修改配置
- config.js中修改node服务的域名和端口号
- 服务器中实现
本例使用nginx端口转发给本地端口，实现nginx和node服务共存
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
- getApiData文件夹下是puppeteer爬虫业务代码
## 项目缺陷
- 只是简单跑通流程，没考虑接口安全性、

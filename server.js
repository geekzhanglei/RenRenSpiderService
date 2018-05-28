/*
 * @Author: zhanglei
 * @Date: 2019-10-24 15:39:05
 * @LastEditors  : zhanglei
 * @LastEditTime : 2020-02-10 17:48:48
 * @Description: 人人影视爬虫
 */
// 加载配置文件
const config = require('./config');
// 运行爬虫函数库
const hotApiFrom = require('./getApiData/hottv');
const hotNewApiFrom = require('./getApiData/hotnew');
const scheduleApiFrom = require('./getApiData/schedule');
// 获取接口数据的处理逻辑
const apiForHotTv = require('./apis/hottv');
const apiForSliderImg = require('./apis/slider');
const apiForTvDeatail = require('./apis/tvdetails');
const apiForSchedule = require('./apis/schedule');
// const apiForResource = require('./apis/resource');
// node基础服务
const http = require('http');
const url = require('url');

const forFiles = require('./utils');

// 任务调度,用来定时执行爬虫
const schedule = require('node-schedule');

// 定时任务运行，每天4点16分15秒爬取数据
schedule.scheduleJob('15 16 4 * * *', () => {
    // 更新爬虫数据
    hotApiFrom.getHotTv();
    hotNewApiFrom.getHotNewTv();
    scheduleApiFrom.getScheduleList();
});
// 大约每3天清理一次log
schedule.scheduleJob('15 13 4 */3 * *', () => {
    forFiles.manageLogs('/root/.forever', 'clear');
});

//创建服务器
const server = http.createServer(function (req, res) {
    let pathname = url.parse(req.url).pathname;
    let url_info = url.parse(req.url, true);

    res.writeHead(200, {
        'Content-type': 'text/html'
    });
    switch (pathname) {
        case "/node/hottv": // 本周热门影视接口
            apiForHotTv.handleHottvData(res, url_info);
            break;
        case "/node/slider": // 影视剧轮播图接口
            apiForSliderImg.handleSliderData(res, url_info);
            break;
        case "/node/tv": // 具体剧集详情接口
            apiForTvDeatail.handleTvDetail(res, url_info);
            break;
        case "/node/schedule": // 整月时间表
            apiForSchedule.handleSchedule(res, url_info);
            break;
            // case "/node/resource": // 获取资源链接，具体美剧的分享链接列表
            // apiForResource.handleResource(res, url_info);
            // break;
        default:
            res.writeHead(404, {
                'Content-Type': 'text/plain'
            });
            res.end('oh!404 not found');
            break;
    }
});

server.listen(config.port, config.host);
console.log('server is running:listening on port ' + config.port);

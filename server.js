/**
 * function：nodejs服务器提供接口
 * author：zhanglei
 * date：2018.5.26
 */

// 加载配置文件
const config = require('./config');
// 运行爬虫函数库
const todoApi = require('./getApiData/hottv');
// 获取接口处理逻辑
const handleHotTv = require('./apis/hottv');
// node基础服务
const http = require('http');
const url = require('url');
// 任务调度,用来定时执行爬虫
const schedule = require('node-schedule');

// 初始化接口数据，即爬虫获取数据
todoApi.getHotTv();

// 定时任务运行，每天0点31分更新数据
var j = schedule.scheduleJob('* 31 0 * * *', function() {
    // '*/10 * * * * *'代表每十秒执行一次
    // todoApi.getHotTv();
});

//创建服务器
const server = http.createServer(function(req, res) {
    let pathname = url.parse(req.url).pathname;
    let url_info = url.parse(req.url, true);

    res.writeHead(200, {
        'Content-type': 'text/html'
    });

    // 热门影视剧接口
    if (pathname == "/hottv") {
        handleHotTv.handleHottvData(res, url_info);
    } else {
        res.writeHead(404, {
            'Content-Type': 'text/plain'
        });
        res.end('404 not found');
    }
});

server.listen(config.port, config.host);
console.log('server is running:listening on port ' + config.port);

/**
 * function：hottv接口的内部逻辑
 * author：zhanglei
 * date：2018.5.28
 */

const url = require('url');
const fs = require('fs');
const path = require('path');

// 获取热门影视接口
let handleHottvData = (res, url_info) => {
    let data = '',
        params = [],
        post_data, json, start, count, _start, _count;

    // 获取get请求参数
    post_data = require('querystring').stringify(url_info.query);
    console.log('参数:' + post_data);
    params = post_data.split("&");
    _start = params[0].split('=')[0];
    _count = params[1].split('=')[0];

    if (params.length && _start === "start" && _count === "count") {
        start = Number(params[0].split('=')[1]);
        count = Number(params[1].split('=')[1]);
    } else {
        start = 0;
        count = 100;
    }
    //这里返回json数据
    res.writeHead(200, {
        "Content-Type": "application/json"
    });

    // 同步读取存储在文件中的数据
    data = fs.readFileSync(path.resolve(__dirname, '../data/data.json'));

    json = data.toString();
    json = JSON.parse(json).slice(start, start + count);
    res.end(JSON.stringify(json));
}

module.exports = {
    handleHottvData
}

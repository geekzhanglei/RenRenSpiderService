/**
 * function：排期表接口的内部逻辑
 * author：zhanglei
 * date：2018.5.31
 */

const fs = require('fs');
const path = require('path');

// 获取剧集详情
let handleSchedule = (res, url_info) => {
    let data = '',
        params = [],
        post_data, json, _start, _count, start, count;

    // 获取get请求参数
    post_data = require('querystring').stringify(url_info.query);
    console.log('参数:' + post_data);
    if (post_data) {
        try {
            params = post_data.split("&");
            _start = params[0].split('=')[0];
            _count = params[1].split('=')[0];
            if (params.length && _start === "start" && _count === "count") {
                start = Number(params[0].split('=')[1]);
                count = Number(params[1].split('=')[1]);
            }
        } catch (e) {
            res.writeHead(400, {
                "Content-Type": "text/plain"
            });
            res.end('error request!Please check api specs!')
            return;
        }
    }

    //这里返回json数据
    res.writeHead(200, {
        "Content-Type": "application/json"
    });

    data = fs.readFileSync(path.resolve(__dirname, '../data/schedule.json'));
    json = data.toString();

    let _maxNum = JSON.parse(json).length;

    console.log(_maxNum, start + count, start, count);

    if (start >= 0 && count > 0 && start + count < _maxNum) {
        json = JSON.parse(json).slice(start, start + count);
        res.end(JSON.stringify(json));
    } else {
        res.end('错误，请检查参数格式');
    }

}

module.exports = {
    handleSchedule
}

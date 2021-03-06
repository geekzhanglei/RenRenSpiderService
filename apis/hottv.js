/**
 * function：hottv接口的内部逻辑
 * author：zhanglei
 * date：2018.5.28
 */

const fs = require('fs');
const path = require('path');

// 获取热门影视接口
let handleHottvData = (res, url_info) => {
    let data = '',
        params = [],
        post_data, json, start = 0,
        count = 100,
        _maxNum = 100,
        _start, _count, tmp;


    // 获取get请求参数
    post_data = require('querystring').stringify(url_info.query);
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
            res.end('请求参数错误');
            return;
        }
    }

    //这里返回json数据
    res.writeHead(200, {
        "Content-Type": "application/json"
    });

    // 同步读取存储在文件中的数据
    data = fs.readFileSync(path.resolve(__dirname, '../data/hottv.json'));

    json = data.toString();
    if (start > _maxNum || start < -_maxNum || start + count < -_maxNum) {
        json = JSON.parse(json).slice(0, _maxNum);
        res.end(JSON.stringify(json));
    } else {
        if (start + count > 99) {
            tmp = 99;
        } else {
            tmp = start + count;
        }
        json = JSON.parse(json).slice(start, tmp);
        res.end(JSON.stringify(json));
    }
}

module.exports = {
    handleHottvData
}

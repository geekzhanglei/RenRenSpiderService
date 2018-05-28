/**
 * function：node/slider接口的内部逻辑
 * author：zhanglei
 * date：2018.5.30
 */

const url = require('url');
const fs = require('fs');
const path = require('path');

// 获取浏览量最高的top10影视接口
let handleSliderData = (res, url_info) => {
    let data = '',
        params = [],
        post_data, json, start = 0,
        count = 100,
        _maxNum = 100,
        _start, _count;


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
            res.end('请求参数错误');
            return;
        }
    }

    //这里返回json数据
    res.writeHead(200, {
        "Content-Type": "application/json"
    });

    // 同步读取存储在文件中的数据
    data = fs.readFileSync(path.resolve(__dirname, '../data/hotnew.json'));

    let result = [];
    json = data.toString();

    try {
        if (start > _maxNum || start < -_maxNum || start + count > _maxNum || start + count < -_maxNum) {
            json = JSON.parse(json).slice(0, _maxNum);
            json.forEach(element => {
                result.push({
                    img: element.img,
                    link: element.link
                });
            });
            res.end(JSON.stringify(result));
        } else {
            json = JSON.parse(json).slice(start, start + count);
            json.forEach(element => {
                result.push({
                    img: element.img,
                    link: element.link
                });
            });
            res.end(JSON.stringify(result));
        }
    } catch (e) {
        res.end('请求非法，请检查参数是否正确！');
    }
}

module.exports = {
    handleSliderData
}

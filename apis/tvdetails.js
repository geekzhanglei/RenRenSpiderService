/**
 * function：hottv接口的内部逻辑
 * author：zhanglei
 * date：2018.5.28
 */

const url = require('url');
const fs = require('fs');
const path = require('path');

// 获取剧集详情
let handleTvDetail = (res, url_info) => {
    let data = '',
        params = [],
        post_data, json, _type, _id, type, id;


    // 获取get请求参数
    post_data = require('querystring').stringify(url_info.query);
    console.log('参数:' + post_data);
    if (post_data) {
        params = post_data.split("&");
        try {
            _type = params[0].split('=')[0];
            _id = params[1].split('=')[0];
            if (params.length && _type === "type" && _id === "id") {
                type = params[0].split('=')[1];
                id = params[1].split('=')[1];
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
        "Content-": "application/json"
    });

    if (type == "hot") {
        // 同步读取存储在文件中的数据
        data = fs.readFileSync(path.resolve(__dirname, '../data/hottv.json'));
    } else {
        data = fs.readFileSync(path.resolve(__dirname, '../data/hotnew.json'));
    }
    json = data.toString();

    JSON.parse(json).forEach(element => {
        if (element.link.split('/').reverse()[0] == id) {
            res.end(JSON.stringify(element));
        }
    });
}

module.exports = {
    handleTvDetail
}

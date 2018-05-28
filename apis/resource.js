/**
 * function：node/slider接口的内部逻辑
 * author：zhanglei
 * date：2018.5.30
 */

const resourceSpider = require('../getApiData/resource');

// 获取资源链接
let handleResource = (res, url_info) => {
    let post_data, _url, link = 'zero';
    post_data = require('querystring').stringify(url_info.query);

    if (post_data) {
        try {
            _url = `http://www.zimuzu.tv/resource/${post_data.split('=')[1]}`;
        } catch (e) {
            res.writeHead(400, {
                "Content-Type": "text/plain"
            });
            res.end('请求参数错误');
            return;
        }
    }

    link = resourceSpider.getResourceLink(_url);

    //这里返回json数据
    res.writeHead(200, {
        "Content-Type": "application/json"
    });
    link.then((data) => {
        res.end(JSON.stringify({
            url: data,
            code: 10000,
            msg: '请求成功'
        }));
    }, (data) => {
        res.end(JSON.stringify({
            code: 10001,
            msg: '请求超时',
            errMsg: data
        }));
    });
}

module.exports = {
    handleResource
}

/**
 * function：获取分享链接
 * author:zhanglei
 * date:2018.6.11
 */
const puppeteer = require('puppeteer');

const {
    sleep
} = require('../utils');


async function getResourceLink(url) {
    // let result = [];
    console.log('Start visit ' + url);

    // 启动一个浏览器
    const browser = await puppeteer.launch({
        args: ['--no-sandbox'],
        dumpio: false
    });

    /* 第一个页面开启 */
    let page = await browser.newPage() // 开启一个新页面
    // 去人人美剧详情页
    await page.goto(url, {
        waitUntil: 'networkidle2' // 网络空闲说明已加载完毕
    });

    await sleep(2000);

    // 结果
    const _link = await page.evaluate(() => {
        var $ = window.$;
        return $('#resource-box a').attr('href');
    });

    console.log('输出数据：');
    console.dir(_link);

    // 关闭浏览器
    await browser.close();
    return _link;
};

module.exports = {
    getResourceLink
};

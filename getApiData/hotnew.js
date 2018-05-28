/**
 * function：排行榜中已开播新剧信息，作为数据源
 * author:zhanglei
 * date:2018.5.30
 */

const puppeteer = require('puppeteer');
const config = require('../config.js');

const {
    sleep,
    writeFileSync
} = require('../utils');

const globalVars = {
    url: `${config.renrenHost}/resource/playing`
    // num: 0
}

async function getHotNewTv() {
    let result = [];
    console.log('Start visit 已开播新剧页面');

    // 启动一个浏览器
    const browser = await puppeteer.launch({
        args: ['--no-sandbox'],
        dumpio: false
    });
    let page = await browser.newPage() // 开启一个新页面

    await page.goto(globalVars.url, {
        waitUntil: 'networkidle2' // 网络空闲说明已加载完毕
    });

    // 结果
    const _listResult = await page.evaluate((renrenhost) => {
        let $ = window.$;
        let _this = this;
        let items = $('.xy-list ul li');
        // globalVars.num = items.length;
        // return items.length;

        let res = [],
            it, cnName, enName, point, link, type, season, readNum;
        if (items.length >= 1) {
            items.each((index, item) => {
                it = $(item)
                cnName = it.find('.info a strong').text();
                enName = it.find('.info a .f14').text();
                point = it.find('.info a .point').text();
                link = renrenhost + it.find('.info a').attr('href');
                type = it.find('.info p').html().split('<br>')[0];
                season = it.find('.info p').html().split('<br>')[1];
                readNum = it.find('.a2 strong').text();

                res.push({
                    cnName,
                    enName,
                    point,
                    link,
                    type,
                    season,
                    readNum
                })
            });
        }
        return res;
    }, config.renrenHost);

    // 关闭浏览器
    await page.close();
    // console.log(globalVars.num)

    for (var i = 0, l = _listResult.length; i < l; i++) {
        page = await browser.newPage() // 开启一个新页面
        console.log("链接" + _listResult[i].link)
        await page.goto(_listResult[i].link, {
            waitUntil: 'networkidle2' // 网络空闲说明已加载完毕
        });

        // page.evaluate相当于页面注入js，所以内部console.log不会打印
        const _detailResult = await page.evaluate(async () => {
            let obj = {},
                director = [],
                cast = [];
            let img = $('.imglink img').attr('src');
            let isRenew = '未知';
            let level = '暂无'
            try {
                // 是否续订
                isRenew = $('.fl-info .tc span')[0].innerText;
            } catch {}
            try {
                // 分级
                level = $('.level-item img').attr('src').split('/').reverse()[0].slice(0, 1) || 'error';
            } catch {}
            let tv = $('.fl-info .ib:eq(3) strong').text();
            $('.fl-info li:eq(9) a').each((index, ele) => {
                director.push(ele.text);
            })
            $('.fl-info .rel a').each((index, ele) => {
                cast.push(ele.text);
            })
            let resource = $('#resource-box .view-res-list a').attr('href');
            let status = $('.fl-info .status span').text() || "未知";
            $('.resource-desc .con a').click();
            let des = $('.resource-desc .con span').text();

            obj = {
                isRenew,
                level,
                status,
                img,
                tv,
                director,
                cast,
                resource,
                des
            };
            return obj;
        });
        result[i] = Object.assign(_listResult[i], _detailResult);
        await page.close();
    }

    await sleep(3000);
    await browser.close();
    console.log('最终数据：');
    console.dir(result);
    writeFileSync('./data/hotnew.json', result);

};

module.exports = {
    getHotNewTv
};

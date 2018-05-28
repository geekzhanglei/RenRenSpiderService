const puppeteer = require('puppeteer');

const {
    sleep,
    writeFileSync
} = require('../utils');

const url = `http://www.zimuzu.tv/html/top/week_tv_list.html`;

async function getHotTv() {
    console.log('Start visit week.html');

    // 启动一个浏览器
    const brower = await puppeteer.launch({
        args: ['--no-sandbox'],
        dumpio: false
    });

    const page = await brower.newPage() // 开启一个新页面
    // 去人人影视每周排行榜页面
    await page.goto(url, {
        waitUntil: 'networkidle2' // 网络空闲说明已加载完毕
    });

    await sleep(3000);

    // 结果
    const result = await page.evaluate(() => {
        // 拿到页面上的jQuery
        var $ = window.$;
        var items = $('.xy-list ul li');

        var res = [];

        if (items.length >= 1) {
            items.each((index, item) => {
                let it = $(item)
                let cnName = it.find('.info a strong').text();
                let enName = it.find('.info a span').text();
                let link = "http://www.zimuzu.tv" + it.find('.info a').attr('href');
                let type = it.find('.info p').html().split('<br>')[0];
                let season = it.find('.info p').html().split('<br>')[1].split('<span>')[0];
                let readNum = it.find('.info p span').text();
                let img = it.find('.img a img').attr('src');

                let rank = it.find('.a1 .f3').text();
                let year2kind = it.find('.a1 p').text();

                res.push({
                    cnName,
                    enName,
                    link,
                    type,
                    season,
                    readNum,
                    img,
                    rank,
                    year2kind
                })
            });
        }
        return res;

    });
    writeFileSync('./data/data.json', result);
    // 关闭浏览器
    brower.close();

    console.dir(result);
};

module.exports = {
    getHotTv
};

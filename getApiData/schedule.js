/**
 * function：获取当月排期表，作为数据源
 * author:zhanglei
 * date:2018.5.31
 */

const puppeteer = require('puppeteer');
const config = require('../config');

const {
    sleep,
    writeFileSync
} = require('../utils');

const globalVars = {
    url: `${config.renrenHost}/tv/schedule`
    // num: 10
}

async function getScheduleList() {
    console.log('------Start visit 排期表页面------');

    // 启动一个浏览器
    const brower = await puppeteer.launch({
        args: ['--no-sandbox'],
        dumpio: false,
        // headless: false   // 可视化运行过程，调试用
    });

    let page = await brower.newPage() // 开启一个新页面

    await page.goto(globalVars.url, {
        waitUntil: 'networkidle2' // 网络空闲说明已加载完毕
    });

    // 结果
    let list = await page.evaluate(() => {
        // 拿到页面上的jQuery
        let $ = window.$;
        let _this = this;
        let items = $('tbody .ihbg');

        let res = [],
            it, links, texts;
        if (items.length) {
            items.each((index, item) => {
                it = $(item)
                time = it.find('dl dt').text();

                infoItem = it.find('dl dd');
                links = [];
                texts = [];
                infoItem.each((index, ele) => {
                    links.push($(ele).find('a').attr('href'));
                    texts.push($(ele).find('a').text());
                });

                res.push({
                    time,
                    links,
                    texts
                });
            });
        }
        return res;
    });

    // 关闭本页
    await page.close();
    console.log('------排期表获取完成，关闭页面------');

    let linkIndex = [], // linkIndex表示每个单页的详细数据，重复用索引值表示，如[obj1,obj2,0,1]，其中0表示obj1，1表示obj2
        detailRes = [], // detailRes是每个详情页数据
        tmpIndex;

    list.forEach(element => {
        element.links.forEach(ele => {
            tmpIndex = linkIndex.indexOf(ele);
            if (tmpIndex == "-1") {
                linkIndex.push(ele);
            } else {
                linkIndex.push(tmpIndex);
            }
        });
    });

    let ele;
    for (let j = 0, l = linkIndex.length; j < l; j++) {
        ele = linkIndex[j];
        console.log('进入排期表item链接'+ele);
        if (typeof ele !== "number") {
            page = await brower.newPage() // 开启一个新页面
            console.log(`------开启新页面，即将跳转链接: ${ele}------`);

            await page.goto(config.renrenHost + ele, {
                waitUntil: 'networkidle2' // 网络空闲说明已加载完毕
            });
            console.log('------跳转完成，页面数据提取中------')
            const detailsList = await page.evaluate(async () => {
                let obj = {},
                    director = [],
                    cast = [],
                    screenwriter = [];

                let img = $('.imglink img').attr('src');
                let tv = $('.fl-info .ib:eq(3) strong').text();
                let type = $('.fl-info li:eq(5) strong').text();
                let enName = $('.fl-info li:eq(0) strong').text();

                $('.fl-info li:eq(8) a').each((index, ele) => {
                    screenwriter.push(ele.text);
                });
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
                obj = {
                    isRenew,
                    level,
                    enName,
                    type,
                    status,
                    img,
                    tv,
                    screenwriter,
                    director,
                    cast,
                    resource,
                    des
                };
                return obj;
            });
            await page.close();
            console.log("当前详情数据");
            console.log(detailsList);
            detailRes.push(detailsList);
        } else {
            detailRes.push(ele);
        }
    }

    await brower.close();

    console.log('详情数据');
    console.dir(detailRes);

    let result = [],
        i = 0;

    // 将result列表数据与详情数据合并处理
    list.forEach(ele => {
        let _listItem = [];
        ele.links.forEach(item => {
            if (typeof detailRes[i] !== "number") {
                _listItem.push(detailRes[i++]);
            } else {
                _listItem.push(detailRes[detailRes[i++]]);
            }
        });
        ele["listItem"] = _listItem;
    });

    // console.log('最终数据：');
    // console.dir(list);

    writeFileSync('./data/schedule.json', list);

};


module.exports = {
    getScheduleList
};

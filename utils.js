const path = require('path');
const fs = require('fs');

function writeFileSync(name, data) {
    fs.writeFile(path.resolve(__dirname, name), JSON.stringify(data), (err) => {
        if (err) {
            console.log("写入失败:" + err);
        } else {
            console.log('写入成功');
        }
    });
}

const sleep = time => new Promise(resolve => {
    setTimeout(resolve, time);
});

// 删除或清空文件：
const manageLogs = (path, handle) => {
    let files = fs.readdirSync(path);
    files.forEach((file) => {
        let curPath = `${path}/${file}`;
        let stats = fs.statSync(curPath);
        if (!stats.isDirectory()) {
            if (handle == 'clear') {
                fs.writeFile(curPath, "", (err) => {
                    if (err) throw err;
                    console.log(`清空文件${curPath}成功`);
                });
            }
            if (handle == 'delete') {
                fs.unlinkSync(curPath);
            }
        }
    });
}

module.exports = {
    writeFileSync,
    sleep,
    manageLogs
};

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

module.exports = {
    writeFileSync: writeFileSync,
    sleep: sleep
};

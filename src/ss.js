const fs = require('fs');
const run = require('./puppeteer');
const defaultConfig = require('./default');
const fileUrl = 'C:/dev/shadowsocks/gui-config.json';

module.exports = class SS {
  constructor(props) {
    this.init(props.url);
  }
  init(url) {
    run(url).then((result) => {
        console.log(result);
      // this.map(result);
        var data=JSON.parse(result).data;
      data.sort((x,y)=>{
          return parseInt(y[0], 10)-parseInt(x[0], 10)
      });
        var configs=data.map(function (o) {
            return {
                "server":  o[1],
                "server_port": parseInt(o[2], 10),
                "password": o[3],
                "method": o[4],
                "remarks":  o[6] + '-' + o[1].split('.')[3],
                "timeout": 5
            }
        });
        this.save(configs);
    });
  }
  save(configs) {
    if (fs.existsSync(fileUrl)) {
      fs.unlinkSync(fileUrl);
    }
    const data = Object.assign({}, defaultConfig, { configs });
    fs.writeFile(fileUrl, JSON.stringify(data), (err) => {
      if (err) {
        console.log(err);
        return;
      }
      console.log('success');
    });
  }
};
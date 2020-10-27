var fs = require('fs');
const apiConfig = {
  local:'https://api.clickspool.com',
  dev: 'https://api.clickspool.com',
  pre: 'https://api.clickspool.com',
  production: ' https://api.clickspool.com',
};
let apidomain = apiConfig[process.argv[2]];
var parse = `const apiConfig ="${apidomain}";\r\n export default apiConfig;`;

fs.writeFile(
  './src/utils/apiConfig.js',
  parse,
  {
    encoding: 'utf8',
    mode: 438,
    flag: 'w',
  },
  function (err) {
    console.log(`-${apidomain}-`);
  }
);

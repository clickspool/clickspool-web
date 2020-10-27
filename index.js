let fs = require('fs');
let html = require('htmlparser-to-html');
let htmlparser = require("htmlparser");
let rawHtml = ``;
let handler ;
let parserData=[];
// console.log(JSON.stringify(m),'mmm')
// console.log(html(m),'----------');
function copyFile(element,cb) {
  fs.readFile(element, 'utf-8', function (err, data) {
    if (err) {
      console.log(`${element}读取失败`);
    } else {
      // writeFile(data,name)
      // return data;
      cb(data)
    }
  });
}

function writeFile(data,name) {
  fs.writeFile(`${name}`, data, 'utf8', function (error) {
    if (error) {
      throw error;
    } else {
      console.log(`${name}已保存`);
    }
  });
}

copyFile('./dist/index.html',(data)=>{
  handler = new htmlparser.DefaultHandler(function (error, dom) {
      if (error){
        console.log(error)
      }else{
        // console.log(JSON.stringify(dom),'mmm')
        parserData=dom;
        parserData[1].children[0].children.forEach((item,index) => {
          if(item.name=='link'){
            if(item.attribs.rel=='stylesheet'){
              parserData[1].children[0].children[index].attribs.href=item.attribs.href+'?'+new Date().getTime()
            }
          }
        });
        parserData[1].children[1].children.forEach((item,index) => {
          if(item.type=='script'){
              parserData[1].children[1].children[index].attribs.src=item.attribs.src+'?'+new Date().getTime()
          }
        });

      }
    });
    var parser = new htmlparser.Parser(handler);

    parser.parseComplete(data);
    writeFile(html(parserData),'./dist/index.html');
})
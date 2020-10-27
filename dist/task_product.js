/* eslint-disable */
let time = null;
let t = 0;
self.onmessage = function (oEvent) {
    var oReq = new XMLHttpRequest();
    if(oEvent){
      time=setInterval(()=>{
        self.postMessage(t++);
      },3000)
      return
    }
    clearInterval(time)
    // oReq.open("GET", "myFile.txt");  // 同步请求
    // oReq.send(null);
    // self.postMessage(oReq.responseText);
};
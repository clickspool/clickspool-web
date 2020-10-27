/**
 * @param file 文件流
 * @return Object  {width, height}
 * }
 */
class CalcImages {
 constructor (file) {
  // return this.getImgWidth(file);
 }
 public getURLImgBase64(url){
  return new Promise((resolve, reject) => {
    let Img = new Image();
    let dataURL = '';
    Img.setAttribute('crossOrigin', 'anonymous');
    Img.src = url;
    Img.onload = () => { //确保图片完整获取
        var canvas = document.createElement("canvas"),//创建canvas元素
            width = Img.width, //canvas的尺寸和图片一样
            height = Img.height;
        // console.log(width,height)
        canvas.width = width;
        canvas.height = height;
        canvas.getContext("2d").drawImage(Img, 0, 0, width, height); //绘制canvas
        dataURL = canvas.toDataURL('image/png'); //转换为base64
        resolve([dataURL,width,height]);
    };
  });
  }

  public getImgWidth = (file) =>{
    return new Promise((resolve, reject) => {
      const reader = new FileReader;
      reader.onload =  (evt) => {
          const image = new Image();
          image.onload =  () => {
            const width = image.width;
            const height = image.height;
              resolve({file,weight_high:`${width},${height}`});
          };
          image.src = evt.target.result;
     };
    reader.readAsDataURL(file);
    })
  }
}

export default CalcImages
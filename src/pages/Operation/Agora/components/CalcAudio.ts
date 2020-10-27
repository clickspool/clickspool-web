/**
 * @param file 文件流
 * @param fileNum 想要返回的视频大小 {1: "KB", 2: "MB", 3: "GB", 4: "TB"}
 * @return Object  {duration, fileSize, type, width, height}
 * }
 */
class CalcAudio {
 constructor (file, fileNum) {
   this.audio = document.createElement('Audio')
   this.audio.preload = 'metadata';
  //  this.audio.setAttribute('crossOrigin', 'anonymous');//处理跨域
   this.audio.src = URL.createObjectURL(file)

   return this.init(file, fileNum)

 }
 public init (file, fileNum) {
   return new Promise((resolve, reject) => {
     const size = this.fileLengthFormat(file.size, fileNum)
     // 文件类型限制
     const type = this.getFileType(file.name)
         // 时长
         this.audio.onloadedmetadata = () => {
           window.URL.revokeObjectURL(this.audio.src);
           const duration = this.audio.duration;
           resolve({
             file,
             size,
             duration,
            //  type,
           })
         }
   })
 }
 public getFileType = (fileName) => {
   const exts = fileName.split('.');
   let ext = "";
   if (exts != undefined) {
       if (exts.length <= 1 && fileName.indexOf('=')>-1) {
           console.log('输入是文件地址：', exts);
           return false
       } else {
           ext = exts[exts.length - 1];
           ext = ext.toLowerCase();
           return ext        
       }
   } else {
     return false
   }
 }
 /**
  * [fileLengthFormat 格式化文件大小]
  * @param  {[int]} total [文件大小] Byte
  * @param  {[int]} n {1: "KB", 2: "MB", 3: "GB", 4: "TB"}
  * @return {[string]}       [带单位的文件大小的字符串]
  */
 public fileLengthFormat(total, n) {
   let format;
   const len = total / (1024.0);
   if (len > 1000) {
       return this.fileLengthFormat(len, ++n)
   } else {
       switch (n) {
           case 1:
               format = len.toFixed(2)
               break;
           case 2:
               format = len.toFixed(2)
               break;
           case 3:
               format = len.toFixed(2)
               break;
           case 4:
               format = len.toFixed(2)
               break;
       }
       return +format;
   }
 }
}

export default CalcAudio
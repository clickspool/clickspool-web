import { uploadMultiMedia } from '@/services/message';
import { delNillObject, base64RmHeader, base64AddHeader, centerEllipsis } from '@/utils/utils';
import emitter from '@/utils/eventemitter.js';

import { Row, Col, message, Spin } from 'antd';

import React, { PureComponent, Fragment, useState, useEffect } from 'react';

import ReactDOM from 'react-dom';

import { formatMessage } from 'umi/locale';

import classNames from 'classnames';
import CalcAudio from './CalcAudio';

import mp3Icon from './timg.jpg';
import styles from './uploader.less';
const message_type_enum = {
  text: 0,
  img: 1,
  video: 2,
  audio: 3,
  gif: 4
}
const imageConversion = require("image-conversion");
const aliyunVTISuffix = '?x-oss-process=video/snapshot,t_2000';
const fileTransform = {
  getVideoDuration(url, mess_type) {
    return new Promise(function (resolve, reject) {
      if (mess_type == 1 || mess_type == 4) {
        resolve('');
        return
      }

      let dataURL = '';
      let video = mess_type == 2 ? document.createElement("video") : document.createElement("audio");
      video.setAttribute('crossOrigin', 'anonymous');//处理跨域
      video.setAttribute('src', url);
      video.addEventListener('loadeddata', function (event) {
        video.oncanplay = function () {
          resolve(video.duration);
        }
      });
    })
  },
  getImgBase64(url) {
    return new Promise(function (resolve, reject) {
      let Img = new Image();
      let dataURL = '';
      Img.setAttribute('crossOrigin', 'anonymous');
      Img.src = url;
      Img.onload = function () { //确保图片完整获取
        var canvas = document.createElement("canvas"),//创建canvas元素
          width = Img.width, //canvas的尺寸和图片一样
          height = Img.height;
        // console.log(width,height)
        canvas.width = width;
        canvas.height = height;
        canvas.getContext("2d").drawImage(Img, 0, 0, width, height); //绘制canvas
        dataURL = canvas.toDataURL('image/png'); //转换为base64
        resolve([dataURL, width, height]);
      };
    });
  },
  dataURLtoBlob(dataurl) {
    var arr = dataurl.split(','), mime = arr[0].match(/:(.*?);/)[1],
      bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new Blob([u8arr], { type: mime });
  },
  blobToDataURL(blob) {
    return new Promise(function (resolve, reject) {
      let file = new FileReader();
      file.onload = function (e) { resolve(e.target.result); }
      file.readAsDataURL(blob);
    })
  },
  dataURLtoFile(dataurl, filename) {
    var arr = dataurl.split(','),
      mime = arr[0].match(/:(.*?);/)[1],
      bstr = atob(arr[1]),
      n = bstr.length,
      u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], filename, { type: mime });
  }
}
const reg = /.(gif|jpg|jpeg|png|gif|jpg|png|mp4|mp3|aac|acc)$/i;
const regMp4 = /.(mp4)$/i;
const regMp3 = /.(mp3|aac|acc)$/i;
const regGif = /.(gif)$/i;
let matterType;
export default class UploaderWrap extends PureComponent {
  constructor(props) {
    super(props);
    this.inputRef = React.createRef();
    this.state = {
      voiceClickstatus: false,
      message_type: '',
      filters: {},
      spinning: false,
      clearMedia: false
    }
    this.el = document.createElement('div');
  }
  uploadImage = (event) => {
    const _this = this;
    const { files } = event.target;
    const file = files[0];
    const formDate = new FormData();
    const { callback } = this.props;
    const { current } = this.inputRef;
    if (file) {
      if (!reg.test(file.name)) {
        message.warning(formatMessage({ id: 'form.operation.nocompatible' }))
        return
      }
      this.setState({
        spinning: true
      })
      emitter.trigger('disabled', {
        disabled: true,
      });
      formDate.append("multiMedia", file);
      if (regMp3.test(file.name)) {
        new CalcAudio(file, 1)
          .then(audioFile => {
            uploadMultiMedia(formDate)
              .then((res) => {
                if (res.code == 0) {
                  const { url: file, path } = res.data;
                  const type = regMp4.test(file) ? 1 : 0;
                  current.value = '';
                  return callback({
                    type,
                    thumbnail: type == 0 ? file : `${file}${aliyunVTISuffix}`,
                    sound: file,
                    size: Math.round(audioFile.size),
                    duration: Math.round(audioFile.duration),
                    // path
                  })
                }
              })
          })
      } else {
        uploadMultiMedia(formDate)
          .then((res) => {
            if (res.code == 0) {
              const { url: file, path } = res.data;
              const type = regMp4.test(file) ? 1 : 0;
              current.value = '';
              return callback({
                type,
                thumbnail: type == 0 ? file : `${file}${aliyunVTISuffix}`,
                file,
                // path
              })
            }
          })
      }



    }
  }

  render() {
    const { messageType, spinning } = this.state;
    const { Container } = this;
    const { uploadName, changePostion, hidden } = this.props;
    return (
      <Row>
        {<Col span={6}>
          <span className={styles.aUpload}>
            <input type="file" ref={this.inputRef} onChange={this.uploadImage} />
            {!uploadName ? `+` : uploadName}
          </span>
        </Col>}
      </Row>
    )
  }
}
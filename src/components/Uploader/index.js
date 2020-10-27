import { uploadMultiMedia } from '@/services/message';
import { delNillObject, base64RmHeader, base64AddHeader, centerEllipsis } from '@/utils/utils';
import emitter from '@/utils/eventemitter.js';

import { Row, Col, message, Spin } from 'antd';

import React, { PureComponent, Fragment, useState, useEffect } from 'react';

import ReactDOM from 'react-dom';

import { formatMessage } from 'umi/locale';

import classNames from 'classnames';

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
const aliyunVTISuffix = '?x-oss-process=video/snapshot,t_1000';
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
const reg = /.(gif|jpg|jpeg|png|gif|jpg|png|mp4|mp3|aac)$/i;
const regMp4 = /.(mp4)$/i;
const regMp3 = /.(mp3|aac)$/i;
const regGif = /.(gif)$/i;
let matterType;
export default class Uploader extends PureComponent {
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
  static getDerivedStateFromProps(nextProps, prevState) {
    const { id, url, message_type, thumb_base64, size, duration, clearMedia } = nextProps;
    if (id != prevState.filters.id) {
      return {
        filters: { id, url, message_type, thumb_base64, size, duration }
      }
    }
    return null
  }
  uploadImage = (event) => {
    const _this = this;
    const { files } = event.target;
    const file = files[0];
    const formDate = new FormData();

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
      })
      formDate.append("multiMedia", file);
      uploadMultiMedia(formDate)
        .then((res) => {
          if (res.code == 0) {
            const { url, path } = res.data;
            const message_type = regMp4.test(url) ? 2 : regMp3.test(url) ? 3 : regGif.test(url) ? 4 : 1;
            fileTransform.getVideoDuration(url, message_type)
              .then(duration => {
                _this.zipImg(url, message_type)
                  .then(([thumb_base64, weight_high]) => {
                    _this.setState(({ filters }) => {
                      const resp = { message_type, url, size: file.size, duration, thumb_base64, weight_high }
                      setTimeout(() => {
                        _this.props.callback({ ...filters, ...resp, path });
                        emitter.trigger('disabled', {
                          disabled: false,
                        })
                      })
                      return { filters: { ...filters, ...resp, path }, spinning: false }
                    })
                  })

              })
          }
        })
    }
  }
  zipImg = (url, message_type) => {
    const { current } = this.inputRef;
    return new Promise((resolve, reject) => {
      if (message_type == 3) {
        resolve('')
        return
      }
      if (message_type == 2) {
        url = `${url}${aliyunVTISuffix}`;
      }
      if (message_type == 4) {
        let Img = new Image();
        let dataURL = '';
        Img.src = url;
        Img.setAttribute('crossOrigin', 'Anonymous');
        Img.onload = function () { //确保图片完整获取
          let width = Img.width,
            height = Img.height;
          current.value = '';
          resolve(['', `${width},${height}`]);

        };
        return
      }
      fileTransform.getImgBase64(url)
        .then(([res, width, height]) => {
          imageConversion.compressAccurately(fileTransform.dataURLtoBlob(res),
            {
              size: 50,
              scale: 0.5,
            })
            .then((blob) => {
              fileTransform.blobToDataURL(blob)
                .then((imgbase64) => {
                  current.value = '';
                  resolve([base64RmHeader(imgbase64), `${width},${height}`])
                })
            })
        })
    })

  }
  onClose = () => {
    const { callback } = this.props;
    const { filters } = this.state;
    this.setState({ filters: { id: filters.id }, message_type: 0 }, () => {
      callback(filters, 'remove')
    })
  }

  Container = (props) => {
    const { changePostion, hidden } = this.props;
    const { voiceClickstatus, filters: { message_type, url, thumb_base64, duration, size } } = this.state;
    const voiceClass = (line) => {
      return classNames(
        styles[line],
        { [styles['active']]: voiceClickstatus }
      )
    }
    if (!message_type) {
      return null
    }
    if (changePostion) {
      return (
        <div className={styles.media_container_wrap}>
          <div className={styles.close} onClick={this.onClose}>X</div>
          <div className={styles.media_container} onClick={props.onClick.bind(this, message_type)}>
            <div className={styles.media_matter}>
              {thumb_base64 &&
                <img src={base64AddHeader(thumb_base64)} />
              }
              {message_type == 4 &&
                <img src={url} />
              }
              {
                (!thumb_base64 && message_type != 4) &&
                <img src={mp3Icon} />
              }
            </div>
            <div className={styles.media_describe}>
              {!!url && <p>{centerEllipsis(url)}</p>}
              {!!size && <p>{size}b</p>}
            </div>
          </div>
        </div>
      )
    }

    return (
      <Fragment>
        {message_type != 0 &&
          <div style={{ position: 'relative', display: message_type == 3 ? 'block' : 'inline-block' }}>
            {!hidden && <div className={styles.close1} onClick={this.onClose}>X</div>}
            {message_type == 1 &&
              <img src={url} onClick={props.onClick.bind(this, message_type)} style={{ maxWidth: '250px' }} />
            }
            {(message_type == 4 && url.toLocaleLowerCase().indexOf('.mp4') == -1) &&
              <img src={url} onClick={props.onClick.bind(this, message_type)} style={{ maxWidth: '250px' }} />
            }
            {(message_type == 4 && url.toLocaleLowerCase().indexOf('.mp4') > -1) &&
              <video src={url} autoPlay loop muted style={{ maxWidth: '250px' }} />
              // <img src={url} onClick={props.onClick.bind(this,message_type)} style={{maxWidth:'250px'}}/>
            }
            {message_type == 2 &&
              <video src={url} autoPlay loop muted style={{ maxWidth: '250px' }} />
              // <div className={styles.video_wrap} onClick={props.onClick.bind(this,message_type)}>
              //   <img src={base64AddHeader(thumb_base64)} style={{maxWidth:'250px'}}/>
              // </div>
            }
            {message_type == 3 &&
              <div className={styles['voice']} style={{ width: `${(25 + 52.4 * Math.min(duration / 60, 1))}%` }} onClick={props.onClick.bind(this, message_type)}>
                <i>{parseInt(duration)}<sup>〃</sup></i>
                <div className={styles["beat_wrap"]}>
                  <span className={voiceClass("line1")}></span>
                  <span className={voiceClass("line2")}></span>
                  <span className={voiceClass("line3")}></span>
                  <span className={voiceClass("line4")}></span>
                  <span className={voiceClass("line5")}></span>
                </div>
              </div>
            }
          </div>
        }
      </Fragment>

    )
  }
  onClickContainer = (mes_type) => {
    if (mes_type == 3) {
      this.playMedia();
      this.setState(({
        voiceClickstatus
      }) => (
          { voiceClickstatus: !voiceClickstatus }
        ))
      return
    }
    this.createMatterWrap();
  }
  componentDidMount = () => {
    const _this = this;
    emitter.on('removeMedia', () => {
      _this.setState({
        filters: {}
      })
    });
    // this.removeChild();
    // this.createMatterWrap();
  }

  componentWillUnmount() {

  }

  createMatterWrap = () => {
    const { url, message_type } = this.state.filters;
    document.body.appendChild(this.el);
    document.body.style.overflow = 'hidden'
    ReactDOM.render(
      (<Fragment>
        <div className={styles.mask} onClick={this.removeChild}></div>
        <div className={styles.matter}>
          {message_type == 2 &&
            <video src={url} autoPlay loop muted />
          }
          {(message_type == 1 || message_type == 4) &&
            <img src={url} />
          }
        </div>
      </Fragment>),
      this.el)
  }
  playMedia = () => {
    const _this = this;
    const { url } = this.state.filters;
    let audio = document.getElementById("audioBox");
    if (audio.src === url) {
      if (audio.paused) {
        audio.play()
      } else {
        audio.pause();
      }
    } else {
      audio.src = url;
      audio.play()
    }
    function handler() {
      _this.setState(({
        voiceClickstatus
      }) => (
          { voiceClickstatus: !voiceClickstatus }
        ))
    }
    audio.addEventListener('ended', handler, false);
  }


  removeChild = () => {
    document.body.style.overflow = 'auto';
    document.body.removeChild(this.el);
  }

  render() {
    const { messageType, spinning } = this.state;
    const { Container } = this;
    const { uploadName, changePostion, hidden } = this.props;
    return (
      <Fragment>
        <Spin tip={formatMessage({ id: 'form.operation.uploading' })} spinning={spinning}>
          <Row>
            {!hidden && <Col span={4}>
              <span className={styles.aUpload}>
                <input type="file" ref={this.inputRef} onChange={this.uploadImage} />
                {!!uploadName && uploadName}
                {!uploadName && formatMessage({ id: 'app.image.clickUploadImage' })}
              </span>
            </Col>}

            {!changePostion &&
              <Col span={10}>
                <Container
                  onClick={this.onClickContainer}
                />
              </Col>
            }
            {changePostion &&
              <Col span={18}>
                <Container
                  onClick={this.onClickContainer}
                />
              </Col>
            }

            {changePostion && <Col span={6}>
              <span className={styles.aUpload}>
                <input type="file" ref={this.inputRef} onChange={this.uploadImage} />
                {!!uploadName && uploadName}
                {!uploadName && formatMessage({ id: 'app.image.clickUploadImage' })}
              </span>
            </Col>}
          </Row>
        </Spin>
        <audio id="audioBox" style={{ display: "none" }} loop={false}></audio>
      </Fragment>
    )
  }
}
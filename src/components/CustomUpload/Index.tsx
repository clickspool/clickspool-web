import React, { useState, useEffect, forwardRef } from 'react';
// tslint:disable-next-line:ordered-imports
import { Upload, Icon, Modal, message } from 'antd';

// 使用forwardRef是为了在Form中拿到ref
const CustomUpload = forwardRef((props, _ref) => {
  const [previewVisible, setPreviewVisible] = useState(false);
  const [previewImage, setPreviewImage] = useState('');
  const [fileList, setFileList] = useState([]);

  useEffect(() => {
    setPreviewImage(props.previewImage);
    setFileList(props.fileList);
  }, [props]);

  useEffect(() => {
    if (props.fileString) {
      receiveImg(props.fileString);
    }
  }, [props.fileString]);

  const beforeUpload = file => {
    return new Promise(function (resolve, reject) {
      // const isLt2M = file.size / 1024 *  < 2;
      // if (!isLt2M) {
      //   message.error('图片最大2M!');
      //   reject(false);
      // } else {
        resolve(file);
      // }
    });
  };

  const receiveImg = url => {
    let _fileList = [];
    if (url) {
      url.split(',').forEach((element, index) => {
        if (element) {
          _fileList.push({
            url: element,
            status: 'done',
            uid: index,
          });
        }
      });
      setFileList(_fileList);
    }
  };

  const handlePreview = file => {
    setPreviewImage(file.url || file.thumbUrl);
    setPreviewVisible(true);
  };

  const uploadButton = (
    <div>
      <Icon type='plus' />
      <div className='ant-upload-text'>{props.des}</div>
    </div>
  );

  return (
    <div className='clearfix'>
      <Upload
        accept={props.type == "image" ? "image/*" : "video/*"}
        listType='picture-card'
        beforeUpload={e => beforeUpload(e)}
        withCredentials={props.withCredentials || false}
        fileList={fileList}
        onPreview={e => handlePreview(e)}
        onRemove={e => props.onRemove(e, props.type)}
        onChange={e => props.onChange(e, props.type)}
      >
        {fileList.length >= 3 ?  <>{fileList.map((item,index)=>{
          return  <img src={item} alt="avatar" key={index} />
        })}</> : <>{fileList.map((item,index)=>{
          return  <img src={item} alt="avatar" key={index} />
        })}{uploadButton}</>
        }
      </Upload>
      <Modal visible={previewVisible} footer={null} onCancel={() => setPreviewVisible(false)}>
        <img alt='logo' style={{ width: '100%' }} src={previewImage} />
      </Modal>
    </div>
  );
});

export default CustomUpload;
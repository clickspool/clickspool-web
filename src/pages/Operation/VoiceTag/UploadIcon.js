import React from 'react'
import { Icon, Upload, Modal } from 'antd';
import { uploadMultiMedia } from '@/pages/Operation/VoiceTag/services';

export default class UploadIcon extends React.Component {
  constructor(props) {
    super(props)
    const value = props.value || {};
    this.state = {
      previewImage: value.img.url,
      previewVisible: false,
      fileList: value.img.name ? [{
        name: value.img.name,
        status: 'done',
        url: value.img.url,
        uid: value.img.name
      }] : [],
      max: value.max | 1
    }
  }
  customRequest = (option) => {
    const _this = this
    const formData = new FormData();
    formData.append('multiMedia', option.file);
    uploadMultiMedia(formData).then(res => {
      console.log(res, 'res')
      if (res.code == 0) {
        _this.state.fileList.push({
          name: res.data.path,
          status: 'done',
          url: res.data.url,
          uid: res.data.path,
        });
        _this.setState({
          fileList: _this.state.fileList,
          previewImage: res.data.url
        })
        _this.props.onChange(_this.state.fileList)
      }
    })
  }
  handleCancel = () => {
    this.setState({
      previewVisible: false,
    })
  }

  handlePreview = () => {
    this.setState({
      previewVisible: true,
    })
  }

  handleChange = (opt) => {
    const { fileList } = this.state;
    if (opt.file.status == "removed") {
      this.setState({
        fileList: fileList.filter((item) => { return item.uid !== opt.file.uid }),
      })
    }
    console.log(opt, 'opt')
  }

  render() {
    const { fileList, previewVisible, previewImage, max } = this.state
    const uploadButton = (
      <div>
        <Icon type="plus" />
        <div className="ant-upload-text">Upload</div>
      </div>
    );
    return (
      <div>
        <Upload
          action=""
          listType="picture-card"
          customRequest={this.customRequest}
          fileList={fileList}
          onPreview={this.handlePreview}
          onChange={this.handleChange}
        >
          {fileList.length >= max ? null : uploadButton}
        </Upload>
        <Modal visible={previewVisible} footer={null} onCancel={this.handleCancel}>
          <img alt="example" style={{ width: '100%' }} src={previewImage} />
        </Modal>
      </div>
    )
  }
}
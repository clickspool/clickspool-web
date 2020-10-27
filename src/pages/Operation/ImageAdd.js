import apiConfig from '@/utils/apiConfig';
import { getAuthority } from '@/utils/authority';

import { connect } from 'dva';

import { Input, Form, Modal, Select, Row, Col, DatePicker, message } from 'antd';

import React from 'react';

import _ from 'lodash';

import { formatMessage } from 'umi/locale';

import styles from './Image.less';

const moment = require('moment');
const FormItem = Form.Item;
const TextArea = Input.TextArea;
const Option = Select.Option;
const { RangePicker } = DatePicker;

let pictureUrl = null;

@Form.create()
@connect(({ image: { data, source, editModel, addVisibleModel, editInfo } }) => ({
  data,
  source,
  editModel,
  addVisibleModel,
  editInfo,
}))
class ImageAdd extends React.Component {
  onOk = () => {
    const {
      dispatch,
      form,
      data: { page },
      editInfo,
    } = this.props;
    const { uploadImgFile } = this.refs;
    form.validateFields((error, value) => {
      if (error) {
        return;
      }
      const va = value;
      va['start_time'] = va.rangeTimePicker[0].format('YYYY-MM-DD HH:mm:ss');
      va['end_time'] = va.rangeTimePicker[1].format('YYYY-MM-DD HH:mm:ss');

      let param = !pictureUrl ? _.merge({}, va) : _.merge({}, va, { picture_url: pictureUrl });
      const formData = new FormData();
      const xhr = new XMLHttpRequest();
      // 将文件转二进制
      formData.append('token', getAuthority());
      formData.append('group', param.group || '');
      formData.append('name', param.name || '');
      formData.append('note', param.note || '');
      formData.append('link_url', param.link_url || '');
      formData.append('status', param.status || '');
      formData.append('start_time', param.start_time || '');
      formData.append('end_time', param.end_time || '');
      formData.append('sort', param.sort || 0);
      formData.append('data', param.data || '');
      formData.append('picture_url', param.picture_url || '');
      formData.append('file', param.picture_url || '');
      xhr.open('post', `${apiConfig}/admin/picture/add`);
      xhr.send(formData);
      xhr.onreadystatechange = () => {
        if (xhr.readyState == 4 && xhr.status == 200) {
          const res = eval('(' + xhr.response + ')');
          if (!res.code) {
            message.success(res.message, 2);
            this.onCancel();
            dispatch({
              type: 'image/getList',
              payload: { page },
            });
          } else {
            message.error(res.message, 2);
          }
        }
      };
    });
  };
  onCancel = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'image/addModelVisble',
      payload: { addVisibleModel: false },
    });
  };
  uploadImage = () => {
    const { uploadImgFile, uploadImg } = this.refs;

    const _URL = window.URL || window.webkitURL;

    if (_URL.createObjectURL(uploadImgFile.files[0])) {
      pictureUrl = uploadImgFile.files[0];
      const reader = new FileReader();
      reader.readAsDataURL(uploadImgFile.files[0]);
      reader.onload = function(evv) {
        uploadImg.src = evv.target.result;
      };
    }
    // console.log(evt,this.refs,'evt this.refs')
  };
  componentWillUpdata() {
    const { editInfo } = this.props;
    this.setState({
      pictureUrl: editInfo.picture_url,
    });
  }
  render() {
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 6 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 18 },
      },
    };
    const {
      form: { getFieldDecorator },
      visible,
      editInfo,
      source,
    } = this.props;
    const rangeConfig = {
      rules: [
        {
          type: 'array',
          required: true,
          message: formatMessage({ id: 'app.glob.pleaseInputTime' }),
        },
      ],
    };
    return (
      !!visible && (
        <Modal
          title={formatMessage({ id: 'app.versions.add' })}
          visible={visible}
          cancelText={formatMessage({ id: 'app.model.cancel' })}
          okText={formatMessage({ id: 'app.model.okText' })}
          onOk={this.onOk}
          onCancel={this.onCancel}
          width="800px"
        >
          <Form>
            <Row>
              <Col span={12}>
                <FormItem
                  {...formItemLayout}
                  label={formatMessage({ id: 'app.image.table.groupName' })}
                >
                  {getFieldDecorator('group', {
                    initialValue: source[0] && source[0].id,
                  })(
                    <Select>
                      {source.map(item => (
                        <Option key={item.id} value={item.id}>
                          {item.name}
                        </Option>
                      ))}
                    </Select>
                  )}
                </FormItem>
              </Col>
              <Col span={12}>
                <FormItem {...formItemLayout} label={formatMessage({ id: 'app.image.table.name' })}>
                  {getFieldDecorator('name', {
                    rules: [
                      {
                        required: true,
                        message: formatMessage({ id: 'app.global.form.pleaseName' }),
                      },
                    ],
                  })(<Input />)}
                </FormItem>
              </Col>
            </Row>
            <Row>
              <Col span={12}>
                <Col span={6} push={2}>
                  {formatMessage({ id: 'app.image.uploadImage' })}:
                </Col>
                <Col span={8}>
                  <a href="#" className={styles.aUpload}>
                    <input type="file" ref="uploadImgFile" onChange={this.uploadImage} />
                    {formatMessage({ id: 'app.image.clickUploadImage' })}
                  </a>
                </Col>
                <Col span={10}>
                  <img className={styles.aUploadImg} ref="uploadImg" />
                </Col>
              </Col>
              <Col span={12}>
                <FormItem {...formItemLayout} label={formatMessage({ id: 'app.global.form.type' })}>
                  {getFieldDecorator('status', {
                    initialValue: '1',
                  })(
                    <Select>
                      <Option value="1">{formatMessage({ id: 'app.config.start' })}</Option>
                      <Option value="0">{formatMessage({ id: 'app.config.forbid' })}</Option>
                    </Select>
                  )}
                </FormItem>
              </Col>
            </Row>
            <Row>
              <Col span={12}>
                <FormItem
                  {...formItemLayout}
                  label={formatMessage({ id: 'app.image.table.link_url' })}
                >
                  {getFieldDecorator('link_url', {
                    rules: [
                      {
                        required: true,
                        message: formatMessage({ id: 'app.image.table.pleaselink_url' }),
                      },
                    ],
                  })(<Input />)}
                </FormItem>
              </Col>
              <Col span={12}>
                <FormItem {...formItemLayout} label={formatMessage({ id: 'app.image.table.note' })}>
                  {getFieldDecorator('note')(<Input />)}
                </FormItem>
              </Col>
            </Row>
            <Row>
              <Col span={12}>
                <FormItem
                  {...formItemLayout}
                  label={formatMessage({ id: 'app.image.choseStartEndTime' })}
                >
                  {getFieldDecorator('rangeTimePicker', rangeConfig)(
                    <RangePicker showTime format="YYYY-MM-DD HH:mm:ss" />
                  )}
                </FormItem>
              </Col>
              <Col span={12} />
            </Row>
            <Row>
              <Col span={12}>
                <FormItem {...formItemLayout} label={formatMessage({ id: 'app.image.table.sort' })}>
                  {getFieldDecorator('sort')(<Input />)}
                </FormItem>
              </Col>
              <Col span={12}>
                <FormItem {...formItemLayout} label={formatMessage({ id: 'app.image.table.data' })}>
                  {getFieldDecorator('data')(<Input />)}
                </FormItem>
              </Col>
            </Row>
          </Form>
        </Modal>
      )
    );
  }
}

export default ImageAdd;

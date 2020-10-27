
import { connect } from 'dva';

import { Input, Switch, Form, Modal, Select, Row, Icon, Col, DatePicker, message, Radio, Upload, InputNumber, Spin } from 'antd';

import React from 'react';

import { formatMessage } from 'umi/locale';

import { removeObjUndefined, checkRate, isEmptyObject } from '@/utils/utils';

import UploadIcon from './UploadIcon'

import _ from 'lodash';

const moment = require('moment');
const FormItem = Form.Item;
const TextArea = Input.TextArea;
const Option = Select.Option;
const { RangePicker } = DatePicker;
const RadioGroup = Radio.Group;
const Search = Input.Search;

@Form.create()
@connect(
  ({
    voiceTag: {
      statusMap = {},
    },
  }) => ({
    statusMap,
  })
)
class Edit extends React.Component {

  onOk = () => {
    const { form: { validateFields }, info = {}, onClose, dispatch } = this.props;
    validateFields((err, values) => {
      if (err) {
        return
      }
      dispatch({
        type: info.id ? 'voiceTag/modify' : 'voiceTag/add',
        payload: { ...info, ...values, icon_remote: values.icon[0].url, icon: values.icon[0].name }
      })
        .then(() => {
          onClose(1)
        })
    })
  }

  onCancel = () => {
    const { onClose } = this.props;
    onClose()
  }

  normFile = e => {
    console.log('Upload event:', e);
    if (Array.isArray(e)) {
      return e;
    }
    return e && e.fileList;
  };

  render() {

    const {
      form: { getFieldDecorator },
      statusMap,
      info = {}
    } = this.props;
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 8 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 },
      },
    };
    const uploadButton = (
      <div>
        <Icon type="plus" />
        <div className="ant-upload-text">Upload</div>
      </div>
    );
    return (
      <Modal
        title={info.id ? formatMessage({ id: 'app.versions.edit' }) : formatMessage({ id: 'app.versions.add' })}
        cancelText={formatMessage({ id: 'app.model.cancel' })}
        okText={formatMessage({ id: 'app.model.okText' })}
        onOk={this.onOk}
        onCancel={this.onCancel}
        visible={true}
      >
        <div className='model_'>


          <Form {...formItemLayout}>
            <Form.Item label={'标签名'}>
              {getFieldDecorator('name',
                {
                  initialValue: info.name || '',
                  rules: [
                    {
                      required: true,
                      message: '标签名',
                    },
                  ],
                })(
                  <Input placeholder={'标签名'} />
                )}
            </Form.Item>
            <Form.Item label={'标签描述'}>
              {getFieldDecorator('content',
                {
                  initialValue: info.content || '',
                  rules: [
                    {
                      required: true,
                      message: '标签描述',
                    },
                  ],
                })(
                  <Input placeholder={'标签描述'} />
                )}
            </Form.Item>
            <Form.Item label="标签图标">
              {getFieldDecorator('icon', {
                initialValue: { img: { name: info.icon, url: info.icon_remote }, max: 1 },
                rules: [{ required: true }],
              })(
                <UploadIcon /> // 组件引入
              )}
            </Form.Item>

            <Form.Item label={'状态'}>
              {getFieldDecorator('status', {
                initialValue: info.status || '0',
                rules: [
                  {
                    required: true,
                    message: '状态',
                  },
                ],
              })(
                <Select placeholder={`状态`}>
                  {Object.keys(statusMap).map(item => {
                    return (
                      <Option key={item} value={item}>
                        {statusMap[item]}
                      </Option>
                    );
                  })}
                </Select>
              )}
            </Form.Item>
          </Form>
        </div>
      </Modal>
    )
  }

}

export default Edit;

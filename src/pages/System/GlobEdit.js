import { modify } from '@/services/setting';

import { Input, Form, Modal, Select, message } from 'antd';
import JonEditor from "./component/JsonEditor";

import React from 'react';

import _ from 'lodash';
const moment = require('moment');

import { formatMessage } from 'umi/locale';
import { getPlatform } from '@/utils/utils';
import { connect } from 'dva';
const FormItem = Form.Item;
const TextArea = Input.TextArea;
const Option = Select.Option;

@Form.create()
@connect(({ settingInfo }) => ({
  settingInfo,
}))
class GlobEdit extends React.Component {
  onOk = () => {
    const {
      dispatch,
      form,
      settingInfo: {
        editInfo: { id },
        data: { page, currentTime },

      },
    } = this.props;
    form.validateFields((error, value) => {
      if (error) {
        return;
      }
      if (value.type == 'json') {
        try {
          var vvv = JSON.parse(value.value);
        } catch (error) {
          if (error) {
            message.warning(formatMessage({ id: 'app.glob.errorJSONMSG' }));
            return;
          }
        }
      }
      modify(_.merge({}, value, { id, update_time: moment((+currentTime*1000)).format('YYYY-MM-DD HH:mm:ss') }))
        .then(res => {
          if (!res.code) {
            this.onCancel();
            dispatch({
              type: 'settingInfo/getConfigList',
              payload: { page: 1, page_size: 10000 },
            });
          }
        })
        .catch(e => {
          console.log(e);
        });
    });
  };
  onCancel = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'settingInfo/editModelVisble',
      payload: { editModel: false },
    });
  };

  render() {
    const { form: { getFieldValue } } = this.props;
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
      settingInfo: { editInfo },
    } = this.props;
    return (
      !!visible && (
        <Modal
          title={formatMessage({ id: 'app.versions.edit' })}
          visible={visible}
          cancelText={formatMessage({ id: 'app.model.cancel' })}
          okText={formatMessage({ id: 'app.model.okText' })}
          onOk={this.onOk}
          onCancel={this.onCancel}
          width="800px"
        >
          <Form>
            <FormItem {...formItemLayout} label={formatMessage({ id: 'app.global.form.name' })}>
              {getFieldDecorator('name', {
                initialValue: editInfo.name,
                rules: [
                  {
                    required: true,
                    message: formatMessage({ id: 'app.global.form.pleaseName' }),
                  },
                ],
              })(<Input />)}
            </FormItem>
            <FormItem {...formItemLayout} label={formatMessage({ id: 'app.global.form.title' })}>
              {getFieldDecorator('title', {
                initialValue: editInfo.title,
                rules: [
                  {
                    required: true,
                    message: formatMessage({ id: 'app.global.form.pleaseTitle' }),
                  },
                ],
              })(<Input />)}
            </FormItem>
            <FormItem {...formItemLayout} label={formatMessage({ id: 'app.global.form.value' })}>
              {getFieldDecorator('value', {
                initialValue: editInfo.value,
                rules: [
                  {
                    required: true,
                    message: formatMessage({ id: 'app.global.form.pleaseValue' }),
                  },
                ],
              })(<JonEditor mode={getFieldValue('type') === '' ? getFieldValue('type') : getFieldValue('type') || editInfo.type} />)}
            </FormItem>
            <FormItem {...formItemLayout} label={formatMessage({ id: 'app.global.form.type' })}>
              {getFieldDecorator('type', { initialValue: editInfo.type })(
                <Select>
                  <Option value="">{formatMessage({ id: 'app.global.form.defaultType' })}</Option>
                  <Option value="json">JSON</Option>
                  <Option value="html">HTML</Option>
                </Select>
              )}
            </FormItem>
            <FormItem
              {...formItemLayout}
              label={formatMessage({ id: 'app.versions.table.platform' })}
            >
              {getFieldDecorator('platform', { initialValue: editInfo.platform })(
                <Select disabled>
                  <Option value="1">{formatMessage({ id: 'app.platform' })}</Option>
                  <Option value="2">IOS</Option>
                </Select>
              )}
            </FormItem>
            <FormItem
              {...formItemLayout}
              label={formatMessage({ id: 'app.global.form.group_name' })}
            >
              {getFieldDecorator('group_name', {
                initialValue: editInfo.group_name || '',
              })(<Input />)}
            </FormItem>
          </Form>
        </Modal>
      )
    );
  }
}

export default GlobEdit;

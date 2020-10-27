import { add } from '@/services/setting';

import { connect } from 'dva';

import { Input, Form, Modal, Select } from 'antd';

import React from 'react';

import { formatMessage } from 'umi/locale';
const FormItem = Form.Item;
const TextArea = Input.TextArea;
const Option = Select.Option;

@Form.create()
@connect(({ settingInfo }) => ({
  settingInfo,
}))
class GlobAdd extends React.Component {
  onOk = () => {
    const {
      dispatch,
      form,
      settingInfo: {
        data: { page },
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
            message(formatMessage({ id: 'app.glob.errorJSONMSG' }));
            return;
          }
        }
      }
      add(_.merge({}, value))
        .then(res => {
          if (!res.code) {
            this.onCancel();
            dispatch({
              type: 'settingInfo/getConfigList',
              payload: {page:1,page_size:10000 },
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
      type: 'settingInfo/addModelVisble',
      payload: { addVisibleModel: false },
    });
  };
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
    } = this.props;
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
            <FormItem {...formItemLayout} label={formatMessage({ id: 'app.global.form.name' })}>
              {getFieldDecorator('name', {
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
                rules: [
                  {
                    required: true,
                    message: formatMessage({ id: 'app.global.form.pleaseValue' }),
                  },
                ],
              })(<TextArea rows={6} />)}
            </FormItem>
            <FormItem {...formItemLayout} label={formatMessage({ id: 'app.global.form.type' })}>
              {getFieldDecorator('type', {
                initialValue: '',
              })(
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
              {getFieldDecorator('platform', {
                initialValue: '1',
              })(
                <Select>
                  <Option value="1">{formatMessage({ id: 'app.platform' })}</Option>
                  <Option value="2">IOS</Option>
                </Select>
              )}
            </FormItem>
            <FormItem
              {...formItemLayout}
              label={formatMessage({ id: 'app.global.form.group_name' })}
            >
              {getFieldDecorator('group_name', {})(<Input />)}
            </FormItem>
          </Form>
        </Modal>
      )
    );
  }
}

export default GlobAdd;

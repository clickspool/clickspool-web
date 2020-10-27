import { add } from '@/services/versions';

import { Input, Form, Modal, Select } from 'antd';

import React, { PureComponent } from 'react';

import { formatMessage } from 'umi/locale';

const FormItem = Form.Item;
const TextArea = Input.TextArea;
const Option = Select.Option;

@Form.create()
class AddModal extends React.Component {
  constructor(props) {
    super(props);
  }
  componentDidMount() {}
  onOk = () => {
    const { form, onCloseModel } = this.props;
    form.validateFields((error, value) => {
      if (error) {
        return;
      }
      add(value)
        .then(res => {
          if (!res.code) {
            onCloseModel(1);
          }
        })
        .catch(e => {
          console.log(e);
        });
    });
  };
  onCancel = () => {
    const { onCloseModel } = this.props;
    onCloseModel();
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
      modalVisible,
    } = this.props;
    return (
      <Modal
        title={formatMessage({ id: 'app.versions.edit' })}
        visible={modalVisible}
        cancelText={formatMessage({ id: 'app.model.cancel' })}
        okText={formatMessage({ id: 'app.model.okText' })}
        onOk={this.onOk}
        onCancel={this.onCancel}
      >
        <Form>
          <FormItem {...formItemLayout} label={formatMessage({ id: 'app.versions.table.version' })}>
            {getFieldDecorator('version', {
              rules: [
                {
                  required: true,
                  message: formatMessage({ id: 'app.versions.inputVersion' }),
                },
              ],
            })(<Input />)}
          </FormItem>
          <FormItem {...formItemLayout} label={formatMessage({ id: 'app.versions.table.url' })}>
            {getFieldDecorator('url', {
              rules: [
                {
                  required: true,
                  message: formatMessage({ id: 'app.versions.inputUrl' }),
                },
              ],
            })(<Input />)}
          </FormItem>
          <FormItem
            {...formItemLayout}
            label={formatMessage({ id: 'app.versions.table.platform' })}
          >
            {getFieldDecorator('platform', { initialValue: '1' })(
              <Select>
                <Option value="1">{formatMessage({ id: 'app.platform' })}</Option>
                <Option value="2">IOS</Option>
              </Select>
            )}
          </FormItem>
          <FormItem {...formItemLayout} label={formatMessage({ id: 'app.versions.table.info' })}>
            {getFieldDecorator('info')(<TextArea rows={4} />)}
          </FormItem>
        </Form>
      </Modal>
    );
  }
}

export default AddModal;

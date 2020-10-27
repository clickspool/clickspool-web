import { add } from '@/services/imagegroup';
import { removeObjUndefined,checkRate } from '@/utils/utils';

import { Input, Form, Modal } from 'antd';

import React from 'react';

import { formatMessage } from 'umi/locale';

const FormItem = Form.Item;

@Form.create()
class GroupAdd extends React.Component {
  onOk = () => {
    this.props.form.validateFields((err, values) => {
      if (!err) {
        let params = values;
        params = removeObjUndefined(params);
        if (params.sort) {
          if (!checkRate(params.sort)) {
            return message.warning(formatMessage({ id: 'app.glob.pleaseInputNum' }));
          } else {
            if (parseInt(params.sort) < 0 || /\./g.test(params.sort + '')) {
              return message.warning(formatMessage({ id: pleaseInputZindex }));
            }
          }
        }
        if (params.sort) {
        }
        add(params).then(res => {
          if (res && !res.code) {
            this.props.onCallback('refresh');
          }
        });
      }
    });
  };
  onCancel = () => {
    this.props.onCallback();
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
          width="400px"
        >
          <Form>
            <FormItem {...formItemLayout} label={formatMessage({ id: 'app.group.table.name' })}>
              {getFieldDecorator('name', {
                rules: [
                  {
                    required: true,
                    message: formatMessage({ id: 'app.glob.pleaseInputGroupName' }),
                  },
                ],
              })(<Input />)}
            </FormItem>
            <FormItem {...formItemLayout} label={formatMessage({ id: 'app.group.table.des' })}>
              {getFieldDecorator('note')(<Input />)}
            </FormItem>
            <FormItem {...formItemLayout} label={formatMessage({ id: 'app.group.table.sort' })}>
              {getFieldDecorator('sort')(<Input />)}
            </FormItem>
          </Form>
        </Modal>
      )
    );
  }
}

export default GroupAdd;

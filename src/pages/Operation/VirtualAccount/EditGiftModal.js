import { add } from '@/services/versions';
import { connect } from 'dva';
import { Input, Form, Modal, Select } from 'antd';

import React, { PureComponent } from 'react';

import { formatMessage } from 'umi/locale';

const FormItem = Form.Item;
const TextArea = Input.TextArea;
const Option = Select.Option;

@Form.create()
@connect()
class EditGiftModal extends React.Component {
  onOk = () => {
    const { form, onCloseModel, dispatch,giftInfo } = this.props;
    form.validateFields((error, value)=>{
      if (error) {
        return;
      }
      dispatch({
        type: 'accounts/uploadGift',
        payload: {...giftInfo,...value}
      })
      .then((res)=>{
        if(res.code==0){
          onCloseModel();
        }
      });
    });
  }
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
      giftInfo
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
          <FormItem {...formItemLayout} label={"礼品Key值"}>
            {getFieldDecorator('stat_key', {
              rules: [
                {
                  required: true,
                  message: "请输入礼品Key值",
                },
              ],
              ...(giftInfo.stat_key ? { initialValue: giftInfo.stat_key } : {}),
            })(<Input />)}
          </FormItem>
          <FormItem {...formItemLayout} label={"礼品数量"}>
            {getFieldDecorator('num', {
              rules: [
                {
                  required: true,
                  message: "请输入礼品数量",
                },
              ],
              ...(giftInfo.num != undefined ? { initialValue: giftInfo.num } : {}),
            })(<Input />)}
          </FormItem>
        </Form>
      </Modal>
    );
  }
}

export default EditGiftModal;

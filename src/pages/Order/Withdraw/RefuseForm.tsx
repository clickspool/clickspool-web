import React, { PureComponent } from 'react';
import { Form, Input, Modal } from 'antd';
//@ts-ignore
import { formatMessage } from 'umi/locale';

class CustomForm extends PureComponent<any, any> {
  constructor(props) {
    super(props);
    this.state = {
      visible: false
    };
  }
  cancel = () => {
    const { handleCancel } = this.props;
    handleCancel();
    this.props.form.resetFields();
  }
  confirm = () => {
    const { handleOk } = this.props;
    console.info('confirm__', this.props.form.getFieldsValue());
    handleOk(this.props.form.getFieldValue('refuse_reason'));
    this.props.form.resetFields();
  }

  render = () => {
    const { form: { getFieldDecorator }, visible, editAble, reason = '' } = this.props;
    const { cancel, confirm } = this;
    const properties: any = {};
    if (!editAble) {
      properties.footer = null;
    }
    return (
      <Modal
        title={formatMessage({ id: 'app.apply.refuse.title' })}
        visible={visible}
        onCancel={cancel}
        onOk={confirm}
        {...properties}
      >
        <Form>
          <Form.Item>
            {getFieldDecorator('refuse_reason', {
              rules: [
                {
                  required: true,
                  message: formatMessage({ id: 'app.apply.refuse.placeholder' }),
                },
              ],
              initialValue: reason
            })(<Input.TextArea
              placeholder={formatMessage({ id: 'app.apply.refuse.placeholder' })}
              autoSize={{ minRows: 2, maxRows: 6 }}
              disabled={!editAble}
            />)}
          </Form.Item>
        </Form>
      </Modal>
    );
  }
}

const RefuseForm = Form.create({
  name: 'refuse_form'
})(CustomForm);
export default RefuseForm;
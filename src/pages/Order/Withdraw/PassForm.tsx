import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Form, Input, Modal, Checkbox } from 'antd';
//@ts-ignore
import { formatMessage } from 'umi/locale';
import styles from './list.less';
@connect(({ apply: { tags } }) => ({  tags }))
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
    handleOk(this.props.form.getFieldValue('tags'));
    this.props.form.resetFields();
  }

  render = () => {
    const { form: { getFieldDecorator }, visible,tags } = this.props;
    const { cancel, confirm } = this;
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
    return (
      <Modal
        title={formatMessage({ id: 'app.apply.pass.title' })}
        visible={visible}
        onCancel={cancel}
        onOk={confirm}
      >
        <Form>
          <Form.Item
            {...formItemLayout}
            label={formatMessage({ id: 'app.apply.pass.label' })}>
            {getFieldDecorator('tags', {
              rules: [
                {
                  required: true,
                  message: formatMessage({ id: 'app.apply.refuse.placeholder' }),
                },
              ],
            })(
              <Checkbox.Group>
                <div className={styles['select-item']}><Checkbox value="A">Recommend</Checkbox></div>
                <div className={styles['select-item']}><Checkbox value="B">Recommend</Checkbox></div>
                <div className={styles['select-item']}><Checkbox value="C">Recommend</Checkbox></div>
              </Checkbox.Group>
            )}
          </Form.Item>
        </Form>
      </Modal>
    );
  }
}

const PassForm = Form.create({
  name: 'refuse_form'
})(CustomForm);
export default PassForm;
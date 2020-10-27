import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Form, Input, Modal, Checkbox, Select } from 'antd';
//@ts-ignore
import { formatMessage } from 'umi/locale';
import styles from './list.less';

const Option = Select.Option;
@connect(({ apply: { tags: allTags } }) => ({ allTags }))
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
    const { handleOk, record, handleCancel, form: { validateFields, getFieldValue, getFieldsValue, resetFields } } = this.props;
    validateFields(errors => {
      if (errors) return;
      console.info('confirm__', this.props.form.getFieldsValue());
      handleOk(getFieldValue('recommend_score'), record);
      this.props.form.resetFields();
    });
  }

  render = () => {
    const { form: { getFieldDecorator }, visible, score = 0, allTags } = this.props;
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
    const scores = [...new Array(10)].map((item, idx) => idx + 1);
    console.info('debug_scores', scores);
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
            {getFieldDecorator('recommend_score', {
              rules: [
                {
                  required: true,
                  message: formatMessage({ id: 'app.apply.pass.placeholder' }),
                },
              ],
              initialValue: score
            })(
              <Select>
                {scores.map((item) => {
                  return (
                    <Option key={item} value={item}>{item}</Option>
                  );
                })}
              </Select>
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
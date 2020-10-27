import React from 'react';
import { Modal, Select, Button, Form } from 'antd';
//@ts-ignore
import { formatMessage } from 'umi/locale';
import classnames from 'classnames/bind';
import styles from './manage.m.less';
import { connect } from 'dva';
const cx = classnames.bind(styles);
const Option = Select.Option;

@connect()
//@ts-ignore
@Form.create()
class Manage extends React.PureComponent<any, any>{
  state = {
    formItemLayout: {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 8 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 },
      },
    },
  }
  submit = () => {
    const { form: { validateFields, getFieldsValue, resetFields }, dispatch, info, close } = this.props;
    validateFields(async (errors) => {
      if (errors) return;
      let values = getFieldsValue();
      const params = new FormData();
      const { creator_id: user_id } = info;
      // Object.keys(values).forEach(key => {
      //   let value = values[key];
      //   if (value === undefined) {
      //     return;
      //   }
      //   params.append(key, value);
      // });

      // if (user_id) {
      //   params.append('user_id', user_id);
      // }
      // console.info('params__', { values, params, user_id });
      const result = await dispatch({ payload: { ...values, user_id }, type: 'upper/setUserOrganization' });
      console.info('handle_ok', result);
      if (result) {
        resetFields();
        close();
      }
    })
  }
  render() {
    const { visible, close, info = {}, data, form: { getFieldDecorator } } = this.props;
    const { formItemLayout } = this.state;
    return (
      <Modal
        okText={formatMessage({ id: 'app.host.upper.save' })}
        footer={null}
        visible={visible}
        title={null}
        onCancel={close}
        width={380}
      >
        <div className={cx('content')}>
          <div className={cx('head')}>
            <img className={cx('avatar')} src={info.avatar} alt="" />
            <div className={cx('name')}>
              <div className={cx('nickname')}>{info.nickname}</div>
              <div className={cx('id')}>UID {info.creator_id} NICKID {info.nick_id}</div>
            </div>
          </div>
          <Form>
            <Form.Item {...formItemLayout} label={formatMessage({ id: 'app.host.upper.manage.sign' })}>
              {getFieldDecorator('is_signed', {
                initialValue: info.is_signed,
                rules: [{ required: true, message: formatMessage({ id: 'app.host.upper.manage.sign.required' }) }],
              })(
                <Select>
                  <Option value={1}>{formatMessage({ id: 'app.host.upper.manage.sign.yes' })}</Option>
                  <Option value={0}>{formatMessage({ id: 'app.host.upper.manage.sign.no' })}</Option>
                </Select>
              )}
            </Form.Item>
            <Form.Item {...formItemLayout} label={formatMessage({ id: 'app.host.upper.manage.organization' })}>
              {getFieldDecorator('organization_id', {
                initialValue: info.organization_id > 0 ? info.organization_id : null,
                rules: [{ required: true, message: formatMessage({ id: 'app.host.upper.manage.organization.required' }) }],
              })(
                <Select>
                  {data.map(item => (
                    <Option key={item.id} value={item.id}>{item.name}</Option>
                  ))}
                </Select>
              )}
            </Form.Item>
          </Form>
          <div className={cx('button-wraper')}>
            <Button onClick={this.submit} type="primary" block>{formatMessage({ id: 'app.host.upper.save' })}</Button>
          </div>
        </div>

      </Modal>
    );
  }
}
export default Manage;

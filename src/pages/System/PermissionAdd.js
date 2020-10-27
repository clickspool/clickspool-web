import { add } from '@/services/permission';

import { connect } from 'dva';

import { Input, Form, Modal, Select } from 'antd';

import React from 'react';

import { formatMessage } from 'umi/locale';

const FormItem = Form.Item;

const Option = Select.Option;

@Form.create()
@connect(({ permission: { roleList } }) => ({
  roleList,
}))
class PermissionAdd extends React.Component {
  state = {
    isdisabled: true,
  };

  onOk = () => {
    this.props.form.validateFields((err, values) => {
      if (!err) {
        const params = values;
        params.role_ids = params.role_ids ? params.role_ids.join(',') : '';
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
  uploadImage = () => {};
  componentDidMount() {
    setTimeout(() => {
      this.setState({
        isdisabled: false,
      });
    }, 20);
  }
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
      roleList,
    } = this.props;
    const children = [];
    roleList.forEach(element => {
      children.push(<Option key={element.id}>{element.name}</Option>);
    });
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
            <FormItem
              {...formItemLayout}
              label={formatMessage({ id: 'app.permission.table.name' })}
            >
              {getFieldDecorator('nickname', {
                rules: [
                  {
                    required: true,
                    message: formatMessage({ id: 'app.global.form.pleaseName' }),
                  },
                ],
              })(<Input />)}
            </FormItem>
            <FormItem
              {...formItemLayout}
              label={formatMessage({ id: 'app.permission.table.phone' })}
            >
              {getFieldDecorator('telephone', {
                rules: [
                  {
                    required: true,
                    message: formatMessage({ id: 'app.permission.pleasePhone' }),
                  },
                ],
              })(<Input disabled={this.state.isdisabled} />)}
            </FormItem>
            <FormItem {...formItemLayout} label={formatMessage({ id: 'app.permission.password' })}>
              {getFieldDecorator('password', {
                rules: [
                  {
                    required: true,
                    message: formatMessage({ id: 'app.permission.pleasePassword' }),
                  },
                ],
              })(<Input type="password" disabled={this.state.isdisabled} />)}
            </FormItem>
            <FormItem
              {...formItemLayout}
              label={formatMessage({ id: 'app.permission.table.role' })}
            >
              {getFieldDecorator('role_ids', {
                rules: [
                  {
                    required: true,
                    message: formatMessage({ id: 'app.permission.table.pleaserole' }),
                  },
                ],
              })(
                <Select
                  mode="multiple"
                  size={'default'}
                  placeholder={formatMessage({ id: 'app.permission.table.pleaserole' })}
                  style={{ width: '100%' }}
                >
                  {children}
                </Select>
              )}
            </FormItem>
          </Form>
        </Modal>
      )
    );
  }
}

export default PermissionAdd;

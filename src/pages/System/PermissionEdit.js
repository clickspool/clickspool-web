import { modify, modifyPassword } from '@/services/permission';

import { connect } from 'dva';

import { Input, Form, Modal, Select, message } from 'antd';

import React from 'react';

import { formatMessage } from 'umi/locale';

const FormItem = Form.Item;

const Option = Select.Option;

@Form.create()
@connect(({ permission: { roleList } }) => ({
  roleList,
}))
class PermissionEdit extends React.Component {
  onOk = () => {
    const {
      editDataSource: { id },
      isEditPw,
      onCallback,
    } = this.props;
    this.props.form.validateFields((err, values) => {
      if (!err) {
        const params = values;
        params.member_id = id;
        if (isEditPw) {
          modifyPassword(params).then(res => {
            if (res && !res.code) {
              onCallback('refresh');
            }
          });
          return;
        }
        params.role_ids = params.role_ids ? params.role_ids.join(',') : '';
        modify(params).then(res => {
          if (res && !res.code) {
            onCallback('refresh');
          }
        });
      }
    });
  };
  onCancel = () => {
    this.props.onCallback();
  };
  uploadImage = () => {};
  componentDidMount() {}
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
      editDataSource,
      isEditPw,
    } = this.props;
    const children = [];
    roleList.forEach(element => {
      children.push(<Option key={element.id}>{element.name}</Option>);
    });
    return (
      !!visible && (
        <Modal
          title={
            !isEditPw
              ? formatMessage({ id: 'app.versions.edit' })
              : formatMessage({ id: 'app.permission.editpassword' })
          }
          visible={visible}
          cancelText={formatMessage({ id: 'app.model.cancel' })}
          okText={formatMessage({ id: 'app.model.okText' })}
          onOk={this.onOk}
          onCancel={this.onCancel}
          width="400px"
        >
          <Form>
            {!isEditPw && (
              <FormItem
                {...formItemLayout}
                label={formatMessage({ id: 'app.permission.table.name' })}
              >
                {getFieldDecorator('nickname', {
                  initialValue: editDataSource.nickname,
                  rules: [
                    {
                      required: true,
                      message: formatMessage({ id: 'app.global.form.pleaseName' }),
                    },
                  ],
                })(<Input />)}
              </FormItem>
            )}
            {!isEditPw && (
              <FormItem
                {...formItemLayout}
                label={formatMessage({ id: 'app.permission.table.phone' })}
              >
                {getFieldDecorator('telephone', {
                  initialValue: editDataSource.telephone,
                  rules: [
                    {
                      required: true,
                      message: formatMessage({ id: 'app.permission.pleasePhone' }),
                    },
                  ],
                })(<Input />)}
              </FormItem>
            )}
            {isEditPw && (
              <FormItem
                {...formItemLayout}
                label={formatMessage({ id: 'app.permission.password' })}
              >
                {getFieldDecorator('password', {
                  initialValue: editDataSource.password,
                  rules: [
                    {
                      required: true,
                      message: formatMessage({ id: 'app.permission.pleasePassword' }),
                    },
                  ],
                })(<Input type="password" />)}
              </FormItem>
            )}
            {!isEditPw && (
              <FormItem
                {...formItemLayout}
                label={formatMessage({ id: 'app.permission.table.role' })}
              >
                {getFieldDecorator('role_ids', {
                  initialValue: editDataSource.role_ids.split(','),
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
            )}
          </Form>
        </Modal>
      )
    );
  }
}

export default PermissionEdit;

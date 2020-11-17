import { modify, modifyPassword,modifyPublisher } from '@/services/permission';

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
      editDataSource: { aid },
      isEditPw,
      onCallback,
    } = this.props;
    this.props.form.validateFields((err, values) => {
      if (!err) {
        const params = values;
        params.member_id = aid;

        modifyPublisher(params).then(res => {
          if (res && !res.code) {
            onCallback('refresh');
          }
        })

        return
        // if (isEditPw) {
        //   modifyPassword(params).then(res => {
        //     if (res && !res.code) {
        //       onCallback('refresh');
        //     }
        //   });
        //   return;
        // }
        // params.role_ids = params.role_ids ? params.role_ids : '';
        // modify(params).then(res => {
        //   if (res && !res.code) {
        //     onCallback('refresh');
        //   }
        // });
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
              ? formatMessage({ id: 'app.permission.edit' })
              : formatMessage({ id: 'app.permission.editpassword' })
          }
          visible={visible}
          cancelText={formatMessage({ id: 'app.model.cancel' })}
          okText={formatMessage({ id: 'app.model.okText' })}
          onOk={this.onOk}
          onCancel={this.onCancel}
          width="550px"
        >
          <Form>
           
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
              <FormItem
                {...formItemLayout}
                label={"First Name"}
              >
                {getFieldDecorator('first_name', {
                  initialValue: editDataSource.first_name,
                  rules: [
                    {
                      required: true,
                      message: "Please input first name",
                    },
                  ],
                })(<Input />)}
              </FormItem>

              <FormItem
                {...formItemLayout}
                label={"Last Name"}
              >
                {getFieldDecorator('last_name', {
                  initialValue: editDataSource.last_name,
                  rules: [
                    {
                      required: true,
                      message: "Please input last name",
                    },
                  ],
                })(<Input />)}
              </FormItem>
              <FormItem
                {...formItemLayout}
                label={"Telephone"}
              >
                {getFieldDecorator('phone_number', {
                  initialValue: editDataSource.phone_number,
                  rules: [
                    {
                      required: true,
                      message: "Please input telephone",
                    },
                  ],
                })(<Input />)}
                 </FormItem>
                <FormItem
                {...formItemLayout}
                label={"Paypal account"}
              >
                {getFieldDecorator('paypal_account', {
                  initialValue: editDataSource.paypal_account,
                  rules: [
                    {
                      required: true,
                      message: "Please input paypal account",
                    },
                  ],
                })(<Input />)}
              </FormItem>
          </Form>
        </Modal>
      )
    );
  }
}

export default PermissionEdit;

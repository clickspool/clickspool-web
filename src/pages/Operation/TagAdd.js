import { add } from '@/services/tag';

import { connect } from 'dva';

import { Input, Form, Modal, Select } from 'antd';

import React from 'react';

import { formatMessage } from 'umi/locale';
import { checkRate } from '@/utils/utils';

const FormItem = Form.Item;
const Option = Select.Option;

@Form.create()
@connect(({ tags: { statusList } }) => ({
  statusList,
}))
class TagAdd extends React.Component {
  onOk = () => {
    this.props.form.validateFields((err, values) => {
      if (!err) {
        let params = values;
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
      statusList,
    } = this.props;
    console.log(statusList, 'statusList');
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
              {getFieldDecorator('description')(<Input />)}
            </FormItem>
            <FormItem {...formItemLayout} label={formatMessage({ id: 'app.group.table.sort' })}>
              {getFieldDecorator('sort')(<Input />)}
            </FormItem>
            <FormItem {...formItemLayout} label={formatMessage({ id: 'app.image.table.status' })}>
              {getFieldDecorator('status', {
                rules: [
                  {
                    required: true,
                    message: formatMessage({ id: 'app.image.table.pleasestatus' }),
                  },
                ],
              })(
                <Select
                  placeholder={formatMessage({ id: 'app.image.table.pleasestatus' })}
                  onChange={this.handleSelectChange}
                >
                  {Object.keys(statusList).map(item => {
                    return (
                      <Option key={item} value={item}>
                        {statusList[item]}
                      </Option>
                    );
                  })}
                </Select>
              )}
            </FormItem>
          </Form>
        </Modal>
      )
    );
  }
}

export default TagAdd;

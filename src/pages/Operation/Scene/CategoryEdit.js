import { connect } from 'dva';
import React, { PureComponent } from 'react';
import { Modal, Form, Input, Switch, Popconfirm } from 'antd';
import { formatMessage } from 'umi/locale';

@connect(({ categories: { list } }) => ({ list }))
@Form.create()
class SceneCategoryEdit extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      visible: false
    }
  }
  cancelSwitch = () => {
    this.props.form.setFieldsValue({
      status: true
    });
  }
  confirmSwitch = () => {
    this.props.form.setFieldsValue({
      status: false
    });
  }
  handleCancel = () => {
    this.setState({ visible: false });
    this.props.form.resetFields();
    this.props.close();
  }

  handleOk = async () => {
    const { form: { validateFields, getFieldsValue, getFieldValue, resetFields }, dispatch, close, id } = this.props;
    validateFields(async errors => {
      if (errors) return;
      const values = getFieldsValue();
      values.status = values.status === true && 1;
      const result = id ? await dispatch({ payload: { id, values }, type: 'categories/patch' }) : await dispatch({ payload: values, type: 'categories/create' });
      if (result) {
        resetFields();
        close();
      }
    });
  }

  render() {
    const _this = this;
    const { visible: isVisible } = this.state;
    const { visible, close, form: { getFieldDecorator }, caption, id, list } = this.props;
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

    let fields = [
      {
        name: 'name',
        placeholder: formatMessage({ id: 'app.scene.category.name_placeholder' }),
        options: {
          rules: [{ required: true, message: formatMessage({ id: 'app.scene.category.name_required' }) }, { max: 20, message: formatMessage({ id: 'app.scene.category.name_verify' }) }],
        },
        label: formatMessage({ id: 'app.scene.category.name' }),
      }, {
        name: 'desc',
        placeholder: formatMessage({ id: 'app.scene.category.desc_placeholder' }),
        options: {
          rules: [{ max: 20, message: formatMessage({ id: 'app.scene.category.desc_verify' }) }],
        },
        label: formatMessage({ id: 'app.scene.category.desc' }),
      }, {
        name: 'sort',
        placeholder: formatMessage({ id: 'app.scene.category.sort_placeholder' }),
        options: {
          rules: [],
        },
        input_type: 'number',
        label: formatMessage({ id: 'app.scene.category.sort' }),
      }, {
        name: 'status',
        options: {
          valuePropName: 'checked',
          initialValue: false,
          rules: [],
        },
        type: 'switch',
        label: formatMessage({ id: 'app.scene.category.switch' }),
      }
    ];
    let init = {};
    // editing with initial value
    if (id && list) {
      init = list && list.find(item => item.id === id);
      fields = fields.map(field => {
        if (field.type === 'switch') {
          field.options.initialValue = !!+init[field.name];
        } else {
          field.options.initialValue = init[field.name];
        }
        return field;
      });
    }
    const formFields = fields.map(field => {
      const { name, options, input_type, placeholder, label, type, initialValue } = field;
      let input = <Input type={input_type} placeholder={placeholder} />;
      let showPopConfirm = false;
      let hint = '';
      if (type === 'switch') {
        if (id && options.initialValue === true) {
          showPopConfirm = true;
          hint = init.tool_count > 0 ? formatMessage({ id: 'app.scene.category.has_tool_offline_hint' }) : formatMessage({ id: 'app.scene.category.offline_hint' });
        }

        input = <Switch />;
      }
      return (
        <Form.Item key={name} {...formItemLayout} label={label}>
          {showPopConfirm ? <Popconfirm
            title={hint}
            okText={formatMessage({ id: 'app.scene.category.offline_confirm' })}
            cancelText={formatMessage({ id: 'app.scene.category.offline_cancel' })}
            okType='danger'
            onCancel={_this.cancelSwitch}
            onConfirm={_this.confirmSwitch}
          >
            {getFieldDecorator(name, options)(input)}
          </Popconfirm> : getFieldDecorator(name, options)(input)}
        </Form.Item>
      );
    });
    return (
      <Modal
        title={caption || formatMessage({ id: 'app.scene.category.add' })}
        visible={isVisible || visible}
        onOk={this.handleOk}
        onCancel={this.handleCancel}
      >
        <Form autoComplete='off'>
          {formFields}
        </Form>
      </Modal >
    );
  }
}
export default SceneCategoryEdit;

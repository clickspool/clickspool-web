import { connect } from 'dva';
import React, { PureComponent } from 'react';
import { Modal, Form, Input, Switch, Popconfirm, Upload, Button, Icon, Select } from 'antd';
//@ts-ignore
import { formatMessage } from 'umi/locale';
import memoize from 'memoize-one';
import isEqual from 'lodash/isEqual';

@connect(({ tag: { list } }) => ({ list }))
//@ts-ignore
@Form.create()
class SceneCategoryEdit extends PureComponent<any, any> {
  constructor(props) {
    super(props);
  }
  state = {
    visible: false,
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
    fields: [
      {
        name: 'name',
        placeholder: formatMessage({ id: 'app.group.tag.edit.name_placeholder' }),
        options: {
          rules: [{ required: true, message: formatMessage({ id: 'app.scene.category.name_required' }) }],
        },
        label: formatMessage({ id: 'app.scene.category.name' }),
      },
      {
        name: 'desc',
        placeholder: formatMessage({ id: 'app.group.tag.edit.desc_placeholder' }),
        options: {
          rules: [],
        },
        label: formatMessage({ id: 'app.scene.category.desc' }),
      },
      {
        name: 'sort',
        placeholder: formatMessage({ id: 'app.scene.category.sort_placeholder' }),
        options: {
          rules: [],
        },
        input_type: 'number',
        label: formatMessage({ id: 'app.scene.category.sort' }),
      },
      {
        name: 'status',
        options: {
          valuePropName: 'checked',
          initialValue: false,
          rules: [],
        },
        type: 'switch',
        label: formatMessage({ id: 'app.scene.category.switch' }),
      },
      {
        name: 'is_recommend',
        options: {
          valuePropName: 'checked',
          initialValue: false,
          rules: [],
        },
        type: 'switch',
        label: formatMessage({ id: 'app.group.tag.edit.recommend' }),
      },
    ]
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
    const { form: { validateFields, getFieldsValue, resetFields }, dispatch, close, id } = this.props;
    validateFields(async errors => {
      if (errors) return;
      const values = getFieldsValue();
      const params = new FormData();

      values.status = values.status === true && 1 || 0;
      values.is_recommend = values.is_recommend === true && 1 || 0;
      Object.keys(values).forEach(key => {
        let value = values[key];
        if (value === undefined) {
          return;
        }
        if (typeof value === 'object' && value) {
          if (Array.isArray(value) && value[0].url) {//已经有 url 的时候不更新字段
            return;
          }
          return params.append(key, value[0].originFileObj, value[0].name);
        }
        params.append(key, value);
      });

      if (id) {
        params.append('id', id);
      }
      console.info('params__', { values, params, id });
      const result = id ? await dispatch({ payload: { params, id }, type: 'tag/patch' }) : await dispatch({ payload: params, type: 'tag/create' });
      if (result) {
        close();
        resetFields();
      }
    });
  }
  normFile = (e) => {
    if (Array.isArray(e)) {
      return e;
    }
    if (e && Array.isArray(e.fileList)) {
      return e.fileList.slice(-1);
    }
    return e && e.fileList;
  }
  renderFieldName = () => {
    const _this = this;
    return memoize((field, init, fieldValue) => {
      const { form: { getFieldDecorator }, id } = this.props;
      let { formItemLayout } = this.state;

      const { name, options, input_type, placeholder, label, type } = field;
      let input = <Input type={input_type} placeholder={placeholder} />;
      let showPopConfirm = false;
      let hint = '';

      if (field.name in init) {
        if (field.type === 'switch') {
          field.options.initialValue = !!+init[field.name];
        } else {
          field.options.initialValue = init[field.name];
        }
      }
      if (type === 'switch') {
        if (id && options.initialValue === true && field.name === 'status') {
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
    }, isEqual);
  }

  render() {
    const { visible: isVisible, fields } = this.state;
    const { visible, form: { getFieldError, getFieldValue }, caption, id, list } = this.props;
    const { handleOk, handleCancel } = this;
    // editing with initial value
    let init = {};
    if (id && list) {
      init = list && list.find(item => item.id === id);
    }
    const formFields = fields.map(field => {
      const renderFunctionName = `renderField_${field.name}`;
      let renderFunction = this[renderFunctionName];
      if (!renderFunction) {
        renderFunction = this[renderFunctionName] = this.renderFieldName();
      }
      const fieldError = getFieldError(field.name);
      let fieldValue = getFieldValue(field.name);
      return renderFunction(field, init, fieldValue, fieldError);
    });

    return (
      <Modal
        title={caption}
        visible={isVisible || visible}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <Form autoComplete='off'>
          {formFields}
        </Form>
      </Modal >
    );
  }
}
export default SceneCategoryEdit;

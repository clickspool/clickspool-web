import { connect } from 'dva';
import React, { PureComponent } from 'react';
import { Modal, Form, Input, Switch, Popconfirm, Upload, Button, Icon } from 'antd';
import { formatMessage } from 'umi/locale';
import memoize from 'memoize-one';
import isEqual from 'lodash/isEqual';
import get from 'lodash/get';
const uuidv1 = require('uuid/v1');

@connect(({ giftCategories: { list } }) => ({ list }))
@Form.create()
class SceneCategoryEdit extends PureComponent {
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
    const { form: { validateFields, getFieldsValue, getFieldValue, resetFields }, dispatch, close, id } = this.props;
    validateFields(async errors => {
      if (errors) return;
      const values = getFieldsValue();
      const params = new FormData();

      values.status = values.status === true && 1 || 0;
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
      const result = id ? await dispatch({ payload: params, type: 'giftCategories/patch' }) : await dispatch({ payload: params, type: 'giftCategories/create' });
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
    return memoize((field, init, fieldValue, fieldError, status) => {
      const { form: { getFieldDecorator, setFieldsValue }, cates, id, list } = this.props;
      let { fields, formItemLayout } = this.state;

      if (field.name in init) {
        if (field.type === 'switch') {
          field.options.initialValue = !!+init[field.name];
        } else if (field.name === 'position') {
          field.options.initialValue = +init[field.name] > 0 ? +init[field.name] : undefined;
        } else if (field.type === 'upload') {
          if (init[field.name]) {
            field.options.initialValue = [{
              url: init[field.name],
              name: init.bundle_name || name,
              uid: uuidv1(),
            }];
          }
        } else {
          field.options.initialValue = init[field.name];
        }
      }

      const { name, options, input_type, placeholder, label, type, initialValue, properties = {} } = field;
      let input = <Input type={input_type} placeholder={placeholder} />;
      let showPopConfirm = false;
      let hint = '';
      let { optionList } = field;


      if (type === 'switch') {
        if (id && options.initialValue === true) {
          showPopConfirm = true;
          hint = init.tool_count > 0 ? formatMessage({ id: 'app.scene.category.has_tool_offline_hint' }) : formatMessage({ id: 'app.scene.category.offline_hint' });
        }
        input = <Switch />;
      }
      if (type === 'upload') {
        options.getValueFromEvent = this.normFile;
        properties.customRequest = ({ file, onSuccess }) => {
          setTimeout(() => {
            onSuccess("ok");
          }, 0);
        };
        input = (
          <Upload {...properties}>
            <Button>
              <Icon type="cloud-upload" /> {placeholder}
            </Button>
          </Upload>
        );
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
    const _this = this;
    const { visible: isVisible, fields } = this.state;
    const { visible, close, form: { getFieldDecorator, getFieldError, getFieldValue }, caption, id, list } = this.props;
    // editing with initial value
    let init = {};
    if (id && list) {
      init = list && list.find(item => item.id === id);
    }
    const formFields = fields.map(field => {
      const renderFunctionName = `renderField_${field.name}`;
      let renderFunction = this[renderFunctionName];
      if (!renderFunction) {
        renderFunction = this[renderFunctionName] = this.renderFieldName(field.name);
      }
      const fieldError = getFieldError(field.name);
      let fieldValue = getFieldValue(field.name);
      let status;
      if (Array.isArray(getFieldValue(field.name))) {
        // fieldValue = get(getFieldValue(field.name)[0], 'url') || get(getFieldValue(field.name)[0], 'uid');
        // status = get(getFieldValue(field.name)[0], 'status');
        fieldValue = get(getFieldValue(field.name)[0], 'status');
      }
      return renderFunction(field, init, fieldValue, fieldError, status);
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

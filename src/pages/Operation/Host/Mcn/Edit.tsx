import { connect } from 'dva';
import React, { PureComponent } from 'react';
import { Modal, Form, Input, Switch, Popconfirm, Tabs, TimePicker, Upload, Button, Icon, Select, Row, Col } from 'antd';
import moment from 'moment';
//@ts-ignore
import { formatMessage } from 'umi/locale';
import memoize from 'memoize-one';
import isEqual from 'lodash/isEqual';
import pick from 'lodash/pick';

@connect(({ mcn: { list } }) => ({ list }))
//@ts-ignore
@Form.create()
export default class EditTemplate extends PureComponent<any, any> {
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
    filters: {},
    fields: [
      {
        name: 'name',
        placeholder: formatMessage({ id: 'app.host.mcn.name.placeholder' }),
        options: {
          rules: [{ required: true, message: formatMessage({ id: 'app.host.mcn.name.required' }) }],
        },
        label: formatMessage({ id: 'app.host.mcn.edit.name' }),
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
    const { form: { validateFields, getFieldsValue }, dispatch, close, id, record } = this.props;
    const { currentTabKey, defaultTabKey, uploadInfo } = this.state;
    const tabkey = currentTabKey || defaultTabKey;
    let ignoreContent = tabkey !== 'text' && tabkey !== 'makefriend';
    validateFields(async errors => {
      console.info('valid_errors_', { errors, tabkey, ignoreContent });
      if (errors && Object.keys(errors).length > 0) return;
      let values = getFieldsValue();
      const params = new FormData();
      // values.status = values.status === true && 1 || 0;
      Object.keys(values).forEach(key => {
        let value = values[key];
        if (value === undefined) {
          return;
        }
        params.append(key, value);
      });

      if (id) {
        params.append('id', id);
      }
      console.info('params__', { values, params, id });
      const result = id ? await dispatch({ payload: { params, id }, type: 'mcn/patch' }) : await dispatch({ payload: params, type: 'mcn/create' });
      if (result) {
        close();
      }
    });
  }

  renderFieldName = () => {
    const _this = this;
    return memoize((field, init, fieldValue) => {
      const { form: { getFieldDecorator }, id } = this.props;
      let { formItemLayout } = this.state;

      const { name, options, input_type, placeholder, label, type, properties = {} } = field;
      let input = <Input type={input_type} {...properties} placeholder={placeholder} />;
      let showPopConfirm = false;
      let hint = '';

      if (field.name in init) {
        if (field.type === 'switch') {
          field.options.initialValue = !!+init[field.name];
        } else if (field.type === 'timepicker' && init[name]) {
          console.info('init[name]__', init[name], moment(init[name], 'HH:mm:ss'));
          field.options.initialValue = moment(init[name], 'HH:mm:ss');
        } else {
          field.options.initialValue = field.name == 'gift_id' ? (init[field.name] == 0 ? '' : init[field.name]) : init[field.name];
        }
      }
      if (type === 'switch') {
        if (id && options.initialValue === true && field.name === 'status') {
          showPopConfirm = true;
          hint = init.tool_count > 0 ? formatMessage({ id: 'app.scene.category.has_tool_offline_hint' }) : formatMessage({ id: 'app.scene.category.offline_hint' });
        }
        input = <Switch />;
      }
      if (type === 'textarea') {
        const { TextArea } = Input;
        input = <TextArea {...properties} />;
      }
      if (type === 'timepicker') {
        input = <TimePicker {...properties} />;
      }
      if (type === 'select') {
        const Option = Select.Option;
        let optionsEl: any;
        let disableSelect = false;
        let { optionList } = field;
        if (typeof optionList === 'string') {
          optionList = this.props[optionList];
        }

        if (optionList) {
          optionsEl = [...optionList].map(item => {
            return <Option key={item[0]} value={item[0]}>{item[1]}</Option>
          });
        }

        // }
        input = (
          <Select disabled={disableSelect} placeholder={placeholder}>
            {optionsEl}
          </Select>
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
  uploaded = ({ uploadInfo, flag, name }) => {
    console.info('uploaded_', { uploadInfo, flag, name });
    const { form: { setFieldsValue } } = this.props;
    if (flag) {
      setFieldsValue({ upload: null });
      return this.setState({
        uploadInfo: null,
      });
    }
    setFieldsValue({ [name]: true });
    this.setState({
      uploadInfo
    });
  }

  componentWillMount = () => {
    const { form: { resetFields } } = this.props;
    resetFields();
  }

  render() {
    const { visible: isVisible, fields, formItemLayout } = this.state;
    const { visible, form: { getFieldError, getFieldValue, getFieldDecorator, setFieldsValue }, caption, id, list, record = {} } = this.props;
    const { handleOk, handleCancel } = this;
    const formFields = fields.map(field => {
      const renderFunctionName = `renderField_${field.name}`;
      let renderFunction = this[renderFunctionName];
      if (!renderFunction) {
        renderFunction = this[renderFunctionName] = this.renderFieldName();
      }
      const fieldError = getFieldError(field.name);
      let fieldValue = getFieldValue(field.name);
      return renderFunction(field, record, fieldValue, fieldError);
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
      </Modal>
    );
  }
}

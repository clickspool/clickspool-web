import { connect } from 'dva';
import React, { PureComponent } from 'react';
import { Modal, Form, Input, Icon, Switch, Popconfirm, Upload, Select, Button, Spin, Radio } from 'antd';
import { formatMessage } from 'umi/locale';
import styles from './ToolEdit.css';
import memoize from 'memoize-one';
import isEqual from 'lodash/isEqual';
import get from 'lodash/get';
const uuidv1 = require('uuid/v1');

@connect(({ tools: { list, loading } }) => ({ list, loading }))
@Form.create()
class SceneCategoryAdd extends PureComponent {
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
        placeholder: formatMessage({ id: 'app.scene.tools.name_placeholder' }),
        options: {
          rules: [{ required: true, message: formatMessage({ id: 'app.scene.tools.name_required' }) }, { max: 20, message: formatMessage({ id: 'app.scene.tools.name_verify' }) }],
        },
        label: formatMessage({ id: 'app.scene.tools.name' }),
      },
      {
        name: 'position',
        placeholder: formatMessage({ id: 'app.scene.tools.position_placeholder' }),
        options: {
          rules: [{ required: true, message: formatMessage({ id: 'app.scene.tools.position_required' }) }],
          initialValue: 2,//hardcode set to [2,'相芯']
        },
        type: 'select',
        label: formatMessage({ id: 'app.scene.tools.position_label' }),
        optionList: 'positions'
      },
      {
        name: 'cate_id',
        placeholder: formatMessage({ id: 'app.scene.tools.cate_placeholder' }),
        options: {
          rules: [{ required: true, message: formatMessage({ id: 'app.scene.tools.cate_required' }) }],
        },
        type: 'select',
        label: formatMessage({ id: 'app.scene.tools.cate_label' }),
      },
      {
        name: 'sort',
        placeholder: formatMessage({ id: 'app.scene.tools.sort_placeholder' }),
        options: {
          rules: [],
        },
        input_type: 'number',
        label: formatMessage({ id: 'app.scene.tools.sort' }),
      },
      {
        name: 'client_apply',
        placeholder: formatMessage({ id: 'app.scene.tools.client_placeholder' }),
        options: {
          rules: [{ required: true, message: formatMessage({ id: 'app.scene.tools.position_required' }) }],
          initialValue: '0',//hardcode set to ['0','全部']
        },
        type: 'radio',
        label: formatMessage({ id: 'app.scene.tools.client_label' }),
        optionList: 'clients'
      },
      {
        name: 'bundle',
        placeholder: formatMessage({ id: 'app.scene.tools.bundle_placeholder' }),
        options: {
          rules: [{ required: true, message: formatMessage({ id: 'app.scene.tools.bundle_required' }) }],
        },
        type: 'upload',
        label: formatMessage({ id: 'app.scene.tools.bundle_label' }),
      },
      {
        name: 'icon',
        placeholder: formatMessage({ id: 'app.scene.tools.icon_placeholder' }),
        options: {
          rules: [{ required: true, message: formatMessage({ id: 'app.scene.tools.icon_required' }) }],
        },
        properties: {
          listType: 'picture-card'
        },
        type: 'upload',
        label: formatMessage({ id: 'app.scene.tools.icon_label' }),
      },
      {
        name: 'show_name',
        options: {
          rules: [{ max: 30, message: formatMessage({ id: 'app.scene.tools.show_name_verify' }) }]
        },
        properties: {
          autoSize: true,
          placeholder: formatMessage({ id: 'app.scene.tools.show_name_placeholder' }),
        },
        label: formatMessage({ id: 'app.scene.tools.show_name' }),
        type: 'textarea'
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
      }
    ],
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
    const _this = this;
    const { form: { validateFields, getFieldsValue, getFieldValue, resetFields }, dispatch, close, id, list } = this.props;
    const tool = list.find(item => item.id === id);

    validateFields(async errors => {
      if (errors) return;
      dispatch({
        type: 'tools/updateState',
        payload: {
          loading: true
        }
      });
      const values = getFieldsValue();
      const params = new FormData();

      values.status = values.status === true && 1 || 0;
      Object.keys(values).forEach(key => {
        let value = values[key];
        if (value === undefined) {
          return;
        }
        if (key === 'bundle') {
          params.append('bundle_name', values.name);
        }
        if (typeof value === 'object' && value) {
          if (Array.isArray(value) && value[0] && value[0].url) {
            if (key === 'bundle') {
              return params.append(key, tool.bundle_path);
            }
            if (key === 'icon') {
              return params.append(key, tool.icon_path);
            }
            return params.append(key, value[0].url);
          }
          return params.append(key, value[0].originFileObj, value[0].name);
        }
        params.append(key, value);
      });

      if (id) {
        params.append('id', id);
      }
      const result = id ? await dispatch({ payload: { params, id }, type: 'tools/patch' }) : await dispatch({ payload: params, type: 'tools/create' });
      dispatch({
        type: 'tools/updateState',
        payload: {
          loading: false
        }
      });
      if (result) {
        close();
        resetFields();
      }
    });
  }
  handleUploadChange = (name, e) => {
    const file = e.file;
    this.setState({
      [name]: e.file.status !== 'removed' ? e.fileList.slice(e.fileList.length - 1) : []
    })
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
      const { form: { getFieldDecorator }, cates, id, list } = this.props;
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
      if (typeof optionList === 'string') {
        optionList = this.props[optionList];
      }
      if (type === 'textarea') {
        const { TextArea } = Input;
        input = <TextArea {...properties} />;
      }
      if (type === 'switch') {
        if (id && options.initialValue === true) {
          showPopConfirm = true;
          hint = init.tool_count > 0 ? formatMessage({ id: 'app.scene.category.has_tool_offline_hint' }) : formatMessage({ id: 'app.scene.category.offline_hint' });
        }
        input = <Switch />;
      }
      if (type === 'radio') {
        const RadioGroup = Radio.Group;
        const radiosEl = [...optionList].map(item => {
          return (
            <Radio key={item[0]} value={item[0]}>{item[1]}</Radio>
          );
        })
        input = (
          <RadioGroup>
            {radiosEl}
          </RadioGroup>
        );
      }
      if (type === 'select') {
        const Option = Select.Option;
        if (name == 'cate_id') {
          const catesEl = cates.filter(cate => { return cate.status == 1 || init.cate_id == cate.id }).map(cate => {
            let status = '';
            if (cate.status == 0) {
              status = ` (${formatMessage({ id: 'app.scene.category.status_offline' })})`;
            }
            return <Option key={cate.id} value={cate.id}>{cate.name}{status}</Option>
          });
          input = (
            <Select placeholder={placeholder}>
              {catesEl}
            </Select>
          );
        } else {
          const optionsEl = [...optionList].map(item => {
            return <Option key={item[0]} value={item[0]}>{item[1]}</Option>
          });
          input = (
            <Select placeholder={placeholder}>
              {optionsEl}
            </Select>
          );
        }

      }
      if (type === 'upload') {
        options.valuePropName = 'fileList';
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
    const { visible: isVisible, formItemLayout, fields } = this.state;
    const { visible, close, form: { getFieldDecorator, getFieldsValue, getFieldValue, setFieldsValue, resetFields, getFieldError }, caption, id, list, cates = {}, positions = new Map(), clients = new Map(), loading } = this.props;

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
    const hideLoad = loading ? '' : ` ${styles['hide']}`;
    return (
      <>
        <Modal
          title={caption || formatMessage({ id: 'app.scene.tools.add' })}
          visible={isVisible || visible}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
        >
          <Form autoComplete='off'>
            {formFields}
          </Form>
        </Modal >
        <div className={`${styles.loading}${hideLoad}`}>
          <Spin size='large' />
        </div>
      </>
    );
  }
}
export default SceneCategoryAdd;

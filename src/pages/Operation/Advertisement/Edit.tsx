import { connect } from 'dva';
import { Modal, Form, Input, Icon, Switch, Popconfirm, Upload, Select, Button, Spin, Radio } from 'antd';
import React, { PureComponent } from 'react';
//@ts-ignore
import { formatMessage } from 'umi/locale';
import get from 'lodash/get';
import memoize from 'memoize-one';
import isEqual from 'lodash/isEqual';
import styles from './edit.css';
const uuidv1 = require('uuid/v1');

@connect(({ gift: { loading, list, clients }, faceCategories: { list: cates } }) => ({ loading, cates, list, clients }))
//@ts-ignore
@Form.create()
class SceneCategoryAdd extends PureComponent<any, any> {
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
          rules: [{ required: true, message: formatMessage({ id: 'app.scene.tools.name_required' }) }],
        },
        label: formatMessage({ id: 'app.scene.tools.name' }),
      },
      {
        name: 'price',
        placeholder: formatMessage({ id: 'app.gift.price' }),
        options: {
          rules: [],
        },
        input_type: 'number',
        label: formatMessage({ id: 'app.gift.price' }),
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
        name: 'icon',
        placeholder: formatMessage({ id: 'app.gift.icon.placeholder' }),
        options: {
          rules: [{ required: true, message: formatMessage({ id: 'app.face.tools.thumb_required' }) }],
        },
        type: 'upload',
        label: formatMessage({ id: 'app.gift.icon' }),
        properties: {
          listType: 'picture-card'
        },
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
  getImageBound = (src) => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => {
        resolve({ width: img.width, height: img.height });
      }
      img.onerror = () => {
        reject();
      }
      img.src = src;
    });
  }
  handleOk = async () => {
    const _this = this;
    const { form: { validateFields, getFieldsValue, getFieldValue, resetFields }, dispatch, close, id, list } = this.props;
    const tool = list.find(item => item.id === id);

    validateFields(async errors => {
      if (errors) return;
      dispatch({
        type: 'gift/updateState',
        payload: {
          loading: true
        }
      });
      const values = getFieldsValue();
      const params = new FormData();

      values.status = values.status === true && 1 || 0;
      const keys = Object.keys(values);
      await Promise.all(keys.map(async key => {
        let value = values[key];
        if (value === undefined) {
          return;
        }
        if (typeof value === 'object' && value) {
          if (Array.isArray(value) && value[0] && value[0].url) {
            return params.append(key, value[0].path);
          }

          const file = get(value[0], 'originFileObj');
          if (!file) {
            return;
          }
          console.info('handleOK_value', { key, value, name: get(value[0], 'name') });
          return params.append(key, file, get(value[0], 'name'));
        }
        params.append(key, value);
      }));
      if (id) {
        params.append('id', id);
      }
      params.append('cate_id', 1);
      const result = id ? await dispatch({ payload: { params, id }, type: 'gift/patch' }) : await dispatch({ payload: params, type: 'gift/create' });
      dispatch({
        type: 'gift/updateState',
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
  normFile = (e) => {
    console.info('normFile__', e);
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
      const { form: { getFieldDecorator, setFieldsValue, getFieldValue }, cates, id, list } = this.props;
      let { fields, formItemLayout } = this.state;
      const { name, options, input_type, placeholder, label, type, initialValue, properties = {} } = field;

      if (init && name in init) {
        if (field.type === 'switch') {
          field.options.initialValue = !!+init[name];
        } else if (field.type === 'upload') {
          let initValue = init[name];
          if (init[`remote_${name}`]) {
            initValue = init[`remote_${name}`];
          }
          if (initValue) {
            field.options.initialValue = [{
              url: initValue,
              path: init[name],
              name: init.title + name,
              uid: uuidv1(),
            }];
          }
        } else {
          field.options.initialValue = init[name];
        }
      }

      let input = <Input key={name} type={input_type} placeholder={placeholder} />;
      let showPopConfirm = false;
      let cancelConfirm = this.cancelSwitch;
      let hint = '';
      let { optionList } = field;
      if (typeof optionList === 'string') {
        optionList = this.props[optionList];
      }
      if (type === 'textarea') {
        const { TextArea } = Input;
        input = <TextArea key={name} {...properties} />;
      }
      if (type === 'switch') {
        if (id && options.initialValue === true) {
          showPopConfirm = true;
          hint = init.tool_count > 0 ? formatMessage({ id: 'app.scene.category.has_tool_offline_hint' }) : formatMessage({ id: 'app.scene.category.offline_hint' });
        }
        // if (id && options.initialValue === false) {
        //   // const cate_id = getFieldValue('cate_id');
        //   // const cate = cates.find(item => item.id == cate_id);
        //   // if (cate.status == '0') {
        //   //   showPopConfirm = true;
        //   //   cancelConfirm = this.confirmSwitch;
        //   //   hint = formatMessage({ id: 'app.face.tools.category_offline_hint' });
        //   // }
        // }
        input = <Switch key={name} />;
      }
      if (type === 'radio') {
        const RadioGroup = Radio.Group;
        const radiosEl = [...optionList].map(item => {
          return (
            <Radio key={item[0]} value={item[0]}>{item[1]}</Radio>
          );
        })
        input = (
          <RadioGroup key={name}>
            {radiosEl}
          </RadioGroup>
        );
      }
      if (type === 'select') {
        const Option = Select.Option;
        let optionsEl: JSX.Element[];
        let disableSelect = false;
        if (name === 'cate_id') {
          optionsEl = cates.filter(cate => { return cate.status == 1 || init.cate_id == cate.id }).map(cate => {
            let status = '';
            if (cate.status == 0) {
              status = ` (${formatMessage({ id: 'app.scene.category.status_offline' })})`;
            }
            return <Option key={cate.id} value={cate.id}>{cate.title}{status}</Option>
          });
        } else {
          optionsEl = [...optionList].map(item => {
            return <Option key={item[0]} value={item[0]}>{item[1]}</Option>
          });
        }
        input = (
          <Select key={name} disabled={disableSelect} placeholder={placeholder}>
            {optionsEl}
          </Select>
        );
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
          <Upload key={name} {...properties}>
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
            onCancel={cancelConfirm}
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
    const { visible, close, form: { getFieldDecorator, getFieldsValue, getFieldValue, setFieldsValue, resetFields, getFieldError }, caption, id, list, cates = {}, clients = new Map(), loading } = this.props;

    let init = {};
    if (id && list) {
      init = list && list.find(item => item.id === id);
    }
    // console.info('tool_edit_render', { id, list, init });
    const formFields = fields.map(field => {
      const name = field.name;
      const renderFunctionName = `renderField_${name}`;
      let renderFunction = this[renderFunctionName];
      if (!renderFunction) {
        renderFunction = this[renderFunctionName] = this.renderFieldName(name);
      }
      const fieldError = getFieldError(name);
      let fieldValue = getFieldValue(name);
      let status;
      if (Array.isArray(getFieldValue(name))) {
        // fieldValue = get(getFieldValue(name)[0], 'url') || get(getFieldValue(name)[0], 'uid');
        // status = get(getFieldValue(name)[0], 'status');
        // console.info('render_fields_', { field, init, fieldValue, fieldError, status });
        fieldValue = get(getFieldValue(name)[0], 'status') || getFieldValue(name).length;
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

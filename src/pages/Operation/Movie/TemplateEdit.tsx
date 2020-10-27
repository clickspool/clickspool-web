import { connect } from 'dva';

import { Modal, Form, Input, Icon, Switch, Popconfirm, Upload, Select, Button, Spin, Radio, Slider } from 'antd';

import React, { PureComponent } from 'react';

import { formatMessage } from 'umi/locale';

import get from 'lodash/get';

import memoize from 'memoize-one';

import isEqual from 'lodash/isEqual';

import styles from './TemplateEdit.css';
const uuidv1 = require('uuid/v1');

@connect(({ movies: { loading, list, clients, sdks, versionRange } }) => ({ loading, list, clients, sdks, versionRange }))
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
        placeholder: formatMessage({ id: 'app.movie.template.name.placeholder' }),
        options: {
          rules: [{ required: true, message: formatMessage({ id: 'app.movie.template.name.required' }) }],
        },
        label: formatMessage({ id: 'app.movie.template.name' }),
      },
      {
        name: 'sdk',
        placeholder: formatMessage({ id: 'app.movie.template.sdk_version' }),
        options: {
          rules: [],
        },
        type: 'select',
        label: formatMessage({ id: 'app.movie.template.sdk_version' }),
        optionList: 'sdks',
      },
      {
        name: 'image_count',
        options: {
          rules: [{ required: true, message: formatMessage({ id: 'app.movie.template.image_count.required' }) }],
        },
        properties: {
          placeholder: formatMessage({ id: 'app.movie.template.image_count.placeholder' }),
          min: 0,
        },
        input_type: 'number',
        label: formatMessage({ id: 'app.movie.template.image_count' }),
      },
      {
        name: 'sort',
        options: {
          rules: [],
        },
        properties: {
          placeholder: formatMessage({ id: 'app.scene.tools.sort_placeholder' }),
          min: 0,
        },
        input_type: 'number',
        label: formatMessage({ id: 'app.scene.tools.sort' }),
      },
      {
        name: 'platform',
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
        name: 'android_version',
        type: 'slider',
        properties: {},
        options: {},
        label: formatMessage({ id: 'app.movie.template.android_version' }),
      },
      {
        name: 'ios_version',
        type: 'slider',
        properties: {},
        options: {},
        label: formatMessage({ id: 'app.movie.template.ios_version' }),
      },
      {
        name: 'package',
        placeholder: formatMessage({ id: 'app.movie.template.package.label' }),
        options: {
          rules: [{ required: true, message: formatMessage({ id: 'app.movie.template.package.required' }) }],
        },
        type: 'upload',
        label: formatMessage({ id: 'app.movie.template.package.label' }),
      },
      {
        name: 'cover',
        placeholder: formatMessage({ id: 'app.movie.template.cover.placeholder' }),
        options: {
          rules: [{ required: true, message: formatMessage({ id: 'app.movie.template.cover.required' }) }],
        },
        type: 'upload',
        label: formatMessage({ id: 'app.movie.template.cover.label' }),
        properties: {
          listType: 'picture-card'
        },
      },
      {
        name: 'preview',
        placeholder: formatMessage({ id: 'app.movie.template.preview.placeholder' }),
        options: {
          rules: [{ required: true, message: formatMessage({ id: 'app.movie.template.preview.required' }) }],
        },
        type: 'upload',
        label: formatMessage({ id: 'app.movie.template.preview.label' }),
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
    const { form: { validateFields, getFieldsValue, getFieldValue, resetFields }, dispatch, close, id, list, versionRange: { android_version_range: [androidStart, androidEnd], ios_version_range: [iosStart, iosEnd] } } = this.props;
    const tool = list.find(item => item.id === id);

    validateFields(async errors => {
      if (errors) return;
      dispatch({
        type: 'movies/updateState',
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
        if (key === 'android_version') {
          params.append('android_version_start', value[0]);
          params.append('android_version_end', value[1] > androidEnd ? 20000 : value[1]);
          return;
        }
        if (key === 'ios_version') {
          params.append('ios_version_start', value[0]);
          params.append('ios_version_end', value[1] > iosEnd ? 20000 : value[1]);
          return;
        }
        if (typeof value === 'object' && value) {
          if (Array.isArray(value) && value[0] && value[0].url) {
            if (['preview', 'package', 'cover'].indexOf(key) !== -1) {
              return params.append(key, tool[key]);
            }
            return params.append(key, value[0].url);
          }
          const file = get(value[0], 'originFileObj');
          if (!file) {
            return;
          }
          return params.append(key, file, get(value[0], 'name'));
        }
        params.append(key, value);
      }));

      if (id) {
        params.append('id', id);
      }
      const result = id ? await dispatch({ payload: { params, id }, type: 'movies/patch' }) : await dispatch({ payload: params, type: 'movies/create' });
      dispatch({
        type: 'movies/updateState',
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
      const { form: { getFieldDecorator, setFieldsValue, getFieldValue }, cates, id, list, versionRange: { android_version_range: [androidStart, androidEnd], ios_version_range: [iosStart, iosEnd] } } = this.props;
      let { fields, formItemLayout } = this.state;
      const name = field.name;
      let androidTo = androidEnd + 1;
      let iosTo = iosEnd + 1;
      console.info('name__', name);

      if (init && name === 'android_version') {
        field.options.initialValue = init['android_version_start'] > 0 ? [+init['android_version_start'], +init['android_version_end']] : [+androidStart, +androidTo];
      }
      if (init && name === 'ios_version') {
        field.options.initialValue = init['ios_version_start'] > 0 ? [+init['ios_version_start'], +init['ios_version_end']] : [+iosStart, +iosTo];
      }
      if (init && field.name in init) {
        if (field.type === 'switch') {
          field.options.initialValue = !!+init[field.name];
        } else if (field.name === 'position') {
          field.options.initialValue = +init[field.name] > 0 ? +init[field.name] : undefined;
        } else if (field.type === 'upload') {
          let initValue = init[name];
          if (init[`remote_${name}`]) {
            initValue = init[`remote_${name}`];
          }
          if (initValue) {
            const paths = initValue.split('/');
            const filename = paths[paths.length - 1];
            field.options.initialValue = [{
              url: initValue,
              path: init[name],
              name: name === 'package' ? filename : (init.name + name),
              uid: uuidv1(),
            }];
          }
        } else {
          field.options.initialValue = init[name];
        }
      }

      const { options, input_type, placeholder, label, type, initialValue, properties = {} } = field;
      let input = <Input {...properties} type={input_type} placeholder={placeholder} />;
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
        let optionsEl: any;
        let disableSelect = false;

        if (optionList) {
          optionsEl = [...optionList].map(item => {
            if (!item[0] && !item[1]) {
              return <Option key={item[0]} value=''>{formatMessage({ id: 'app.movie.template.version.nolimit' })}</Option>
            }
            return <Option key={item[0]} value={item[0]}>{item[1]}</Option>
          });
        }
        input = (
          <Select disabled={disableSelect} placeholder={placeholder}>
            {optionsEl}
          </Select>
        );
      }
      if (name === 'android_version') {
        const marks = {
          [androidStart]: androidStart,
          [androidTo]: {
            style: {
              color: '#6656F5',
            },
            label: formatMessage({ id: 'app.movie.template.newest_version' }),
          },
        };
        const tipFormatter = (value) => {
          if (value === androidTo) {
            return formatMessage({ id: 'app.movie.template.newest_version' });
          }
          return value;
        };

        input = <Slider disabled={+getFieldValue('platform') === 2 ? true : false} className={styles.slider} tipFormatter={tipFormatter} range marks={marks} min={androidStart} max={androidTo} />;
      }
      if (name === 'ios_version') {
        const marks = {
          [iosStart]: iosStart,
          [iosTo]: {
            style: {
              color: '#6656F5',
            },
            label: formatMessage({ id: 'app.movie.template.newest_version' }),
          },
        };
        const tipFormatter = (value) => {
          if (value === iosTo) {
            return formatMessage({ id: 'app.movie.template.newest_version' });
          }
          return value;
        };

        input = <Slider disabled={+getFieldValue('platform') === 1 ? true : false} className={styles.slider} tipFormatter={tipFormatter} range marks={marks} min={iosStart} max={iosTo} />;
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
    const { visible: isVisible, formItemLayout, fields } = this.state;
    const { visible, close, form: { getFieldDecorator, getFieldsValue, getFieldValue, setFieldsValue, resetFields, getFieldError }, caption, id, list, clients = new Map(), loading, sdks } = this.props;

    if (id && fields[0] && fields[0].name !== 'id') {
      fields.unshift({
        name: 'id',
        //@ts-ignore
        options: {},
        properties: {
          //@ts-ignore
          disabled: true,
        },
        label: formatMessage({ id: 'app.movie.template.id' }),
      });
    }
    let init = {};
    if (id && list) {
      init = list && list.find(item => item.id === id);
    }
    // console.info('tool_edit_render', { id, list, init });
    const formFields = fields.map(field => {
      const renderFunctionName = `renderField_${field.name}`;
      let renderFunction = this[renderFunctionName];
      if (!renderFunction) {
        renderFunction = this[renderFunctionName] = this.renderFieldName(field.name);
      }
      const fieldError = getFieldError(field.name);
      let fieldValue = getFieldValue(field.name);
      let status;
      if (Array.isArray(getFieldValue(field.name)) && field.type === 'upload') {
        // fieldValue = get(getFieldValue(field.name)[0], 'url') || get(getFieldValue(field.name)[0], 'uid');
        // status = get(getFieldValue(field.name)[0], 'status');
        // console.info('render_fields_', { field, init, fieldValue, fieldError, status });
        fieldValue = get(getFieldValue(field.name)[0], 'status') || getFieldValue(field.name).length;
      }
      if (field.type === 'slider') {
        status = getFieldValue('platform');
      }
      if (field.name === 'position') {
        const cate_id = getFieldValue('cate_id');
        fieldValue = `${fieldValue || ''}_${cate_id || ''}`;
      }
      return renderFunction(field, init, fieldValue, fieldError, status);
    });
    const hideLoad = loading ? '' : ` ${styles['hide']}`;
    return (
      <>
        <Modal
          title={caption || formatMessage({ id: 'app.movie.template.add' })}
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

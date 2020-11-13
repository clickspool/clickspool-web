import { Button, DatePicker, Divider, Form, Icon, Input, Modal, Popconfirm, Select, Switch, Upload } from 'antd';
import BraftEditor from 'braft-editor';
import 'braft-editor/dist/index.css';
import { connect } from 'dva';
import get from 'lodash/get';
import isEqual from 'lodash/isEqual';
// tslint:disable-next-line:ordered-imports
import memoize from 'memoize-one';
import moment from 'moment';
import React, { PureComponent } from 'react';
//@ts-ignore
import { formatMessage } from 'umi/locale';
import { uploadMultiMedia } from './services/index';
const uuidv1 = require('uuid/v1');

@connect(({ material: { list } }) => ({ list }))
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
        xs: { span: 8 },
        sm: { span: 4 },
      },
      wrapperCol: {
        xs: { span: 16 },
        sm: { span: 20 },
      },
    },
    dateFormat: 'YYYY-MM-DD',
    fields: [
      {
        name: 'title',
        options: {
          rules: [{ required: true, message: formatMessage({ id: 'app.explore.daily.name.placeholder' }) }],
        },
        properties: {
          placeholder: formatMessage({ id: 'app.explore.daily.name.placeholder' }),
        },
        label: formatMessage({ id: 'app.explore.daily.name' }),
      },
      {
        name: 'show_date',
        options: {
          rules: [{ required: true, message: formatMessage({ id: 'app.explore.daily.time.placeholder' }) }],
        },
        properties: {
          placeholder: formatMessage({ id: 'app.explore.daily.time.placeholder' }),
        },
        label: formatMessage({ id: 'app.explore.daily.time' }),
        type: 'date',
      },
      {
        name: 'cover',
        placeholder: formatMessage({ id: 'app.face.tools.thumb_placeholder' }),
        options: {
          rules: [{ required: true, message: formatMessage({ id: 'app.face.tools.thumb_required' }) }],
        },
        type: 'upload',
        label: formatMessage({ id: 'app.face.tools.thumb' }),
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
    const { form: { validateFields, getFieldsValue, resetFields }, dispatch, close, id, list } = this.props;
    const record = list.find(item => item.id === id);
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
        if (value && value.date) {
          return params.append(key, value.format(this.state.dateFormat));
        }

        if (value.convertOptions) {
          return params.append(key, value.toHTML());
        }
        if (Array.isArray(value)) {
          let picList = [];
          const initPicList = record && record[key] ? record[key].split(',') : [];
          picList = value.map(item => {
            if (item.url) {
              return initPicList.find(pic => item.url.indexOf(pic) !== -1);
            }
            return item.response.path;
          })
          return params.append(key, picList.join(','));
        }
        params.append(key, value);
      });

      if (id) {
        params.append('id', id);
      }
      console.info('params__', { values, params, id });

      const result = id ? await dispatch({ payload: { params, id }, type: 'daily/patch' }) : await dispatch({ payload: params, type: 'daily/create' });
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
    // if (e && Array.isArray(e.fileList)) {
    //   return e.fileList.slice(-1);
    // }
    const files = e.fileList.map(file => {
      if (!file.url) {
        file.percent = 100;
      }
      return file;
    });
    return files;
  }
  renderFieldName = () => {
    const _this = this;
    return memoize((field, init, fieldValue, fieldError, status) => {
      const { form: { getFieldDecorator, getFieldValue }, id } = this.props;
      let { formItemLayout } = this.state;

      const { name, options, input_type, placeholder, label, type, properties = {} } = field;
      let input = <Input type={input_type} {...properties} />;
      let showPopConfirm = false;
      let hint = '';
      let { optionList } = field;
      if (typeof optionList === 'string') {
        optionList = this.props[optionList] || [];
      }

      if (name in init) {
        if (field.type === 'switch') {
          field.options.initialValue = !!+init[name];
        } else if (field.type === 'select') {
          field.options.initialValue = this.props[field.optionList][+init[name]];
        } else if (field.type === 'date') {
          field.options.initialValue = moment(init[name], this.state.dateFormat);
        } else if (field.type === 'richText') {
          field.options.initialValue = BraftEditor.createEditorState(init[name]);
        } else if (field.type === 'upload') {
          if (init[field.name]) {
            const picList = init[`remote_${field.name}s`] || init[`remote_${field.name}`];
            const pics = Array.isArray(picList) ? picList : [picList];
            field.options.initialValue = pics.map((pic) => {
              return {
                url: pic,
                name: init.bundle_name || name,
                uid: uuidv1(),
              }
            });
          }
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
      if (type === 'date') {
        input = <DatePicker {...properties} />;
      }
      if (type === 'richText') {
        input = (
          <BraftEditor
            className="my-editor"
            {...properties}
          />
        );
      }
      if (type === 'select') {
        const Option = Select.Option;
        const optionsEl = [...optionList].map((item, index) => {
          return <Option key={index} value={index}>{item}</Option>
        });
        input = (
          <Select {...properties}>
            {optionsEl}
          </Select>
        );
      }
      if (type === 'upload') {
        options.valuePropName = 'fileList';
        options.getValueFromEvent = this.normFile;
        properties.customRequest = ({ file, onSuccess, onProgress }) => {
          console.info('custom_request_', { file, onSuccess });
          const params = new FormData();
          params.append('multiMedia', file);
          uploadMultiMedia(params, {
            onUploadProgress: ({ total, loaded }) => {
              console.info('total__', { loaded, total });
              onProgress({ percent: Math.round(loaded / total * 100).toFixed(2) }, file);
            },
          }).then(({ data: response }) => {
            onSuccess(response, file);
          });
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
    const { visible, form: { getFieldError, getFieldValue }, caption, id, list, record = {} } = this.props;
    const { handleOk, handleCancel } = this;
    // editing with initial value
    // let init = {};
    // if (id && list) {
    //   init = list && list.find(item => item.id === id);
    // }
    const formFields = fields.map(field => {
      const renderFunctionName = `renderField_${field.name}`;
      let renderFunction = this[renderFunctionName];
      if (!renderFunction) {
        renderFunction = this[renderFunctionName] = this.renderFieldName();
      }
      const fieldError = getFieldError(field.name);
      let fieldValue = getFieldValue(field.name);
      let status;
      const value = getFieldValue(field.name);
      if (Array.isArray(value)) {
        status = value.map(item => {
          return item.status
        }).join('');
        fieldValue = get(getFieldValue(field.name)[0], 'status') || getFieldValue(field.name).length;
      }
      return renderFunction(field, record, fieldValue, fieldError, status);
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

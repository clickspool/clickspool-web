import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import Cropper from 'react-cropper';
import 'cropperjs/dist/cropper.css';
import {
  Icon,
  Input,
  Button,
  Modal,
  Form,
  Select,
  Spin,
  Upload,
  Switch,
  TimePicker,
  //  ,  Input, , Tag, Switch, Popconfirm, Divider, Modal 
} from 'antd';
import moment from 'moment';
import memoize from 'memoize-one';
import isEqual from 'lodash/isEqual';
import get from 'lodash/get';
const uuidv1 = require('uuid/v1');
//@ts-ignore
import { formatMessage } from 'umi/locale';
import classnames from 'classnames/bind';
import styles from './style.less';

const cx = classnames.bind(styles);
const { Option } = Select;

const AUTO_PUSH_START_DEFAULT = '08:00:00';
const AUTO_PUSH_END_DEFAULT = '23:59:59';
const AUTO_PUSH_INTERVAL = 3600;

@connect(({ groups: { groupTypes, tags } }) => ({ groupTypes, tags }))
//@ts-ignore
@Form.create()
export default class GroupEdit extends PureComponent<any, any> {
  cropper = React.createRef()
  state = {
    autoIntervalDisable: false,
    fields: [
      {
        name: 'name',
        options: {
          // rules: [{ required: true, message: formatMessage({ id: 'app.group.name_required' }) }],
        },
        properties: {
          placeholder: formatMessage({ id: 'app.group.name_placeholder' }),
        },
        label: formatMessage({ id: 'app.group.name' }),
      },
      {
        name: 'tag_ids',
        options: {
          rules: [
            // {
            //   required: true,
            //   message: formatMessage({ id: 'app.group.select_tag_required' })
            // }
          ],
        },
        properties: {
          placeholder: formatMessage({ id: 'app.group.select_tag_placeholder' }),
        },
        type: 'select',
        optionList: 'tags',
        label: formatMessage({ id: 'app.group.select_tag' }),
      },
      {
        name: 'create_user_id',
        options: {
          rules: [{ required: true, message: formatMessage({ id: 'app.group.user_id_required' }) }],
        },
        properties: {
          placeholder: formatMessage({ id: 'app.group.user_id_placeholder' }),
        },
        label: formatMessage({ id: 'app.group.user_id' }),
      },
      // {
      //   name: 'avatar',
      //   placeholder: formatMessage({ id: 'app.virtual.accounts.avatar_placeholder' }),
      //   options: {
      //     // rules: [
      //     //   {
      //     //     required: true,
      //     //     message: formatMessage({ id: 'app.virtual.accounts.avatar_required' })
      //     //   }
      //     // ],
      //     valuePropName: 'fileList',
      //   },
      //   properties: {
      //     listType: 'picture-card',
      //   },
      //   type: 'upload',
      //   label: formatMessage({ id: 'app.virtual.accounts.avatar' }),
      // },
      {
        name: 'group_type',
        options: {
          rules: [{ required: true, message: formatMessage({ id: 'app.group.list.group_type_required' }) }],
        },
        properties: {
          placeholder: formatMessage({ id: 'app.group.list.group_type' }),
        },
        type: 'select',
        optionList: 'groupTypes',
        label: formatMessage({ id: 'app.group.list.group_type' }),
      },
      {
        name: 'sort',
        options: {
        },
        properties: {
          placeholder: formatMessage({ id: 'app.group.sort' }),
        },
        input_type: 'number',
        label: formatMessage({ id: 'app.group.sort' }),
      },
      {
        name: 'auto_message',
        options: {
          valuePropName: 'checked',
          initialValue: false,
          rules: [],
        },
        type: 'switch',
        label: formatMessage({ id: 'app.group.list.auto_message' }),
      },
      {
        name: 'auto_push_start',
        options: {
          rules: [{ required: true, message: formatMessage({ id: 'app.group.push_required' }) }],
        },
        properties: {
          defaultOpenValue: moment('00:00:00', 'HH:mm:ss')
        },
        type: 'time_range',
        label: formatMessage({ id: 'app.group.push' }),
      },
      {
        name: 'auto_interval',
        options: {
          rules: [{ required: true, message: formatMessage({ id: 'app.group.auto_interval_required' }) }],
          initialValue: AUTO_PUSH_INTERVAL
        },
        properties: {
          placeholder: formatMessage({ id: 'app.group.auto_interval_placeholder' }),
        },
        input_type: 'number',
        label: formatMessage({ id: 'app.group.auto_interval' }),
      },
    ],
    formItemLayout: {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 6 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 15 },
      },
    }
  }
  // cropper = React.createRef();
  handleOk = () => {
    const { form: { validateFields, getFieldsValue, getFieldValue, resetFields }, dispatch, close, record } = this.props;
    validateFields(async errors => {
      const auto_message = getFieldValue('auto_message');
      console.info('handle_ok_validateFields', errors);
      if (errors) {
        console.info('auto_interval___', auto_message);
        if (!auto_message) {
          let errorList;
          Array.isArray(errors) && (errorList = errors.filter(error => {
            return ['auto_push_end', 'auto_push_start', 'auto_interval'].indexOf(error.field) === -1;
          }));
          if (errorList && errorList.length > 0) {
            return;
          }
        } else {
          return;
        }
      };
      const values = getFieldsValue();
      const params = new FormData();

      // values.status = values.status === true && 1 || 0;
      values.auto_message = values.auto_message === true && 1 || 0;
      Object.keys(values).forEach(key => {
        let value = values[key];
        if (value === undefined) {
          return;
        }
        // console.info('value==', { key, value });
        if (key === 'tag_ids' && Array.isArray(value)) {
          return params.append(key, value.join(','));
        }
        // if (typeof value === 'object' && value) {
        //   console.info('__debug_value__', value);
        //   if (Array.isArray(value) && value[0].url) {//已经有 url 的时候不更新字段
        //     return;
        //   }
        //   return params.append(key, value[0].originFileObj, value[0].name);
        // }
        if (value instanceof moment) {
          //@ts-ignore
          value = value.format('HH:mm:ss');
          return params.append(key, value);
        }
        params.append(key, value);
      });

      const result = record ? await dispatch({ payload: { params, id: record.id }, type: 'groups/patch' }) : await dispatch({ payload: params, type: 'groups/create' });
      if (result) {
        close();
        resetFields();
      }
    });
  }
  handleCancel = () => {
    const { close, form: { resetFields } } = this.props;
    close();
    resetFields();
  }
  normFile = e => {
    if (Array.isArray(e)) {
      return e;
    }
    if (e && Array.isArray(e.fileList)) {
      if (e.file.status === 'removed') {
        return [];
      }
      this.setState({ avatar: window.URL.createObjectURL(e.file.originFileObj) });
      return e.fileList.slice(-1);
    }
    return e && e.fileList;
  }
  preview = (file) => {
    // return console.info('preview_file', file);
    if (file.url) {
      return this.setState({ avatar: file.url });
    }
    this.setState({ avatar: window.URL.createObjectURL(file.originFileObj) });
  }
  crop = () => {
    const cropper = this.cropper.current as any;
    if (!cropper) {
      return;
    }
    const { form: { getFieldValue, setFieldsValue } } = this.props;
    let avatarFile = getFieldValue('avatar');
    if (Array.isArray(avatarFile)) {
      avatarFile = avatarFile[0];
    }
    const fileName = avatarFile.name;
    cropper.getCroppedCanvas().toBlob((blob) => {
      avatarFile.type = blob.type;
      avatarFile.size = blob.size;
      const file = new File([blob], fileName, { type: blob.type });
      avatarFile.originFileObj = file;
      avatarFile.thumbUrl = window.URL.createObjectURL(file);
      avatarFile.url = '';
      avatarFile.uid = uuidv1();
      avatarFile.status = 'new';
      setFieldsValue({
        avatar: [avatarFile]
      });
      this.setState({
        avatar: ''
      });
    });
  }
  cancelCrop = () => {
    this.setState({
      avatar: ''
    });
  }
  renderFieldName = () => {
    return (field, init: any = {}, fieldValue, fieldError, status, isDisabled) => {
      const { form: { getFieldDecorator, setFieldsValue, getFieldValue }, cates, id, list } = this.props;
      let { fields, formItemLayout } = this.state;

      if (field.name === 'multilingual' && init && init.dialects) {
        field.options.initialValue = JSON.parse(init.dialects);
      }
      if (init && field.name in init) {
        if (field.type === 'upload') {
          if (init[field.name]) {
            field.options.initialValue = [{
              url: init[field.name],
              name: `${init.nickname}.png`,
              uid: uuidv1(),
            }];
          }
        } else if (field.type === 'date') {
          field.options.initialValue = moment(init[field.name], 'YYYY-MM-DD');
        } else if (field.name === 'region') {
          field.options.initialValue = +init[field.name];
        } else {
          field.options.initialValue = init[field.name];
        }
      }

      const { name, options, input_type, placeholder, label, type, initialValue, properties = {} } = field;
      if (field.name === 'auto_interval' || field.name === 'auto_push_start') {
        properties.disabled = +getFieldValue('auto_message') === 0 ? true : false;
      }
      // if (field.name === 'auto_push_start' && !options.initialValue) {

      // }
      // if (field.name === 'auto_push_end' && !options.initialValue) {
      //   options.initialValue = moment('23:59:59', 'HH:mm:ss');
      // }
      if (field.name === 'auto_push_start') {
        const pushEndOptions = Object.assign({}, options);
        options.initialValue = moment(get(init, 'auto_push_start') || AUTO_PUSH_START_DEFAULT, 'HH:mm:ss');
        pushEndOptions.initialValue = moment(get(init, 'auto_push_end') || AUTO_PUSH_END_DEFAULT, 'HH:mm:ss');

        return (
          <Form.Item key={`${name}-wraper`} {...formItemLayout} label={label} required>
            <Form.Item key={name} style={{ display: 'inline-block', width: 'calc(50% - 15px)' }}>
              {getFieldDecorator(name, options)(<TimePicker {...properties} placeholder={formatMessage({ id: 'app.group.push.start' })} />)}
            </Form.Item>
            <span style={{ display: 'inline-block', width: '30px', textAlign: 'center' }}>-</span>
            <Form.Item key={`${name}-1`} style={{ display: 'inline-block', width: 'calc(50% - 15px)' }}>
              {getFieldDecorator('auto_push_end', pushEndOptions)(<TimePicker {...properties} placeholder={formatMessage({ id: 'app.group.push.end' })} />)}
            </Form.Item>
          </Form.Item>
        );
      }

      let input = <Input type={input_type} {...properties} />;
      let hint = '';
      let { optionList } = field;
      if (typeof optionList === 'string') {
        optionList = this.props[optionList] || [];
      }

      if (field.name in init) {
        if (field.type === 'switch') {
          field.options.initialValue = !!+init[field.name];
        } else {
          field.options.initialValue = init[field.name];
        }
      }
      if (type === 'switch') {
        if (field.name === 'auto_message') {
          properties.onChange = (checked, e) => {
            this.setState({
              autoIntervalDisable: !checked
            });
          }
        }
        input = <Switch {...properties} />;
      }

      if (type === 'textarea') {
        const { TextArea } = Input;
        input = <TextArea {...properties} />;
      }
      if (type === 'select') {
        const Option = Select.Option;
        const optionsEl = [...optionList].map(item => {
          return <Option key={item[0]} value={item[0]}>{item[1]}</Option>
        });
        input = (
          <Select {...properties}>
            {optionsEl}
          </Select>
        );
      }

      if (type === 'upload') {
        options.getValueFromEvent = this.normFile;
        properties.onPreview = this.preview;
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
          {getFieldDecorator(name, options)(input)}
        </Form.Item>
      );
    };
  }

  render() {
    const { account, visible, form: { getFieldDecorator, getFieldValue, getFieldError }, loading, record } = this.props;
    const { handleOk, handleCancel, renderFields, renderField, cropper } = this;
    const { fields = [], formItemLayout, avatar, autoIntervalDisable } = this.state;
    const caption = record ? formatMessage({ id: 'app.group.edit' }) : formatMessage({ id: 'app.group.add' });
    if (record && fields[0] && fields[0].name !== 'id') {
      fields.unshift({
        name: 'id',
        options: {
          // rules: [{ required: true, message: formatMessage({ id: 'app.group.name_required' }) }],
        },
        properties: {
          placeholder: formatMessage({ id: 'app.group.id' }),
          //@ts-ignore
          disabled: true,
        },
        label: formatMessage({ id: 'app.group.id' }),
      });
    }
    const formFields = fields.map(field => {
      const renderFunctionName = `renderField_${field.name}`;
      let renderFunction = this[renderFunctionName];
      if (!renderFunction) {
        renderFunction = this[renderFunctionName] = this.renderFieldName();
      }
      const fieldError = getFieldError(field.name);
      let fieldValue = getFieldValue(field.name);
      let status;
      // console.info('debug_modify_field', { field, record, fieldValue, name: field.name });
      if (field.name === 'tag_ids' && Array.isArray(fieldValue)) {
        fieldValue = fieldValue.join(',');
      } else if (Array.isArray(getFieldValue(field.name))) {
        // fieldValue = get(getFieldValue(field.name)[0], 'url') || get(getFieldValue(field.name)[0], 'uid');
        // status = get(getFieldValue(field.name)[0], 'status');
        fieldValue = get(getFieldValue(field.name)[0], 'status');//rerender when status changed
      }
      return renderFunction(field, record, fieldValue, fieldError, status, autoIntervalDisable);
    });
    return (
      <Fragment>
        <Modal
          title={caption}
          visible={visible}
          onOk={handleOk}
          onCancel={handleCancel}
        >
          <Form autoComplete='off'>
            {formFields}
          </Form>
        </Modal>
        <Modal
          title={formatMessage({ id: 'app.virtual.accounts.avatar_edit' })}
          onOk={this.crop}
          onCancel={this.cancelCrop}
          visible={!!avatar}
        // className={cx({ hide: !avatar })}
        >
          <Cropper
            ref={this.cropper}
            src={avatar}
            style={{ height: 400, width: '100%' }}
            // Cropper.js options
            aspectRatio={1}
            guides={true}
          />
        </Modal>
        <div className={cx('loading', { hide: !loading })}>
          <Spin size='large' />
        </div>
      </Fragment>
    );
  }
}

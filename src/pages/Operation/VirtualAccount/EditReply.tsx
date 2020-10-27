import { connect } from 'dva';
import React, { PureComponent } from 'react';
import { Modal, Form, Input, Switch, Popconfirm, Tabs, TimePicker, Upload, Button, Icon, Select, Row, Col } from 'antd';
import moment from 'moment';
//@ts-ignore
import { formatMessage } from 'umi/locale';
import memoize from 'memoize-one';
import isEqual from 'lodash/isEqual';
import pick from 'lodash/pick';
import Uploader from '@/components/Uploader/index';

const { TabPane } = Tabs;
const { Option } = Select;
const keys = {
  hint: formatMessage({ id: 'app.virtual.reply.rule.timeunit.hint' }),
  day: formatMessage({ id: 'app.virtual.reply.rule.timeunit.day' }),
  hour: formatMessage({ id: 'app.virtual.reply.rule.timeunit.hour' }),
  minute: formatMessage({ id: 'app.virtual.reply.rule.timeunit.minute' }),
  second: formatMessage({ id: 'app.virtual.reply.rule.timeunit.second' }),
};
enum TabKey { media, text, makefriend, reward, video };
const timeUnit = new Map([[keys.hint, 0], [keys.day, 60 * 60 * 24], [keys.hour, 60 * 60], [keys.minute, 60], [keys.second, 1]]);

@connect(({ robotTemplate: { list, sendTypes, ruleTypes, autoSendToolInfo, gifts } }) => ({ list, sendTypes, ruleTypes, autoSendToolInfo, gifts }))
//@ts-ignore
@Form.create()
export default class EditTemplate extends PureComponent<any, any> {
  constructor(props) {
    super(props);
  }
  state = {
    visible: false,
    currentTabKey: null,
    defaultTabKey: TabKey[0],
    uploadInfo: {
      path: ''
    },
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
    unit: keys.minute,
    filters: {},
    fields: [
      {
        name: 'title',
        placeholder: formatMessage({ id: 'app.message.template.name_placeholder' }),
        options: {
          rules: [{ required: true, message: formatMessage({ id: 'app.scene.category.name_required' }) }],
        },
        label: formatMessage({ id: 'app.message.template.name' }),
      },
      {
        name: 'robot_id',
        placeholder: formatMessage({ id: 'app.virtual.reply.account.placeholder' }),
        options: {
          rules: [{ required: true, message: formatMessage({ id: 'app.virtual.reply.account.required' }) }],
        },
        label: formatMessage({ id: 'app.virtual.reply.account' }),
      },
      {
        name: 'content',
        placeholder: formatMessage({ id: 'app.message.template.content_placeholder' }),
        options: {
          rules: [{ required: true, message: formatMessage({ id: 'app.virtual.reply.type.text_required' }) }],
        },
        properties: {
          autoSize: true,
        },
        type: 'textarea',
        label: formatMessage({ id: 'app.message.template.content' }),
      },
      {
        name: 'rule_type',
        placeholder: formatMessage({ id: 'app.virtual.reply.rule.type.placeholder' }),
        options: {
          rules: [{ required: true, message: formatMessage({ id: 'app.virtual.reply.rule.type.placeholder' }) }],
        },
        type: 'select',
        label: formatMessage({ id: 'app.virtual.reply.rule.type' }),
        optionList: 'ruleTypes',
      },
      {
        name: 'rule_message_count',
        placeholder: formatMessage({ id: 'app.virtual.reply.rule_message_count.placeholder' }),
        options: {
          rules: [{ required: true, message: formatMessage({ id: 'app.virtual.reply.rule_message_count.placeholder' }) }],
        },
        properties: {
          min: 1,
        },
        input_type: 'number',
        label: formatMessage({ id: 'app.virtual.reply.rule_message_count' }),
      },
      {
        name: 'rule_message_interval',
        placeholder: formatMessage({ id: 'app.virtual.reply.rule_message_interval.placeholder' }),
        options: {
          rules: [{ required: true, message: formatMessage({ id: 'app.virtual.reply.rule_message_interval.placeholder' }) }],
        },
        properties: {
          min: 0,
        },
        input_type: 'number',
        label: formatMessage({ id: 'app.virtual.reply.rule_message_interval' }),
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
        name: 'rule_type',
        placeholder: formatMessage({ id: 'app.virtual.reply.rule.type.placeholder' }),
        options: {
          rules: [{ required: true, message: formatMessage({ id: 'app.virtual.reply.rule.type.placeholder' }) }],
        },
        type: 'select',
        label: formatMessage({ id: 'app.virtual.reply.rule.type' }),
        optionList: 'ruleTypes',
      },
      {
        name: 'gift_id',
        placeholder: formatMessage({ id: 'app.virtual.reply.media.reward' }),
        options: {
          rules: [{ required: true, message: formatMessage({ id: 'app.virtual.reply.media.reward' }) }],
        },
        type: 'select',
        label: formatMessage({ id: 'app.virtual.reply.value.reward' }),
        optionList: 'gifts',
      },
      {
        name: 'text_price',
        placeholder: formatMessage({ id: 'app.virtual.reply.text_price.placeholder' }),
        options: {
        },
        properties: {
        },
        input_type: 'number',
        label: formatMessage({ id: 'app.virtual.reply.text_price' }),
      },
      {
        name: 'voice_price',
        placeholder: formatMessage({ id: 'app.virtual.reply.voice_price.placeholder' }),
        options: {
        },
        properties: {
        },
        input_type: 'number',
        label: formatMessage({ id: 'app.virtual.reply.voice_price' }),
      },
      {
        name: 'video_price',
        placeholder: formatMessage({ id: 'app.virtual.reply.video_price.placeholder' }),
        options: {
        },
        properties: {
        },
        input_type: 'number',
        label: formatMessage({ id: 'app.virtual.reply.video_price' }),
      },
      {
        name: 'send_timing',
        options: {
        },
        properties: {
        },
        type: 'timepicker',
        label: formatMessage({ id: 'app.virtual.reply.send_timing' }),
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
    const { form: { validateFields, getFieldsValue }, dispatch, close, id, sendTypes, record } = this.props;
    const { currentTabKey, defaultTabKey, uploadInfo } = this.state;
    const tabkey = currentTabKey || defaultTabKey;
    let ignoreContent = tabkey !== 'text' && tabkey !== 'makefriend';
    validateFields(async errors => {
      console.info('valid_errors_', { errors, tabkey, ignoreContent });
      if (ignoreContent && errors && errors.content) {
        delete errors.content;
      }
      if (errors && errors.gift_id && errors.tabkey !== 'gift') {
        delete errors.gift_id;
      }
      if (errors && errors.upload && (
        tabkey !== 'media'
        || (tabkey === 'media' && record && record.url && [2, 4].indexOf(+record.message_type) !== -1)
      )) {
        delete errors.upload;
      }
      if (errors && errors.uploadVideo && (
        tabkey !== 'video'
        || (tabkey === 'video' && record && record.url && +record.message_type === 6)
      )) {
        delete errors.uploadVideo;
      }
      if (errors && Object.keys(errors).length > 0) return;
      let values = getFieldsValue();
      const params = new FormData();
      params.append('send_type', sendTypes.get(tabkey)||'1');
      if (!ignoreContent) {
        params.append('message_type', '0');
      } else if (tabkey === 'reward') {//TODO
        // params.append('award', '1');
        params.append('message_type', '5');
      } else {
        const upload = uploadInfo && uploadInfo.path ? uploadInfo : record;
        console.info('handleOk_upload_', upload);
        Object.assign(values, pick(upload, ['message_type', 'thumb_base64', 'size', 'duration', 'weight_high']));
        if (tabkey === 'video') {
          values.message_type = 6;
        }
        values.url = upload.path || upload.url;
        delete values.upload;
      }
      values.status = values.status === true && 1 || 0;
      Object.keys(values).forEach(key => {
        let value = values[key];
        if (value === undefined) {
          return;
        }
        if (key === 'content' && ignoreContent) {
          return;
        }
        if (key === 'rule_message_interval') {
          const { unit } = this.state;
          return params.append(key, `${value * timeUnit.get(unit)}`);
        }
        if (value && value.format) {
          return params.append(key, value.format('HH:mm:ss'));
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
      const result = id ? await dispatch({ payload: { params, id }, type: 'robotTemplate/patch' }) : await dispatch({ payload: params, type: 'robotTemplate/create' });
      if (result) {
        close();
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
  changeUnit = (e) => {
    const { unit } = this.state;
    const { form: { setFieldsValue, getFieldValue } } = this.props;
    const value = getFieldValue('rule_message_interval');
    let matchUnit;
    [...timeUnit].map(item => {
      if (item[1] === e) {
        matchUnit = item[0];
      }
    });
    this.setState({ unit: matchUnit });
    value > 0 && setFieldsValue({ rule_message_interval: value * timeUnit.get(unit) / timeUnit.get(matchUnit) });
  }
  initInterval = () => {
    const { form: { setFieldsValue, getFieldValue } } = this.props;
    let showValue = getFieldValue('rule_message_interval');
    let max = 0;

    [...timeUnit].map(item => {
      if (max >= 1) { return }
      const [caption, count] = item;
      if (count && showValue % count === 0) {
        this.setState({ unit: caption });
        max = showValue / count;
        setFieldsValue({ rule_message_interval: showValue / count });
      }
    });
  }
  renderInterval = () => {
    const { formItemLayout, fields, unit } = this.state;
    const field = fields[5];
    const { name, options, input_type, placeholder, label, properties = {} } = field;

    let unitAfter = (
      <Select onChange={this.changeUnit} defaultValue={unit} style={{ width: '8em' }}>
        {[...timeUnit].map((item, index) => {
          return (<Option key={item[1]} disabled={index === 0} value={item[1]}>{item[0]}</Option>);
        })}
      </Select>
    );
    //@ts-ignore
    properties.addonAfter = unitAfter;
    let input = <Input type={input_type} {...properties} placeholder={placeholder} />;

    const { form: { getFieldDecorator } } = this.props;
    return (
      <Form.Item key={name} {...formItemLayout} label={label}>
        {getFieldDecorator(name, options)(input)}
      </Form.Item>
    );
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
  setCurrentTabKey = (activeKey) => {
    this.setState({
      currentTabKey: activeKey
    });
  };
  setDefaultTabKey = memoize((message_type, send_type) => {
    const { sendTypes } = this.props;
    if (+send_type === +sendTypes.get('makefriend')) {
      return this.setState({
        defaultTabKey: 'makefriend'
      });
    }
    if (message_type == 0) {
      return this.setState({
        defaultTabKey: 'text'
      });
    }
    if (message_type == 5) {
      return this.setState({
        defaultTabKey: 'reward'
      });
    }
    if (message_type == 6) {
      return this.setState({
        defaultTabKey: 'video'
      });
    }
    this.setState({
      defaultTabKey: 'media'
    });
  });
  componentDidMount = () => {
    const { record, form: { setFieldsValue } } = this.props;
    if (!record) {
      return;
    }
    const { message_type, send_type } = record;
    this.setDefaultTabKey(message_type, send_type);
    this.initInterval();
  }
  componentWillMount = () => {
    const { form: { resetFields } } = this.props;
    resetFields();
  }

  render() {
    const { visible: isVisible, fields, formItemLayout } = this.state;
    const { visible, form: { getFieldError, getFieldValue, getFieldDecorator, setFieldsValue }, caption, id, list, record = {}, autoSendToolInfo: { name: toolName, icon, price } } = this.props;
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
    const tabkey = this.state.currentTabKey || this.state.defaultTabKey;
    let uploaderDefaultProps;
    let uploaderVideoDefaultProps;
    if (record) {
      if (record.message_type == 6) {
        uploaderVideoDefaultProps = pick(record, ['size', 'duration', 'message_type', 'weight_high']);
        uploaderVideoDefaultProps.message_type = record.message_type == 6 ? 2 : record.message_type;
        uploaderVideoDefaultProps.url = record.remote_url;
      } else {
        uploaderDefaultProps = pick(record, ['size', 'duration', 'message_type', 'weight_high']);
        uploaderDefaultProps.url = record.remote_url;
      }
    }

    return (
      <Modal
        title={caption}
        visible={isVisible || visible}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <style>
          {
            `
             ._label_{
              text-align:right;
              color:rgba(0, 0, 0, 0.85);
              font-size:14px;
              padding-right:4px;
              margin-top:10px;
             }
             ._detail_{
              color:rgba(0, 0, 0, 0.85);
              font-size:14px;
              margin-top:10px;
              font-weight:bold
             }
            `
          }</style>
        <Form autoComplete='off'>
          {formFields[0]}
          {formFields[1]}
          <h4>{formatMessage({ id: 'app.virtual.reply.type.title' })}</h4>
          <Tabs onChange={this.setCurrentTabKey} defaultActiveKey={this.state.defaultTabKey}>
            <TabPane tab={formatMessage({ id: 'app.virtual.reply.type.media' })} key={TabKey[0]}>
              <Form.Item key={name} required {...formItemLayout} label={formatMessage({ id: 'app.virtual.reply.type.media' })}>
                {/* {getFieldDecorator(name, options)(input)} */}
                {tabkey === TabKey[0] && getFieldDecorator(
                  'upload',
                  {
                    rules: [{ required: true, message: formatMessage({ id: 'app.virtual.reply.media.required' }) }],
                  }
                )(<Uploader {...uploaderDefaultProps} callback={(uploadInfo, flag) => { this.uploaded({ uploadInfo, flag, name: 'upload' }) }} />)}
              </Form.Item>
            </TabPane>
            <TabPane forceRender tab={formatMessage({ id: 'app.virtual.reply.type.text' })} key={TabKey[1]}>
              {tabkey !== TabKey[2] && formFields[2]}
            </TabPane>
            <TabPane tab={formatMessage({ id: 'app.virtual.reply.type.makefriend' })} key={TabKey[2]}>
              {tabkey === TabKey[2] && formFields[2]}
            </TabPane>
            <TabPane tab={formatMessage({ id: 'app.virtual.reply.type.reward' })} key={TabKey[3]}>
              {formFields[8]}
            </TabPane>
            <TabPane tab={formatMessage({ id: 'app.virtual.reply.type.video' })} key={TabKey[4]}>
              <Form.Item key={name} required {...formItemLayout} label={formatMessage({ id: 'app.virtual.reply.type.video' })}>
                {/* {getFieldDecorator(name, options)(input)} */}
                {tabkey === TabKey[4] && getFieldDecorator(
                  'uploadVideo',
                  {
                    rules: [{ required: true, message: formatMessage({ id: 'app.virtual.reply.media.required' }) }],
                  }
                )(<Uploader {...uploaderVideoDefaultProps} callback={(uploadInfo, flag) => { this.uploaded({ uploadInfo, flag, name: 'uploadVideo' }) }} />)}
              </Form.Item>
            </TabPane>
          </Tabs>
          <h4>{formatMessage({ id: 'app.virtual.reply.rule.title' })}</h4>
          {formFields[3]}
          {/* {formFields[3]} */}
          {formFields[4]}
          {this.renderInterval()}
          {formFields[6]}
          {formFields[9]}
          {formFields[10]}
          {formFields[11]}
          {formFields[12]}
        </Form>
      </Modal>
    );
  }
}

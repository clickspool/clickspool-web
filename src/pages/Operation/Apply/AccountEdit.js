import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import Cropper from 'react-cropper';
import 'cropperjs/dist/cropper.css';
import {
  Breadcrumb,
  Icon,
  Input,
  Button,
  Modal,
  Form,
  Select,
  DatePicker,
  Spin,
  Upload,
  Card,
  Row,
  Col,
  Switch,
  message
  //  ,  Input, , Tag, Switch, Popconfirm, Divider, Modal 
} from 'antd';
import moment from 'moment';
import memoize from 'memoize-one';
import isEqual from 'lodash/isEqual';
import get from 'lodash/get';
const uuidv1 = require('uuid/v1');
import { formatMessage } from 'umi/locale';
import classnames from 'classnames/bind';
import styles from './AccountEdit.less';
import UploaderWrap from '@/components/UploadWrap/index';
import AudioCom from './AudioCom';
import CalcAudio from './CalcAudio';
import { recommendModify } from './services/apply';

const cx = classnames.bind(styles);
const { Option } = Select;

@connect(({ apply: {
  chatTagsMap } }) => ({
    chatTagsMap
  }))
@Form.create()
export default class AccountEdit extends React.Component {
  constructor(props) {
    super(props);
    this.cropper = React.createRef();
  }
  state = {

    formItemLayout: {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 5 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 },
      },
    },
    matterList: new Map(),
    audio: [],
    tag_id: '',
  }
  // cropper = React.createRef();
  handleOk = () => {
    const { form: { validateFields, getFieldsValue, getFieldValue, resetFields }, dispatch, close, record } = this.props;
    const { audio, score } = this.state
    recommendModify({ ...record, chat_tags: JSON.stringify(audio)=="[{}]"?"[]":JSON.stringify(audio), recommend_score: score })
      .then(() => {
        close();
      })
    return

    validateFields(async errors => {
      if (errors) return;
      const values = getFieldsValue();
      const params = new FormData();
      if (values.recommend_auth && !(values.user_tags || []).length) {
        // message.warn('请选择推荐标签', 2);
        // return
      }
      // values.status = values.status === true && 1 || 0;
      Object.keys(values).forEach(key => {
        let value = values[key];
        if (value === undefined) {
          return;
        }
        if (key == 'user_interests' || key == 'user_tags') {
          return params.append(key, Array.isArray(value) ? value.join(',') : value);
        }
        // console.info('value==', { key, value });
        if (key === 'birthday') {
          return params.append(key, (value instanceof Object) ? value.format('YYYY-MM-DD') : value);
        }
        if (key === 'multitalingual') {
          return params.append(key, value.join(','));
        }
        if (typeof value === 'object' && value) {
          if (Array.isArray(value) && value[0].url) {//已经有 url 的时候不更新字段
            return;
          }
          return params.append(key, value[0].originFileObj, value[0].name);
        }
        if (key === 'recommend_auth') {
          return params.append(key, +value);
        }
        params.append(key, value);
      });
      if (matterList.size) {
        params.append('background', JSON.stringify([...matterList.values()]));
      }
      params.append('chat_tags', JSON.stringify([this.state.audio]));
      if (record) {
        params.append('user_id', record.id);
      }
      console.info('params__', { values, params, record });
      recommendModify()
      // const result = record ? await dispatch({ payload: { params, id: record.id }, type: 'accounts/patch' }) : await dispatch({ payload: params, type: 'accounts/create' });
      if (result) {
        close();
        resetFields();
      }
    });
  }
  handleCancel = () => {
    const { close } = this.props;
    close();
    // resetFields();
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
    const cropper = this.cropper.current;
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
      console.info('avatarFile__', { avatarFile, fileName, blobType: blob.type, blob });
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
    const _this = this;
    return memoize((field, init = {}, fieldValue, fieldError, status) => {
      const { form: { getFieldDecorator, setFieldsValue }, cates, id, list } = this.props;
      let { fields, formItemLayout } = this.state;

      // console.info('init__', { init, field });
      if (field.name == 'user_interests' && init && init.user_interests) {
        field.options.initialValue = (init.user_interests).split(',').map((item) => { return +item })
      }
      if (field.name == 'user_tags' && init && init.user_tags) {
        field.options.initialValue = (init.user_tags).split(',').map((item) => { return +item })
      }
      if (init && field.name in init && field.name != 'user_interests' && field.name != 'user_tags') {
        if (field.type === 'upload') {
          if (init[field.name]) {
            field.options.initialValue = [{
              url: init[field.name],
              name: `${init.nickname}.png`,
              uid: uuidv1(),
            }];
          }
        } else if (field.type === 'date') {
          field.options.initialValue = moment(init[field.name], 'DD/MM/YYYY');
        } else if (field.name === 'nation') {
          field.options.initialValue = +init[field.name];
        } else {
          field.options.initialValue = init[field.name];
        }
      }

      const { name, options, input_type, placeholder, label, type, initialValue, properties = {} } = field;
      let input = <Input type={input_type} {...properties} />;
      let showPopConfirm = false;
      let hint = '';
      let { optionList } = field;
      if (typeof optionList === 'string') {
        optionList = this.props[optionList] || [];
      }
      if (type === 'textarea') {
        const { TextArea } = Input;
        input = <TextArea {...properties} />;
      }
      if (type === 'date') {
        input = (
          <DatePicker className={cx('date')} disabledDate={(date) => {
            return date >= new Date();
          }} />
        );
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
    }, isEqual);
  }
  getMediaMatter = (matter) => {
    this.setState(({ matterList }) => {
      matterList.set(+new Date(), matter)
      return { matterList }
    })
  }
  getMediaMatterAudio = (matter) => {
    console.log(matter, 'matter')
    this.setState(({ audio }) => {
      return { audio: [{ ...audio[0], ...matter }] }
    })
  }
  componentDidMount() {
    const { record } = this.props;
    if (record && record.chat_tags) {
      var p = JSON.parse(record.chat_tags).length?JSON.parse(record.chat_tags):[{}];
      this.setState({
        audio: p,
        tag_id:p[0].tag_id
      })
      // const backgroundList = JSON.parse(record.background);
      // let matterList = new Map();
      // backgroundList.map((item, index) => {
      //   matterList.set(index, item)
      // })
      // this.setState({
      //   matterList
      // })
    }
    if (record && record.recommend_score) {
      this.setState({
        score: record.recommend_score
      })
    }
  }



  render() {
    const { account, visible, form: { getFieldDecorator, getFieldValue, getFieldError }, loading, record, chatTagsMap } = this.props;
    const { handleOk, handleCancel, renderFields, renderField } = this;
    const { fields = [], formItemLayout, avatar, matterList } = this.state;
    const caption = record ? formatMessage({ id: 'app.virtual.accounts.edit' }) : formatMessage({ id: 'app.virtual.accounts.add' });
    // const formFields = renderFields(fields);
    const formFields = fields.map(field => {
      const renderFunctionName = `renderField_${field.name}`;
      let renderFunction = this[renderFunctionName];
      if (!renderFunction) {
        renderFunction = this[renderFunctionName] = this.renderFieldName(field.name);
      }
      const fieldError = getFieldError(field.name);
      let fieldValue = getFieldValue(field.name);
      let status;
      if (field.name === 'user_interests' || field.name === 'user_tags') {
        // fieldValue = fieldValue.join(',');
      } else if (Array.isArray(getFieldValue(field.name))) {
        // fieldValue = get(getFieldValue(field.name)[0], 'url') || get(getFieldValue(field.name)[0], 'uid');
        // status = get(getFieldValue(field.name)[0], 'status');
        fieldValue = get(getFieldValue(field.name)[0], 'status');//rerender when status changed
      }
      return renderFunction(field, record, fieldValue, fieldError, status);
    });
    const gridStyle = {
      width: '25%',
      textAlign: 'center',
      boxShadow: 'none',
      padding: '5px'
    };
    return (
      <Fragment>
        <Modal
          title={caption}
          visible={true}
          onOk={() => { handleOk() }}
          onCancel={() => { handleCancel() }}
        >
          <Row >
            <Col span={5}>
              <p className={cx('lab')}>
                {'场景化标签'}:
              </p>
            </Col>
            <Col span={19}>
              <Select
                style={{ width: 200 }}
                placeholder="请选择场景化标签"
                {...this.state.tag_id ? { value: this.state.tag_id } : {}}
                onChange={(tag_id) => {
                  this.setState(({ audio }) => {
                    return { tag_id, audio: [{ ...audio[0], tag_id }] }
                  })
                }}
              >
                {!!chatTagsMap &&
                  chatTagsMap.map((item, index) => (
                    <Option value={item.id} key={index}>{item.name}</Option>
                  ))
                }
              </Select>
            </Col>
          </Row>
          <Row >
            <Col span={5}>
              <p className={cx('lab')}>
                {'上传音频'}:
              </p>
            </Col>
            <Col span={19}>
              <Card bordered={false}>
                {(!!this.state.audio.length && Object.keys(this.state.audio[0]).length > 1) && <Card.Grid style={gridStyle}><AudioCom  {...this.state.audio[0]} /></Card.Grid>}
                <Card.Grid style={gridStyle}><UploaderWrap callback={this.getMediaMatterAudio} /></Card.Grid>
              </Card>
            </Col>
          </Row>
          <Row>
            <Col span={5}>
              <p className={cx('lab')}>
                {formatMessage({ id: 'app.apply.pass.label' })}:
              </p>
            </Col>
            <Col span={19}>
              <Select
                style={{ width: 200 }}
                placeholder={formatMessage({ id: 'app.apply.pass.placeholder' })}
                {...this.state.score ? { value: this.state.score } : {}}
                onChange={(score) => {
                  this.setState({ score })
                }}
              >
                {[...new Array(10)].map((item, idx) => {
                  return <Option key={idx} value={idx}>{idx}</Option>
                })}
              </Select>
            </Col>
          </Row>
        </Modal>
      </Fragment>
    );
  }
}

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
import  UploaderWrap from '@/components/UploadWrap/index';

const cx = classnames.bind(styles);
const { Option } = Select;

@connect(({ accounts: { loading, genders, user_interests, nation, videoMap,
  messageMap,
  voiceMap,
  tagsMap }}) => ({ loading, genders, user_interests, nation, videoMap,
    messageMap,
    voiceMap,
    tagsMap }))
@Form.create()
export default class AccountEdit extends React.Component {
  constructor(props) {
    super(props);
    this.cropper = React.createRef();
  }
  state = {
    fields: [
      {
        name: 'nickname',
        options: {
          rules: [{ required: true, message: formatMessage({ id: 'app.virtual.accounts.name_required' }) }, { max: 20, message: formatMessage({ id: 'app.virtual.accounts.name_verify' }) }],
        },
        properties: {
          placeholder: formatMessage({ id: 'app.virtual.accounts.name_placeholder' }),
        },
        label: formatMessage({ id: 'app.settings.basic.nickname' }),
      },
      {
        name: 'login_account',
        options: {
          rules: [
            {
              required: true,
              message: formatMessage({ id: 'app.user_.username' })
            }
          ],
        },
        properties: {
          placeholder: formatMessage({ id: 'app.user_.username' }),
        },
        label: formatMessage({ id: 'app.user_.username' }),
      },
      {
        name: 'sex',
        options: {
          rules: [
            {
              required: true,
              message: formatMessage({ id: 'app.virtual.accounts.gender_required' })
            }
          ],
        },
        properties: {
          placeholder: formatMessage({ id: 'app.virtual.accounts.gender_placeholder' }),
        },
        type: 'select',
        optionList: 'genders',
        label: formatMessage({ id: 'app.virtual.accounts.gender' }),
      },
      
      {
        name: 'birthday',
        placeholder: formatMessage({ id: 'app.virtual.accounts.birthday_placeholder' }),
        options: {
          rules: [
            {
              required: true,
              message: formatMessage({ id: 'app.virtual.accounts.birthday_required' })
            }
          ],
        },
        type: 'date',
        label: formatMessage({ id: 'app.virtual.accounts.birthday' }),
      },
      {
        name: 'text_price',
        options: {
          // rules: [
          //   {
          //     required: true,
          //     message: formatMessage({ id: 'app.virtual.recommend.text_price' })
          //   }
          // ],
        },
        properties: {
          placeholder: formatMessage({ id: 'app.virtual.recommend.text_price' }),
        },
        type: 'select',
        optionList: 'messageMap',
        label: formatMessage({ id: 'app.virtual.recommend.text_price' }),
      },
      {
        name: 'video_price',
        options: {
          // rules: [
          //   {
          //     required: true,
          //     message: formatMessage({ id: 'app.virtual.recommend.video_price' })
          //   }
          // ],
        },
        properties: {
          placeholder: formatMessage({ id: 'app.virtual.recommend.video_price' }),
        },
        type: 'select',
        optionList: 'videoMap',
        label: formatMessage({ id: 'app.virtual.recommend.video_price' }),
      },
      {
        name: 'voice_price',
        options: {
        //   rules: [
        //     {
        //       required: true,
        //       message: formatMessage({ id: 'app.virtual.recommend.voice_price' })
        //     }
        //   ],
        },
        properties: {
          placeholder: formatMessage({ id: 'app.virtual.recommend.voice_price' }),
        },
        type: 'select',
        optionList: 'voiceMap',
        label: formatMessage({ id: 'app.virtual.recommend.voice_price' }),
      },
      {
        name: 'user_tags',
        options: {
          // rules: [
          //   {
          //     required: true,
          //     message: formatMessage({ id: 'app.virtual.recommend.tags' })
          //   }
          // ],
        },
        properties: {
          mode: 'multiple',
          placeholder: formatMessage({ id: 'app.virtual.recommend.tags' }),
        },
        type: 'select',
        optionList: 'tagsMap',
        label: formatMessage({ id: 'app.virtual.recommend.tags' }),
      },
      {
        name: 'user_interests',
        options: {
          rules: [
            {
              required: true,
              message: formatMessage({ id: 'app.virtual.accounts.tag_required' })
            }
          ],
        },
        properties: {
          mode: 'multiple',
          placeholder: formatMessage({ id: 'app.virtual.accounts.tag_placeholder' }),
          onChange:(val)=>{console.log(val,'val,....')}
        },
        type: 'select',
        optionList: 'user_interests',
        label: formatMessage({ id: 'app.virtual.accounts.tag' }),
      },
      {
        name: 'nation',
        options: {
          rules: [
            {
              required: true,
              message: formatMessage({ id: 'app.virtual.accounts.country_required' })
            }
          ],
        },
        properties: {
          placeholder: formatMessage({ id: 'app.virtual.accounts.country_placeholder' }),
        },
        type: 'select',
        optionList: 'nation',
        label: formatMessage({ id: 'app.virtual.accounts.country' }),
      },
      {
        name: 'profile',
        options: {
          rules: [
            {
              required: true,
              message: formatMessage({ id: 'app.virtual.accounts.brief_required' })
            },
            {
              max: 100,
              message: formatMessage({ id: 'app.scene.tools.name_verify' })
            }
          ],
        },
        properties: {
          placeholder: formatMessage({ id: 'app.virtual.accounts.brief_placeholder' }),
        },
        type: 'textarea',
        label: formatMessage({ id: 'app.virtual.accounts.brief' }),
      },
      {
        name: 'avatar',
        placeholder: formatMessage({ id: 'app.virtual.accounts.avatar_placeholder' }),
        options: {
          rules: [
            {
              required: true,
              message: formatMessage({ id: 'app.virtual.accounts.avatar_required' })
            }
          ],
          valuePropName: 'fileList',
          getValueFromEvent: this.normFile,
        },
        properties: {
          listType: 'picture-card',
        },
        type: 'upload',
        label: formatMessage({ id: 'app.virtual.accounts.avatar' }),
      },
      
      {
        name: 'longitude',
        properties: {
          placeholder: formatMessage({ id: 'app.virtual.accounts.longitude_placeholder' }),
          type: 'number'
        },
        label: formatMessage({ id: 'app.virtual.accounts.longitude' }),
      },
      {
        name: 'latitude',
        properties: {
          placeholder: formatMessage({ id: 'app.virtual.accounts.latitude_placeholder' }),
          type: 'number'
        },
        label: formatMessage({ id: 'app.virtual.accounts.latitude' }),
      },
    ],
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
    matterList:new Map(),
  }
  // cropper = React.createRef();
  handleOk = () => {
    const { form: { validateFields, getFieldsValue, getFieldValue, resetFields }, dispatch, close, record } = this.props;
    const {matterList} = this.state
    validateFields(async errors => {
      if (errors) return;
      const values = getFieldsValue();
      const params = new FormData();
      if(values.recommend_auth&&!(values.user_tags||[]).length){
          // message.warn('请选择推荐标签', 2);
          // return
      }
      // values.status = values.status === true && 1 || 0;
      Object.keys(values).forEach(key => {
        let value = values[key];
        if (value === undefined) {
          return;
        }
        if(key =='user_interests'|| key =='user_tags'){
          return params.append(key, Array.isArray(value)?value.join(','):value);
        }
        // console.info('value==', { key, value });
        if (key === 'birthday') {
          return params.append(key,(value instanceof Object)?value.format('YYYY-MM-DD'):value);
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
      if(matterList.size){
        params.append('background',JSON.stringify([...matterList.values()]));
      }

      if (record) {
        params.append('user_id', record.id);
      }
      console.info('params__', { values, params, record });
      const result = record ? await dispatch({ payload: { params, id: record.id }, type: 'accounts/patch' }) : await dispatch({ payload: params, type: 'accounts/create' });
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
        field.options.initialValue = (init.user_interests).split(',').map((item)=>{return +item})
      }
      if (field.name == 'user_tags' && init && init.user_tags) {
        field.options.initialValue = (init.user_tags).split(',').map((item)=>{return +item})
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
  getMediaMatter=(matter)=>{
   this.setState(({matterList})=>{
    matterList.set(+new Date(),matter)
    return {matterList}
   })
  }
  componentDidMount(){
    const  { record } = this.props;
    if(record&&record.background){
      const backgroundList = JSON.parse(record.background);
      let matterList = new Map();
      backgroundList.map((item,index)=>{
        matterList.set(index,item)
      })
      this.setState({
        matterList
      })
    }
  }

  render() {
    const { account, visible, form: { getFieldDecorator, getFieldValue, getFieldError }, loading, record } = this.props;
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
      if (field.name === 'user_interests'|| field.name === 'user_tags') {
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
      boxShadow:'none',
      padding:'5px'
    };
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
            <Form.Item {...this.state.formItemLayout}  label={formatMessage({ id: 'app.virtual.recommend.is' })}>
              {getFieldDecorator('recommend_auth', { valuePropName: 'checked',initialValue: record?!!(+record.recommend_auth):false })(<Switch />)}
            </Form.Item>
          </Form>
          <Row >
            <Col span={5}>
              <p  className={cx('lab')}> 
                {formatMessage({ id: 'app.virtual.recommend.background' })}:
              </p>
            </Col>
            <Col span={19}>
                <Card bordered={false}>
                  {!!matterList.size&&
                    [...matterList.values()].map((item,index)=>{
                      const k =  [...matterList.keys()];
                      return (
                        <Card.Grid style={gridStyle} key={index}>
                          <div className={cx('upload_list')}>
                            
                            <div className={cx('close1')} onClick={(e)=>{
                                this.setState(({matterList})=>{
                                  matterList.delete(k[index])
                                  return { matterList}
                                })
                                return false
                            }}>X</div>
                            {item.type==1 && <div className={cx('play_icon')} onClick={
                              ()=>{
                                window.open(item.file,'_blank');                 
                              }
                            }/>}
                            <img style={{width:'100%'}} src={item.thumbnail} onClick={
                              ()=>{
                                window.open(item.file,'_blank');                 
                              }
                            } />
                          </div>
                        </Card.Grid>
                      )
                    })
                  }
                  <Card.Grid  style={gridStyle}><UploaderWrap callback={this.getMediaMatter}/></Card.Grid>
              </Card>
            </Col>
          </Row>
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

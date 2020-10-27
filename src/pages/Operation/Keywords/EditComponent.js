
import  BreadcrumbBox from '@/components/BreadcrumbBox';
import { delNillObject,toParseInt,momentToString } from '@/utils/utils';
import memoize from 'memoize-one';
import { connect } from 'dva';

import {
  Layout,
  Menu,
  Input,
  Breadcrumb,
  Icon,
  Button,
  Pagination,
  Divider,
  DatePicker,
  Table,
  Popconfirm,
  Badge,
  Card,
  Form,
  Row,
  Modal,
  Col,
  Select,
  Mention ,
  Upload, 
  Switch,
  message
} from 'antd';

import React, { PureComponent,Fragment } from 'react';

import _ from 'lodash';

import Link from 'umi/link';
import router from 'umi/router';
import { formatMessage } from 'umi/locale';
import isEqual from 'lodash/isEqual';
import styles from './index.less';
const { MonthPicker, RangePicker } = DatePicker;
const { confirm } = Modal;
const { Option } = Select;
const Search = Input.Search;
const moment = require('moment');

// import {message_type_enum,send_user_ids_enum,send_type_enum,send_user_tag_enum,send_platform_enum} from './relatedEnum'


const platfromEnum={
  0:'全部',1:'安卓',2:'iOS',3:'H5'
}

@Form.create()
@connect(({
  keyword:{
    data,
    filters,
    status,
    model,
    detail
  }
})=>{
  return {
    data,
    filters,
    status,
    model,
    detail
  }
})
export default class EditComponent extends PureComponent {
  constructor(props) {
    super(props)
    const uid = Math.random();
    this.state={
       uid,
       keywordList:[""],
       detailState:{}
    }
  }
  static  getDerivedStateFromProps(props, currstate) {
    console.log(isEqual(props.detail,currstate.detailState),'isEqual(props.detail,currstate.detailState)')
    if(!isEqual(props.detail,currstate.detailState)){
        return {
          detailState:props.detail,
          keywordList:props.detail.keyword?props.detail.keyword.split(','):[""],
        }
    }
    return null
 }


  componentDidMount=()=>{
   
  }

  

  formSwitch=(e)=>{
    console.log(e,'eee')
    return e
  }
  formFile=(type,cate,e)=>{
    if(!e.file){
        return
    }
    const rep = new RegExp(`${type}`);
    const {file} = e;
    if(!rep.test(file.type)){
      message.error(formatMessage({ id: 'app.keywords.format' }, { format:type}));
      return
    }

    if(e.fileList.length>1){
      return e && e.fileList.reverse().splice(0,1);
    }
    return e && e.fileList;
  }

  plusHandle=()=>{
    this.setState(({
      keywordList
    })=>{
      return {keywordList:[...keywordList,'']}
    })
  }
  minusHandle=(index)=>{
    this.setState(({
      keywordList
    })=>{
      keywordList.splice(index,1);
      return {keywordList:[...keywordList]}
    },()=>{
    })
  }

  ModalDetail=()=>{
    const {form: { getFieldDecorator },status,detail} = this.props;
    const {uid,keywordList} = this.state;
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 6 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 18 },
      },
    };
    const formItemLayout1 = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 7 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 17},
      },
    };
    const UploadButton = (
      <Button>
        <Icon type="upload" />Upload
      </Button>
    );
    const UploadRender=memoize((file)=>{
      const name =file?(typeof(file)=='string'?file:file.name):'file'
      return (
        <Upload
          name='file'
          onRemove={this.onRemove}
          listType="text"
          beforeUpload={()=>{return false}}
        >
          {UploadButton}
        </Upload>)
    })
    return (
      <Fragment>
      <Form>
          <Row>
          <Form.Item {...formItemLayout} label={formatMessage({ id: 'app.keywords.name' })}>
              {getFieldDecorator('name', {
                rules: [
                  {
                    required: true,
                    message: formatMessage({ id: 'app.keywords.pname' }),
                  },
                ],
                initialValue:detail.name||''
              })(<Input />)}
            </Form.Item>
          </Row>
          {keywordList.map((item,index)=>{
               const rulesItem=index?
                              { initialValue:item||''}:
                              {rules: [
                                  {
                                    required: true,
                                    message: `${formatMessage({ id: 'app.keywords.pkeys' })}`,
                                  },
                                ],
                                initialValue:item||''
                              };
               return (<Row key={index}>
                        <Col span={20}>
                          <Form.Item {...formItemLayout1} label={`${formatMessage({ id: 'app.keywords.keys' })}${index+1}`}>
                              {getFieldDecorator('keyword'+index, rulesItem)(<Input />)}
                            </Form.Item>
                          </Col>
                          <Col span={4}>
                            <div className={styles.active_}>
                              <Button icon="plus" shape="circle" size='small' onClick={this.plusHandle}/>
                              {index!=0&&<Button icon="minus" shape="circle" size='small' type="danger" onClick={this.minusHandle.bind(this,index)}/>}
                            </div> 
                          </Col>
                      </Row>)
            })}
          {/* <KeywordRender keyword={keywordList}/> */}
          <Row>
          <Form.Item {...formItemLayout} label={formatMessage({ id: 'app.keywords.width' })}>
              {getFieldDecorator('width', {
                rules: [
                  {
                    required: true,
                    message: formatMessage({ id: 'app.keywords.width' }),
                  },
                ],
                initialValue:detail.width||''
              })(<Input />)}
            </Form.Item>
          </Row>
          <Row>
          <Form.Item {...formItemLayout} label={formatMessage({ id: 'app.keywords.height' })}>
              {getFieldDecorator('height', {
                rules: [
                  {
                    required: true,
                    message: formatMessage({ id: 'app.keywords.height' }),
                  },
                ],
                initialValue:detail.height||''
              })(<Input />)}
            </Form.Item>
          </Row>
          <Row>
            <Form.Item {...formItemLayout} label={formatMessage({ id: 'app.keywords.uploadmp4' })}>
              {getFieldDecorator('preview', {
                rules: [
                  {
                    required: true,
                    message: formatMessage({ id: 'app.keywords.uploadmp4' }),
                  },
                ],
                valuePropName:'fileList',
                getValueFromEvent:this.formFile.bind(this,'mp4','preview'),
                initialValue:detail.preview?[{uid:`${uid}1`,url:detail.preview,name:(detail.preview||'').replace(/(.{5}).*(.{4}\..*)$/,'$1...$2')
              }]:'',
              })(UploadRender())}
            </Form.Item>
          </Row>
          <Row>
            <Form.Item {...formItemLayout} label={formatMessage({ id: 'app.keywords.upload' })}>
              {getFieldDecorator('package', {
                rules: [
                  {
                    required: true,
                    message: formatMessage({ id: 'app.keywords.upload' }),
                  },
                ],
                valuePropName:'fileList',
                getValueFromEvent:this.formFile.bind(this,'zip','package'),
                initialValue:detail.package?[{uid:`${uid}2`,url:detail.package,name:(detail.package||'').replace(/(.{5}).*(.{4}\..*)$/,'$1...$2')
              }]:'',
              })(UploadRender())}
            </Form.Item>
          </Row>
          <Row>
            <Form.Item {...formItemLayout} label={formatMessage({ id: 'app.keywords.platfrom' })}>
              {getFieldDecorator('platform', {
                initialValue:~~detail.platform+''
              })(
                <Select>
                    {Object.keys(platfromEnum).map((item,index)=>{
                        return (
                          <Option value={item} key={index}>{platfromEnum[item]}</Option>
                        )
                    })}
                  </Select>
              )}
            </Form.Item>
          </Row>
          <Row>
            <Form.Item {...formItemLayout} label={formatMessage({ id: 'app.keywords.isup' })}>
              {getFieldDecorator('status', {
               valuePropName:'checked',
               initialValue: !!~~detail.status,
              //  getValueFromEvent:this.formSwitch
              })(
                <Switch 
                  checkedChildren={formatMessage({ id: 'app.keywords.y' })} 
                  unCheckedChildren={formatMessage({ id: 'app.keywords.n' })}
                />
              )}
            </Form.Item>
          </Row>
        </Form>
      </Fragment>
    )
  }
  onOk=()=>{
    const {form:{getFieldsValue,validateFields},detail,dispatch} = this.props; 
    validateFields((errors,value) => {
      if(!errors){
        const keyword=Object.keys(value)
                      .reduce((total,curr,index)=>{
                          if(curr.indexOf('keyword')>-1){
                            if(!total){
                              total = `${value[curr]}`;
                            }else if(value[curr]){
                              total = `${total},${value[curr]}`;
                            }
                          }
                          return total;
                      },'');

        const values = {...detail,...value,keyword,preview:value.preview[0].originFileObj||value.preview[0].url,package:value.package[0].originFileObj||value.package[0].url};
        const params = new FormData();
        values.status = values.status === true && 1 || 0;
        Object.keys(values).forEach(key => {
          let value = values[key];
          params.append(key, value);
        });
        if(detail.id===undefined){
          dispatch({
            type:'keyword/addElement',
            payload:params
          })
          .then((res)=>{
            if(res){
              this.props.onOk()
            }
          })
        }else{
          dispatch({
            type:'keyword/EditElement',
            payload:params
          })
          .then((res)=>{
            if(res){
              this.props.onOk()
            }
          })
        }
      }
    })
  }
  onCancel=()=>{
    this.props.onCancel()
    this.setState({
      detailState:{}
    })
  }
  render=() =>{
    const {ModalDetail} = this;
    const {visible} = this.props;
    return (
      !!visible&&
      (<Modal
          title={formatMessage({ id: 'app.versions.add' })}
          visible
          cancelText={formatMessage({ id: 'app.model.cancel' })}
          okText={formatMessage({ id: 'app.model.okText' })}
          onOk={this.onOk}
          onCancel={this.onCancel}
          width="600px"
        >
        <ModalDetail />
      </Modal>)
    )
  }
}
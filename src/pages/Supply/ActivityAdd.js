import { contentDetail,getLanguageList } from '@/services/content';
import { uploadImage,addMaterial,modifyMaterial } from '@/services/activity';
import { add } from '@/services/push';
import apiConfig from '@/utils/apiConfig';
import { getAuthority } from '@/utils/authority';

import { connect } from 'dva';

import { Input,Switch , Form, Modal, Select, Row,Icon , Col, DatePicker, message, Radio,Upload,InputNumber,Spin } from 'antd';

import React from 'react';

import { formatMessage } from 'umi/locale';

import styles from './Content.less';
import "./Activeadd.less";
import { removeObjUndefined, checkRate,isEmptyObject } from '@/utils/utils';

import _ from 'lodash';
import { array } from 'prop-types';

const moment = require('moment');
const FormItem = Form.Item;
const TextArea = Input.TextArea;
const Option = Select.Option;
const { RangePicker } = DatePicker;
const RadioGroup = Radio.Group;
const Search = Input.Search;

@Form.create()
@connect(
  ({
    activity: {
      data: {list},
      lineList,
      statusList,
      materialCateList
    },
  }) => ({
    list,
    statusList,
    lineList,
    materialCateList
  })
)
class ActivityAdd extends React.Component {

  state = {
    isShowPushTime: false,
    contentTitle: '',
    contentTime: '',
    fileImage:'',
    showDelIcon:false,
    image:'',
    noImageTip:'',
    imageStatus:'success',
    confirmLoading:false,
    modifyList:{},
    languageList:[],
    multi_lan_info:new Map(),
    list_map:{},
    single_lan_info:{},
    default_list_checked:0,
    spinning:false
  };
  withinTen = (rule, value, callback) => {
    if (value&&value.length>30) {
      callback(formatMessage({ id: 'app.activity.withinten' }));
    } else {
      callback();
    }
  }
  withinOneHundred = (rule, value, callback) => {
    if (value&&value.length>100) {
      callback(formatMessage({ id: 'app.activity.withinOneHundred' }));
    } else {
      callback();
    }
  }
  handleSubmit = obj => {
          if(obj.id||obj.id==0){
            return modifyMaterial(obj)
          }else{
            return addMaterial(obj)
          }
  };
  handleChange = (ev) => {
    const {multi_lan_info,default_list_checked,single_lan_info} =  this.state;
    const file = ev.target.files[0];
    this.setState({
      spinning:true
    })
    this.imageUploadCallBack(file)
    .then((res)=>{
      this.setState({
        spinning:false
      })
      if(!res.data.code){
        multi_lan_info.set(default_list_checked,{...single_lan_info,...{'image':res.data.url}})
        this.setState({
          single_lan_info:{...single_lan_info,...{'image':res.data.url}},
          multi_lan_info
        })
      }
    })
  }
  handleShowDelIcon=(item)=>{
      this.setState({
        showDelIcon:!item,
      })
  }
  delImage=()=>{
    const {single_lan_info,multi_lan_info,default_list_checked} = this.state;
    multi_lan_info.set(default_list_checked,{...single_lan_info,...{'image':''}})
    this.setState({
      single_lan_info:{...single_lan_info,image:''},
      multi_lan_info
    })
  }
  onChangeNum=(num)=>{
    const {modifyList} = this.state;
    modifyList.line_percent = parseInt(num); 
    this.setState({
      modifyList
    })
  }
  async onOk(){
    const _self = this;
    const {form,onCallBack } = this.props;
    const {single_lan_info,multi_lan_info,default_list_checked,languageList} = this.state;
    const {fileImage,image,modifyList,imageStatus } = this.state;
     multi_lan_info.set(default_list_checked,{...single_lan_info})
     await this.setState({
        multi_lan_info
     })
    //  console.log(this.state.multi_lan_info,'multi_lan_infomulti_lan_info')
     form.validateFields((err, values) => {
      if(err){
        return;
      }

      const multi_lan_info =[];let nextStep=true;
      _self.state.multi_lan_info.forEach((item,index)=>{

        if(item.title&&item.desc&&item.image){
          multi_lan_info.push({
            ...item,...{lan:index,lan_name:(languageList.filter(ii=>ii.value==index)[0]['name'])}
          })
        }else{
          if(!isEmptyObject(item)&&nextStep){
            nextStep=false
          }
        }
      });
      if(!nextStep){
        return message.error(formatMessage({ id: 'app.activity.nofill' }))
      }
      // multi_lan_info.map()
      // console.log(multi_lan_info);
      // const multi_lan_info_array = [...multi_lan_info.values()]
      // const multi_lan_info_keys_array = [...multi_lan_info.keys()]
      // multi_lan_info_keys_array.map((item)=>{

      // })

      //  return

      const filter = {image,begin_time:values.rangeTimePicker&&values.rangeTimePicker[0]?moment(values.rangeTimePicker[0]).format('YYYY-MM-DD HH:mm:ss'):'',end_time:values.rangeTimePicker&&values.rangeTimePicker[0]?moment(values.rangeTimePicker[1]).format('YYYY-MM-DD HH:mm:ss'):''}
      values.rangeTimePicker=null;
      values.img=null;
      values.line_name=null;
      values.create_time=null;
      values.update_time=null;
      values.status_name=null;
      values.line_percent = !values.line_percent?(modifyList.line_percent?modifyList.line_percent:'0'):(parseInt(values.line_percent.split('%')[0])>100)?'100':values.line_percent.split('%')[0]
      const val =  _.merge({},modifyList,values,filter);
      val.multi_lan_info=JSON.stringify(multi_lan_info)
      this.handleSubmit(val)
        .then((res)=>{
           if(!res.code){
            message.success(res.message);
            onCallBack(1)
           }else{
            message.warn(res.message);
            this.setState({
              confirmLoading:false,
            })
           }
        })
        .catch(function(reason){
            message.error(reason)
            this.setState({
              confirmLoading:false,
            })
        })
    })
  }
  onCancel=()=>{
    const {onCallBack}=this.props;
    onCallBack()
  }
  
  imageUploadCallBack = file =>{
    const formData = new FormData();
     formData.append('uploadImage', file);
     return uploadImage(formData)
}

  componentDidMount=() =>{
    const {modifyId,list} = this.props;
    this.getLanguageList();
    if(modifyId){
      const modifyList = list.filter((item)=>{
        if(item.id==modifyId){
            return item
        }
    })
    const multi_lan_info_arr = modifyList[0].multi_lan_info?JSON.parse(modifyList[0].multi_lan_info):[];
    const multi_lan_info = new Map();
    let single_lan_info = {}
    multi_lan_info_arr.map((item)=>{
      multi_lan_info.set(item.lan,item);
      if(item.lan==0){
        single_lan_info = item;
      }
    })
    this.setState({
      modifyList:modifyList[0],
      multi_lan_info,
      single_lan_info
    })
    }
  }
  getLanguageList=()=>{
    getLanguageList({token:getAuthority()})
    .then(res=>{
      if(!res.code){
        const list_map = {};
        let default_list_checked = 0
        res.data.map((item)=>{
          if(item.key=='en'){
            list_map[item.value]=true;
            default_list_checked = item.value
            return
          }
          list_map[item.value]=false;
        })
        this.setState({
          default_list_checked,
          list_map,
          languageList:res.data
        })
      }
    })
  }
  onChangeLanInfo=(value)=>{
    const {multi_lan_info,list_map,default_list_checked,single_lan_info} =  this.state;
    Object.keys(list_map).map(item=>{
      list_map[item]=false
    })
    multi_lan_info.set(default_list_checked,single_lan_info);
    this.setState({
      list_map:{...list_map,...{[value]:true}},
      multi_lan_info,
      single_lan_info:multi_lan_info.get(value)||{},
      default_list_checked:value
    })

  }
  onSwitch=(bool)=>{
    const {single_lan_info} =  this.state;
    this.setState({
      single_lan_info:{...single_lan_info,...{'checked':bool}}
    })
  }

  onChangeContent=(ev)=>{
    const {single_lan_info} =  this.state;
    console.log(ev.target.value,'ev.target.value')
    this.setState({
      single_lan_info:{...single_lan_info,...{[ev.target.name]:ev.target.value}}
    })
  }

  render() {
    const uploadButton = (
      <div className="upload__" >
        <input type="file" onChange={this.handleChange}/>
        <Icon type="plus" />
        <div className="ant-upload-text">上传</div>
      </div>
    );
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 4 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 20 },
      },
    };
    const formItemTwoRow = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 8 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 12 },
      },
    };
    const { isShowPushTime, contentTitle, contentTime,single_lan_info:{image,title,desc,checked},noImageTip,imageStatus,modifyList,confirmLoading,languageList,list_map  } = this.state;
    const {materialCateList} = this.props; 
    const {
      form: { getFieldDecorator },
      list,
      statusList,
      lineList,
      modifyId
    } = this.props;
    const rangeConfig = (modifyList.begin_time&&modifyList.end_time)?{
      initialValue: [moment(modifyList.begin_time), moment(modifyList.end_time)],
      rules: [
        {
          type: 'array',
          required: true,
          message: formatMessage({ id: 'app.glob.pleaseInputTime' }),
        },
      ],
    }:{
      rules: [
        {
          type: 'array',
          required: true,
          message: formatMessage({ id: 'app.glob.pleaseInputTime' }),
        },
      ],
    };
    const LanguageWrap = (props)=>{
      return(
        <Row style={{marginBottom:'24px'}}>
                <Col span={4}><p className={props.label?styles['lan-wrap-label']:''}>{props.label||''}</p></Col>
                <Col span={20}>
                    {props.children}
                </Col>
          </Row>
      )
    }
    return (
        <Modal
          title={modifyId?formatMessage({ id: 'app.versions.edit' }):formatMessage({ id: 'app.versions.add' })}
          cancelText={formatMessage({ id: 'app.model.cancel' })}
          okText={formatMessage({ id: 'app.model.okText' })}
          onOk={this.onOk.bind(this)}
          onCancel={this.onCancel}
          width="1100px"
          visible={true}
          confirmLoading={confirmLoading}
        >
        <style>
            {
              `
              .upload__{
                position:relative;
                cursor: pointer;
              }
              .upload__ input[type='file']{
                position:absolute;
                z-index:1;
                opacity: 0;
                top:0;
                left:0;
                bottom:0;
                right:0;
                height:104px;
                width:104px;
                cursor: pointer;
              }
              .ant-upload-select-picture-card1 {
                position:relative;
                overflow:hidden;
                display: table-cell;
                vertical-align: middle;
                width: 104px;
                height: 104px;
                margin-right: 8px;
                margin-bottom: 8px;
                text-align: center;
                background-color: #fafafa;
                border: 1px dashed #d9d9d9;
                border-radius: 4px;
                cursor: pointer;
                -webkit-transition: border-color .3s ease;
                transition: border-color .3s ease;
              }
              .ant-upload-select-picture-card1 img {
                width: 104px;
                height:auto;
              }
              .delete__img{
                width: 104px;
                height: 104px;
                position:absolute;
                z-index:10;
                background:rgba(0,0,0,0.5);
                top:0;
                left:0;
                transition: all .3s;
              }
              .ant-upload-select-picture-card1 i.anticon-delete{
                color:#fff;
                font-size:20px;
                margin-top: 42px;
                text-algin:center;
              }
              .ant-upload-select-picture-card1:hover{
                border: 1px dashed #26A4FF;
                color:#26A4FF
              }
              .ant-upload-select-picture-card1 i {
                font-size: 32px;
                color: #999;
                margin-top:20px;
                cursor: pointer;
              }
              
              .ant-upload-select-picture-card1 .ant-upload-text {
                color: #666;
                line-height:16px

              }
              .width100{
                width:100% !important;
              }
              .has-error .ant-upload-select-picture-card1{
                border: 1px dashed red;
              }
              label[for*="img"]:before {
                display: inline-block;
                margin-right: 4px;
                content: '*';
                font-family: SimSun;
                line-height: 1;
                font-size: 14px;
                color: #f5222d;
            }
              `
            }
        </style>
          <Form>
            <FormItem {...formItemLayout} label={formatMessage({ id: 'app.activity.name' })}>
              {getFieldDecorator('name', {
                initialValue: modifyList.name||'',
                rules: [
                  {
                    required: true,
                    message: formatMessage({ id: 'app.activity.pname' }),
                  },
                  { validator: this.withinTen },
                ],
              })(<Input placeholder={formatMessage({ id: 'app.activity.pname' })}/>)}
            </FormItem>
            <Spin tip={formatMessage({ id: 'app.activity.uploading' })} spinning={this.state.spinning}>
            <LanguageWrap>
              <ul className={styles["tab_wrap"]}>
                {!!languageList.length&&languageList.map((item)=>{
                    return  <li onClick={this.onChangeLanInfo.bind(this,item.value)} key={item.value} className={list_map[item.value]?styles['checked']:''}>{item.name} </li>
                 })
                }
              </ul>
            </LanguageWrap>
            <Row style={{marginBottom:'24px'}}>
                <Col span={4}><p className={styles['lan-wrap-label']}>{formatMessage({ id:'app.activity.title' })}</p></Col>
                <Col span={20}>
                    <Input.TextArea rows={2} value={title||''} name="title" onChange={this.onChangeContent}  placeholder={formatMessage({ id: 'app.activity.pdescribe' })}/>
                </Col>
            </Row>
            <Row style={{marginBottom:'24px'}}>
                <Col span={4}><p className={styles['lan-wrap-label']}>{formatMessage({ id:'app.activity.describe' })}</p></Col>
                <Col span={20}>
                    <Input.TextArea rows={4} value={desc||''}  name="desc" onChange={this.onChangeContent} placeholder={formatMessage({ id: 'app.activity.pdescribe' })}/>
                </Col>
            </Row>
            <LanguageWrap label={formatMessage({ id:'app.activity.isPublish' })}>
                <Switch checkedChildren={formatMessage({ id:'app.activity.yes' })} unCheckedChildren={formatMessage({ id:'app.activity.no' })} defaultChecked={!!checked} onChange={this.onSwitch}/>
            </LanguageWrap>
            <LanguageWrap label={formatMessage({ id: 'app.activity.pic' })}>
                <div>
                    {!!image&&
                      // fileImage.map((item,index)=>
                          (<div className="ant-upload-select-picture-card1" onMouseEnter={this.handleShowDelIcon.bind(this,0)} onMouseLeave={this.handleShowDelIcon.bind(this,1)} style={{cursor:'initial'}}>
                                    <img src={image}/>
                                    {this.state.showDelIcon&&<div className="delete__img" ><Icon type="delete" onClick={this.delImage} style={{cursor:'pointer'}}/></div>}
                                </div>)
                      // )
                    }
                  {!image&&
                  <div className="ant-upload-select-picture-card1">
                        { uploadButton}
                    </div>
                  }
                </div>
            </LanguageWrap>
            </Spin>
            <FormItem
              {...formItemLayout}
              label={formatMessage({ id: 'app.activity.activitytime' })}
            >
              {getFieldDecorator('rangeTimePicker', rangeConfig )(
                <RangePicker showTime format="YYYY-MM-DD HH:mm:ss" className="width100" />
              )}
            </FormItem>
            <FormItem {...formItemLayout} label={formatMessage({ id: 'app.activity.url' })}>
              {getFieldDecorator('banner_link', {
                initialValue: modifyList.banner_link||'',
                rules: [
                  {
                    required: true,
                    message: formatMessage({ id: 'app.activity.purl' }),
                  },
                ],
              })(<Input placeholder={formatMessage({ id: 'app.activity.purl' })}/>)}
            </FormItem>
            <FormItem {...formItemLayout} label={formatMessage({ id: 'app.activity.url_ios' })}>
              {getFieldDecorator('banner_ios_link', {
                initialValue: modifyList.banner_ios_link||'',
                rules: [
                  {
                    required: true,
                    message: formatMessage({ id: 'app.activity.purl' }),
                  },
                ],
              })(<Input placeholder={formatMessage({ id: 'app.activity.purl' })}/>)}
            </FormItem>
            <FormItem {...formItemLayout} label={formatMessage({ id: 'app.activity.id' })}>
              {getFieldDecorator('sort', {
                initialValue: modifyList.sort||'',
              })(<Input  />)}
            </FormItem>
            <FormItem {...formItemLayout} label={formatMessage({ id: 'app.activity.status' })}>
                  {getFieldDecorator('status', {
                    initialValue: modifyList.status||Object.keys(statusList)[1],
                  })(
                    <Select>
                        {
                          Object.keys(statusList).map((item)=>(
                              <Option value={item} key={item}>{statusList[item]}</Option>
                            ))  
                        }
                    </Select>
                  )}
              </FormItem>
              <FormItem {...formItemLayout} label={formatMessage({ id: 'app.activity.channel' })}>
                  {getFieldDecorator('line_id', {
                    initialValue: modifyList.line_id||Object.keys(lineList)[0],
                  })(
                    <Select>
                        {
                          Object.keys(lineList).map((item)=>(
                              <Option value={item} key={item}>{lineList[item]}</Option>
                          ))  
                        }
                    </Select>
                  )}
              </FormItem>
              <Row>
              <Col span={12}>
                  <FormItem {...formItemTwoRow} label={formatMessage({ id: 'app.activity.channelAve' })}>
                    {getFieldDecorator('line_percent', {
                    })(
                      <div className={styles.zanbi}>
                          <InputNumber
                              defaultValue={modifyList.line_percent?`${modifyList.line_percent}`:'0'}
                              min={0}
                              max={100}
                              formatter={value => `${value}%`}
                              parser={value => value.replace('%', '')}
                              onChange={this.onChangeNum}
                            />
                      </div>
                    )}
                  </FormItem>
              </Col>
              <Col span={12}>
              <FormItem {...formItemTwoRow} label={formatMessage({ id: 'app.activity.cate' })}>
                {getFieldDecorator('cate', {
                  initialValue: modifyList.cate||Object.keys(materialCateList)[0],
                })(
                  <Select dropdownMenuStyle={{height:'120px',overflowY:'auto'}}>
                        {Object.keys(materialCateList).map(item => {
                          return (
                            <Option key={item} value={item}>
                              {materialCateList[item]}
                            </Option>
                          );
                        })}
                      </Select>
                )}
              </FormItem>
              </Col>
            </Row>
          </Form>
        </Modal>
      )
  }
}

export default ActivityAdd;

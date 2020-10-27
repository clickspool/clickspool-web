import { connect } from 'dva';
import Link from 'umi/link';

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
  Col,
  Select,
  Spin,
  Modal,
  message,
  Tabs,
  Switch,
  Radio,
} from 'antd';

import React, { PureComponent, Fragment } from 'react';

import { formatMessage } from 'umi/locale';
import  Uploader from '@/components/Uploader/index';

import styles from './matters.less';
import classNames from 'classnames/bind';
import isNil from 'lodash/isNil';

const Search = Input.Search;
const Option = Select.Option;
const cx = classNames.bind(styles);
const { TabPane } = Tabs;
const moment = require('moment');


@Form.create()
@connect((
 { 
   matters:{
    materialStatusMap,
    groupTagMap,
    materialTypes,
  },
  memberInfo:{
    data:{
      keys
    }
  }
 }
)=>(
  {
  materialStatusMap,
  groupTagMap,
  materialTypes,
  keys
 }
 ))
export default class Matters extends PureComponent {
  constructor(props) {
    super(props)
    this.state={
      defaultActiveKey:"1", //1 媒体素材 2 文本内容
      showMedia:true,
      showSendType:true,
      title:'',
      duration:'',
      filters:{
        name:'',
        content:'',
        tag_id:'',
        status:''
      },
    }
  }
  
  componentDidMount=()=>{
    const {info} = this.props;
    this.setState({
      filters:info,
      showSendType:(~~info.send_type==0)?false:true,
      showMedia:info.type=='0'?false:true,
      defaultActiveKey:info.type=='0'?'2':'1',
      title:Object.keys(info).length?formatMessage({id:'app.matters.edit'}):formatMessage({id:'app.matters.add'}),
      duration:(info.type==2||info.type==3)?info.duration:''
    })
   
  }
  handleOk=()=>{
    const {form:{validateFields},groupTagMap,dispatch} = this.props;
    const {filters,defaultActiveKey} = this.state;
    if(defaultActiveKey=='1'&&!filters.url){
        message.warn(formatMessage({id:'app.matters.upload_matter'}));
        return
    }
    validateFields((err,value)=>{
      const {tag_ids:vtag_ids,send_time:vsend_time,send_date:vsend_date}= value;
      const tag_ids= Object.keys(groupTagMap).filter((item)=>{
                  return vtag_ids.indexOf(groupTagMap[item])>-1
              })
      const send_date =(!!vsend_date?vsend_date.format('YYYYMMDD'):null);
      const send_time = (!!vsend_time?vsend_time.format('YYYY-MM-DD HH:mm'):null);
      
      // console.log(tag_ids,send_date,send_time);
      const params = {...filters,...value,tag_ids,send_date,send_time,status:~~value.status,type:defaultActiveKey=='2'?0:(filters.message_type>-1?filters.message_type:filters.type)};
      // groupMaterialAdd, //群组素材添加
    // groupMaterialModify,//群组素材编辑
      dispatch({type:'matters/updateEffects',payload:{params,fn:params.id>-1?'groupMaterialModify':'groupMaterialAdd'}})
      .then((res)=>{
        if(!(~~res.code)){
          this.props.close(1);
        }
      })
      .catch(()=>{
        
      })
    })
  }

  handleCancel=()=>{
      this.props.close();
  }

  tabCallBack=(key)=>{
    const {filters} = this.state;
      this.setState({
        showMedia:key==1?true:false,
        defaultActiveKey:key+'',
        filters:{...filters,type:key!=1?"0":filters.type}
      })
  }
  getMediaMatter=(matter,flag)=>{
    if(flag){
      matter={
        url:'',
        thumb_base64:'',
        duration:'',
        message_type:0,
        size:'',
        weight_high:'',
        path:'',
      }
    }
    this.setState(({filters})=>{

      if(matter.thumb_base64&&matter.message_type==2){
        return{
            filters:{...filters,...matter,cover:`${matter.url}?x-oss-process=video/snapshot,t_1000,f_jpg,w_${matter['weight_high'].split('_')[0]},h_0,m_fast`},
            duration:matter.duration
        }
      }
      if(matter.thumb_base64&&matter.message_type==1){
        return{
            filters:{...filters,...matter,cover:`${matter.url}`}
        }
      }
      if(matter.thumb_base64&&matter.message_type==4){
        return{
            filters:{...filters,...matter,cover:`${matter.url}`}
        }
      }
      return{
          filters:{...filters,...matter},
          duration:matter.duration
      }
    })
  }

  onChangeSendType=(checked)=> {
    const {value} = checked.target;
    this.setState({
      showSendType:value=='0'?false:true,
    })
    // console.log(`switch to ${checked}`);
  }
  onChangeDuration=(ev)=>{
    const {value:duration} = ev.target;
    this.setState(({filters})=>{
      return {
        filters:{...filters,duration},
        duration
      }
    })
  }

  render=()=>{
    const {
      form:{getFieldDecorator},
      groupTagMap,
      keys
    } = this.props;
    const {tabCallBack,onChangeSendType} = this;
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 8 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 },
      },
    };
    const ColLayout ={
      sm: { span: 4},
    }
    const ColLayout2 ={
      sm: { span: 20 },
    }
    const {defaultActiveKey,
            showMedia,
            filters:{name,content,tag_ids,status,sort,send_type,send_time,send_date	},
            filters,
            showSendType,
            title
            } = this.state;
    // console.log(groupTagMap);
    return (
        <Modal
          title={title}
          visible={true}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
          style={{"paddingBottom":"130px"}}
        >
        <div >
          <Form {...formItemLayout}>
              <Form.Item label={formatMessage({id:'app.matters.name'})}>
                  {getFieldDecorator('name', {
                    initialValue:name,
                    rules: [
                      {
                        required: true,
                        message: formatMessage({id:'app.matters.pinputName'}),
                      },
                    ],
                  })(<Input placeholder={formatMessage({id:'app.matters.pinputName'})}/>)}
                </Form.Item>
                <Row>
                  <Col {...ColLayout}></Col>
                  <Col {...ColLayout2}>
                    <Tabs defaultActiveKey={defaultActiveKey} onChange={tabCallBack}>
                      <TabPane tab={formatMessage({id:'app.matters.mediacontent'})} key="1" />
                      <TabPane tab={formatMessage({id:'app.matters.textcontent'})} key="2" />
                    </Tabs>
                  </Col>
                </Row>
                    <div style={{display:!showMedia?'block':'none'}}>
                      <Form.Item label={formatMessage({id:'app.matters.textcontent'})}>
                            {getFieldDecorator('content', {
                              initialValue:content,
                              rules: [
                                {
                                  required: true,
                                  message: formatMessage({id:'app.matters.pinputName'}),
                                },
                              ],
                            })(<Input.TextArea rows={4} placeholder={formatMessage({id:'app.matters.pinputName'})}/>)}
                      </Form.Item>
                    </div>
                 <div style={{display:showMedia?'block':'none'}}>
                    <Row>
                      <Col {...ColLayout} />
                      <Col {...ColLayout2}>
                          <Row>
                              <Col sm={{ span: 5}}>
                                <span className={cx('label_')}>{formatMessage({id:'app.matters.uploadermediacontent'})}:</span>
                              </Col>
                              <Col sm={{ span: 19}}>
                                <Uploader 
                                  uploadName={'+'}
                                  {...filters}
                                  message_type={filters.type}
                                  callback={this.getMediaMatter}
                                />
                              </Col>
                          </Row>
                      </Col>
                    </Row>
                    {(this.state.duration||this.state.duration===0||this.state.duration==='0')&&<Row>
                      <Col {...ColLayout} />
                      <Col {...ColLayout2}>
                          <Row>
                              <Col sm={{ span: 5}}>
                                <span className={cx('label_')}>{formatMessage({id:'app.content.mins'})}:</span>
                              </Col>
                              <Col sm={{ span: 19}}>
                                <Input style={{width:'80px'}} value={this.state.duration} onChange={this.onChangeDuration} placeholder={formatMessage({id:'app.content.mins'})}/>
                              </Col>
                          </Row>
                      </Col>
                    </Row>}
                  </div>
                  <Form.Item label={formatMessage({id:'app.matters.selecttag'})}>
                          {getFieldDecorator('tag_ids', {
                            initialValue:(tag_ids||[]).reduce((prev,curr)=>{
                              prev.push(groupTagMap[curr])
                              return prev
                            },[])
                          })(
                            <Select
                            mode="multiple"
                            style={{ width: '100%' }}
                            placeholder={formatMessage({id:'app.matters.selecttag'})}
                            // onChange={handleChange}
                            optionLabelProp="label"
                          >
                          {Object.keys(groupTagMap).map((item,index)=>(
                            <Option 
                              value={groupTagMap[item]} 
                              label={groupTagMap[item]} 
                              key={index}>
                                {groupTagMap[item]}
                            </Option>))}
                          </Select>
                          )}
                    </Form.Item>
                    {keys.indexOf('1-18-3-6')>-1&&
                    <Fragment>
                    <Form.Item label={formatMessage({id:'app.matters.sort'})}>
                          {getFieldDecorator('sort', {
                            initialValue:sort,
                            rules: [
                             { validator(rule, value, callback, source, options) {
                                var errors = [];
                                if(value!=""&&!/^[0]{1}$|^[1-9]\d*$/.test(value)){
                                  errors.push(formatMessage({id:'app.matters.positive'}));
                                }
                                return callback(errors);
                              }}
                            ]
                            ,
                          })(<Input placeholder={formatMessage({id:'app.matters.sort'})}/>)}
                    </Form.Item>
                    <Form.Item label={formatMessage({id:'app.matters.sendtype'})}>
                          {getFieldDecorator('send_type', {
                            initialValue:(~~send_type)+'',
                            // valuePropName: 'checked' 
                          })(
                            <Radio.Group size="default" onChange={onChangeSendType}>
                                <Radio.Button value="0">{formatMessage({id:'app.matters.sendtype0'})}</Radio.Button>
                                <Radio.Button value="1">{formatMessage({id:'app.matters.sendtype1'})}</Radio.Button>
                            </Radio.Group>
                          )}
                    </Form.Item>
                      <div style={{display:!showSendType?'block':'none'}}>
                        <Form.Item label={formatMessage({id:'app.matters.sendtype0'})}>
                        {getFieldDecorator('send_date',{
                          initialValue:(~~send_date==0)?null:moment(send_date,'YYYY-MM-DD')
                        })(<DatePicker format="YYYY-MM-DD"/>)}
                        </Form.Item>
                      </div>
                      <div style={{display:showSendType?'block':'none'}}>
                        <Form.Item label={formatMessage({id:'app.matters.sendtype1'})}>
                          {getFieldDecorator('send_time',{
                              initialValue:(~~send_time==0)?((send_time&&send_time!=0)?moment(send_time, 'YYYY-MM-DD HH:mm:ss'):null):moment(send_time, 'YYYY-MM-DD HH:mm:ss')
                          })(
                            <DatePicker showTime={{ format: 'HH:mm' }} format="YYYY-MM-DD HH:mm" />,
                          )}
                        </Form.Item>
                      </div>
                    <Form.Item label={formatMessage({id:'app.matters.selectstatus'})}>
                          {getFieldDecorator('status', {
                            initialValue:!!(~~status),
                            valuePropName: 'checked' 
                          })(
                            <Switch
                                checkedChildren={<Icon type="check" />}
                                unCheckedChildren={<Icon type="close" />}
                              />
                          )}
                    </Form.Item>
                  </Fragment>
              }
          </Form>
          </div>
        </Modal>
    );
  }

}
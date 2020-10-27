
import React, { Component } from 'react';
import { connect } from 'dva';
import { Button, Form, Row, Col, message, Select, Input, TimePicker, Switch, Modal, Divider } from 'antd';
import moment from 'moment';
import { format } from 'prettier';
import UploadAudio from './UploadAudio';
import UploadVideo from './UploadVideo';
import UploadImage from './UploadImage';

const TextArea = Input.TextArea;
const Option = Select.Option;
const ButtonGroup = Button.Group;

@Form.create()
@connect(({
  virtualApply:{
    statusMap,
    messageTypeMap,
    sendTypeMap,
    conditionKeyMap,
    subConditionKeyMap,
    noRootRules,
    giftMap,
    ruleTypeMap
  }
})=>({
  statusMap,
  messageTypeMap,
  sendTypeMap,
  conditionKeyMap,
  subConditionKeyMap,
  noRootRules,
  giftMap,
  ruleTypeMap
}))
class Edit extends Component {
  constructor(props) {
    super(props);
    this.state={
      condition_m_list:[
        {"begin_time":"","end_time":"","match_message_count":''},
      ],
      son_condition_m_list:[
        {
          "key": "",
          "call_rule_id": "",
          "value": "",
          "comment": ""
       }
      ],
      send_time_info_later:{
        send_day_later:'',
        send_timing:'',
        after_seconds:'',
      },
      sel_mode:'0',
      mess:{
        message_type:undefined,
        content:'',
        remote_url:'',
      },
      send_type:'1',
    }
  }

  public onOk=()=>{
    const {form:{validateFields}, dispatch, detail, onClose } = this.props;
    const {condition_m_list,son_condition_m_list, send_time_info_later, mess, send_type,sel_mode } =this.state;

   
    if(typeof(mess.message_type)==='undefined'){
      message.warn('请选择消息类型');
      return
    }
    if(condition_m_list.lenght==1 && !condition_m_list[0].begin_time){
      message.warn('请输入规则');
      return
    }
    validateFields((err, values) => {
      if(err){
        return
      }
     const condition_list = condition_m_list.map((item)=>{
        return {
          key:'time_range',
          value:JSON.stringify(item)
        }
     })

     let son_condition_list = []
     if(son_condition_m_list.lenght==1 && son_condition_m_list[0].key===""){
     }else{
      son_condition_list = son_condition_m_list.map((item)=>{
          return {
              "key": item.key,
              "call_rule_id": item.call_rule_id,
              "value": item.value,
              "comment": item.comment
          }
      })
     }
       dispatch({ 
         type:`virtualApply/${detail.id?'modify':'add'}`,
         payload:{
           ...detail,
           ...values,
           ...mess,
           message_type:mess.message_type==7?0:(+mess.message_type),
           condition_list:JSON.stringify(condition_list),
           ...{...send_time_info_later},
           son_condition_list:JSON.stringify(son_condition_list),
          send_type:+(!!send_type),
          send_time_type:sel_mode==0?1:0,
          is_root:values.is_root?1:0,
          status:+(!!values.status)
        }}
       )
       .then((res)=>{
          if(res.code == 0){
            onClose();
          }
       })
    })
  }



  onChangeSelTime= (sel_mode) => {
    this.setState({
      sel_mode
    })
  }

  
  onPutOffClickStart= (evt)=>{
    if(evt){
      const time = evt.format('HH:mm');
      this.setState(({ send_time_info_later })=>{
        send_time_info_later.send_timing = time;
        return { send_time_info_later }
      })
    }
  }
  onChangeTime = (evt)=>{
    const {value} =  evt.target;
    const {sel_mode} = this.state;
    if (/^[1-9]\d*$/.test(value)||value == 0){
      this.setState(({ send_time_info_later })=>{
        if(sel_mode==1){
          send_time_info_later.send_day_later = value;
        }else{
          send_time_info_later.after_seconds = value;
        }
        
        return { send_time_info_later }
      })
    }
  }

  public PutOff = ()=>{
    const {onChangeSelTime,onPutOffClickStart, onChangeTime} = this;
    const {send_time_info_later:{after_seconds,send_timing,send_day_later}, sel_mode} = this.state;

    const send_timing_time =send_timing? {value:moment(send_timing,'HH:mm')}:{};
    const selectAfter = (
      <Select value={sel_mode+''}  style={{ width: 80 }} onChange={onChangeSelTime}>
        <Option value="0">秒</Option>
        <Option value="1">天</Option>
      </Select>
    );
    return (
      <Row>
      <Col span={8} className='lab'>第N天(0=>当天)</Col>
      <Col span={16}>
        <Input addonAfter={selectAfter} placeholder={sel_mode==1?"发送时间(Day)":"发送时间(s)"} onChange={onChangeTime} value={sel_mode==1?send_day_later:after_seconds}/>
      </Col>
      {sel_mode==1&&
        <>
          <Col span={8} className='lab' style={{marginTop:'3px'}}>发送时间点</Col>
          <Col span={16}>
            <TimePicker onChange={onPutOffClickStart} {...send_timing_time} style={{marginTop:'3px',width:'100%'}} className={'__TimePicker__'} placeholder={'发送时间点'} format="HH:mm"/>
          </Col>
        </>
      }
    </Row>
    )
  }
  
  onChangeMessageTypeMap = (message_type)=>{
    // if(message_type){
      this.setState(({ mess })=>{
        mess.remote_url = '';
        mess.message_type = message_type;
        if(message_type==7){
          return { mess,send_type:2 };
        }
        return { mess }
      })
    // }
  }

  onUpload=(res)=>{
    const {dispatch} = this.props;
    if(res.code!=0){
      message.info(res.msg)
      return
    }
    dispatch({
      type:"virtualApply/uploadMedia",
      payload:{multiMedia:res.file}
    })
    .then((ress)=>{
      console.log(ress,'ress')
      if(!ress.code){
         this.setState(({ mess })=>{
        return { mess:{...mess,...res,file:null,url:ress.data.path,remote_url:ress.data.url} }
        })
      }
    })
    console.log(res,'onUpload opt')
  }

  onChangeMessageContent=(evt)=>{
    const {value} =  evt.target;
    this.setState(({ mess })=>{
        mess.content = value;
        return { mess }
      })
  }

  onChangeMessageGift = (gift_id)=>{
      this.setState(({ mess })=>{
        mess.gift_id = gift_id;
        return { mess }
      })
  }

  public SelMess = () =>{
    const {
      props:{
        messageTypeMap,
        giftMap,
        detail:{
          remote_url,
          message_type:propsMessage_type
        }
      },
      state:{
        mess:{
          message_type,
          content,
          gift_id,
        },
        send_type,
      },
      onChangeMessageTypeMap,
      onUpload,
      onChangeMessageContent,
      onChangeMessageGift
    } = this;
       const gift_id_val = gift_id?{value:gift_id}:{};
      return (
        <Row>
        <Col span={8} className='lab'>消息类型</Col>
        <Col span={16}>
        <Select
              placeholder='请选择消息类型'
              style={{ width: '100%' }}
              onChange={onChangeMessageTypeMap}
              value={this.state.mess.message_type}
             >
            {Object.keys({...messageTypeMap})
            .map((item, index)=>{
                return <Option value={item} key={index}>{messageTypeMap[item]}</Option>
            })}
          </Select>
        </Col>
        {(typeof(message_type)!='undefined')&&<Col span={8} className='lab' style={{ marginTop:'5px' }}>内容</Col>}
        <Col span={16} style={{ marginTop:'5px' }}>
            {(message_type==1||message_type==4)&&<UploadImage {...{onUpload, defaulturl:this.state.mess.remote_url,url:(propsMessage_type==1||propsMessage_type==4)?remote_url:''}}/>}
            {(message_type==6||message_type==2)&&<UploadVideo {...{onUpload, defaulturl:this.state.mess.remote_url,url:(propsMessage_type==2||propsMessage_type==6)?remote_url:''}}/>}
            {(message_type==3)&&<UploadAudio {...{onUpload, defaulturl:this.state.mess.remote_url,url:(propsMessage_type==3)?remote_url:''}}/>}
            {(message_type==0||message_type==7)&&<Input value={content} onChange={onChangeMessageContent} placeholder='请输入内容'/>}
            {message_type==5 &&
              <Select
              placeholder='请选择消息类型'
              style={{ width: '100%' }}
              {...gift_id_val}
              onChange={onChangeMessageGift}
              >
            {giftMap
            .map((item, index)=>{
                return <Option value={item.id} key={index}>{<><img src={item.icon} style={{width:'30px',height:'30px'}}/>{`${item.id} ${item.name} ${item.name} $${item.price}`}</>}</Option>
            })}
          </Select>}
        </Col>
      </Row>
    )
  }

  public componentDidMount(){
   const{ detail: { id,condition_list, son_condition_list, send_time_type, content, remote_url, send_day_later, gift_id, send_timing,after_seconds, message_type, send_type } } = this.props;

   if(typeof(id)!=='undefined'){
      this.setState(({
        condition_m_list,
        son_condition_m_list,
      })=>{
        let condition_list_map=[];
        let son_condition_list_map=[];
        if(condition_list){
         JSON.parse(son_condition_list).map((item)=>{
          condition_list_map.push(JSON.parse(item.value));
          })
        }
        if(son_condition_list){
          JSON.parse(son_condition_list).map((item)=>{
            son_condition_list_map.push(item)
          })
        }
        return {
          son_condition_m_list:son_condition_list_map.length?son_condition_list_map:son_condition_m_list,
          condition_m_list:condition_list_map.length?condition_list_map:condition_m_list,
          send_time_info_later:{ 
            send_day_later,
            send_timing,
            after_seconds,
          },
          mess:{
            remote_url,
            message_type:(message_type==0&&send_type==2)?7:message_type,
            content,
            gift_id
          },
          sel_mode:send_time_type==1?0:1,
          send_type
        }
      })
   }
}

  onConditionClickStart=(index,evt) => {
    if(evt){
      const time = evt.format('HH:mm');
      this.setState(({ condition_m_list })=>{
        const m = condition_m_list[index];
         m.begin_time= time;
         condition_m_list[index] = m;
        return { condition_m_list }
      })
    }
  }
  onConditionClickEnd=(index,evt) => {
    if(evt){
      const time = evt.format('HH:mm');
      this.setState(({ condition_m_list })=>{
        const m = condition_m_list[index];
         m.end_time= time;
         condition_m_list[index] = m;
        return { condition_m_list }
      })
    }
  }

  onConditionChange=(index,evt) => {
    const {value} =  evt.target;
    if (/^[1-9]\d*$/.test(value)||value ==0){
      this.setState(({ condition_m_list })=>{
        const m = condition_m_list[index];
         m.match_message_count= value;
         condition_m_list[index] = m;
        return { condition_m_list }
      })
    }
  }

  addCondition = (index) =>{
    this.setState(({ condition_m_list })=>{
      let param = {"begin_time":"","end_time":"","match_message_count":''};
      condition_m_list.splice(index+1, 0, param ); 
      return { condition_m_list }
    })
  }

  delCondition= (index) =>{
    this.setState(({ condition_m_list })=>{
      if(condition_m_list.length>1){
        condition_m_list.splice(index, 1 ); 
        return { condition_m_list }
      }
    })
  }


  public Condition=()=>{
    const {onConditionClickStart, onConditionClickEnd, onConditionChange, addCondition, delCondition} = this;
    const { condition_m_list } = this.state;
    const format = 'HH:mm';
   return (
    <Row>
      <Col span={8} className='lab'>规则列表</Col>
      <Col span={16}>
        {condition_m_list.map((item,index)=>{
          const {begin_time,end_time,match_message_count} = item;
          const start =begin_time? {value:moment(begin_time,'HH:mm')}:{};
          const end = end_time?{value:moment(end_time,'HH:mm')}:{};
          return (
            <Row style={{marginTop:'3px'}} align='middle' justify="center" type="flex" key={index}>
                <Col span={16}>
                    <TimePicker onChange={onConditionClickStart.bind(this,index)} {...start} className={'__TimePicker__'} placeholder={'开始时间'} format="HH:mm"/>
                    <TimePicker onChange={onConditionClickEnd.bind(this,index)}  {...end} className={'__TimePicker__ s_nth'} placeholder={'结束时间'} format="HH:mm"/>
                    <Input onChange={onConditionChange.bind(this,index)} value={match_message_count} placeholder={'匹配消息数'}  style={{width:'203px',marginTop:'3px'}}/>
                </Col>
                <Col span={8}>
                <ButtonGroup>
                  <Button type="danger" size='small' onClick={delCondition.bind(this,index)}>减去</Button>
                  <Button type="primary" size='small' onClick={addCondition.bind(this,index)}>增加</Button>
                </ButtonGroup>
                </Col>
            </Row>
          )
        })}
      </Col>
    </Row>
   )
  }

  onSonConditionChange=(index, key, evt) => {
    this.setState(({ son_condition_m_list })=>{
      const m = son_condition_m_list[index];
       m[key]= evt;
       son_condition_m_list[index] = m;
      return { son_condition_m_list }
    })
  }

  onSonInputChange= (index,key,evt) => {
    const {value} =  evt.target;
      this.setState(({ son_condition_m_list })=>{
        const m = son_condition_m_list[index];
         m[key]= value;
         son_condition_m_list[index] = m;
        return { son_condition_m_list }
      })
  }


  addSonCondition = (index) =>{
    this.setState(({ son_condition_m_list })=>{
      let param = {"key": "", "call_rule_id": "","value": "","comment": ""}
      son_condition_m_list.splice(index+1, 0, param ); 
      return { son_condition_m_list }
    })
  }

  delSonCondition= (index) =>{
    this.setState(({ son_condition_m_list })=>{
      if(son_condition_m_list.length>1){
        son_condition_m_list.splice(index, 1 ); 
        return { son_condition_m_list }
      }
    })
  }
  public SonCondition=()=>{
    // tslint:disable-next-line:no-this-assignment
    const {
      props:{
        noRootRules,
        subConditionKeyMap
      },
      state:{
        son_condition_m_list
      },
      delSonCondition,
      addSonCondition,
      onSonConditionChange,
      onSonInputChange
    } = this;

   return (
    <Row>
      <Col span={8} className='lab'>子规则列表</Col>
      <Col span={16}>
        {son_condition_m_list.map((item,index)=>{
          const key = item.key?{value:item.key}:{};
          const call_rule_id = item.call_rule_id?{value:item.call_rule_id}:{};
          const value = item.value?{value:item.value}:{};
          const comment = item.comment?{value:item.comment}:{};
          return (
            <Row style={{marginTop:'3px'}} align='middle' justify="center" type="flex" key={index}>
                <Col span={16}>
                    <Select 
                    placeholder={'选择子规则'}
                    style={{ width: 203 }}
                    onChange={onSonConditionChange.bind(this,index,'key')}
                    {...key}
                    >
                      {
                        subConditionKeyMap.map((item,index)=>{
                          return (<Option key={index} value={item.value}>{item.name}</Option>)
                        })
                      }
                    </Select>
                    <Select 
                    placeholder={'选择非ROOT规则'}
                    style={{ width: 203,marginTop:'3px' }}
                    onChange={onSonConditionChange.bind(this,index,'call_rule_id')}
                    {...call_rule_id}
                    >
                      {
                        !!Object.keys(noRootRules).length&&
                        noRootRules.map((item, index)=>{
                          return (<Option key={index} value={item.id}>{item.title}</Option>)
                        })
                      }
                    </Select>
                    <Input {...value} placeholder={'子规则值'} onChange={onSonInputChange.bind(this,index,'value')}  style={{width:'203px',marginTop:'3px'}}/>
                    <Input {...comment} placeholder={'描述'}  onChange={onSonInputChange.bind(this,index,'comment')} style={{width:'203px',marginTop:'3px'}}/>
                </Col>
                <Col span={8}>
                <ButtonGroup>
                <Button type="danger" size='small' onClick={delSonCondition.bind(this,index)}>减去</Button>
                  <Button type="primary" size='small' onClick={addSonCondition.bind(this,index)}>增加</Button>
                </ButtonGroup>
                </Col>
            </Row>
          )
        })}
      </Col>
    </Row>
   )
  }
  

  public render() {
    const {props: { form: { getFieldDecorator },
     onClose , detail, 
     detail:{ title, 
     robot_id,
     rule_message_count,
     rule_message_interval,
     message_type,
     is_root,
     rule_type,
     send_type, status=false}, 
     messageTypeMap,
     sendTypeMap,
     ruleTypeMap,
     dispatch}, 
     Condition,
     SonCondition,
     PutOff,
     SelMess,
     onOk} = this;
    const formItemLayout = {
      labelCol: { span: 8 },
      wrapperCol: { span: 16 },
    };
    return (
      <Modal
        title={`${!Object.keys(detail).length?'新增':'编辑'}`}
        centered
        visible={true}
        onOk={() => onOk()}
        onCancel={() => onClose()}
        className="i_edit"
        >
          <style>
            {`
             .i_edit .ant-upload.ant-upload-select{
                  display:block
              }
              .lab{
                white-space: nowrap;
                text-overflow: ellipsis;
                color: rgba(0, 0, 0, 0.85);
                position: relative;
                text-align: right;
                top: 5px;
              }
              .lab::after {
                content: ':';
                position: relative;
                top: -0.5px;
                margin: 0 8px 0 2px;
            }
            .__TimePicker__{
              width:100px;
            }
            .__TimePicker__.s_nth{
              margin-left:3px
            }
            `}
          </style>
        <Form.Item {...formItemLayout} label="模板名称">
          {getFieldDecorator('title', {
            rules: [
              {
                required: true,
                message: '请输入模板名称',
              },
            ],
            initialValue:title
          })(<Input placeholder="请输入模板名称" />)}
        </Form.Item>
        <Form.Item {...formItemLayout} label="运营账号">
          {getFieldDecorator('robot_id', {
            rules: [
              {
                required: true,
                message: '请输入运营账号',
              },
            ],
            initialValue:robot_id
          })(<Input placeholder="请输入运营账号" />)}
        </Form.Item>
        <SelMess />
        <Row>
          <Condition />
          <SonCondition />
        </Row>
        <Divider />
        <Row>
          <Col style={{fontWeight:'bold'}}>发送条件</Col>
        </Row>
        <Form.Item {...formItemLayout} label="发送消息规则类型">
          {getFieldDecorator('rule_type', {
            rules: [
              {
                required: true,
                message: '请选择发送消息规则类型',
              },
            ],
            initialValue:rule_type
          })(
            <Select
              placeholder='请选择发送消息规则类型'
              style={{ width: '100%' }}
             >
            {Object.keys(ruleTypeMap)
            .map((item, index)=>{
                return <Option value={item} key={index}>{ruleTypeMap[item]}</Option>
            })}
          </Select>
          )}
        </Form.Item>
        <Form.Item {...formItemLayout} label="发送消息数">
          {getFieldDecorator('rule_message_count', {
            initialValue:rule_message_count
          })(<Input placeholder="请输入发送消息数" />)}
        </Form.Item>
        <Form.Item {...formItemLayout} label="发送时间间隔（秒）">
          {getFieldDecorator('rule_message_interval', {
            initialValue:rule_message_interval	
          })(<Input placeholder="请输入发送时间间隔（秒)" />)}
        </Form.Item>
        <PutOff />
        <Form.Item {...formItemLayout} label="IS_ROOT">
          {getFieldDecorator('is_root', {
            initialValue: !!(+is_root),
            valuePropName:'checked'
          })(<Switch />)}
        </Form.Item>
        <Form.Item {...formItemLayout} label="是否上架">
          {getFieldDecorator('status', {
            initialValue: !!(+status),
            valuePropName:'checked'
          })(<Switch />)}
        </Form.Item>
      </Modal>
    )
  }
}
export default Edit;

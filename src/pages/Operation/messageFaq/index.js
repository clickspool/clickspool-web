
import  BreadcrumbBox from '@/components/BreadcrumbBox';
import { delNillObject,toParseInt,momentToString ,delHtmlTag} from '@/utils/utils';
import  Uploader from '@/components/Uploader/index';
import { replyFeed } from '@/services/message';
import emitter from '@/utils/eventemitter.js';

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
  AutoComplete,
  Col,
  Select,
  Mention 
} from 'antd';

import React, { PureComponent,Fragment } from 'react';

import _ from 'lodash';

import Link from 'umi/link';
import router from 'umi/router';
import { formatMessage } from 'umi/locale';

import memoizeOne from 'memoize-one';

import classNames from 'classnames/bind';

import ContentEditable from 'react-contenteditable';

import AutoList from './AutoList.js';
import MessageList from './MessageList.js';
import styles from './index.less';
const { Option } = Select;
const Search = Input.Search;
const moment = require('moment');
let cx = classNames.bind(styles);
const { MonthPicker, RangePicker } = DatePicker;

@Form.create()
@connect(({
  mess:{
    feedList,
    feedRecentList,
    feedTypes,
    replyFeedParams,
    serviceMember,
    versions,
    feedStatuses,
    searchUsers,
    searchUsersTel
  },
  memberInfo:{
    data:{assistant_id}
  }
})=>{
  return {
    feedList,
    feedRecentList,
    feedTypes,
    replyFeedParams,
    serviceMember,
    versions,
    feedStatuses,
    searchUsers,
    assistant_id,
    searchUsersTel
  }
})
export default class messageFaq extends PureComponent {
  constructor(props) {
    super(props)
    this.contentEditable = React.createRef();
    this.modelRef = React.createRef();
    this.nicknameRef = React.createRef();
    this.telephoneRef = React.createRef();
    this.state={
      focus:false,
      html: ``,
      isShowModel:false,
      category:'',
      result:[],
      autocomplete:true,
      telephone:'',
      nickname:'',
      send_msg_nickname:'',
      filters:{
        page:1,
        page_size:20
      },
      replay:{
        user_id:''
      },
      disabled:false
    }
  }

  handleSubmit=(t)=>{
    console.info('handleSubmit__t',t);
    const {getFieldsValue} = this.props.form;
    const searchParamer = getFieldsValue();
    const { telephone,nickname} = this.state;
    const {searchUsers,searchUsersTel} = this.props;
    const paramers = {}
    if(searchParamer.faqtime){
      paramers.create_time_start=searchParamer.faqtime[0];
      paramers.create_time_end=searchParamer.faqtime[1];
      searchParamer.faqtime=null
    }
    if(searchParamer.dealtime){
      paramers.reply_time_start=searchParamer.dealtime[0];
      paramers.reply_time_end=searchParamer.dealtime[1];
      searchParamer.dealtime=null
    }
    if(telephone){
      const telephoneObj = searchUsersTel.filter((item)=>{
              return item['telephone']==telephone;
            })
        if(telephoneObj.length){
          paramers.user_id = telephoneObj[0]['id']
        }
    }
    if(nickname){
      const nicknameObj = searchUsers.filter((item)=>{
        return item['nickname']==nickname;
      })
        if(nicknameObj.length){
          paramers.user_id = nicknameObj[0]['id']
        }
    }
    t.export = t.export === undefined ? 0 : t.export;
    this.setState(({filters})=>{
      return Object.assign(filters,searchParamer,paramers,!!Object.keys(t).length?t:{page:1})
    },()=>{
      this.getList()
    })
  }
  handleOnReset=()=>{
    const {current}=this.telephoneRef;
    this.props.form.resetFields();
    this.setState({
        telephone:'',
        nickname:'',
        filters:{
          page_size:20,
          page:1,
        }
      },()=>{
        this.getList()
    })
  }

  handleTableChange=(page,pageSize)=>{
    this.handleSubmit({
      page
    })
}

onShowSizeChange=(current,page_size)=>{
  this.handleSubmit({
    page_size,
    page:current
  })
}

onChangeSearch=(category,value)=>{
  const {dispatch} = this.props;
  this.setState({
    [category]:value
  })
  if(category=='telephone'){
    dispatch({
      type:"mess/getSearchUsersTel",
      payload:{[category]:value}
    })
    return
  }
  dispatch({
    type:"mess/getSearchUsers",
    payload:{[category]:value}
  })
}
  
  FormSearch = ()=>{
    const { getFieldDecorator } = this.props.form;
    const {searchUsers,feedStatuses,serviceMember,versions,searchUsersTel} = this.props;
    const { result,category,autocomplete,telephone,nickname } = this.state;
    const {onChangeSearch} = this;
    return (
      <div className={styles.addBtn}>
          <Card title={formatMessage({ id: 'menu.operation.activity'})} className={styles.card} bordered>
            <Form layout="vertical" hideRequiredMark>
              <Row gutter={10}>
              <Col lg={8} md={12} sm={24}>
                <Form.Item label={formatMessage({ id: 'operation.messagefaq.faqtime' })}>
                    {getFieldDecorator('faqtime')(
                      <RangePicker 
                        showTime
                        format="YYYY-MM-DD HH:mm:ss"
                        style={{width:'100%'}}
                      />
                    )}
                  </Form.Item>
                </Col>
                <Col lg={8} md={12} sm={24}>
                  <Form.Item label={formatMessage({ id: 'operation.messagefaq.dealtime' })}>
                    {getFieldDecorator('dealtime')(
                      <RangePicker showTime format="YYYY-MM-DD HH:mm:ss" style={{width:'100%'}}/>,
                    )}
                  </Form.Item>
                </Col>
                <Col lg={4} md={12} sm={24}>
                    <div style={{color:'#000000d9'}}>{formatMessage({ id: 'operation.messagefaq.nickname' })}</div>
                      <AutoList 
                         style={{ width: '100%',marginTop: '8px' }} 
                         placeholder={formatMessage({ id: 'operation.messagefaq.nickname' })} 
                         onChange={onChangeSearch}
                         dataSource={searchUsers}
                         ref={this.nicknameRef}
                         tag ='nickname'
                         value={this.state.nickname}
                      />
                </Col>
                <Col lg={4} md={12} sm={24}>
                    <div style={{color:'#000000d9'}}>{formatMessage({ id: 'operation.messagefaq.tel' })}</div>
                      <AutoList 
                         style={{ width: '100%',marginTop: '8px' }} 
                         placeholder={formatMessage({ id: 'operation.messagefaq.tel' })} 
                         onChange={onChangeSearch}
                         dataSource={searchUsersTel}
                         ref={this.telephoneRef}
                         tag ='telephone'
                         value={this.state.telephone}
                      />
                </Col>
                </Row>
                <Row gutter={10}>
                <Col lg={4} md={12} sm={24}>
                  <Form.Item label={formatMessage({ id: 'operation.messagefaq.uuid' })}>
                      {getFieldDecorator('user_id', {
                        initialValue: '',
                      })(
                        <Input placeholder={formatMessage({ id: 'operation.messagefaq.uuid' })}/>
                      )}
                    </Form.Item>
                </Col>
                <Col lg={4} md={12} sm={24}>
                  <Form.Item label={formatMessage({ id: 'operation.messagefaq.version' })}>
                      {getFieldDecorator('version', {
                        initialValue: '',
                      })(
                        <Select>
                          <Option value="">{formatMessage({ id: 'operation.messagefaq.allversion' })}</Option>
                          {versions.map((item,index)=>{
                              return (
                                <Option value={item.value} key={index}>{item.key}</Option>
                              )
                          })}
                        </Select>
                      )}
                    </Form.Item>
                </Col>
                <Col lg={4} md={12} sm={24}>
                  <Form.Item label={formatMessage({ id: 'operation.messagefaq.status' })}>
                      {getFieldDecorator('reply_status', {
                        initialValue: '',
                      })(
                        <Select>
                          <Option value="">{formatMessage({ id: 'operation.messagefaq.allstatus' })}</Option>
                          {Object.keys(feedStatuses).map((item,index)=>{
                              return (
                                <Option value={item} key={index}>{feedStatuses[item]}</Option>
                              )
                          })}
                        </Select>
                      )}
                    </Form.Item>
                </Col>   
                <Col lg={4} md={12} sm={24}>
                  <Form.Item label={formatMessage({ id: 'operation.messagefaq.service' })}>
                      {getFieldDecorator('member_id', {
                        initialValue: '',
                      })(
                        <Select>
                          <Option value="">{formatMessage({ id: 'operation.messagefaq.allservice' })}</Option>
                          {serviceMember.map((item,index)=>{
                              return (
                                <Option value={item.id} key={index}>{item.nickname}</Option>
                              )
                          })}
                        </Select>
                      )}
                    </Form.Item>
                </Col>       
                <Col lg={8} md={12} sm={24} style={{paddingTop:"28px"}}>
                   <Button type="primary" onClick={this.handleSubmit.bind(this,{})}>
                       {formatMessage({ id: 'form.operation.search' })}
                   </Button>
                   <Button style={{marginLeft:'8px'}} type="primary" onClick={this.handleSubmit.bind(this,{export : 1})}>
                       {formatMessage({ id: 'app.content.export' })}
                   </Button>
                   <Button style={{marginLeft:'8px'}} onClick={this.handleOnReset}>
                       {formatMessage({ id: 'form.operation.reset' })}
                   </Button>
                </Col>
              </Row>
            </Form>
          </Card>
        </div>
    )
  }

  TableList =()=>{
    const {feedList:{list},feedStatuses,serviceMember } =this.props;
    const columns = [
      {
        title: 'ID',
        dataIndex: 'id',
        key: 'id',
        width: '80px',
      },
      {
        title: formatMessage({ id: 'operation.messagefaq.uuid' }),
        dataIndex: 'user_id',
        key: 'user_id',
        width: '80px',
      },
      {
        title: 'NickID',
        dataIndex: 'nick_id',
        key: 'nick_id',
        width: '80px',
      },
      {
        title: formatMessage({ id: 'operation.messagefaq.nickname' }),
        dataIndex: 'nickname',
        key: 'nickname',
        width: '80px',
      },
      {
        title: formatMessage({ id: 'operation.messagefaq.tel' }),
        dataIndex: 'telephone',
        key: 'telephone',
        width: '80px',
      },
      {
        title: formatMessage({ id: 'operation.messagefaq.time' }),
        dataIndex: 'time',
        key: 'time',
        width: '100px',
        render:(text,record)=>{
          return(
            <Fragment>
              <p>{formatMessage({id:'operation.messagefaq.faqtime'})}:{record.create_at}</p>
              {!!record.reply_time&&<p>{formatMessage({id:'operation.messagefaq.dealtime'})}:{record.reply_time}</p>}
            </Fragment>
          )
        }

      },
      {
        title:formatMessage({ id:'operation.messagefaq.version'}),
        dataIndex: 'version',
        key: 'version',
        width: '80px',
      },
      {
        title:formatMessage({ id: 'operation.messagefaq.lastContent' }),
        dataIndex: 'content',
        key: 'content',
        width: '300px',
        render:(text,record)=>{
          return(
            <Fragment>
               <div style={{ wordWrap: 'break-word', wordBreak: 'break-all' }}>
                {text?text:record.file_url}
              </div>
            </Fragment>
          )
        }
      },
      {
        title:formatMessage({ id: 'operation.messagefaq.status' }),
        dataIndex: 'reply_status',
        key: 'reply_status',
        width: '80px',
        render:(text)=>{
          return (<span style={{color:text==0?'#f85a62':'#52c41a'}}>{feedStatuses[text]}</span>)
        }
      },
      {
        title:formatMessage({ id: 'operation.messagefaq.dealservice' }),
        dataIndex: 'admin_uid',
        key: 'admin_uid',
        width: '80px',
        render:(text)=>{
          if(!text||text==0){
            return ''
          }
          return serviceMember.filter((item)=>{
                return (item.id==text)
              })[0]['nickname']
        }
      },
      {
        title:formatMessage({ id: 'operation.messagepush.operation' }),
        width: '100px',
        render:(text, record) => {
          return (
            <div>
              <Button type="primary" onClick={this.onChanggeModel.bind(this,record)}>{formatMessage({ id: 'operation.messagefaq.reply' })}</Button>
            </div>
          )
        }
      },
    ]
    return (
      <Table
        columns={columns}
        dataSource={list}
        pagination={false}
        bordered
        scroll={{ x: 1300 }}
        rowKey={(record, index) => `${record.id}${index}`}
    />
    )
  }

 async componentDidMount(){
    const {dispatch } = this.props;
    const {current} = this.contentEditable;
    const _this = this;
    emitter.on('disabled',({disabled})=>{
      _this.setState({
        disabled
      })
    });
    if(current){
      this.keepLastIndex(current)
    }
    Promise.all([
      dispatch({
        type:'mess/feedTypes'
      }),
      dispatch({
        type:'mess/getVersions'
      }),
      dispatch({
        type:'mess/getServiceMember'
      }),
      dispatch({
        type:'mess/getFeedStatuses'
      })
    ])
    .then(()=>{
      this.getList()
    })
   
    // document.onkeydown=function(event){ 
    //   var e = event || window.event || arguments.callee.caller.arguments[0]; 
    //   if(e && e.keyCode==13){//enter 键 
    //     _this.onsubmitHandle();
    //     return false; 
    //   } 
    // } 
  }

  getList=()=>{
    const {dispatch} = this.props;
    const {filters} = this.state;
    dispatch({
      type: 'mess/feedList',
      payload:momentToString(filters)
    });
  }

keepLastIndex=(obj)=> {
    this.setState({
      focus:true
   })
    if (window.getSelection) {//ie11 10 9 ff safari
        obj.focus(); //解决ff不获取焦点无法定位问题
        var range = window.getSelection();//创建range
        range.selectAllChildren(obj);//range 选择obj下所有子内容
        range.collapseToEnd();//光标移至最后
    }
    else if (document.selection) {//ie10 9 8 7 6 5
        var range = document.selection.createRange();//创建选择对象
        //var range = document.body.createTextRange();
        range.moveToElementText(obj);//range定位到obj
        range.collapse(false);//光标移至最后
        range.select();
    }

}
scrollBottom=()=>{
  const {current}=this.modelRef;
  if(current){
    current.scrollTop = current.scrollHeight;
  }
}

onSendMsgblur=()=>{
  this.setState({
    focus:false
  })
}
onSendMsgFocus=()=>{
  this.setState({
    focus:true
  })
}

onSendMsgChange=(ev)=>{
  const {value:html} = ev.target;
  const {dispatch,feedRecentList} = this.props;
  const {replay:{user_id}} = this.state;
  
  this.setState({ 
      html
  },()=>{
    const id = feedRecentList[_.cloneDeep(feedRecentList)
      // .reverse()
      .findIndex((val)=>{
        return val.user_id==user_id
      })]['id'];
    if(html.trim()){
      dispatch({
        type:'mess/addReplyParamsReducer',
        payload:{
          user_id,
          message_type:0,
          id,
          content:html
        }
      })
      return
    }
    dispatch({
      type:'mess/rmReplyParamsReducer',
      payload:{
        user_id,
        message_type:0,
        id
      }
    })
 })
}

onsubmitHandle = ()=>{
  const {replyFeedParams,dispatch} = this.props;
  const {replay:{user_id}} = this.state;
  const {current} = this.contentEditable;

  if(replyFeedParams.length){
    this.setState({
      disabled:true
    })
    replyFeedParams.map((item)=>{
      replyFeed({...item,content:delHtmlTag(item.content||'')})
      .then((res)=>{
        this.setState({
          disabled:false
        })
        if(!res.code){
          current.value="";
            dispatch({
              type:'mess/rmReplyParamsReducer',
              payload:[]
            })
            dispatch({
              type:'mess/feedRecentList',
              payload:{
                user_id
              }
            })
            .then(()=>{
              this.scrollBottom();
              this.getList();
            })
          if(item.message_type==0){
            this.setState({
              html:''
            })
          }else{
            emitter.trigger('removeMedia');
          }
        }
      })
    })
   
  }
}
onChanggeModel=(obj)=>{
  const {dispatch} = this.props;
  dispatch({
    type:'mess/rmReplyParamsReducer',
    payload:[]
  })
  this.setState({
    html:''  
  })
  if(obj.id&&obj.user_id){
    this.setState({replay:{user_id:obj.user_id},send_msg_nickname:obj.nickname},()=>{
      this.setState(({isShowModel})=>({isShowModel:!isShowModel}),()=>{
        if(this.state.isShowModel==true){
            this.contentEditable.current.focus()
            document.body.style.overflow='hidden'
        }else{
          document.body.style.overflow='auto'
        }
      })
    })
    return
  }else{
    this.setState(({isShowModel})=>({isShowModel:!isShowModel}),()=>{
      if(this.state.isShowModel==true){
        document.body.style.overflow='hidden'
        }else{
          document.body.style.overflow='auto'
        }
    })
    return
  }
}

getMediaMatter=(matter,remove)=>{
  const {dispatch,feedRecentList} = this.props;
  const {replay:{user_id}} = this.state;
  const id = feedRecentList[_.cloneDeep(feedRecentList)
                        .reverse()
                        .findIndex((val)=>{
                          return val.user_id==user_id
                        })]['id'];
  if(remove){
    dispatch({
      type:'mess/rmReplyParamsReducer',
      payload:matter
    })
    return
  }
  dispatch({
    type:'mess/addReplyParamsReducer',
    payload:{
      user_id,
      id,
      ...matter
    }
  })
}

render=() =>{
    const {feedList}= this.props;
    const  {focus,isShowModel,filters:{page_size,page}}= this.state;
    const src = [
    {icon:'desktop',name:formatMessage({ id: 'menu.operation' })},
    {name:formatMessage({ id: 'menu.operation.xiaomishupush' })}
    ]
    const {FormSearch,TableList,scrollBottom} = this;

    return (<Fragment>
          <BreadcrumbBox src={src}/>
          <FormSearch />
          <TableList/>
          <div className={styles.rightPagination}>
            <Pagination
              showTotal={total => formatMessage({ id: 'app.glob.pagetotal' },{total:total})}
              pageSizeOptions={['20', '30', '40']}
              showSizeChanger
              onShowSizeChange={this.onShowSizeChange}
              current={toParseInt(page)||1}
              pageSize={page_size}
              onChange={this.handleTableChange}
              total={toParseInt(feedList.total_count)}
            />
          </div>

          {isShowModel&&<div>
            <div className={styles.mask}></div>
            <div className={styles.model}>
              <div className={styles.header}>
                <div className={styles.title}>{this.state.send_msg_nickname||`${formatMessage({id:'form.operation.user'})}_${this.state.replay.user_id}`}</div>
                <div className={styles.close} onClick={this.onChanggeModel}>X</div>
              </div>
              <div className={styles.message_wrap} ref={this.modelRef}>
                  <MessageList scrollBottom={scrollBottom} userId={this.state.replay.user_id}/>
              </div>
              <div className={cx('footer',{white:focus})}>
                {/* <ContentEditable
                    innerRef={this.contentEditable}
                    className={styles.mess_input}
                    html={this.state.html} 
                    disabled={false}     
                    onChange={this.onSendMsgChange} 
                    tagName='article'
                    onFocus={this.onSendMsgFocus} 
                    onBlur={this.onSendMsgblur} 
                  /> */}
                  <textarea
                   type="text"
                    ref={this.contentEditable}
                    className={styles.mess_input}
                    value={this.state.html} 
                    disabled={false}     
                    onChange={this.onSendMsgChange} 
                    onFocus={this.onSendMsgFocus} 
                    onBlur={this.onSendMsgblur}
                  />
                  <div className={styles.send_btn_wrap} >
                    <div className={cx('placeholder')}>
                    </div>
                    <div className={cx('media')}>
                      <Uploader uploadName={formatMessage({id:'form.operation.uploadaffix'})} changePostion={true} hidden={true} callback={this.getMediaMatter}/>
                    </div>
                    <div className={cx('btn')}>
                        <Button 
                            type="primary" disabled={this.state.disabled} onClick={this.onsubmitHandle}>
                            {formatMessage({id:'form.operation.sendMsg'})}
                        </Button>
                    </div>
                      
                  </div>
              </div>
            </div>
          </div>}
        </Fragment>)
      }
}
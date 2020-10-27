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
  Tag,
  Tabs,
  Radio
} from 'antd';

import React, { PureComponent, Fragment } from 'react';

import { formatMessage } from 'umi/locale';

import _ from 'lodash';
import  BreadcrumbBox from '@/components/BreadcrumbBox';
import MattersModel from './MattersModel';
import styles from './matters.less';
import classNames from 'classnames/bind';

const Search = Input.Search;
const Option = Select.Option;
const { RangePicker } = DatePicker;
const cx = classNames.bind(styles);
const moment = require('moment');
@Form.create()
@connect((
 { 
   matters:{
    data,
    materialStatusMap,
    groupTagMap,
    materialTypes,
    spinShow,
    is_send
  },
  memberInfo:{
    data:{
      keys
    }
  }
 }
)=>(
  {
  data,
  materialStatusMap,
  groupTagMap,
  materialTypes,
  spinShow,
  is_send,
  keys
 }
 ))

//  大权限
export default class Matters extends PureComponent {
  constructor(props) {
    super(props)
    this.state={
      selectedRowKeys:[],
      showModel:false,
      info:{},
      filters:{
        pageSize:20,
        page:1
      },
      sendDate:'',
      selectType:1,
    }
  }
  
  componentDidMount=()=>{
    const {dispatch}= this.props;
   
    dispatch({type:'matters/statusEffects'});
    dispatch({type:'matters/tagEffects'});
    dispatch({type:'matters/typesEffects'});
    dispatch({type:'matters/isSendEffects'});
    this.getConfigList();
   
  }
  getConfigList=()=>{
    const {dispatch}= this.props;
    const {filters,selectType} = this.state;
    this.setState({
      selectedRowKeys:[],
    })
    dispatch({type:'matters/listEffects',payload:{...filters,selectType}})
  }
  onSearch=()=>{
    const {form:{
      validateFields,
    }}=this.props;
    validateFields((err, values) => {
      let time = {};
      if (values.mattersTime&&values.mattersTime.length) {
        time = {
          create_at_start: moment(values.mattersTime[0]).format('YYYY-MM-DD HH:mm:ss'),
          create_at_end: moment(values.mattersTime[1]).format('YYYY-MM-DD HH:mm:ss'),
        };
      }
      if(values.send_date&&values.send_date.length) {
        time = {...time,send_date_start: moment(values.send_date[0]).format('YYYYMMDD'),
        send_date_end: moment(values.send_date[1]).format('YYYYMMDD')}
      }
      if (values.send_time&&values.send_time.length) {
        time = {...time,send_time_start: moment(values.send_time[0]).format('YYYY-MM-DD HH:mm'),
        send_time_end: moment(values.send_time[1]).format('YYYY-MM-DD HH:mm')}
      }
  
      delete values['mattersTime'];
      delete values['send_date'];
      delete values['send_time'];
        this.setState(({filters})=>{
          return {filters:{...values,...time,page:1}}
        },()=>{
          this.getConfigList();
        })
    })
  }
  onReset=()=>{
    const {form:{
      resetFields,
    }}=this.props;

    resetFields();
    this.setState({
      filters:{
        pageSize:20,
        page:1
      }
    },()=>{
        this.getConfigList();
    })
  }
  // groupMaterialAdd, //群组素材添加
    // groupMaterialModify,//群组素材编辑
    // groupMaterialStatusSet, //群组素材：上下架
  onChangeStatus=(info,stu)=>{
    const {dispatch}  = this.props;
    const {selectedRowKeys} = this.state;
    const _this = this;
    Modal.destroyAll();
    // if(info=='batch'){
      if(info=='batch'&&!selectedRowKeys.length){
          message.warning(formatMessage({ id: 'app.matters.sureInfo'}));
          return
      }
     const content = (info,stu)=>{
        if(stu=='up'){
          if(info=='batch'){
            return formatMessage({ id: 'app.matters.surebatchup'})
          }
          return formatMessage({ id: 'app.matters.sureup'})
        }
        if(info=='batch'){
          return formatMessage({ id: 'app.matters.surebatchdown'})
        }
        return formatMessage({ id: 'app.matters.suredown'})
     }
      Modal.confirm({
        content:content(info,stu),
        onOk() {
          return new Promise((resolve, reject) => {
              dispatch({type:'matters/updateEffects',payload:{params:info=='batch'?{
                id:selectedRowKeys.join(","),
                status:stu=='up'?1:0
              }:{
                id:info.id,
                status:stu=='up'?1:0
              },fn:'groupMaterialStatusSet'}})
              .then(()=>{
                _this.getConfigList();
                resolve()
              })
              .catch(()=>{
                reject()
              })
          })
          .catch(() => console.log('Oops errors!'));
        },
        onCancel() {
          console.log('Cancel');
        },
      });
      return
    // }
  }

  onUpdate=(info)=>{
    this.setState({
      info,
      showModel:true,
    })
  }

  closeModel=(flag)=>{
    
    this.setState({
      info:{},
      showModel:false,
    },()=>{
      if(flag){
        this.getConfigList();
      }
    })
  }

  onDel=(id)=>{
    const {dispatch}  = this.props;
    const _this = this;
    Modal.confirm({
      content:formatMessage({id:'app.matters.suredel'}),
      onOk() {
        return new Promise((resolve, reject) => {
            dispatch({type:'matters/updateEffects',payload:{params:{id},fn:'groupMaterialDelete'}})
            .then((res)=>{
              if(!res.code){
                _this.getConfigList();
                resolve()
              }
            })
            .catch(()=>{
              reject()
            })
        })
        .catch(() => console.log('Oops errors!'));
      },
      onCancel() {
        console.log('Cancel');
      },
    })
  }

  checkSendTime=(ev)=>{
    const {value} = ev.target;
    const {setFieldsValue} = this.props.form;
    setFieldsValue({'send_date':[null,null]});
    this.setState(({filters})=>
    {
     return {sendDate:value,filters:{...filters,'send_date_start':this.enumDate(value),'send_date_end':this.enumDate(value)} }
    },()=>{
      this.getConfigList();
    })
  }

  enumDate(dataEnum){
    let sendDate = ''
    switch (dataEnum) {
      case 'today':
        sendDate = moment(+new Date()).format('YYYYMMDD');
        break;
      case 'aftertomorrow':
       sendDate = moment(+new Date()+2*86400000).format('YYYYMMDD');
        break;
      case 'tomorrow':
      sendDate = moment(+new Date()+86400000).format('YYYYMMDD');
        break;
      default:
        break;
    }
   return sendDate
  }
  mattersTimeOk=(data)=>{
    this.setState({
      sendDate:''
    })
    // console.log(data)
  }
  FormSearch = ()=>{
    const { 
      form:{getFieldDecorator}, 
      materialStatusMap,
      groupTagMap,
      materialTypes, 
      is_send,
      keys
    } = this.props;
    const {onSearch,onReset,onChangeStatus,onUpdate} = this;
    return (
      <Fragment>
          <Card bordered>
            {this.state.selectType=='2'&&
              <Radio.Group style={{marginBottom:'10px'}} buttonStyle="solid" size={"large"} onChange={this.checkSendTime} value={this.state.sendDate}>
                <Radio.Button value="today">{formatMessage({ id: 'app.matters.today' })}</Radio.Button>
                <Radio.Button value="tomorrow">{formatMessage({ id: 'app.matters.tomorrow' })}</Radio.Button>
                <Radio.Button value="aftertomorrow">{formatMessage({ id: 'app.matters.aftertomorrow' })}</Radio.Button>
              </Radio.Group>
            }
            <Form layout="vertical" hideRequiredMark>
                 {this.state.selectType!='2'&&<Row gutter={10}>
                  <Col span={2}>
                      <Form.Item label={formatMessage({ id: 'app.matters.id' })}>
                          {getFieldDecorator('id', {
                            initialValue: '',
                          })(
                            <Input placeholder={formatMessage({ id: 'app.matters.id' })}/>
                          )}
                      </Form.Item>
                  </Col>
                  <Col span={2}>
                      <Form.Item label={formatMessage({ id: 'app.matters.name' })}>
                          {getFieldDecorator('name', {
                            initialValue: '',
                          })(
                            <Input placeholder={formatMessage({ id: 'app.matters.name' })}/>
                          )}
                      </Form.Item>
                  </Col>
                  <Col span={2}>
                      <Form.Item label={formatMessage({ id: 'app.matters.status' })}>
                          {getFieldDecorator('status', {
                            initialValue: '',
                          })(
                            <Select>
                                <Option value="">{formatMessage({ id: 'app.matters.all_status' })}</Option>
                                {Object.keys(materialStatusMap).map((item,index)=>{
                                    return (
                                      <Option value={item} key={index}>{materialStatusMap[item]}</Option>
                                    )
                                })}
                              </Select>
                          )}
                      </Form.Item>
                  </Col>
                  <Col span={6}>
                        <Form.Item label={formatMessage({id: 'app.matters.sendtype1'})}>
                            {getFieldDecorator('send_time')(
                              <RangePicker 
                                showTime={{ format: 'HH:mm' }} 
                                format="YYYY-MM-DD HH:mm"
                                placeholder={[
                                  formatMessage({ id: 'app.matters.create_at_start' }),
                                  formatMessage({ id: 'app.matters.create_at_end' }),
                                ]}
                                style={{ width: '100%' }}
                              />
                            )}
                        </Form.Item>
                    </Col>
                   
                    <Col span={12}>
                      <Form.Item label={formatMessage({ id: 'app.matters.createTime' })}>
                        {getFieldDecorator('mattersTime')(
                          <RangePicker
                           
                            placeholder={[
                              formatMessage({ id: 'app.matters.create_at_start' }),
                              formatMessage({ id: 'app.matters.create_at_end' }),
                            ]}
                            style={{ width: '100%' }}
                            showTime
                          />
                        )}
                      </Form.Item>
                    </Col>
                </Row>}
                <Row gutter={10}>
                    <Col span={2}>
                          <Form.Item label={formatMessage({ id: 'app.matters.tag' })}>
                              {getFieldDecorator('tag_id', {
                                initialValue: '',
                              })(
                                <Select>
                                    <Option value="">{formatMessage({ id: 'app.matters.all_tag' })}</Option>
                                    {Object.keys(groupTagMap).map((item,index)=>{
                                        return (
                                          <Option value={item} key={index}>{groupTagMap[item]}</Option>
                                        )
                                    })}
                                  </Select>
                              )}
                          </Form.Item>
                      </Col>
                      <Col span={2}>
                            <Form.Item label={formatMessage({ id: 'app.matters.type' })}>
                                {getFieldDecorator('type', {
                                  initialValue: '',
                                })(
                                  <Select>
                                      <Option value="">{formatMessage({ id: 'app.matters.all_type' })}</Option>
                                      {Object.keys(materialTypes).map((item,index)=>{
                                          return (
                                            <Option value={item} key={index}>{materialTypes[item]}</Option>
                                          )
                                      })}
                                    </Select>
                                )}
                            </Form.Item>
                        </Col>
                        <Col span={2}>
                            <Form.Item label={formatMessage({ id: 'app.matters.send_status' })}>
                                {getFieldDecorator('is_send', {
                                  initialValue: '',
                                })(
                                  <Select>
                                      <Option value="">{formatMessage({ id: 'app.matters.all_send' })}</Option>
                                      {Object.keys(is_send).map((item,index)=>{
                                          return (
                                            <Option value={item} key={index}>{is_send[item]}</Option>
                                          )
                                      })}
                                    </Select>
                                )}
                            </Form.Item>
                        </Col>
                      <Col span={6}>
                        <Form.Item label={this.state.selectType==2?formatMessage({id: 'app.matters.send_time'}):formatMessage({id: 'app.matters.sendtype0'})}>
                            {getFieldDecorator('send_date')(
                              <RangePicker 
                              onChange={this.mattersTimeOk}
                              placeholder={[
                                formatMessage({ id: 'app.matters.create_at_start' }),
                                formatMessage({ id: 'app.matters.create_at_end' }),
                              ]}
                                style={{ width: '100%' }}
                              />
                            )}
                        </Form.Item>
                     </Col>
                      
                    <Col span={12}>
                      <Row align="bottom" type="flex" style={{height:"60px"}}>
                        <Col span={18}>
                          <Button type="primary" onClick={onSearch} className={cx('btn')}>{formatMessage({ id: 'app.matters.search' })}</Button>
                          <Button type="danger"  onClick={onReset} className={cx('btn')}>{formatMessage({ id: 'app.matters.reset' })}</Button>
                         {(keys||[]).indexOf('1-18-3-6')>-1&&
                          <Fragment>
                          <Button type="primary" onClick={onChangeStatus.bind(this,'batch','up')} className={cx('btn')}>{formatMessage({ id: 'app.matters.up' })}</Button>
                          <Button type="danger" onClick={onChangeStatus.bind(this,'batch')}  className={cx('btn')}>{formatMessage({ id: 'app.matters.down' })}</Button>
                          </Fragment>
                        }
                        </Col>
                        <Col span={6} style={{textAlign:'right'}}>
                          <Button type="primary" onClick={onUpdate.bind(this,{})}>{formatMessage({ id: 'app.matters.add' })}</Button>
                        </Col>
                      </Row>         
                    </Col>
                </Row>
            </Form>
          </Card>
      </Fragment>
    )
  }
  onShowSizeChange=(_,pageSize)=>{
    console.log(pageSize,'onShowSizeChange')
    this.setState(({filters})=>{
      return {filters:{...filters,pageSize}}
    },()=>{
      this.getConfigList();
    })
  }
  onChangePage=(page)=>{
    this.setState(({filters})=>{
      return {filters:{...filters,page}}
    },()=>{
      this.getConfigList();
    })
  }
  onChangeTabs=(key)=>{
    this.setState({
      selectType:key,
      filters:{
        pageSize:20,
        page:1
      }
    },()=>{
      this.getConfigList();
    })
  }
  render=()=>{
    const {FormSearch,onChangeStatus,onUpdate,onDel,onChangeTabs} = this;
    const {data:{list,total_count},keys} = this.props;
    const {filters:{page,pageSize},selectedRowKeys,showModel} = this.state;
    const { 
      materialStatusMap,
      groupTagMap,
      materialTypes,
      dispatch,
      is_send
    } = this.props;
    const src = [
      {icon:'desktop',name:formatMessage({ id: 'menu.operation' })},
      {name:formatMessage({ id: 'menu.operation.group.matters' })}
    ]
    const columns = [
      {
        title: formatMessage({ id: 'app.matters.id' }),
        dataIndex: 'id',
        key: 'id',
      },
      {
        title: formatMessage({ id: 'app.matters.cover' }),
        dataIndex: 'cover',
        key: 'cover',
        render(text){
          // ?x-oss-process=
          let src = '';
          if(!!text&&(/\.mp4\?x-oss-process/.test(text))){
            src=`${text.split('?')[0]}?x-oss-process=video/snapshot,t_1000,f_jpg,w_200,h_0,m_fast`;
          }
          if(!!text&&(!/.mp4\?x-oss-process/.test(text))){
            if(!/\?x-oss-process/.test(text)){
              src = `${text}?x-oss-process=image/resize,w_200,h_0,m_fast`;
            }else{
              src = text;
            }
          }
          return <img src={src} alt={text}/>
        }
      },
      {
        title: formatMessage({ id: 'app.matters.name' }),
        dataIndex: 'name',
        key: 'name',
      },
      {
        title: formatMessage({ id: 'app.matters.tag' }),
        dataIndex: 'tag_names',
        key: 'tag_names',
        render(text){
          const tag =(
            <Fragment>
                {!!text.length&&
                   text.map((item,index)=>{
                      return <Tag  color="purple" key={index}>{item}</Tag>
                   }) 
                }
            </Fragment>
          )
          return tag
        }
      },
      {
        title: formatMessage({ id: 'app.matters.type' }),
        dataIndex: 'type',
        key: 'type',
        render(text){
          return  <Tag color="purple">{materialTypes[text]}</Tag>
        }
      },
      {
        title: formatMessage({ id: 'app.matters.status' }),
        dataIndex: 'status',
        key: 'status',
        render(text){
            if(text==1){
              return <Tag color="purple">{materialStatusMap[text]}</Tag>
            }
            return <Tag color="gray">{materialStatusMap[text]}</Tag>
        }
      },
      {
        title: formatMessage({ id: 'app.matters.sort'}),
        dataIndex: 'sort',
        key: 'sort',
      },
      {
        title: formatMessage({ id: "app.activity.sendtype"}),
        dataIndex: 'send_type',
        key: 'send_type',
        render(text,record){
          const type=(
            <div className={cx('time_box')}>
             { text==1&&<div className={cx('box')}>{formatMessage({id: 'app.matters.sendtype1'})}：{record.send_time}</div>}
             { text!=1&& <div className={cx('box')}>{formatMessage({id: 'app.matters.sendtype0'})}：{record.send_date}</div>}
            </div>
          );
          return type
        }
      },
      {
        title: formatMessage({ id: 'app.matters.send_status' }),
        dataIndex: 'is_send',
        key: 'is_send',
        render(text,record){
          if(text==0){
            return <Tag color="gray">{is_send[text]}</Tag>
          }
          return <Tag color="purple">{is_send[text]}</Tag>
        }
      },
      {
        title: formatMessage({ id: 'app.matters.time'}),
        dataIndex: 'address',
        key: 'address',
        render(text,record){
          const Time=(
            <div className={cx('time_box')}>
              <div className={cx('box')}>{formatMessage({ id: 'app.matters.updatetime'})}：{record.update_at}</div>
              <div className={cx('box')}>{formatMessage({ id: 'app.matters.creattime'})}：{record.create_at}</div>
            </div>
          );
          return Time
        }
      },
      {
        title: formatMessage({ id: 'app.matters.operate'}),
        dataIndex: 'operate',
        key: 'operate',
        render(_,record){
          const Opwrap = (
            <div className={cx('op_wrap')}>
              <Button type="primary" className={cx('btn')} onClick={onUpdate.bind(this,record)}>{formatMessage({ id: 'app.matters.edit' })}</Button>
              {(keys||[]).indexOf('1-18-3-6')>-1&&<Button 
                onClick={onChangeStatus.bind(this,record,!!(~~record.status)?'':'up')} 
                type={!!(~~record.status)?"danger":"primary"}  
                className={cx('btn')}>
                {formatMessage({ id: (!!(~~record.status)?'app.matters.alonedown':'app.matters.aloneup') })}
              </Button>}
              {((keys||[]).indexOf('1-18-3-6')>-1||record.send_type==-1)&&<Button type="danger" className={cx('btn')} onClick={onDel.bind(this,record.id)}>{formatMessage({ id: 'app.matters.del' })}</Button>}
            </div>
          )
          return Opwrap
        }
      },
    ];
    const rowSelection = {
      onChange: (selectedRowKeys, selectedRows) => {
        this.setState({
          selectedRowKeys,
        })
      },
      selectedRowKeys
    };

    return (<Fragment>
              <BreadcrumbBox src={src}/>
              {(keys||[]).indexOf('1-18-3-6')>-1&&
                <Tabs defaultActiveKey="1" onChange={onChangeTabs}>
                  <Tabs.TabPane tab={formatMessage({ id: 'app.matters.mattertab' })} key="1"/>
                  <Tabs.TabPane tab={formatMessage({ id: 'app.matters.pushListTab' })} key="2"/>
                </Tabs>
              }
              <FormSearch />
              <Table bordered rowKey='id'  scroll={{x: true}} rowSelection={rowSelection} columns={columns} dataSource={list} pagination={
                {
                  position: 'both',
                  pageSize:pageSize||20,
                  current:this.state.filters.page,
                  showSizeChanger: true,
                  pageSizeOptions: ['20', '30', '40'],
                  onShowSizeChange: this.onShowSizeChange,
                  total:total_count,
                  showTotal: total => formatMessage({ id: 'app.glob.pagetotal' }, { total: total }),
                  size: 'small',
                  onChange: this.onChangePage,
                  showQuickJumper:true
                }
              } 
              />
              {
                showModel&&
                <MattersModel info={this.state.info} close={this.closeModel}/>
              }
          </Fragment>
          )
  }

}
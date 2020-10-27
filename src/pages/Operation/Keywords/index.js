
import  BreadcrumbBox from '@/components/BreadcrumbBox';
import { delNillObject,toParseInt,momentToString } from '@/utils/utils';
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
  message,
  Tag
} from 'antd';

import React, { Component,Fragment } from 'react';

import _ from 'lodash';

import Link from 'umi/link';
import router from 'umi/router';
import { formatMessage } from 'umi/locale';

import styles from './index.less';
import EditComponent from './EditComponent';
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
export default class Keywords extends Component {
  constructor(props) {
    super(props)
    this.state={
      visible:false,
      playingStates: {},
    }
  }

  handleTableChange=(page,pageSize)=>{
      this.handleSubmit(null,{
        page
      })
  }
  onShowSizeChange=(current,page_size)=>{
    this.handleSubmit(null,{
      page_size,
      page:current
    })
  }
  

  handleSubmit=(event,opt={})=>{
    const {form:{getFieldsValue},filters} = this.props;
    console.log(getFieldsValue());
    this.getFilters({...getFieldsValue(),page:1,...opt});
  }
  handleOnReset=()=>{
    this.props.form.resetFields();
    this.getFilters({name:'',status:'',page_size:20,page:1});
  }

  showDelConfirm=(id) =>{
    const _this = this;
    confirm({
      title: formatMessage({ id: 'form.operation.tip' }),
      content: formatMessage({ id: 'form.operation.tipDelContent' }),
      onOk() {
        return new Promise((resolve, reject) => {
          messDel({id})
          .then(()=>{
            resolve()
            _this.getList();
          })

        }).catch(() => console.log('Oops errors!'));
      },
      onCancel() {},
    });
  }

  

  FormSearch = ()=>{
    const {form:{ getFieldDecorator},status } = this.props;
    return (
      <div className={styles.addBtn}>
          <Card className={styles.card} bordered>
            <Form layout="vertical" hideRequiredMark>
              <Row gutter={10}>
              <Col lg={8} md={12} sm={24}>
                  <Form.Item label={formatMessage({ id: 'app.keywords.name' })}>
                      {getFieldDecorator('name',{
                        initialValue: '',
                      })(
                        <Input placeholder={formatMessage({ id: 'app.keywords.name' })} />
                      )}
                  </Form.Item>
                </Col>
                <Col lg={8} md={12} sm={24}>
                  <Form.Item label={formatMessage({ id: 'app.keywords.status' })}>
                      {getFieldDecorator('status',{
                        initialValue: '',
                      })(
                        <Select>
                          <Option value="">{formatMessage({ id: 'app.keywords.allstatus' })}</Option>
                          {
                            Object.keys(status).map((item,index)=>{
                              return <Option value={item} key={index}>{status[item]}</Option>
                            })
                          }
                        </Select>
                      )}
                    </Form.Item>
                </Col>
                <Col lg={8} md={12} sm={24} style={{paddingTop:"28px"}}>
                   <Button type="primary" onClick={this.handleSubmit}>
                       {formatMessage({ id: 'form.operation.search' })}
                   </Button>
                   <Button style={{marginLeft:'8px'}}  onClick={this.handleOnReset}>
                       {formatMessage({ id: 'form.operation.reset'})}
                   </Button>
                   <Button  type="primary" style={{marginLeft:'8px'}} onClick={this.handleAddModal}>
                       {formatMessage({ id: 'app.keywords.addmodel' })}
                   </Button>
                </Col>
              </Row>
            </Form>
          </Card>
        </div>
    )
  }

  handleAddModal=()=>{
    const {dispatch} = this.props;
    dispatch({type: 'keyword/detailEffect',payload:{}})
    .then((res)=>{
      this.setState({
        visible:true
      })
    })
  }

  handleEditModal=(id)=>{
    const {data:{list},dispatch} = this.props;
    const detail=list.find((item)=>{
        return item.id==id;
    })
    dispatch({type: 'keyword/detailEffect',payload:{...detail}})
    .then((res)=>{
      this.setState({
        visible:true
      })
    })
   
  }

  delElem=(id,status)=>{
    const _this = this;
    const {dispatch} = this.props;
    if(status==1){
      Modal.warning({
        title: formatMessage({ id: 'form.operation.tip' }),
        content: formatMessage({ id: 'app.keywords.uping'}),
        okText:formatMessage({ id: 'app.keywords.know' }),
      });
      return
    }
    confirm({
      cancelText:formatMessage({ id: 'app.model.cancel' }),
      okText:formatMessage({ id: 'app.model.okText' }),
      title: formatMessage({ id: 'form.operation.tip' }),
      content: formatMessage({ id: 'form.operation.tipDelContent'}),
      onOk() {
        return new Promise((resolve, reject) => {
          dispatch({type: 'keyword/delElement',payload:{id}})
          .then(()=>{
            resolve()
            _this.getFilters();
          })

        }).catch(() => console.log('Oops errors!'));
      },
      onCancel() {},
    });
  }
  changeStatus=(id,status)=>{
    const _this = this;
    const {dispatch} = this.props;
    confirm({
      cancelText:formatMessage({ id: 'app.model.cancel' }),
      okText:formatMessage({ id: 'app.model.okText' }),
      title: formatMessage({ id: 'form.operation.tip' }),
      content: formatMessage({ id: 'app.keywords.judge'},{content:status==0?formatMessage({ id: 'app.keywords.down'}):formatMessage({ id: 'app.keywords.up'})}),
      onOk() {
        return new Promise((resolve, reject) => {
          dispatch({type: 'keyword/statusElement',payload:{id,status}})
          .then(()=>{
            resolve()
            _this.getFilters();
          })

        }).catch(() => console.log('Oops errors!'));
      },
      onCancel() {},
    });
  }
  videoPlay(e) {
    if (e.target.tagName !== 'VIDEO') {
      return;
    }
    const video = e.target;
    if (video.paused) {
      return video.play();
    }
    video.pause();
    // console.info('video.play__', video.paused);

  }
  onPlay = (e) => {
    const id = e.target.getAttribute('data-id');
    const {playingStates}= this.state;
    playingStates[id] = true;
    this.setState({
      playingStates
    },()=>{
      console.log(this.state.playingStates);
    });
  }
  onPause = (e) => {
    const id = e.target.getAttribute('data-id');
    const {playingStates} = this.state;
    playingStates[id] = false;
    this.setState({
      playingStates
    });
  }
  TableList =()=>{
    const {data:{list},status,type} =this.props;
    const { playingStates } = this.state;
    console.log(playingStates,'playingStates')
    const columns = [
      {
        title: formatMessage({ id: 'app.keywords.id' }),
        dataIndex: 'id',
        key: 'id',
        width: 80,
      },
      {
        title: formatMessage({ id: 'app.keywords.name' }),
        dataIndex: 'name',
        key: 'name',
        width: 80,
      },
      {
        title: formatMessage({ id: 'app.keywords.platfrom' }),
        dataIndex: 'platform',
        key: 'platform',
        width: 80,
        render:(text,record)=>{
          const platfromEnum={
            '0':'全部','1':'安卓','2':'iOS','3':'H5'
          }
          return platfromEnum[text];
        }
      },
      {
        title: formatMessage({ id: 'app.keywords.magical' }),
        dataIndex: 'remote_preview',
        key: 'remote_preview',
        width: 100,
        render:(text,record)=>{
          const show = playingStates[record.id] ? `${styles.hide} ${styles.play}` : styles.play;
          return (
            <div className={styles.wraper}>
              <video data-id={record.id} onPlay={this.onPlay} onPause={this.onPause} onClick={this.videoPlay} className={styles.cover} src={text} />
              <Icon className={show} type="play-circle" />
            </div>
          );;
        }
      },
      
      {
        title:formatMessage({ id: 'app.keywords.keys' }),
        dataIndex: 'keyword',
        key: 'keyword',
        width: 200,
        render:(text,record)=>{
          return text;
        }
      },
      {
        title:formatMessage({ id: 'app.keywords.status' }),
        dataIndex: 'status',
        key: 'status',
        width: 80,
        render:(text,record)=>{
         return <Tag color={text==0?'#ccc':'green'}>{formatMessage({ id: text==0?'app.keywords.down':'app.keywords.up' })}</Tag>
        }
      },
      {
        title:formatMessage({ id: 'app.keywords.time' }),
        dataIndex: 'create_at',
        key: 'create_at',
        width: 200,
        render:(text,record)=>{
          return (
            <Fragment>
                <p>{formatMessage({ id: 'app.keywords.createTime' })}:{text}</p>
                <p>{formatMessage({ id: 'app.keywords.updateTime' })}:{record.update_at}</p>
            </Fragment>
          );
        }
      },
      {
        title:formatMessage({ id: 'app.keywords.action' }),
        width: 200,
        render:(text, record) => {
          return (
            <div>
              <Button type="link" onClick={this.handleEditModal.bind(this,record.id)}>{formatMessage({ id: 'app.keywords.edit' })}</Button>
              {record.status==0&&<Button type="link" onClick={this.changeStatus.bind(this,record.id,1)}>{formatMessage({ id:  'app.keywords.up' })}</Button>}
              {record.status==1&&<Button type="link" onClick={this.changeStatus.bind(this,record.id,0)} style={{color:'#ff4d4f',marginLeft:'6px'}}>{formatMessage({ id:  'app.keywords.down' })}</Button>}
              <Button type="link" onClick={this.delElem.bind(this,record.id,record.status)} style={{color:'#ff4d4f',marginLeft:'6px'}}>{formatMessage({ id: 'form.operation.del' })}</Button>
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

  componentDidMount=()=>{
    const {dispatch} = this.props;
    dispatch({type: 'keyword/statusEffect'});
    this.getFilters();
  }

  getFilters=(opt={})=>{
    const {dispatch,filters} = this.props;
    const fliter = dispatch({type: 'keyword/Filters',payload:{...filters,...opt}});
    fliter.then(res=>{
      return this.getList(res)
    })
  }
  getList=(opt={})=>{
    const {dispatch} = this.props;
    dispatch({
      type: 'keyword/listEffect',
      payload:opt
    });
  }
  onOk=()=>{
    this.getFilters();
    this.setState({
      visible:false
    })
  }

  onCancel=()=>{
    this.setState({
      visible:false
    })
  }

  render=() =>{
    const {data:{total_count,total_page},model,filters} = this.props;
    const {visible,playingStates} = this.state;
    const src = [
      {icon:'desktop',name:formatMessage({ id: 'menu.operation' })},
      {name:formatMessage({ id: 'app.keywords.keyword' })}
    ]
    const {FormSearch,TableList,ModalDetail} = this;
    return (<Fragment>
                <BreadcrumbBox src={src}/>
                <FormSearch/>
                <TableList/>
                <div className={styles.rightPagination}>
                  <Pagination
                    showTotal={total => formatMessage({ id: 'app.glob.pagetotal' },{total:total})}
                    pageSizeOptions={['20', '30', '40']}
                    showSizeChanger
                    onShowSizeChange={this.onShowSizeChange}
                    current={toParseInt(filters.page)||1}
                    pageSize={filters.page_size}
                    onChange={this.handleTableChange}
                    total={toParseInt(total_count)}
                  />
                </div>
                <EditComponent {...{visible,onOk:this.onOk,onCancel:this.onCancel}}/>
          </Fragment>)
  }
}
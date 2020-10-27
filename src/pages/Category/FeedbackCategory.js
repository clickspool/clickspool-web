import { modifyFaqCate, delFaqCate,modifyFaqCateStatus,modifyFaqCateRecommend } from '@/services/faq';
import { type, removeObjUndefined ,isEmptyObject} from '@/utils/utils';
import { connect } from 'dva';

import {
  message,
  Input,
  Breadcrumb,
  Icon,
  Button,
  Pagination,
  Table,
  Modal,
  Form,
  Row,
  Col,
  Card,
  Select,
  DatePicker,
  Tag,
} from 'antd';

import React, { PureComponent } from 'react';

import _ from 'lodash';

import { formatMessage } from 'umi/locale';
import router from 'umi/router';

import { operationEnum, getKey } from '../../../config/role.enum';
import styles from './Feed.less';
import FeedbackCategoryAdd from './FeedbackCategoryAdd';
import FeedbackCategoryEdit from './FeedbackCategoryEdit';

const { Option } = Select;
const { RangePicker } = DatePicker;
const Search = Input.Search;
const moment = require('moment');
function toParseInt(str) {
  if (str) {
    return parseInt(str || 0);
  }
  return 0;
}

@Form.create()
@connect(
  ({
    feedbackcate: {
      data: {page, list,total_count},
      faqCateStatusList,
      posmap
    },
    routing: {
      location: { pathname },
    },
    memberInfo: {
      data: { keys },
    },
  }) => ({
    list,
    page,
    total_count,
    faqCateStatusList,
    pathname,
    keys,
    posmap
  })
)
class FeedbackCategroy extends PureComponent {
  constructor(props) {
    super(props);
  
  }
  state = {
      pagination: {
        page: 1,
        page_size:20,
        id: '',
        version:'',
        name:'',
        status:'',
      },
      modifyId:'',
      showModelAdd:false,
      showModelEdit:false,
  }
  
  addGlob=()=>{
      this.setState({
        showModelAdd:true,
      })
  }
  onSearch=(val)=>{
    const {pagination} = this.state;
    if(val.trim()){
      this.setState({
        pagination:_.merge({},pagination,{name:val})
      },()=>{
          this.updataConfiList();
      })
    }
  }
  updataConfiList=()=>{
    const { dispatch } = this.props;
    const { pagination } = this.state;
    dispatch({
      type: 'feedbackcate/getList',
      payload: pagination,
    });
  }
  handleTableChange=(page)=>{
    const {pagination} = this.state;
    const val =  _.merge({},pagination,{page})
    this.setState({
      pagination:val
    },()=>{
      this.updataConfiList();
    })
  }

  onChangeStatus=(id,status)=>{
    if(status==0){
      Modal.confirm({
        title: formatMessage({id:'app.activity.tip'}),
        content: formatMessage({id:'app.activity.sureDown'}),
        okText: formatMessage({id:'app.activity.sure'}),
        cancelText: formatMessage({id:'app.activity.cancel'}),
        onOk:()=>{
          modifyFaqCateStatus({
            status,
            id
          })
          .then((res)=>{
              if(!res.code){
                message.success(res.message)
                this.updataConfiList();
              }else{
                message.error(res.message)
              }
          })
        }
      });
      return
    }
    modifyFaqCateStatus({
      status,
      id
    })
    .then((res)=>{
        if(!res.code){
          message.success(res.message)
          this.updataConfiList();
        }else{
          message.error(res.message)
        }
    })
  }

  openModel=(modifyId)=>{
    this.setState({
      showModelEdit:true,
      modifyId
    })
  }

  handleDel=(id,status)=>{
    if(status==0){
      Modal.warn({
        title: formatMessage({id:'app.activity.tip'}),
        content: formatMessage({id:'app.activity.makesureNoDel'}),
        okText: formatMessage({id:'app.activity.iknow'}),
      });
    }else{
      Modal.confirm({
        title: formatMessage({id:'app.activity.tip'}),
        content: formatMessage({id:'app.activity.sureDel'}),
        okText: formatMessage({id:'app.activity.sure'}),
        cancelText: formatMessage({id:'app.activity.cancel'}),
        onOk:()=>{
          delFaqCate({
            id
          })
          .then((res)=>{
            if(!res.code){
              message.success(res.message)
              this.updataConfiList();
            }else{
              message.error(res.message)
            }
        })
        }
      });
      
    }
  }

  closeModel=(index)=>{
    this.setState({
      showModelAdd:false,
      showModelEdit:false,
      modifyId:'',
    })
    if(index){
      this.updataConfiList();
    }
  }
  onChangeRecommend=(id,is_recommend)=>{
    const  recommend= parseInt(is_recommend)==0?1:0;
    modifyFaqCateRecommend({
      id,
      is_recommend:recommend
    }).then((res)=>{
      if(!res.code){
        message.success(res.message)
        this.updataConfiList();
      }else{
        message.error(res.message)
      }
    })
  }

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'feedbackcate/getFaqCateStatusList',
    });
    dispatch({
      type: 'feedbackcate/faqCateDisplayPosMap',
    });
    this.updataConfiList();
  }

  render() {
    const {total_count,list,faqCateStatusList,posmap } = this.props;
    const columns = [
      {
        title: formatMessage({ id: 'app.feedbackcategory.id' }),
        dataIndex: 'id',
        key: 'id',
      },
      {
        title: formatMessage({ id: 'app.feedbackcategory.name' }),
        dataIndex: 'name',
        key: 'name',
        render:(text,record)=>{
          const name =()=>{
            if(record.multi_name){
             let chinese =  JSON.parse(record.multi_name).filter((item)=>{
                return item.lan==2;
              })
              if(!chinese.length){
                chinese =  JSON.parse(record.multi_name).filter((item)=>{
                  return item.lan==0;
                })
              }
              return chinese[0].name
            }
            return text
          } 
          return (
            <div>
              <span style={{ marginRight: 5 }}>{name()}</span>
              {
               record.is_recommend==1?<Tag color="#108ee9">{formatMessage({ id: 'app.activity.recommend' })}</Tag>:''
              }
            </div>
          )
        }
      },
      {
        title: formatMessage({ id: 'app.feedbackcategory.des' }),
        dataIndex: 'desc',
        key: 'desc',
      },
      {
        title: formatMessage({ id: 'app.feedbackcategory.sort' }),
        dataIndex: 'sort',
        key: 'sort',
      },
      {
        title: formatMessage({ id: 'app.feedbackcategory.status' }),
        dataIndex: 'status',
        key: 'status',
        render:(text,record)=>{
          return (
            faqCateStatusList[text]
          )
        }
      },
      {
        title: formatMessage({ id: 'app.feedbackcategory.time' }),
        dataIndex: 'time',
        key: 'time',
        render: (text, record) => (<div>
              <p>{formatMessage({ id:'app.feedbackcategory.createtime' })}：{record.create_at}</p>
              <p>{formatMessage({ id:'app.feedbackcategory.updatetime' })}：{record.update_at}</p>
        </div>),
      },
      {
        title: formatMessage({ id: 'app.faq.pos' }),
        dataIndex: 'display_pos',
        key: 'display_pos',
        width: '80',
        render: (text, record) => {
          if(!posmap.length){
            return ''
          }
          return posmap.reduce((curr,prev)=>{
                  if(text.split(',').indexOf((prev.value)+'')>-1){
                    curr += !!curr?`,${prev.name}`: prev.name
                  } 
                  return curr
                },'')
        },
      }, 
      {
        title: formatMessage({ id: 'app.feedbackcategory.act' }),
        dataIndex: 'act',
        key: 'act',
        render: (text, record) =>{
          const keys = Object.keys(faqCateStatusList)
          const status = keys.filter((item)=>{
              if(record.status != item){
                return item;
              }
          })
          return (
            <p className="active">
                  <a href="javastript:void(0)" onClick={this.onChangeStatus.bind(this,record['id'],status[0])} className={status[0] == 0 ? "danger" : null}>{faqCateStatusList[status[0]]}</a>
                  <a href="javastript:void(0)" onClick={this.openModel.bind(this,record['id'])}>{ formatMessage({ id: 'app.activity.edit' })}</a>
                  <a href="javastript:void(0)" onClick={this.onChangeRecommend.bind(this,record['id'],record.is_recommend)} className={record.is_recommend == 0 ? null:"danger"}>{
                    record.is_recommend == 0? formatMessage({ id: 'app.activity.recommend' }):formatMessage({ id: 'app.feedbackcategory.norecommend' })
                  }</a>
                  <a href="javastript:void(0)" className="danger" onClick={this.handleDel.bind(this,record['id'],status[0])}>{ formatMessage({ id: 'app.activity.del' })}</a>
              </p>
          )
        }
      }
      ];
    return (<div>
              <div className={styles.breadcrumbBox}>
                  <Breadcrumb>
                    <Breadcrumb.Item>
                      <Icon type="lock" />
                      <span>{formatMessage({ id: 'menu.feedback' })}</span>
                    </Breadcrumb.Item>
                    <Breadcrumb.Item>{formatMessage({ id: 'menu.feedback.feedbackcategory' })}</Breadcrumb.Item>
                  </Breadcrumb>
              </div>
              <div className={styles.addBtn}>
              <style>
                  {`
                    .active a{
                      margin-left:6px;
                      text-decoration: none !important;
                    }
                    .active a.danger{
                      color:#ff4d4f
                    }
                  `}
                </style>
                <div>
                    <Search
                      placeholder={formatMessage({ id: 'app.feedbackcategory.pleaseName' })}
                      enterButton={formatMessage({ id: 'app.pages.search' })}
                      size="default"
                      onSearch={this.onSearch}
                    />
                </div>
                <div className={styles.btnBox}>
                    <Button type="primary" onClick={this.addGlob}>
                      {formatMessage({ id: 'app.versions.add' })}
                    </Button>
                </div>
                <div />
                <div />
            </div>
            <Table
              columns={columns}
              dataSource={list}
              pagination={false}
              bordered
              rowKey={(record, index) => `${record.id}${index}`}
            />
            <div className={styles.rightPagination}>
              <Pagination
                showTotal={total => formatMessage({ id: 'app.glob.pagetotal' },{total:total})}
                current={1}
                pageSize={20}
                onChange={this.handleTableChange}
                total={total_count}
              />
            </div>
            {
              this.state.showModelAdd&&
              <FeedbackCategoryAdd onCallback={this.closeModel}/>
            }
            {
              this.state.showModelEdit&&
              <FeedbackCategoryEdit onCallback={this.closeModel} modifyId={this.state.modifyId}/>
            }
        </div>)
  }
}
export default FeedbackCategroy;

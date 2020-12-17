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
  NameRender = (record,flag)=>{
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
    if(flag){
      return name();
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
  render() {
    const {total_count,list,faqCateStatusList,posmap } = this.props;
      return (
        <div>
          <style>
            {`
              .status-badge .ant-badge-status-dot{
                  height:8px;
                  width:8px
              }
              .regDate .ant-calendar-picker{
                width:100%;
              }
              .styles-card .ant-card-head-wrapper div:nth-child(1){
                  width:160px;
                  flex: 1 1;
              }
              .styles-card .ant-card-head-wrapper div:nth-child(2){
                width:160px;
                flex:16 1;
            }
            .l-menu-style li:after{
              content: '';
              position: absolute;
              right: 0;
              top: 0;
              height:40px;
              border-right: 3px solid #26A4FF;
              transform: scaleY(0.0001);
              opacity: 0;
              transition: transform 0.15s cubic-bezier(0.215, 0.61, 0.355, 1), opacity 0.15s cubic-bezier(0.215, 0.61, 0.355, 1);
            }
            .l-menu-style.ant-menu:not(.ant-menu-horizontal) .ant-menu-item-selected{
               background:#def6ff
            }
            .knowledge_base{
              width:100%;
              box-sizing: border-box;
              padding: 40px;
            }
            .box__{
              width:100%;
              height:120px;
              background:#fff;
              border-radius: 4px;
              transition: all 0.3s;
              box-sizing: border-box;
              display:flex;
              align-items: center;
              justify-content: center;
              flex-direction: column;
            }
            .box__:hover{
              box-shadow: 3px 2px 10px #999999;
              }
              `}
          </style>
  
          <div className={styles.breadcrumbBox}>
          <Breadcrumb style={{borderBottom:' 1px solid #ccc',paddingBottom:' 10px'}}>
              <Breadcrumb.Item>
                <Icon type="profile" />
                <span>{formatMessage({ id: 'menu.knowledge' })}</span>
              </Breadcrumb.Item>
              {/* <Breadcrumb.Item>{formatMessage({ id: 'menu.knowledge' })}</Breadcrumb.Item> */}
            </Breadcrumb>
          </div>
          <div className={'knowledge_base'}>
            <Row gutter={[16, 16]}>
              
                {
                  
                  !!list.length &&
                  list.map((item, index) => {
                    return <Col span={12} key={index}  style={{marginTop:'8px',cursor:'pointer'}}
                      onClick={()=>{
                        router.push(`/knowledge_base/${item.id}/${this.NameRender(item,1)}`)
                      }}
                    >
                    <div className={'box__'}>
                      <div style={{textAlign:'center',color:"#000"}}>{this.NameRender(item)}</div>
                      <div style={{textAlign:'center',marginTop:'5px',fontSize:'12px'}}>{item.desc}</div>
                    </div>
                    </Col>
                  })
                }
  
              
  
            </Row>
  
          </div>
        </div>
      );
  }
}
export default FeedbackCategroy;

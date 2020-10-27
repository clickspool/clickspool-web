
import  BreadcrumbBox from '@/components/BreadcrumbBox';
import {isEmptyObject,momentToString} from  '@/utils/utils';
import  Uploader from '@/components/Uploader/index';

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
  Col,
  Select,
} from 'antd';

import React, { PureComponent,Fragment } from 'react';

import Link from 'umi/link';
import { formatMessage } from 'umi/locale';

import isNil from 'lodash/isNil';

import styles from './index.less';
@connect(({mess:{messInfo}})=>{
  return {
    messInfo
  }
})
export default class messageDetail extends PureComponent {
  constructor(props) {
    super(props)
    this.state={
      filters:{}
    }
  }
  getDetail=()=>{
    const {dispatch} = this.props;
    const {id} = this.props.computedMatch.params;
    if(id||id==='0'||id===0){
      dispatch({
        type:'mess/messInfo',
        payload:{id}
      })
    }
  }
  
  static getDerivedStateFromProps(nextProps,prevState){
    const {messInfo} = nextProps;
    if(messInfo.id!=prevState.filters.id){
      return {
        filters:momentToString(messInfo)
      }
    }
    return null
  }
  componentDidMount=()=>{
    this.getDetail();
  }
  render=() =>{
    const {id} = this.props.computedMatch.params;
    const {filters} = this.state;
    const src = [
      {icon:'desktop',name:formatMessage({ id: 'menu.operation' })},
      {link:'/operation/messagepush',name:formatMessage({ id: 'menu.operation.xiaomishupush' })},
      {name:formatMessage({ id: 'form.operation.detail' })}
    ]
    const gridStyle = {
      width: '25%',
      textAlign: 'left',
      paddingLeft:'10px',
      height:'80px',
      boxSizing: 'border-box'
    };
    const gridFullStyle = {
      width: '100%',
      textAlign: 'left',
      paddingLeft:'10px'
    };

    const ellipsis = {
      overflow: 'hidden',// 超出边框外隐藏
      text0verflow:'ellipsis', // 属性规定当文本溢出包含元素时发生的事情。
      whiteSpace: 'nowrap' 
    }

    const detailContent =isEmptyObject(filters)?[]: [
      {
        key:formatMessage({ id: 'operation.messagepush.title' }),
        value:[filters.title]
      },
      {
        key:formatMessage({ id: 'form.operation.createTime' }),
        value:[`${filters.create_time}`]
      },
      {
        key:formatMessage({ id:'operation.messagepush.client' }),
        value:[filters.platform_name]
      },
      {
        key:formatMessage({ id:'form.operation.mediaType' }),
        value:[filters.message_type_name]
      },
      {
        key:formatMessage({ id:'form.operation.sendTime' }),
        value:[filters.send_timing]
      },
      {
        key:formatMessage({ id:'operation.messagepush.uidtag' }),
        value:[filters.send_user_tag_name]
      },
      {
        key:'URL',
        value:[(<p style={{width:"100px",...ellipsis}} title={filters.url}>{filters.url}</p>)]
      },
      {
        key:formatMessage({ id:'operation.messagepush.createUser' }),
        value:[filters.member_nickname],
      },
      {
        key:formatMessage({ id:'operation.messagepush.userRange' }),
        value:[!!filters.send_user_ids?filters.send_user_ids:formatMessage({ id: 'operation.messagepush.unlimitedUser' })],
        layout:'full'
      },
      {
        key:formatMessage({ id:'operation.messagepush.pushContent'}),
        value:[filters.content],
        layout:'full'
      },
      {
        key:formatMessage({ id:'operation.messagepush.pushMedia'}),
        value:[(
          <Uploader  {...filters} hidden={true}/>
        )],
        layout:'full',
        width:'110px'
      },
    ]

    return (
      <div className={'message_push_up'}>
             <Card
              title={
                <BreadcrumbBox src={src} className={styles.breadcrumb_Box}/>
              }
              className={styles.card_wrap}
             >
               {
                 !!detailContent.length&&detailContent.map((item,index)=>{
                    return (<Card.Grid style={item.layout?gridFullStyle:gridStyle} key={index}>
                              <Row type="flex" justify="start">
                                  <Col style={{width:item.width||'70px'}}><span className={styles.detail_title}>{item.key}</span>
                                  </Col>
                                  <Col style={item.layout?{width:'500px'}:{}}>
                                    <div>{item.value.map((ii,kk)=>{
                                        return (
                                          <span key={kk}>{ii||''}</span>
                                        )
                                    })} </div>
                                  </Col>
                                </Row>
                        </Card.Grid>)
                 })
               }
              </Card>
          </div>
        )
  }
}
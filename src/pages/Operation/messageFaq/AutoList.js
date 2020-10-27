import  BreadcrumbBox from '@/components/BreadcrumbBox';
import { delNillObject,base64RmHeader,base64AddHeader } from '@/utils/utils';

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
  Mention 
} from 'antd';

import React, { PureComponent,Fragment } from 'react';

import Link from 'umi/link';
import router from 'umi/router';
import { formatMessage } from 'umi/locale';

import isEqual from 'lodash/isEqual';

import classNames from 'classnames/bind';

import styles from './auto.less';

const moment = require('moment');
let cx = classNames.bind(styles);



@connect(({
  mess:{
    feedRecentList,
    feedTypes
  },
  memberInfo:{
    data:{assistant_id}
  }
})=>{
  return {
    feedRecentList,
    feedTypes,
    assistant_id
  }
})
export default class AutoList extends PureComponent {
  constructor(props) {
    super(props)
    this.state={
      feedRecentList:[],
      value:'',
      select:false,
      dataSource:[],
      show:false,
    }
  }
  static getDerivedStateFromProps(nextProps,prevState){
    const {dataSource,value} = nextProps;
    const {select} = prevState;
    if(!isEqual(dataSource,prevState.dataSource)){
      return {
        dataSource,
        show:dataSource.length?select?false:true:false,
        select:false
      }
    }
    if(value!=prevState.stateValue){
      return {
        value
      }
    }
    return null
  }
  componentDidMount=()=>{
    // document.onClick=()=>{
    //   setTimeout(()=>{
    //     this.setState({
    //       show:false
    //     })
    //   })
    // }
  }
  onChange=(event)=>{
    const {value} = event.target;
    const {onChange,tag} = this.props;
    this.setState({
      value
    },()=>{
      onChange(tag,value);
    })
  }
  onSelect=(value)=>{
    const {onChange,tag} = this.props;
    this.setState({
      value,
      show:false,
      select:true,
    },()=>{
      onChange(tag,value);
    })
  }

  onBlur=()=>{
    setTimeout(()=>{
      this.setState({
        show:false
      })
    },500)
  }

  render(){
    const {className,style,placeholder,ref,tag} = this.props;
    const {show,value,dataSource} = this.state;
    return (
      <div className={cx('auto',className||'')} style={style}>
          <input onBlur={this.onBlur} placeholder={placeholder} ref={ref} onChange={this.onChange} value={value}/>
         {show&&
          <ul className={cx('list')} >
            {dataSource.map((item,index)=>{
               return (<li key={index} onClick={this.onSelect.bind(this,item[tag])}>{item[tag]}</li>)
            })}
          </ul>
        }
      </div>
    )
  }
}
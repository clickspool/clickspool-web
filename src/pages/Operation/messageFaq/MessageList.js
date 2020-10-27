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

import ReactDOM from 'react-dom';

import router from 'umi/router';
import { formatMessage } from 'umi/locale';

import memoize from 'memoize-one';

import isEqual from 'lodash/isEqual';

import classNames from 'classnames/bind';

import cloneDeep from 'lodash/cloneDeep';

import styles from './index.less';
const moment = require('moment');
let cx = classNames.bind(styles);


const feedTypes={
  VOICE: '音频',
  VIDEO: '视频',
  IMAGE: '图片',
  TEXT: '文本'
}
const aliyunVTISuffix = '?x-oss-process=video/snapshot,t_1000';
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
export default class MessageList extends PureComponent {
  constructor(props) {
    super(props)
    this.time =null;
    this.el = document.createElement('div');
    this.state={
      feedRecentList:[],
      filters:{},
      clickVoiceIndexes:'',
      mustscrollBottom:true
    }
  }
  static getDerivedStateFromProps(nextProps,prevState){
    const {feedRecentList} = nextProps;
    if(!isEqual(feedRecentList,prevState.feedRecentList)){
      return {
        feedRecentList,
        mustscrollBottom:true
      }
    }
    return null
  }
  componentDidMount=()=>{
    const {mustscrollBottom} = this.state;
    this.getList(mustscrollBottom)
    this.setState({
      mustscrollBottom:false
    })
    this.time = setInterval(()=>{
      this.getList()
    },5000)
  }

  getList=(flag)=>{
    const {scrollBottom,dispatch,userId:user_id} = this.props; 
    const {mustscrollBottom} = this.state;
    dispatch({
      type:'mess/feedRecentList',
      payload:{
        user_id
      }
    })
    .then(()=>{
      console.log(flag,mustscrollBottom,'flag||mustscrollBottom')
      if(flag||mustscrollBottom){
        scrollBottom();
        this.setState({
          mustscrollBottom:false
        })
      }
    })
  }
  onClickContainer=(filters,clickVoiceIndexes)=>{
    this.setState({
      filters,
      clickVoiceIndexes
    },()=>{
      if(filters.object_name=='VOICE'){
        this.playMedia();
        return
      }
      this.createMatterWrap();
    })
    
  }

  playMedia=()=>{
    const _this = this;
    const {filters:{file_url},clickVoiceIndexes} = this.state;
    let audio = document.getElementById("audio_box");
    if(audio.src === file_url){
      if(audio.paused){
        _this.setState({
          clickVoiceIndexes
         })   
        audio.play()
      }else{
        _this.setState({
          clickVoiceIndexes:''
         }) 
        audio.pause();
      }
    }else{
      audio.src=file_url;
      _this.setState({
        clickVoiceIndexes:clickVoiceIndexes
       }) 
      audio.play()
    }
    audio.addEventListener('ended', function () {  
       _this.setState({
        clickVoiceIndexes:''
       })
    }, false);
  }

  componentWillUnmount=()=>{
    clearInterval(this.time);
  }
  createMatterWrap=()=>{
    const {file_url,object_name} = this.state.filters;
    document.body.appendChild(this.el);
    document.body.style.overflow='hidden'
    ReactDOM.render(
    (<Fragment>
    <div className={styles.mask1} onClick={this.removeChild}></div>
    <div className={styles.matter1}>
    {(object_name=='VIDEO'||object_name=='GIF')&& 
      <video src={file_url} autoPlay loop muted/>
    }
    {(object_name=='IMAGE')&&
      <img src={file_url} />
    }
    </div>
    </Fragment> ),
    this.el)
  }
  removeChild=()=>{
    // document.body.style.overflow='auto';
    document.body.removeChild(this.el);
  }
  ContainerList=memoize((feedRecentList,assistant_id,clickVoiceIndexes)=>{
    const cloneList = cloneDeep(feedRecentList).reverse();
    const voiceClass =(line,index)=>{ 
      return classNames(
          styles[line],
          {[styles['active']]:(clickVoiceIndexes===index)}
        ) 
    }
    if(!cloneList.length){
        return null
    }
    
    return (
      <ul>
        {
          cloneList.map((item,index)=>{
            const MediaContainer=()=>{
              let contentStyle='';
                if(item.object_name=='TEXT'){
                  contentStyle= cx('mess_content',{[(item.user_id==assistant_id)?'right':'left']:true})
                  return (
                    <Fragment >
                        <div className={styles.creat_time}>{item.create_at}</div>
                        <div className={contentStyle}>{item.content}</div>
                    </Fragment>
                  )
                }
                if(item.object_name=='IMAGE'){
                  contentStyle= cx('img_mess',{[(item.user_id==assistant_id)?'right':'left']:true})
                  return (
                    <Fragment>
                        <div className={styles.creat_time}>{item.create_at}</div>
                        <div className={contentStyle} onClick={this.onClickContainer.bind(this,item,index)}>
                            <img src={item.file_url} />
                        </div>
                    </Fragment>
                  )
                }
                if(item.object_name=='VIDEO'||item.object_name=='GIF'){
                  contentStyle= cx('video_mess',{[(item.user_id==assistant_id)?'right':'left']:true})
                  return (
                    <Fragment>
                        <div className={styles.creat_time}>{item.create_at}</div>
                        <div className={contentStyle} onClick={this.onClickContainer.bind(this,item,index)}>
                            {/* <img src={`${item.file_url}${aliyunVTISuffix}`} /> */}
                            <video src={item.file_url} autoPlay loop muted></video>
                        </div>
                    </Fragment>
                  )
                }
                if(item.object_name=='VOICE'){
                  contentStyle= cx('voice',{[(item.user_id==assistant_id)?'right':'left']:true})
                  return (
                    <Fragment>
                      <div className={styles.creat_time}>{item.create_at}</div>
                          <div onClick={this.onClickContainer.bind(this,item,index)} className={contentStyle}  style={{ width: `${(25 + 52.4 * Math.min((item.duration||30) / 60, 1))}%` }}>
                            <i>{parseInt(item.duration||0)}<sup>〃</sup></i>
                            <div className={styles["beat_wrap"]}>
                              <span className={voiceClass("line1",index)}></span>
                              <span className={voiceClass("line2",index)}></span>
                              <span className={voiceClass("line3",index)}></span>
                              <span className={voiceClass("line4",index)}></span>
                              <span className={voiceClass("line5",index)}></span> 
                          </div>
                      </div>
                    </Fragment>
                  )
                }
            
            }
           return ( <li key={index}>
                    <div className={styles.mess_container} key={index}>
                        {MediaContainer()} 
                    </div>
                  </li>)
          })
        }
      </ul>
    )
  })
  render(){
    const {assistant_id } = this.props;
    const {feedRecentList,clickVoiceIndexes} = this.state;
    const {ContainerList} =this
    return (
      <Fragment>
          {
           ContainerList(feedRecentList,assistant_id,clickVoiceIndexes)
          }
        <audio id="audio_box" style={{display:"none"}} loop={false}></audio>
        </Fragment>
    )
  }
}
import * as activityApi from '@/services/activity';
import { type, removeObjUndefined } from '@/utils/utils';
import Debounce from 'lodash-decorators/debounce';

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

import styles from './Content.less';
import ActivityAdd from './ActivityAdd';

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

const btnStatus = {
  onlineBtn: true,
  offlineBtn: true,
  delBtn: true,
};


@Form.create()
@connect(
  ({
    activity: {
      data: {page, total_page, list,total_count},
      lineList,
      statusList,
      materialCateList
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
    total_page,
    statusList,
    lineList,
    pathname,
    keys,
    materialCateList
  })
)
class Activity extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      languageList:[],
      pagination: {
        page: 1,
        page_size: 20,
        type: '',
        status: '',
        name: '',
        id: '',
        type: '',
        line_id:"",
        begin_time:"",
        end_time:""
      },
    };
  }
  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'activity/getLineList',
    });
    dispatch({
      type: 'activity/getStatusList',
    });
    dispatch({
      type: 'activity/getMaterialCateList',
    });
    this.updataConfiList();
    
  }

  SearchResetBtnHandle = () => {
    const { pagination } = this.state;
    this.props.form.resetFields();
    this.setState(
      {
        pagination: {
          page: 1,
          page_size: 20,
          type: '',
          status: '',
          name: '',
          id: '',
          type: '',
          line_id:"",
          begin_time:"",
          end_time:""
        },
        showModel:false,
        modifyId:'',
      },
      () => {
        this.updataConfiList();
      }
    );
  };

  updataConfiList=()=>{
    const { dispatch } = this.props;
    const { pagination } = this.state;
    dispatch({
      type: 'activity/getList',
      payload: pagination,
    });
  }

  onShowSizeChange=(current,page_size)=>{
    const {pagination} = this.state;
    const val =  _.merge({},pagination,{page_size})
    this.setState({
      pagination:val
    },()=>{
      this.updataConfiList();
    })
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
  closeModel=(index)=>{
    this.setState({
      showModel:false,
      modifyId:'',
    })
    if(index){
      this.updataConfiList();
    }
  }

  openModel=(modifyId)=>{
    this.setState({
      showModel:true,
      modifyId
    })

    return false
  }

  isNum = (rule, value, callback) => {
    var re = /^[0-9]+$/ ;
    if (value&&!re.test(value)) {
      callback(formatMessage({ id: 'app.activity.isNum' }));
    } else {
      callback();
    }
  }

  SearchBtnHandle=()=>{
    const {form} = this.props;
    const {pagination} = this.state;
    form.validateFields((err, values) => {
    if(err){
      return
    }
    const filter = { page: 1,page_size: 20,begin_time:values.pushtime&&values.pushtime[0]?moment(values.pushtime[0]).format('YYYY-MM-DD HH:mm:ss'):'',end_time:values.pushtime&&values.pushtime[0]?moment(values.pushtime[1]).format('YYYY-MM-DD HH:mm:ss'):''}
    values.pushtime='';
    const val =  _.merge({},pagination,values,filter);
    this.setState({
      pagination:val
    },()=>{
      this.updataConfiList();
    })
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
          activityApi.modifyStatus({
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
    activityApi.modifyStatus({
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

    return false;
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
          activityApi.deleteMaterial({
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
    return false
  }
  goSuppliesData=(id,line_id)=>{
      router.push(`/operation/activity/suppliesdata?id=${id}&line_id=${line_id}`);
      return false;
  }

  render() {
    const {
      list,
      page,
      total_count,
      statusList,
      lineList,
      form: { getFieldDecorator },
      keys,
      pathname,
      materialCateList 
    } = this.props;
    const { handleChangeCate,onShowSizeChange,showModel} = this;
    const columns = [
      {
        title: formatMessage({ id: 'app.activity.sucaiid' }),
        dataIndex: 'id',
        key: 'id',
      },
      {
        title: formatMessage({ id: 'app.activity.name' }),
        dataIndex: 'name',
        key: 'name',
        render: (text, record)=> (
          <div>
            <span>{text}</span>
         </div>
        ),
      },
      {
        title: formatMessage({ id: 'app.activity.cate' }),
        dataIndex: 'cate',
        key: 'cate',
        render: (text, record)=> {
          return materialCateList[text]
        }
      },
      // {
      //   title: formatMessage({ id: 'app.activity.avePV' }),
      //   dataIndex: 'banner_avg_pv',
      //   key: 'banner_avg_pv',
      // },
      // {
      //   title: formatMessage({ id: 'app.activity.landingpv' }),
      //   dataIndex: 'banner_pv',
      //   key: 'banner_pv',
      // },
      // {
      //   title: formatMessage({ id: 'app.activity.landinguv' }),
      //   dataIndex: 'banner_uv',
      //   key: 'banner_uv',
      // },
      // {
      //   title: formatMessage({ id: 'app.activity.exchangeRate' }),
      //   dataIndex: 'banner_rate',
      //   key: 'banner_rate',
      // },
      {
        title: formatMessage({ id: 'app.activity.activitytime' }),
        dataIndex: 'source_name',
        key: 'source_name',
        render: (text, record)=> (
          <div>
            <p>{formatMessage({ id: 'app.activity.start' })}：{record.begin_time}</p>
            <p>{formatMessage({ id: 'app.activity.end' })}：{record.end_time}</p>
          </div>
        )
      },
      {
        title: formatMessage({ id: 'app.activity.status' }),
        dataIndex: 'status',
        key: 'status',
        render: (text, record)=> (
          <div>
            <p>{statusList[text]}</p>
          </div>
        )
      },
      {
        title: formatMessage({ id: 'app.activity.channel' }),
        dataIndex: 'line_id',
        key: 'line_id',
        render: (text, record)=> (
          <div>
            <p>{lineList[text]}</p>
          </div>
        )
      },
      {
        title: formatMessage({ id: 'app.activity.duty' }),
        dataIndex: 'line_percent',
        key: 'line_percent',
        render: (text, record)=> (
            <p>{text}%</p>
        )
      },
      {
        title: formatMessage({ id: 'app.activity.act' }),
        dataIndex: 'act',
        key: 'act',
        width:"200px",
        render: (text, record) => {
          const keys = Object.keys(statusList)
          const status = keys.filter((item)=>{
              if(record.status != item){
                return item;
              }
          })
          return (
            <p className="active">
              <span onClick={this.onChangeStatus.bind(this,record['id'],status[0])} className={status[0] == 0 ? "danger" : null}>{statusList[status[0]]}</span>
              <span href="javastript:;" onClick={this.openModel.bind(this,record['id'])}>{ formatMessage({ id: 'app.activity.edit' })}</span>
              {/* <span href="javastript:;" onClick={this.goSuppliesData.bind(this,record['id'],record.line_id)}>{ formatMessage({ id: 'app.activity.detail' })}</span> */}
              <span href="javastript:;" className="danger" onClick={this.handleDel.bind(this,record['id'],status[0])}>{ formatMessage({ id: 'app.activity.del' })}</span>
          </p>
          )
        }
      },
     
    ];
    return (
      <div className="content-box">
        <style>
          {`
            .content-box .ant-form-vertical .ant-form-item{
              padding-bottom: 0px;
            }
            .active span{
              margin-left:6px;
              text-decoration: none !important;
              color:#1681d9;
              cursor: pointer;
            }
            .active span.danger{
              color:#ff4d4f
            }
          `}
        </style>
        <div className={styles.breadcrumbBox}>
          <Breadcrumb>
            <Breadcrumb.Item>
              <Icon type="lock" />
              <span>{formatMessage({ id: 'menu.operation' })}</span>
            </Breadcrumb.Item>
            <Breadcrumb.Item>{formatMessage({ id: 'menu.operation.activity' })}</Breadcrumb.Item>
          </Breadcrumb>
        </div>
        <div className={styles.addBtn}>
          <Card title={formatMessage({ id: 'menu.operation.activity'})} className={styles.card} bordered>
            <Form layout="vertical" hideRequiredMark>
              <Row gutter={16}>
              <Col lg={6} md={12} sm={24}>
                  <Form.Item label={formatMessage({ id:'app.activity.sucaiid'})}>
                    {getFieldDecorator('id',{
                       rules: [
                        { validator: this.isNum },
                       ]
                    })(
                      <Input
                        placeholder={formatMessage({ id: 'app.activity.psucaiid' })}
                      />
                    )}
                  </Form.Item>
                </Col>
                <Col lg={6} md={12} sm={24}>
                  <Form.Item label={formatMessage({ id: 'app.activity.pname' })}>
                    {getFieldDecorator('name')(
                      <Input
                        placeholder={formatMessage({ id: 'app.activity.name' })}
                      />
                    )}
                  </Form.Item>
                </Col>
                <Col lg={12} md={12} sm={24}>
                  <Form.Item label={formatMessage({ id: 'app.activity.activitytime' })}>
                    {getFieldDecorator('pushtime')(
                      <RangePicker
                        format="YYYY-MM-DD HH:mm:ss"
                        showTime={{
                          hideDisabledOptions: true,
                          defaultValue: [moment('00:00:00', 'HH:mm:ss'), moment('11:59:59', 'HH:mm:ss')],
                        }}
                        placeholder={[
                          formatMessage({ id: 'app.activity.starttime' }),
                          formatMessage({ id: 'app.activity.endtime' }),
                        ]}
                        style={{ width: '100%' }}
                      />
                    )}
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={16}>
              <Col lg={6} md={12} sm={24}>
                  <Form.Item label={formatMessage({ id: 'app.activity.status' })}>
                    {getFieldDecorator('status', {
                      initialValue: '',
                    })(
                      <Select>
                        <Option value="">{formatMessage({ id: 'app.activity.allstatus' })}</Option>
                        {Object.keys(statusList).map(item => {
                          return (
                            <Option key={item} value={item}>
                              {statusList[item]}
                            </Option>
                          );
                        })}
                      </Select>
                    )}
                  </Form.Item>
                </Col>
                <Col lg={6} md={12} sm={24}>
                  <Form.Item label={formatMessage({ id: 'app.activity.channel' })}>
                    {getFieldDecorator('line_id', {
                      initialValue: '',
                    })(
                      <Select>
                        <Option value="">{formatMessage({ id: 'app.activity.allchannel' })}</Option>
                        {Object.keys(lineList).map(item => {
                          return (
                            <Option key={item} value={item}>
                              {lineList[item]}
                            </Option>
                          );
                        })}
                      </Select>
                    )}
                  </Form.Item>
                </Col>
                <Col lg={6} md={12} sm={24}>
                  <Form.Item label={formatMessage({ id: 'app.activity.cate' })}>
                    {getFieldDecorator('cate', {
                      initialValue: '',
                    })(
                      <Select>
                        <Option value="">{formatMessage({ id: 'app.activity.allcate' })}</Option>
                        {Object.keys(materialCateList).map(item => {
                          return (
                            <Option key={item} value={item}>
                              {materialCateList[item]}
                            </Option>
                          );
                        })}
                      </Select>
                    )}
                  </Form.Item>
                </Col>
                <Col lg={6} md={12} sm={24}>
                    <Button
                      type="primary"
                      className={styles.btnSmt}
                      onClick={this.SearchBtnHandle}
                    >
                      {formatMessage({ id: 'app.content.search' })}
                    </Button>
                    <Button
                      type="primary"
                      className={styles.btnSmt}
                      onClick={this.openModel.bind(this,'')}
                      style={{marginLeft:'5px'}}
                    >
                      {formatMessage({ id: 'app.activity.add' })}
                    </Button>
                </Col>
              </Row>
            </Form>
          </Card>
        </div>
        <Table
            columns={columns}
            dataSource={list}
            pagination={false}
            bordered
            rowKey={(record, index) => `${record.id}${index}`}
            scroll={{ x: 2000 }}
          /> 
          <div className={styles.rightPagination}>
              <Pagination
                showTotal={total => formatMessage({ id: 'app.glob.pagetotal' },{total:total})}
                pageSizeOptions={['20', '30', '40']}
                showSizeChanger
                onShowSizeChange={onShowSizeChange}
                current={1}
                pageSize={20}
                onChange={this.handleTableChange}
                total={total_count}
              />
            </div> 
            {this.state.showModel&&
            <ActivityAdd onCallBack={this.closeModel} modifyId={this.state.modifyId}/>}         
      </div>
    );
  }
}
export default Activity;

import { del } from '@/services/users';
import { type } from '@/utils/utils';

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
} from 'antd';

import React, { PureComponent } from 'react';

import { formatMessage } from 'umi/locale';

import _ from 'lodash';

import { operationEnum, getKey } from '../../../config/role.enum';

import styles from './ImageGroup.less';
import TagAdd from './TagAdd';
import TagEdit from './TagEdit';
import { relative } from 'path';

const { Sider, Content } = Layout;
const Search = Input.Search;
const { Option } = Select;
function toParseInt(str) {
  if (str) {
    return parseInt(str || 0);
  }
  return 0;
}
const { RangePicker } = DatePicker;
const moment = require('moment');

@connect(
  ({
    users: {
      recordList:{page, total_count, list },
      callingTypeList,
      channelTypeList,
      callingStatusList,
      info,
      sex,
    },
    routing: {
      location: { pathname },
    },
    memberInfo: {
      data: { keys },
    },
  }) => ({
    list,
    callingTypeList,
    channelTypeList,
    callingStatusList,
    info,
    page,
    total_count,
    keys,
    pathname,
    sex,
  })
)
@Form.create()
class Friends extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      pagination: { 
        page_size: 20, 
        page: 1, 
        user_id:'',
        tel:'',
        nickname:'',
        gender:'',
        channel_type:'',
        calling_id:'',
        calling_status:'',
        calling_type:'',
        begin_time:'',
        end_time:'',
      },
    };
    _.bindAll(this, [
      'updataConfiList',
      'onSearch',
      'handleTableChange',
    ]);
  }
  componentDidMount() {
    const paramer = this.props.computedMatch.params;
    this.setState(
      {
        pagination: Object.assign({}, this.state.pagination, { user_id: paramer.id }),
      },
      () => {
        this.getEnumList().then(() => {
          this.updataConfiList();
        });
      }
    );
  }

  onSearch() {
    const {form} = this.props;
    const {pagination} = this.state;
    form.validateFields((err, values) => {
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
  SearchResetBtnHandle=()=>{
    this.props.form.resetFields();
    this.setState({
      pagination:{ 
        page_size: 20, 
        page: 1, 
        user_id:'',
        tel:'',
        nickname:'',
        gender:'',
        channel_type:'',
        calling_id:'',
        calling_status:'',
        calling_type:'',
        begin_time:'',
        end_time:'',
      }
    },()=>{
      this.updataConfiList();
    })
  }

  async getEnumList() {
    const { dispatch } = this.props;
    await (() => {
      dispatch({
        type: 'permission/getRoleList',
      });
    })();
    await (() => {
      dispatch({
        type: 'permission/getMemberStatusList',
      });
    })();
    dispatch({
      type: 'users/getUserSexList',
    });
    dispatch({
      type: 'users/getCallingTypeList',
    })
    dispatch({
      type: 'users/getChannelTypeList',
    })
    dispatch({
      type: 'users/getCallingStatusList',
    })
    dispatch({
      type: 'users/getUserInfo',
      payload: this.state.pagination,
    });
  }

  updataConfiList() {
    const { dispatch } = this.props;
    const paramer = this.props.computedMatch.params;
    this.setState({
        pagination: Object.assign({}, this.state.pagination, { user_id: paramer.id }),
      },()=>{
      dispatch({
        type: 'users/getRecordList',
        payload:this.state.pagination
      })
    })
  }
  handleTableChange(page) {
    const { pagination } = this.state;
    this.setState(
      {
        pagination: Object.assign({}, pagination, { page }),
      },
      () => {
        this.updataConfiList();
      }
    );
  }

  onShowSizeChange = (current, pageSize) => {
    const { pagination } = this.state;
    this.setState(
      {
        pagination: Object.assign({}, pagination, { page: current, page_size: pageSize }),
      },
      () => {
        this.updataConfiList();
      }
    );
    console.log(current, pageSize);
  };

  render() {
    const {
      list,
      page,
      total_count,
      info,
      roleList,
      statusList,
      callingTypeList,
      channelTypeList,
      callingStatusList,
      keys,
      pathname,
      sex,
      form: { getFieldDecorator },
    } = this.props;
    const { pagination } = this.state;
    const { onShowSizeChange } = this;
    const columns = [
      {
        title: formatMessage({ id: 'app.users.id' }),
        dataIndex: 'user_id',
        key: 'user_id',
        width: '80px',
      },
      {
        title: formatMessage({ id: 'app.users.avatar' }),
        dataIndex: 'avatar',
        key: 'avatar',
        width: '120px',
        render:(text)=>(
            <img style={{width:'100px',height:'100px'}} src={text} />
        )
      },
      {
        title: formatMessage({ id: 'app.users.Name' }),
        dataIndex: 'nickname',
        key: 'nickname',
        width: '150px',
      },
      {
        title: formatMessage({ id: 'app.users.phone' }),
        dataIndex: 'telephone',
        key: 'telephone',
        width: '100px',
      },
      {
        title: formatMessage({ id: 'app.users.sex' }),
        dataIndex: 'gender_name',
        key: 'gender_name',
        width: '80px',
      },
      {
        title: formatMessage({ id: 'app.records.goCallCategory' }),
        dataIndex: 'channel_type_name',
        key: 'channel_type_name',
        width: '150px',
      },
      {
        title: formatMessage({ id: 'app.records.status' }),
        dataIndex: 'calling_status_name',
        key: 'calling_status_name',
        width: '100px',
      },
      {
        title: formatMessage({ id: 'app.records.callOutCategory' }),
        dataIndex: 'calling_type_name',
        key: 'calling_type_name',
        width: '100px',
      },
      {
        title: formatMessage({ id: 'app.records.callTimes' }),
        dataIndex: 'duration',
        key: 'duration',
        width: '100px',
        render: text => {
          return `${text}${formatMessage({ id: 'app.users.min' })}`;
        },
      },
      {
        title: formatMessage({ id: 'app.users.date' }),
        dataIndex: 'calling_time',
        key: 'calling_time',
        width: '220px',
      },
    ];
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
            `}
        </style>
        <Layout>
          <Sider theme={'light'} style={{ marginRight: '10px', border: '1px solid #e8e8e8' }}>
            <Menu
              defaultSelectedKeys={['key222']}
              className={'l-menu-style'}
              style={{ position: 'relative', border: 0 }}
            >
              <Menu.Item key={'key111'} style={{ position: 'relative', border: 0 }}>
                <Link to={`/operation/user/list/friends/${this.state.pagination.user_id}`}>
                  {formatMessage({ id: 'app.friends.friendsManage' })}
                </Link>
              </Menu.Item>
              <Menu.Item key={'key222'} style={{ position: 'relative', border: 0 }}>
                {formatMessage({ id: 'app.records.recordsManage' })}
              </Menu.Item>
            </Menu>
          </Sider>
          <Content>
            <div className={styles.breadcrumbBox}>
              <Breadcrumb>
                <Breadcrumb.Item>
                  <Icon type="lock" />
                  <span>{formatMessage({ id: 'menu.operation' })}</span>
                </Breadcrumb.Item>
                <Breadcrumb.Item>
                  <Link to="/operation/user/list">{formatMessage({ id: 'menu.operation.user.list' })}</Link>
                </Breadcrumb.Item>
                <Breadcrumb.Item>
                  {formatMessage({ id: 'app.records.recordsManage' })}
                </Breadcrumb.Item>
              </Breadcrumb>
            </div>
            <div className={styles.addBtn}>
              <Card
                title={formatMessage({ id: 'app.records.recordsManage' })}
                className={'styles-card'}
                bordered
                extra={
                  <span>
                    {info.nickname || '匿名用户'}：{info.telephone}
                  </span>
                }
              >
                <Form layout="vertical" hideRequiredMark>
                  <Row gutter={16} className="regDate">
                    <Col lg={6} md={12} sm={24}>
                      <Form.Item label={formatMessage({ id: 'app.users.id' })}>
                        {getFieldDecorator('calling_id')(
                          <Input placeholder={formatMessage({ id: 'app.users.pleaseID' })} />
                        )}
                      </Form.Item>
                    </Col>
                    <Col lg={6} md={12} sm={24}>
                      <Form.Item label={formatMessage({ id: 'app.users.Name' })}>
                        {getFieldDecorator('nickname')(
                          <Input placeholder={formatMessage({ id: 'app.users.pleaseName' })} />
                        )}
                      </Form.Item>
                    </Col>
                    <Col lg={6} md={12} sm={24}>
                      <Form.Item label={formatMessage({ id: 'app.friends.callDate' })}>
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
                    <Col lg={6} md={12} sm={24}>
                      <Form.Item label={formatMessage({ id: 'app.users.sex' })}>
                        {getFieldDecorator('gender', {
                          initialValue: '',
                        })(
                          <Select>
                            <Option value="">{formatMessage({ id: 'app.users.allSex' })}</Option>
                              {
                                Object.keys(sex).map((item)=>{
                                  return  <Option key={item} value={item}>{sex[item]}</Option>
                                })
                              }
                          </Select>
                        )}
                      </Form.Item>
                    </Col>
                  </Row>
                  <Row gutter={16}>
                    <Col lg={6} md={12} sm={24}>
                      <Form.Item label={formatMessage({ id: 'app.records.onState' })}>
                        {getFieldDecorator('calling_status', {
                          initialValue: '',
                        })(
                          <Select>
                            <Option value="">
                              {formatMessage({ id: 'app.records.allStatus' })}
                            </Option>
                              {
                                Object.keys(callingStatusList).map((item)=>{
                                  return  <Option key={item} value={item}>{callingStatusList[item]}</Option>
                                })
                              }
                          </Select>
                        )}
                      </Form.Item>
                    </Col>
                    <Col lg={6} md={12} sm={24}>
                      <Form.Item label={formatMessage({ id: 'app.records.callCategory' })}>
                        {getFieldDecorator('channel_type', {
                          initialValue:  '',
                        })(
                          <Select>
                            <Option value="">
                              {formatMessage({ id: 'app.records.allCategory' })}
                            </Option>
                                {
                                  Object.keys(channelTypeList).map((item)=>{
                                    return  <Option key={item} value={item}>{channelTypeList[item]}</Option>
                                  })
                                }
                          </Select>
                        )}
                      </Form.Item>
                    </Col>
                    <Col lg={6} md={12} sm={24}>
                      <Form.Item label={formatMessage({ id: 'app.records.callOutCategory' })}>
                        {getFieldDecorator('calling_type', {
                          initialValue:'',
                        })(
                          <Select>
                            <Option value="">
                              {formatMessage({ id: 'app.records.allCategory' })}
                            </Option>
                            {
                              Object.keys(callingTypeList).map((item)=>{
                                return  <Option key={item} value={item}>{callingTypeList[item]}</Option>
                              })
                            }
                          </Select>
                        )}
                      </Form.Item>
                    </Col>
                    <Col lg={6} md={12} sm={24}>
                      <Button
                        type="primary"
                        className={styles.btnSmt}
                        onClick={this.onSearch}
                      >
                        {formatMessage({ id: 'app.content.search' })}
                      </Button>
                      <Button
                        className={styles.btnSmt}
                        style={{ marginLeft: 8 }}
                        onClick={this.SearchResetBtnHandle}
                      >
                        {formatMessage({ id: 'app.content.reset' })}
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
              scroll={{ x: 1300 }}
              rowKey={(record, index) => `${record.id}${index}`}
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
                total={toParseInt(total_count)}
              />
            </div>
          </Content>
        </Layout>
      </div>
    );
  }
}
export default Friends;

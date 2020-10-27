import { del } from '@/services/tag';
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
import { relative } from 'path';

const { RangePicker } = DatePicker;
const moment = require('moment');
const { Sider, Content } = Layout;
const Search = Input.Search;
const { Option } = Select;
function toParseInt(str) {
  if (str) {
    return parseInt(str || 0);
  }
  return 0;
}

@connect(
  ({
    users: {
      friend: { list, page, total_count },
      info,
      sex,
      friendSource,
      relationList,
      country,
      status,
    },
    routing: {
      location: { pathname },
    },
    memberInfo: {
      data: { keys },
    },
  }) => ({
    list,
    info,
    page,
    total_count,
    keys,
    pathname,
    sex,
    friendSource,
    relationList,
    country,
    status,
  })
)
@Form.create()
class Friends extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      pagination: { page_size: 20, page: props.page, total_count: props.total_count },
      addVisible: false,
      editVisible: false,
      editDataSource: {},
    };
    _.bindAll(this, [
      'updataConfiList',
      'addVisbleHandle',
      'handleTableChange',
      'delRole',
      'onCloseEditModel',
      'userEdit',
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
  SearchResetBtnHandle = () => {
    const { pagination } = this.state;
    this.props.form.resetFields();
    this.setState(
      {
        pagination: Object.assign({}, pagination, {
          page: 1,
          page_size: 20,
          status: '',
          name: '',
          sex: '',
          telephone: '',
          country: '',
          begin_time: '',
          end_time: '',
        }),
      },
      () => {
        this.updataConfiList();
      }
    );
  };
  SearchBtnHandle = () => {
    this.props.form.validateFields((err, values) => {
      const { pagination } = this.state;
      let time = {};
      if (values.pushtime && type(values.pushtime) === 'array') {
        time = {
          create_date_start: moment(values.pushtime[0]).format('YYYY-MM-DD') + ' 00:00:00',
          create_date_end: moment(values.pushtime[1]).format('YYYY-MM-DD') + ((moment(values.pushtime[0]).format('YYYY-MM-DD') == moment(values.pushtime[1]).format('YYYY-MM-DD')) ? ' 23:59:59' : ' 00:00:00'),
        };
      }
      // if (values.checktime && type(values.checktime) === 'array') {
      //   time = Object.assign({}, time, {
      //     update_date_start: moment(values.checktime[0]).format('YYYY-MM-DD') + ' 00:00:00',
      //     update_date_end: moment(values.checktime[0]).format('YYYY-MM-DD') + moment(values.pushtime[0]).format('YYYY-MM-DD')==moment(values.pushtime[1]).format('YYYY-MM-DD')?' 23:59:59':' 00:00:00',
      //   });
      // }
      delete values['pushtime'];
      this.setState(
        {
          pagination: Object.assign({}, pagination, values, { page: 1, ...time }),
        },
        () => {
          this.updataConfiList();
        }
      );
    });
  };

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
      type: 'users/getCountryList',
    });
    dispatch({
      type: 'users/getUserInfo',
      payload: this.state.pagination,
    });
    dispatch({
      type: 'users/getFriendSourceList',
    });
    dispatch({
      type: 'users/getRelationList',
    });
  }

  updataConfiList() {
    const { dispatch } = this.props;
    const { pagination } = this.state;
    dispatch({
      type: 'users/getFriendList',
      payload: pagination,
    });
  }
  addVisbleHandle(refresh) {
    this.setState({ addVisible: !this.state.addVisible }, () => {
      refresh === 'refresh' && this.updataConfiList();
    });
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

  delRole(id) {
    del({ id })
      .then(res => {
        if (!res.code) {
          this.updataConfiList();
        }
      })
      .catch(e => {
        console.log(e);
      });
  }
  userEdit(record) {
    this.setState({ editDataSource: record }, () => {
      this.onCloseEditModel();
    });
  }
  onCloseEditModel(refresh) {
    this.setState({ editVisible: !this.state.editVisible }, () => {
      refresh === 'refresh' && this.updataConfiList();
    });
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
      keys,
      sex,
      pathname,
      friendSource,
      relationList,
      form: { getFieldDecorator },
      country,
      status
    } = this.props;
    const { addVisible, editVisible, editDataSource } = this.state;
    const { onShowSizeChange } = this;
    const columns = [
      {
        title: formatMessage({ id: 'app.users.id' }),
        dataIndex: 'id',
        key: 'id',
        width: '80px',
      },
      {
        title: formatMessage({ id: 'app.users.avatar' }),
        dataIndex: 'avatar',
        key: 'avatar',
        width: '100px',
        render: (text, record) => {
          //   const getRandomColor = (function () {
          //     var r = Math.round(Math.random() * 255), g = Math.round(Math.random() * 255), b = Math.round(Math.random() * 255);
          //     var color = r << 16 | g << 8 | b;
          //     return "#" + color.toString(16)
          // }())
          const styleColore = {
            background: '#4fbcff',
            width: `60px`,
            height: '60px',
            color: '#fff',
            borderRadius: '50%',
            lineHeight: '60px',
            textAlign: 'center',
          };
          if (!text) {
            return (
              <div style={styleColore}>
                <Icon style={{ fontSize: '24px', lineHeight: '60px', color: '#fff' }} type="user" />
              </div>
            );
          }
          return <img style={styleColore} src={text} />;
        },
      },
      {
        title: formatMessage({ id: 'app.users.Name' }),
        dataIndex: 'nickname',
        key: 'nickname',
        width: '100px',
        render: (text, record) => {
          text = text || '';
          var name = text.length > 6 ? `${text.substring(0, 6)}...` : text;
          return <p title={text}>{name}</p>;
        },
      },
      {
        title: formatMessage({ id: 'app.users.slaveNickname' }),
        dataIndex: 'slave_nickname',
        key: 'slave_nickname',
        width: '100px',
        render: (text, record) => {
          text = text || '';
          var name = text.length > 6 ? `${text.substring(0, 6)}...` : text;
          return <p title={text}>{name}</p>;
        },
      },
      {
        title: formatMessage({ id: 'app.users.phone' }),
        dataIndex: 'telephone',
        key: 'telephone',
        width: '100px',
      },
      {
        title: formatMessage({ id: 'app.users.sex' }),
        dataIndex: 'sex',
        key: 'sex',
        width: '100px',
        render: (text, record) => {
          return sex[text];
        },
      },
      {
        title: formatMessage({ id: 'app.friends.registerStatus' }),
        dataIndex: 'friend_status',
        key: 'friend_status',
        width: '100px',
        render: (text, record) => {
          return relationList[text];
        },
      },
      {
        title: formatMessage({ id: 'app.friends.friendSource' }),
        dataIndex: 'friend_source',
        key: 'friend_source',
        width: '100px',
        render: text => {
          return friendSource[text];
        },
      },
      {
        title: formatMessage({ id: 'app.users.state' }),
        dataIndex: 'country',
        key: 'country',
        width: '100px',
        render: (text, record) => {
          return country[text];
        },
      },
      // {
      //   title: formatMessage({ id: 'app.friends.callTimes' }),
      //   dataIndex: 'call_count',
      //   key: 'call_count',
      //   width: '130px',
      // },
      {
        title: formatMessage({ id: 'app.friends.videoTimes' }),
        dataIndex: 'call_count',
        key: 'call_count',
        width: '130px',
      },
      // {
      //   title: formatMessage({ id: 'app.friends.soundTimes' }),
      //   dataIndex: 'soundTimes',
      //   key: 'soundTimes',
      //   width: '100px',

      // },
      {
        title: formatMessage({ id: 'app.users.date' }),
        dataIndex: 'date',
        key: 'date',
        width: '220px',
        render: (text, record) => {
          return (
            <div>
              <p>{formatMessage({ id: 'app.friends.currentCall' })}:{record.create_at}</p>
              <p>{formatMessage({ id: 'app.friends.registerDate' })}:{record.update_at}</p>
            </div>
          );
        },
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
              defaultSelectedKeys={['key111']}
              className={'l-menu-style'}
              style={{ position: 'relative', border: 0 }}
            >
              <Menu.Item key={'key111'} style={{ position: 'relative', border: 0 }}>
                {' '}
                {formatMessage({ id: 'app.friends.friendsManage' })}
              </Menu.Item>
              <Menu.Item key={'key222'} style={{ position: 'relative', border: 0 }}>
                <Link to={`/operation/user/list/records/${this.state.pagination.user_id}`}>
                  {' '}
                  {formatMessage({ id: 'app.records.recordsManage' })}
                </Link>
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
                  {formatMessage({ id: 'app.friends.friendsManage' })}
                </Breadcrumb.Item>
              </Breadcrumb>
            </div>
            <div className={styles.addBtn}>
              <Card
                title={formatMessage({ id: 'app.friends.friendsManage' })}
                className={'styles-card'}
                bordered
                extra={
                  <span>
                    {info.nickname || '匿名用户'}：{info.telephone}
                  </span>
                }
              >
                <Form layout="vertical" hideRequiredMark>
                  <Row gutter={16}>
                    <Col lg={6} md={12} sm={24}>
                      <Form.Item label={formatMessage({ id: 'app.users.id' })}>
                        {getFieldDecorator('id')(
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
                      <Form.Item label={formatMessage({ id: 'app.users.sex' })}>
                        {getFieldDecorator('sex', {
                          initialValue: '',
                        })(
                          <Select>
                            <Option value="">{formatMessage({ id: 'app.users.allSex' })}</Option>
                            {Object.keys(sex).map(item => {
                              return (
                                <Option key={item} value={item}>
                                  {sex[item]}
                                </Option>
                              );
                            })}
                          </Select>
                        )}
                      </Form.Item>
                    </Col>
                    <Col lg={6} md={12} sm={24}>
                      <Form.Item label={formatMessage({ id: 'app.friends.registerStatus' })}>
                        {getFieldDecorator('type', {
                          initialValue: '',
                        })(
                          <Select>
                            <Option value="">
                              {formatMessage({ id: 'app.friends.allStatus' })}
                            </Option>
                            {Object.keys(relationList).map(item => {
                              return (
                                <Option key={item} value={item}>
                                  {relationList[item]}
                                </Option>
                              );
                            })}
                          </Select>
                        )}
                      </Form.Item>
                    </Col>
                  </Row>
                  <Row gutter={16} className="regDate">
                    <Col lg={6} md={12} sm={24}>
                      <Form.Item label={formatMessage({ id: 'app.users.phone' })}>
                        {getFieldDecorator('telephone')(
                          <Input placeholder={formatMessage({ id: 'app.users.pleasephone' })} />
                        )}
                      </Form.Item>
                    </Col>
                    <Col lg={6} md={12} sm={24}>
                      <Form.Item label={formatMessage({ id: 'app.friends.callDate' })}>
                        {getFieldDecorator('pushtime')(
                          <RangePicker
                            placeholder={[
                              formatMessage({ id: 'app.users.startRegDate1' }),
                              formatMessage({ id: 'app.users.endRegDate1' }),
                            ]}
                            style={{ width: '100%' }}
                          />
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
                current={toParseInt(this.state.pagination.page)||1}
                pageSize={this.state.pagination.page_size||20}
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

import { type } from '@/utils/utils';
import { reply } from '@/services/customer';
import { getLanguageList } from '@/services/content';
import { getAuthority } from '@/utils/authority';
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

import { serviceFaqStatus } from '../../../config/role.enum';

import styles from './Group.less';

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

/**
 * 枚举
 * status  1 未回复
 * status  2 已回复
 * status  3 驳回
 */

@connect(
  ({
    customer: {
      data: { list, page, total_count },
      category,
      version,
      statusList,
      customer: { customer_list },
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
    keys,
    pathname,
    category,
    version,
    statusList,
    customer_list,
  })
)
@Form.create()
class Customer extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      pagination: { page_size: 20, page: props.page, total_count: props.total_count },
      selectedRowKeys: [],
      selectedRowKeys1: [],
      languageList: []
    };
    _.bindAll(this, ['updataConfiList', 'handleTableChange']);
  }
  componentDidMount() {
    this.getEnumList().then(() => {
      this.updataConfiList();
    });
    getLanguageList({ token: getAuthority() })
      .then(res => {
        if (!res.code) {
          this.setState({
            languageList: res.data
          })
        }
      })
  }

  goResolve = () => { };
  rejectHandel = id => {
    reply({
      ids: id + '',
      status: 3,
    }).then(res => {
      if (res && !res.code) {
        this.updataConfiList();
      }
    });
  };

  batchRejectHandel = () => {
    const { selectedRowKeys1, selectedRowKeys } = this.state;
    if (!selectedRowKeys1.length) {
      return;
    }
    reply({
      ids: selectedRowKeys1.join(','),
      status: 3,
    }).then(res => {
      if (!res.code) {
        this.setState({
          selectedRowKeys: [],
          selectedRowKeys1: []
        })
        this.updataConfiList();
      }
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
      dispatch({
        type: 'customer/getCategory',
      });
    })();

    dispatch({
      type: 'customer/getAllVersion',
    });
    dispatch({
      type: 'customer/getFeedbackStatusList',
    });
    dispatch({
      type: 'customer/getCustomer',
    });
  }

  updataConfiList() {
    const { dispatch } = this.props;
    const { pagination } = this.state;
    dispatch({
      type: 'customer/getList',
      payload: pagination,
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
          version: '',
          operater_id: '',
          telephone: '',
          category: '',
          create_date_start: '',
          create_date_end: '',
          update_date_start: '',
          update_date_end: '',
        },
      },
      () => {
        this.updataConfiList();
      }
    );
  };

  SearchBtnHandle = (e, isExport = 0) => {
    this.props.form.validateFields((err, values) => {
      if (err) {
        return
      }
      const { pagination } = this.state;
      let time = {};
      if (values.pushtime && type(values.pushtime) === 'array') {
        time = {
          create_date_start: moment(values.pushtime[0]).format('YYYY-MM-DD') + ' 00:00:00',
          create_date_end: moment(values.pushtime[1]).format('YYYY-MM-DD') + ((moment(values.pushtime[0]).format('YYYY-MM-DD') == moment(values.pushtime[1]).format('YYYY-MM-DD')) ? ' 23:59:59' : ' 00:00:00'),
        };
      }
      if (values.checktime && type(values.checktime) === 'array') {
        time = Object.assign({}, time, {
          update_date_start: moment(values.checktime[0]).format('YYYY-MM-DD') + ' 00:00:00',
          update_date_end: moment(values.checktime[0]).format('YYYY-MM-DD') + ((moment(values.pushtime[0]).format('YYYY-MM-DD') == moment(values.pushtime[1]).format('YYYY-MM-DD')) ? ' 23:59:59' : ' 00:00:00'),
        });
      }
      delete values['pushtime'];
      delete values['checktime'];
      this.setState(
        {
          pagination: Object.assign({}, pagination, values, { export: isExport, page: 1, ...time }),
        },
        () => {
          this.updataConfiList();
        }
      );
    });
  };

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
    // console.log(current, pageSize);
  };

  validateTel = (rule, value, callback) => {
    const form = this.props.form;
    const reg = /^1([38][0-9]|4[579]|5[0-3,5-9]|6[6]|7[0135678]|9[89])\d{8}$/;
    if (value && !reg.test(value)) {
      callback(formatMessage({ id: 'app.feedback.pleaseRightPhone' }));
    } else {
      callback();
    }
  }

  render() {
    const {
      list,
      page,
      total_count,
      roleList,
      statusList,
      keys,
      pathname,
      category,
      version,
      customer_list,
      form: { getFieldDecorator },
    } = this.props;
    const { addVisible, editVisible, editDataSource, selectedRowKeys, languageList } = this.state;
    const { onShowSizeChange } = this;
    console.log(category,'categorycategorycategory')
    const rowSelection = {

      onChange: (selectedRowKeys, selectedRows) => {
        let itemm;
        itemm = selectedRows.map(item => {
          return item.id;
        });
        this.setState({
          selectedRowKeys1: itemm,
          selectedRowKeys
        });
        // console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
      },
      selectedRowKeys,
    };

    const columns = [
      {
        title: formatMessage({ id: 'app.users.id' }),
        dataIndex: 'id',
        key: 'id',
        width: '80px',
      },
      {
        title: formatMessage({ id: 'app.feedback.feedbackID' }),
        dataIndex: 'user_id',
        key: 'user_id',
        width: '100px',
      },
      {
        title: formatMessage({ id: 'app.users.phone' }),
        dataIndex: 'tell',
        key: 'tell',
        width: '100px',
      },
      {
        title: formatMessage({ id: 'app.feedback.resolveDate' }),
        dataIndex: 'create_at',
        key: 'create_at',
        width: '120px',
      },
      // {
      //   title: formatMessage({ id: 'app.feedback.language' }),
      //   dataIndex: 'lan',
      //   key: 'lan',
      //   width: '120px',
      //   render: (text, record) => {
      //     return !!languageList.length && languageList.filter(item => {
      //       return item.value == text
      //     })[0].name
      //   }
      // },
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
        title: formatMessage({ id: 'app.feedback.issueCategory' }),
        dataIndex: 'category',
        key: 'category',
        width: '100px',
        render: (text, record) => {
          const arr = category.filter((item) => {
            return text == item.id
          })[0]
          if (arr) {
            return arr.name;
          } else {
            return ''
          }
        },
      },
      {
        title: formatMessage({ id: 'app.feedback.allVersions' }),
        dataIndex: 'version',
        key: 'version',
        width: '100px',
        render: (text, record) => {
          return text;
        },
      },
      {
        title: formatMessage({ id: 'app.feedback.osVersion' }),
        dataIndex: 'os_version',
        key: 'os_version',
        width: '200px',
      },
      {
        title: formatMessage({ id: 'app.feedback.device' }),
        dataIndex: 'device_brand',
        key: 'device_brand',
        render: (value, record) => {
          return `${record.device_brand}  ${record.device_version}`;
        }
      },
      {
        title: formatMessage({ id: 'app.feedback.source' }),
        dataIndex: 'source',
        key: 'source',
      },
      {
        title: formatMessage({ id: 'app.feedback.network' }),
        dataIndex: 'network',
        key: 'network',
      },
      {
        title: formatMessage({ id: 'app.withdraw.id' }),
        dataIndex: 'order_id',
        key: 'order_id',
      },
      {
        title: formatMessage({ id: 'app.feedback.resolveTime' }),
        dataIndex: 'update_at',
        key: 'update_at',
        width: '100px',
        render: (text, record) => {
          if (record.status == 1) {
            return '';
          }
          return text;
        },
      },
      {
        title: formatMessage({ id: 'app.feedback.resolveCustomer' }),
        dataIndex: 'operater_nickname',
        key: 'operater_nickname',
        width: '100px',
      },
      {
        title: formatMessage({ id: 'app.feedback.replyContent' }),
        dataIndex: 'reply_content',
        key: 'reply_content',
        width: '130px',
        render: (text, record) => {
          text = text || '';
          var name = text.length > 40 ? `${text.substring(0, 40)}...` : text;
          return <p title={text}>{name}</p>;
        },
      },
      {
        title: formatMessage({ id: 'app.feedback.feedbackContent' }),
        dataIndex: 'content',
        key: 'content',
        width: '130px',
        render: (text, record) => {
          text = text || '';
          var name = text.length > 40 ? `${text.substring(0, 40)}...` : text;
          return <p title={text}>{name}</p>;
        },
      },
      // {
      //   title: formatMessage({ id: 'app.feedback.rejectStatus' }),
      //   dataIndex: 'status',
      //   key: 'status',
      //   width: '130px',
      //   render: text => {
      //     return statusList[text];
      //   },
      // },
      {
        title: formatMessage({ id: 'app.feedback.operation' }),
        dataIndex: 'action',
        key: 'action',
        width: '220px',
        fixed:'right',
        render: (text, record) => {
          return (
            <span>
              {record.status == 1 && (
                <Link to={`/feedback/customer/detail/${record.id}`}>
                  {' '}
                  {formatMessage({ id: 'app.feedback.goResolve' })}
                </Link>
              )}
              {record.status != 1 && (
                <Link to={`/feedback/customer/detail/${record.id}`}>
                  {' '}
                  {formatMessage({ id: 'app.feedback.seeDetail' })}
                </Link>
              )}
              {record.status == 1 && (
                <span>
                  <Divider type="vertical" />
                  <Popconfirm
                    title={formatMessage({ id: 'app.feedback.makesureREJECT' })}
                    onConfirm={() => this.rejectHandel(record.id)}
                  >
                    <a href="#" className={styles.dengerColor}>
                      {formatMessage({ id: 'app.feedback.reject' })}
                    </a>
                  </Popconfirm>
                </span>
              )}
            </span>
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

        <div className={styles.breadcrumbBox}>
        <Breadcrumb style={{borderBottom:' 1px solid #ccc',paddingBottom:' 10px'}}>
            <Breadcrumb.Item>
              <Icon type="lock" />
              <span>{formatMessage({ id: 'menu.feedback' })}</span>
            </Breadcrumb.Item>
            <Breadcrumb.Item>{formatMessage({ id: 'menu.feedback.customer' })}</Breadcrumb.Item>
          </Breadcrumb>
        </div>
        <div className={styles.addBtn}>
          <Card
            title={formatMessage({ id: 'menu.feedback.customer' })}
            className={'styles-card'}
            bordered
          >
            <Form layout="vertical" hideRequiredMark>
              <Row gutter={16}>
                <Col lg={6} md={12} sm={24}>
                  <Form.Item label={formatMessage({ id: 'app.feedback.feedbackID' })}>
                    {getFieldDecorator('user_id')(
                      <Input placeholder={formatMessage({ id: 'app.feedback.pleaseID' })} />
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
                  <Form.Item label={formatMessage({ id: 'app.feedback.phone' })}>
                    {getFieldDecorator('telephone', {
                      rules: [
                        {
                          validator: this.validateTel,
                        }
                      ]
                    })(
                      <Input placeholder={formatMessage({ id: 'app.feedback.pleasePhone' })} />
                    )}
                  </Form.Item>
                </Col>
                <Col lg={6} md={12} sm={24}>
                  <Form.Item label={formatMessage({ id: 'app.feedback.customers' })}>
                    {getFieldDecorator('operater_id', {
                      initialValue: '',
                    })(
                      <Select>
                        <Option value="">
                          {formatMessage({ id: 'app.feedback.allCustomers' })}
                        </Option>
                        {customer_list.map((item, index) => {
                          return (
                            <Option key={index} value={item.id}>
                              {item.nickname}
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
                  <Form.Item label={formatMessage({ id: 'app.feedback.feedbackTime' })}>
                    {getFieldDecorator('pushtime')(<RangePicker />)}
                  </Form.Item>
                </Col>
                <Col lg={6} md={12} sm={24}>
                  <Form.Item label={formatMessage({ id: 'app.feedback.resolveTime' })}>
                    {getFieldDecorator('checktime')(<RangePicker />)}
                  </Form.Item>
                </Col>
                <Col lg={6} md={12} sm={24}>
                  <Form.Item label={formatMessage({ id: 'app.feedback.issueCategory' })}>
                    {getFieldDecorator('category')(
                      <Select placeholder={formatMessage({ id: 'app.feedback.issueCategory' })}>
                        {category && category.length && category.map((item, index) => {
                          return (
                            <Option key={index} value={item.id}>
                              {item.name}
                            </Option>
                          );
                        })}
                      </Select>
                    )}
                  </Form.Item>
                </Col>
                {/* <Col lg={6} md={12} sm={24}>
                  <Form.Item label={formatMessage({ id: 'app.feedback.issueStatus' })}>
                    {getFieldDecorator('status', {
                      initialValue: '',
                    })(
                      <Select>
                        <Option value="">
                          {formatMessage({ id: 'app.feedback.allIssueStatus' })}
                        </Option>
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
                </Col> */}
              </Row>
              <Row gutter={16} className="regDate">
                {/* <Col lg={6} md={12} sm={24}>
                  <Form.Item label={formatMessage({ id: 'app.feedback.versions' })}>
                    {getFieldDecorator('version', {
                      initialValue: '',
                    })(
                      <Select>
                        <Option value="">
                          {formatMessage({ id: 'app.feedback.allVersions' })}
                        </Option>
                        {version.list.map((item, index) => {
                          return (
                            <Option key={index} value={item}>
                              {item}
                            </Option>
                          );
                        })}
                      </Select>
                    )}
                  </Form.Item>
                </Col> */}
                {/* <Col lg={6} md={12} sm={24}>
                  <Form.Item label={formatMessage({ id: 'app.feedback.language' })}>
                    {getFieldDecorator('lan', {
                      initialValue: '',
                    })(
                      <Select>
                        <Option value="">
                          {formatMessage({ id: 'app.feedback.alllanguage' })}
                        </Option>
                        {!!languageList.length && languageList.map((item, index) => {
                          return (
                            <Option key={index} value={item.value}>
                              {item.name}
                            </Option>
                          );
                        })}
                      </Select>
                    )}
                  </Form.Item>
                </Col> */}
                <Col lg={10} md={12} sm={24}>
                  <Button type="primary" className={styles.btnSmt} onClick={this.SearchBtnHandle}>
                    {formatMessage({ id: 'app.content.search' })}
                  </Button>
                  <Button type="primary" style={{ marginLeft: 8 }} className={styles.btnSmt} onClick={(e) => this.SearchBtnHandle(e, 1)}>
                    {formatMessage({ id: 'app.content.export' })}
                  </Button>
                  <Button
                    className={styles.btnSmt}
                    style={{ marginLeft: 8 }}
                    onClick={this.SearchResetBtnHandle}
                  >
                    {formatMessage({ id: 'app.content.reset' })}
                  </Button>
                  <Button
                    type="danger"
                    className={styles.btnSmt}
                    style={{ marginLeft: 8 }}
                    onClick={this.batchRejectHandel}
                  >
                    {formatMessage({ id: 'app.feedback.batchreject' })}
                  </Button>
                </Col>
              </Row>
            </Form>
          </Card>
        </div>
        <Table
          rowSelection={rowSelection}
          columns={columns}
          dataSource={list}
          pagination={false}
          bordered
          scroll={{ x: 2000 }}
          rowKey={(record, index) => `${record.id}${index}`}
        />
        <div className={styles.rightPagination}>
          <Pagination
            showTotal={total => formatMessage({ id: 'app.glob.pagetotal' }, { total: total })}
            pageSizeOptions={['20', '30', '40']}
            showSizeChanger
            onShowSizeChange={onShowSizeChange}
            current={toParseInt(page)}
            pageSize={this.state.pagination.page_size||20}
            onChange={this.handleTableChange}
            total={toParseInt(total_count)}
          />
        </div>
      </div>
    );
  }
}
export default Customer;

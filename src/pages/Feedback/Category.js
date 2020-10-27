import { type } from '@/utils/utils';

import { reply } from '@/services/customer';

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
class Faq extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      pagination: { page_size: 20, page: props.page, total_count: props.total_count },
      selectedRowKeys: [],
    };
    _.bindAll(this, ['updataConfiList', 'handleTableChange']);
  }
  componentDidMount() {
    this.getEnumList().then(() => {
      this.updataConfiList();
    });
  }

  goResolve = () => {};
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
    const { selectedRowKeys } = this.state;
    if (!selectedRowKeys.length) {
      return;
    }
    reply({
      ids: selectedRowKeys.join(','),
      status: 3,
    }).then(res => {
      if (!res.code) {
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
    })();

    dispatch({
      type: 'customer/getCategory',
    });
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

  SearchBtnHandle = () => {
    this.props.form.validateFields((err, values) => {
      const { pagination } = this.state;
      let time = {};
      if (values.pushtime && type(values.pushtime) === 'array') {
        time = {
          create_date_start: moment(values.pushtime[0]).format('YYYY-MM-DD') + ' 00:00:00',
          create_date_end: moment(values.pushtime[1]).format('YYYY-MM-DD') + ' 00:00:00',
        };
      }
      if (values.checktime && type(values.checktime) === 'array') {
        time = Object.assign({}, time, {
          update_date_start: moment(values.checktime[0]).format('YYYY-MM-DD') + ' 00:00:00',
          update_date_end: moment(values.checktime[0]).format('YYYY-MM-DD') + ' 00:00:00',
        });
      }
      delete values['pushtime'];
      delete values['checktime'];
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
      roleList,
      statusList,
      keys,
      pathname,
      category,
      version,
      customer_list,
      form: { getFieldDecorator },
    } = this.props;
    const { addVisible, editVisible, editDataSource } = this.state;
    const { onShowSizeChange } = this;

    const rowSelection = {
      onChange: (selectedRowKeys, selectedRows) => {
        let itemm;
        itemm = selectedRows.map(item => {
          return item.id;
        });
        this.setState({
          selectedRowKeys: itemm,
        });
        console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
      },
    };

    const columns = [
      {
        title: formatMessage({ id: 'app.faq.id' }),
        dataIndex: 'id',
        key: 'id',
        width: '80px',
      },
      {
        title: formatMessage({ id: 'app.faq.category' }),
        dataIndex: 'category',
        key: 'category',
        width: '100px',
        render: (text, record) => {

        }
      },
      {
        title: formatMessage({ id: 'app.faq.title' }),
        dataIndex: 'title',
        key: 'title',
        width: '100px',
        render: (text, record) => {
          text = text || '';
          var name = text.length > 15 ? `${text.substring(0,15)}...` : text;
          return <p title={text}>{name}</p>;
        }
      },
      {
        title: formatMessage({ id: 'app.faq.pv' }),
        dataIndex: 'pv',
        key: 'pv',
        width: '80px',
      },
      {
        title: formatMessage({ id:'app.faq.date' }),
        dataIndex: 'data',
        key: 'data',
        width: '120px',
        render: (text, record) => {
        
        },
      },
      {
        title: formatMessage({ id: 'app.faq.status' }),
        dataIndex: 'status',
        key: 'status',
        width: '100px',
        render: (text, record) => {
         
        },
      },
        
      {
        title: formatMessage({ id: 'app.feedback.operation' }),
        dataIndex: 'action',
        key: 'action',
        width: '220px',
        render: (text, record) => {
          return (
            <span>
                <Link to={`/feedback/faq/edit/${record.id}`}>
                  {formatMessage({ id: 'app.faq.edit' })}
                </Link>
                <span>
                  <Divider type="vertical" />
                  <Popconfirm
                    title={formatMessage({ id: 'app.feedback.makesureREJECT' })}
                    onConfirm={() => this.rejectHandel(record.id)}
                  >
                    <a href="#" >
                      {formatMessage({ id: 'app.faq.up' })}
                    </a>
                  </Popconfirm>
                </span>
                <span>
                  <Divider type="vertical" />
                  <Popconfirm
                    title={formatMessage({ id: 'app.feedback.makesureREJECT' })}
                    onConfirm={() => this.rejectHandel(record.id)}
                  >
                    <a href="#" className={styles.dengerColor}>
                      {formatMessage({ id: 'app.faq.down' })}
                    </a>
                  </Popconfirm>
                </span>
                <span>
                  <Divider type="vertical" />
                  <Popconfirm
                    title={formatMessage({ id: 'app.feedback.makesureREJECT' })}
                    onConfirm={() => this.rejectHandel(record.id)}
                  >
                    <a href="#" className={styles.dengerColor}>
                      {formatMessage({ id: 'app.faq.del' })}
                    </a>
                  </Popconfirm>
                </span>
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
          <Breadcrumb>
            <Breadcrumb.Item>
              <Icon type="lock" />
              <span>{formatMessage({ id: 'menu.feedback' })}</span>
            </Breadcrumb.Item>
            <Breadcrumb.Item>{formatMessage({ id: 'menu.feedback.faq' })}</Breadcrumb.Item>
          </Breadcrumb>
        </div>
        <div className={styles.addBtn}>
          <Card
            title={formatMessage({ id: 'menu.feedback.faq' })}
            className={'styles-card'}
            bordered
          >
            <Form layout="vertical" hideRequiredMark>
              <Row gutter={16}>
                <Col lg={6} md={12} sm={24}>
                  <Form.Item label={formatMessage({ id: 'app.faq.title' })}>
                    {getFieldDecorator('user_id')(
                      <Input placeholder={formatMessage({ id: 'app.faq.pleasetitle' })} />
                    )}
                  </Form.Item>
                </Col>
                <Col lg={6} md={12} sm={24}>
                  <Form.Item label={formatMessage({ id: 'app.faq.category' })}>
                    {getFieldDecorator('operater_id', {
                      initialValue: '',
                    })(
                      <Select>
                        <Option value="">
                          {formatMessage({ id: 'app.faq.allcategory' })}
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
                <Col lg={6} md={12} sm={24}>
                  <Form.Item label={formatMessage({ id: 'app.faq.status' })}>
                    {getFieldDecorator('operater_id', {
                      initialValue: '',
                    })(
                      <Select>
                        <Option value="">
                          {formatMessage({ id: 'app.faq.allstatus' })}
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
                  <Col lg={6} md={12} sm={24}>
                      <Button type="primary" className={styles.btnSmt} onClick={this.SearchBtnHandle}>
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
              <Row gutter={16} className="regDate">
                <Col lg={6} md={12} sm={24}>
                      <Button
                        type="primary"
                        className={styles.btnSmt}
                        style={{ marginLeft: 8 }}
                        onClick={this.batchRejectHandel}
                      >
                        {formatMessage({ id: 'app.faq.add' })}
                      </Button>
                      <Button
                        type="primary"
                        className={styles.btnSmt}
                        style={{ marginLeft: 8 }}
                        onClick={this.batchRejectHandel}
                      >
                        {formatMessage({ id:'app.faq.batchup' })}
                      </Button>
                      <Button
                        type="danger"
                        className={styles.btnSmt}
                        style={{ marginLeft: 8 }}
                        onClick={this.batchRejectHandel}
                      >
                        {formatMessage({ id: 'app.faq.batchdown' })}
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
          scroll={{ x: 1300 }}
          rowKey={(record, index) => `${record.id}${index}`}
        />
        <div className={styles.rightPagination}>
          <Pagination
             showTotal={total => formatMessage({ id: 'app.glob.pagetotal' },{total:total})}
            pageSizeOptions={['20', '30', '40']}
            showSizeChanger
            onShowSizeChange={onShowSizeChange}
            current={toParseInt(page)}
            pageSize={this.state.pagination.page_size}
            onChange={this.handleTableChange}
            total={toParseInt(total_count)}
          />
        </div>
      </div>
    );
  }
}
export default Faq;

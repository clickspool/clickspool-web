import { del } from '@/services/tag';
import { setUserStar } from '@/services/users';
import { type, PAYERROR } from '@/utils/utils';

import { connect } from 'dva';

import {
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
  Modal,
  Tag
} from 'antd';

import React, { PureComponent, Fragment } from 'react';

import { formatMessage } from 'umi/locale';

import _ from 'lodash';
import Link from 'umi/link';

import { operationEnum, getKey } from '../../../../config/role.enum';

import styles from './Users.less';

const { Option } = Select;
const { RangePicker } = DatePicker;
const moment = require('moment');
const Search = Input.Search;
function toParseInt(str) {
  if (str) {
    return parseInt(str || 0);
  }
  return 0;
}
const platform = {
  '1': 'Android',
  '2': 'iOS',
  '3': 'H5',
}


@connect(
  ({
    users: {
      status,
      sex,
      country,
      user_star
    },
    member: {
      data: { list, page, total_count },
      productMap,
      statusMap,
      payTypes
    },
    routing: {
      location: { pathname },
    },
    memberInfo: {
      data: { keys },
    },
    global: {
      GlobalCountryMap
    }
  }) => ({
    list,
    page,
    total_count,
    keys,
    pathname,
    status,
    sex,
    country,
    user_star,
    productMap,
    statusMap,
    payTypes,
    GlobalCountryMap
  })
)
@Form.create()
class Users extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      pagination: { page_size: 20, page: 1, total_count: props.total_count },
      addVisible: false,
      editVisible: false,
      editDataSource: {},
      showPreview: false,
      previewImg: '',
      switchover: {}
    };
    _.bindAll(this, [
      'updataConfiList',
      'SearchBtnHandle',
      'SearchResetBtnHandle',
      'handleTableChange',
    ]);
  }
  componentDidMount() {
    // console.log(CoinWrap(),'CoinWrap');
    this.getEnumList().then(() => {
      this.updataConfiList();
    });
  }
  export = () => {
    const { dispatch } = this.props;
    const { pagination } = this.state;
    dispatch({
      type: 'member/fetch',
      payload: { ...pagination, export: 1 },
    });
  }
  SearchResetBtnHandle = () => {
    const { pagination } = this.state;
    this.props.form.resetFields();
    this.setState({
      pagination: {
        page: 1,
        page_size: 20,
        begin_time: '',
        end_time: '',
      },
    },
      () => {
        this.updataConfiList();
      }
    );
  };
  SearchBtnHandle = (e, isExport = 0) => {
    this.props.form.validateFields((err, values) => {
      const { pagination } = this.state;
      let time = {};

      if (values.pushtime && values.pushtime.length > 0 && type(values.pushtime) === 'array') {
        time = {
          begin_time: moment(values.pushtime[0]).format('YYYY-MM-DD') + ' 00:00:00',
          end_time: moment(values.pushtime[1]).format('YYYY-MM-DD') + ((moment(values.pushtime[0]).format('YYYY-MM-DD') == moment(values.pushtime[1]).format('YYYY-MM-DD')) ? ' 23:59:59' : ' 00:00:00'),
        };
      } else {
        time = {
          begin_time: '',
          end_time: '',
        };
      }

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
    dispatch({
      type: 'member/statusMap',
    });
    dispatch({
      type: 'member/productMap',
    });
    dispatch({
      type: 'member/payTypes',
    });
  }

  updataConfiList() {
    const { dispatch } = this.props;
    const { pagination } = this.state;
    dispatch({
      type: 'member/fetch',
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
  };

  render() {
    const {
      list,
      page,
      total_count,
      roleList,
      keys,
      pathname,
      form: { getFieldDecorator },
      status,
      sex,
      country,
      productMap,
      statusMap,
      payTypes,
      GlobalCountryMap
    } = this.props;
    const { addVisible, editVisible, editDataSource } = this.state;
    const { onShowSizeChange } = this;
    const _this = this;
    const hasOperation = [{
      title: formatMessage({ id: 'app.user_.operation' }),
      dataIndex: 'operation',
      key: 'operation',
      width: '80px',
      render(text, record) {
        return (
          <>
            <Button type="primary" icon='edit'	>{formatMessage({ id: 'app.user_.edit' })}</Button>
          </>
        )
      }
    }];
    const columns = [...[
      {
        title: formatMessage({ id: 'app.member.order_id' }),
        dataIndex: 'order_id',
        key: 'order_id',
        width: '80px',

      },
      {
        title: "第三方平台订单号",
        dataIndex: 'other_order_id',
        key: 'other_order_id',
        width: '120px',
      },
      {
        title: formatMessage({ id: 'app.member.time' }),
        dataIndex: 'time',
        key: 'time',
        width: '130px',
        render(text, record) {
          return (
            <>
              <p>{formatMessage({ id: 'app.seed.create_at' })}：{record.create_at}</p>
              <p>{formatMessage({ id: 'app.seed.update_at' })}：{record.update_at}</p>
            </>
          )
        }
      },
      {
        title: formatMessage({ id: 'app.member.user_id' }),
        dataIndex: 'user_id',
        key: 'user_id',
        width: '80px',
        textWrap: 'word-break',
        // ellipsis: true,
      },
      {
        title: `用户注册时间`,
        dataIndex: 'register_time',
        key: 'register_time',
        width: '110px',
        textWrap: 'word-break',
        render(h) {
          if (h) {
            return <p style={{ whiteSpace: `nowrap` }}>{h.split(' ')[0]}</p>
          }
        },
      },
      {
        title: formatMessage({ id: 'app.member.package_name' }),
        dataIndex: 'product_id',
        key: 'product_id',
        width: '100px',
        textWrap: 'word-break',
        render(text, record) {

          const product_info = JSON.parse(record.product_info)
          if (product_info) {
            // return product_info.name
            return  <p style={{ wordWrap: `break-word`,whiteSpace: `normal`, wordBreak:`break-all`}}>{product_info.name}</p>
          }
          return ''

        }
      },
      {
        title: formatMessage({ id: 'app.member.price_dollar' }),
        dataIndex: 'price_dollar',
        key: 'price_dollar',
        width: '80px',
        render(text, record) {
          const product_info = JSON.parse(record.product_info)
          if (product_info) {
            return <p style={{ whiteSpace: `nowrap` }}>{product_info.real_price}</p>
          }
          return ''
        }
      },
      {
        title: formatMessage({ id: 'app.member.pay_type' }),
        dataIndex: 'pay_type',
        key: 'pay_type',
        width: '120px',
        render(text, record) {
          let ordId = record.other_order_id;
          if (ordId && text == 5) {
            return <p style={{ whiteSpace: `nowrap` }} style={{ color: typeof (ordId.split('..')[1]) == 'undefined' ? '' : 'green' }}>{payTypes[text]} {typeof (ordId.split('..')[1]) != 'undefined'?`第${+ordId.split('..')[1]+1}次续订`:''}</p>
          }
          return <p style={{ whiteSpace: `nowrap` }}>{payTypes[text]}</p>
          // return <p style={{ whiteSpace: `nowrap` }}>{payTypes[text]}</p>
        }
      },
      {
        title: formatMessage({ id: 'app.member.pay_status' }),
        dataIndex: 'order_status',
        key: 'order_status',
        width: '100px',
        render(text, record) {
          return <Tag color={text == 1 ? 'green' : "grey"}>{statusMap[text]}</Tag>
        }
      },
      // {
      //   title: formatMessage({ id: 'app.member.platform_order_id' }),
      //   dataIndex: 'other_order_id',
      //   key: 'other_order_id',
      //   width: '80px',
      // },
      {
        title: formatMessage({ id: 'app.settings.basic.country' }),
        dataIndex: '_',
        key: '_',
        width: '100px',
        render: (text, record) => {
          if (GlobalCountryMap.length) {
            let myCountry = GlobalCountryMap
              .find((item) => {
                return item.id == record.nation;
              })
            if (myCountry) {
              return <p style={{ whiteSpace: `nowrap` }}>{myCountry.name}</p>
            }
          }

          return ''
        }
      },
      {
        title: formatMessage({ id: 'app.member.fail_reason' }),
        dataIndex: 'feed_info',
        key: 'feed_info',
        width: '150px',
        render(text, records) {
          return (
            <p onClick={() => {
              _this.setState(({ switchover }) => {
                return { switchover: { [records.id]: !switchover[records.id] } }
              })
            }} style={{ cursor: 'pointer' }}> {!_this.state.switchover[records.id] ? records.oimt : records.original} </p>
          )
        }
      },
    ],
      // ...hasOperation
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
            .sup-required{
                color:#f5222d;
                margin-right:2px;
            }
            .web .ant-modal{
                width:auto !important
            }
            .web .ant-modal .ant-modal-body{
                padding:16px !important;
            }
            .public-DraftStyleDefault-block{
                margin:0;
            }
            `}
        </style>
        <div className={styles.breadcrumbBox}>
          <Breadcrumb>
            <Breadcrumb.Item>
              <Icon type="lock" />
              <span>{formatMessage({ id: 'menu.operation' })}</span>
            </Breadcrumb.Item>
            <Breadcrumb.Item>{formatMessage({ id: 'menu.order' })}</Breadcrumb.Item>
            <Breadcrumb.Item>{formatMessage({ id: 'menu.order.member' })}</Breadcrumb.Item>
          </Breadcrumb>
        </div>
        <div className={styles.addBtn}>
          <Card
            title={formatMessage({ id: 'menu.order.member' })}
            className={styles.card}
            bordered
          >
            <Form layout="vertical" hideRequiredMark>
              <Row gutter={16}>
                <Col lg={3} md={12} sm={24}>
                  <Form.Item label={formatMessage({ id: 'app.member.order_id' })}>
                    {getFieldDecorator('order_id')(
                      <Input placeholder={formatMessage({ id: 'app.member.order_id' })} />
                    )}
                  </Form.Item>
                </Col>
                <Col lg={3} md={12} sm={24}>
                  <Form.Item label={formatMessage({ id: 'app.member.user_id' })}>
                    {getFieldDecorator('user_id')(
                      <Input placeholder={formatMessage({ id: 'app.member.user_id' })} />
                    )}
                  </Form.Item>
                </Col>
                <Col lg={12} md={12} sm={24}>
                  <Form.Item label={formatMessage({ id: 'app.member.package_name' })}>
                    {getFieldDecorator('product_id')(
                      <Select
                        placeholder={formatMessage({ id: 'app.member.package_name' })}
                      >
                        {productMap.map((item, index) => {
                          return (
                            <Option key={index} value={item.id}>
                              {`id:${item.id}; 产品名:${item.name}; 价格:${item.real_price}`}
                            </Option>
                          );
                        })}
                      </Select>
                    )}
                  </Form.Item>
                </Col>
                <Col lg={6} md={12} sm={24}>
                  <Form.Item label={formatMessage({ id: 'app.member.pay_type' })}>
                    {getFieldDecorator('pay_type')(
                      <Select
                        placeholder={formatMessage({ id: 'app.member.pay_type' })}
                      >
                        {Object.keys(payTypes || {}).map(item => {
                          return (
                            <Option key={item} value={item}>
                              {payTypes[item]}
                            </Option>
                          );
                        })}
                      </Select>
                    )}
                  </Form.Item>
                </Col>
                <Col lg={6} md={12} sm={24}>
                  <Form.Item label={formatMessage({ id: 'app.member.pay_status' })}>
                    {getFieldDecorator('order_status')(
                      <Select
                        placeholder={formatMessage({ id: 'app.member.pay_status' })}
                      >
                        {Object.keys(statusMap).map(item => {
                          return (
                            <Option key={item} value={item}>
                              {statusMap[item]}
                            </Option>
                          );
                        })}
                      </Select>
                    )}
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item label='订单时间'>
                    {getFieldDecorator('pushtime')(
                      <RangePicker
                        showTime={{ format: 'HH:mm:ss' }}
                        format="YYYY-MM-DD HH:mm:ss"
                        placeholder={[
                          formatMessage({ id: 'app.matters.create_at_start' }),
                          formatMessage({ id: 'app.matters.create_at_end' }),
                        ]}
                        style={{ width: '100%' }}
                      />
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
                  <Button
                    className={styles.btnSmt}
                    style={{ marginLeft: 8 }}
                    onClick={this.export}
                  >
                    {formatMessage({ id: 'app.content.export' })}
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
          scroll={{ x: 1300}}
          rowKey={(record, index) => `${record.id}${index}`}
        />
        <div className={styles.rightPagination}>
          <Pagination
            showTotal={total => formatMessage({ id: 'app.glob.pagetotal' }, { total: total })}
            pageSizeOptions={['20', '30', '40']}
            showSizeChanger
            onShowSizeChange={onShowSizeChange}
            current={toParseInt(this.state.pagination.page)}
            pageSize={this.state.pagination.page_size}
            onChange={this.handleTableChange}
            total={toParseInt(total_count)}
          />
        </div>
      </div>
    );
  }
}
export default Users;

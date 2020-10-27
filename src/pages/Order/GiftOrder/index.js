
import React, { Component } from 'react';
import { connect } from 'dva';
import { Breadcrumb, Tabs, Button, Tag, Form, Row, Col, Input, Card, Popconfirm, Select, Table, message, DatePicker } from 'antd';
import CommonBreadCrumb from '@/components/CommonBreadCrumb';
import { formatMessage } from 'umi/locale';
import router from 'umi/router';
const moment = require('moment');

const Search = Input.Search;
const FormItem = Form.Item;
const TextArea = Input.TextArea;
const Option = Select.Option;
const { RangePicker } = DatePicker;
const { TabPane } = Tabs;

@Form.create()
@connect(({
  giftOrder: {
    filter,
    list,
    statusMap,
    productMap,
    payTypes,
    GlobalCountryMap
  }
}) => ({
  filter,
  list,
  statusMap,
  productMap,
  payTypes,
  GlobalCountryMap
}))
class Index extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showModel: false,
      info: {},
      switchover:{}
    }
  }

  changeFilter = (query) => {
    const { dispatch } = this.props;
    return new Promise((resole) => {
      dispatch({
        type: "giftOrder/filter",
        payload: { filter: query }
      })
      resole()
    })
  }
  export = () => {
    const { dispatch } = this.props;
    const { pagination } = this.state;
    dispatch({
      type: 'giftOrder/fetch',
      payload: { ...pagination, export: 1 },
    });
  }

  fetch = (query) => {
    const { dispatch } = this.props;
    console.info('query__', query);
    this.changeFilter(query)
      .then(() => {
        dispatch({
          type: "giftOrder/fetch",
        })
      })
  }

  onEdit = (info) => {
    this.setState({
      info: info || {}
    }, () => {
      this.setState({
        showModel: true,
      })
    })
  }
  onClose = () => {
    this.setState({
      showModel: false,
    })
  }

  onReset = () => {
    const { form: { resetFields } } = this.props;
    resetFields();
    this.onSearch();
  }

  onSearch = () => {
    const { form: { validateFields }, } = this.props;
    validateFields((err, values) => {
      if (values.pushtime) {
        const [begin_time, end_time] = values.pushtime;
        values.begin_time = `${begin_time.format('YYYY-MM-DD')} 00:00:00`;
        values.end_time = `${end_time.format('YYYY-MM-DD')} 23:59:59`;
        delete values.pushtime;
      } else {
        values.begin_time = null;
        values.end_time = null;
      }
      this.changeFilter({ page: 1, page_size: 20, total: 0 })
        .then(() => {
          this.fetch(values);
        })
    })
  }

  export = () => {
    const { dispatch } = this.props;
    const { pagination } = this.state;
    dispatch({
      type: 'giftOrder/fetch',
      payload: { export: 1 },
    });
  }

  SearchBar = () => {
    const { props: { form: { getFieldDecorator }, statusMap = {}, payTypes = {}, productMap = [] }, onSearch, onEdit, onReset } = this;
    const formItemLayout = {
      labelCol: { span: 8 },
      wrapperCol: { span: 16 },
    };
    const STYLE = {marginTop: '29px'}
    return (
      <Card
        title={formatMessage({ id: 'menu.order.diamond' })}
        bordered
      >
        <Form layout="vertical" hideRequiredMark>
          <Row gutter={16}>
            <Col lg={4} md={12} sm={24}>
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
            <Col lg={3} md={12} sm={24}>
              <Form.Item label={formatMessage({ id: 'app.member.pay_type' })}>
                {getFieldDecorator('pay_type')(
                  <Select
                    placeholder={formatMessage({ id: 'app.member.pay_type' })}
                  >
                    {Object.keys(payTypes).map(item => {
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
            <Col lg={4} md={12} sm={24}>
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
            <Col lg={10} md={12} sm={24}>
              <Form.Item label={formatMessage({ id: 'app.diamond.product_content' })}>
                {getFieldDecorator('product_id')(
                  <Select
                    placeholder={formatMessage({ id: 'app.diamond.product_content' })}
                  >
                    {!!productMap.length && (productMap).map(item => {
                      return (
                        <Option key={item.id} value={item.id}>
                          {`id:${item.id}; 产品名:${item.name}; 价格:${item.real_price}`}
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
              <Button type="primary" onClick={this.onSearch} style={STYLE}>
                {formatMessage({ id: 'app.content.search' })}
              </Button>
              <Button

                style={{ marginLeft: 8,...STYLE }}
                onClick={this.onReset}
              >
                {formatMessage({ id: 'app.content.reset' })}
              </Button>
              <Button
                style={{ marginLeft: 8,...STYLE }}
                onClick={this.export}
              >
                {formatMessage({ id: 'app.content.export' })}
              </Button>
            </Col>
          </Row>
        </Form>
      </Card>
    )
  }

  TableList = () => {
    const { list, filter, statusMap = {}, payTypes = {}, productMap = [], GlobalCountryMap = [], dispatch } = this.props;
    const { onDel, onEdit } = this;
    const _this = this;
    const columns = [...[
      {
        title: formatMessage({ id: 'app.member.order_id' }),
        dataIndex: 'order_id',
        key: 'order_id',
        width: '80px',
      },
      {
        title: formatMessage({ id: 'app.member.time' }),
        dataIndex: 'time',
        key: 'time',
        width: '120px',
        render: (text, record) => {
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
        width: '100px',
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
        title: formatMessage({ id: 'app.diamond.product_content' }),
        dataIndex: 'product_id',
        key: 'product_id',
        width: '100px',
        textWrap: 'word-break',
        render: (text, record) => {
          const product_info = JSON.parse(record.product_info)
          if (product_info) {
            return <p style={{ whiteSpace: `normal` }}>{product_info.name}</p>
          }
        }
      },
      {
        title: formatMessage({ id: 'app.member.price_dollar' }),
        dataIndex: 'price_dollar',
        key: 'price_dollar',
        width: '80px',
        render: (text, record) => {
          const product_info = JSON.parse(record.product_info)
          if (product_info) {
            return <p style={{ whiteSpace: `nowrap` }}>{product_info.real_price}</p>
          }
        }
      },
      {
        title: formatMessage({ id: 'app.member.pay_type' }),
        dataIndex: 'pay_type',
        key: 'pay_type',
        width: '120px',
        render: (text, record) => {
          let i = '';
          let ordId = record.other_order_id;
          Object.keys(payTypes).map(item => {
            if (item == text) {
              i = payTypes[text];
            }
          })
          if (ordId && text == 5) {
            return <p style={{ whiteSpace: `nowrap` }} style={{ color: typeof (ordId.split('..')[1]) == 'undefined' ? '' : 'green' }}>{i}{typeof (ordId.split('..')[1]) != 'undefined' ? `第${+ordId.split('..')[1] + 1}次续订` : ''}</p>
          }
          return <p style={{ whiteSpace: `nowrap` }}>{i}</p>
        }
      },
      {
        title: formatMessage({ id: 'app.member.pay_status' }),
        dataIndex: 'order_status',
        key: 'order_status',
        width: '80px',
        render: (text, record) => {
          let i = '';
          Object.keys(statusMap).map(item => {
            if (item == text) {
              i = statusMap[text];
            }
          })
          return <Tag color={text == 1 ? 'green' : "grey"}>{i}</Tag>
        }
      },
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
      <Table
        columns={columns}
        dataSource={list}
        align="center"
        bordered
        scroll={{ x: true }}
        rowKey={(record, index) => `${record.id}${index}`}
        scroll={{ x: 1300 }}
        pagination={{
          position: 'both',
          pageSize: filter.page_size,
          showSizeChanger: true,
          pageSizeOptions: ['20', '30', '40'],
          onShowSizeChange: this.onShowSizeChange,
          total: filter.total,
          current: filter.page,
          showTotal: total => formatMessage({ id: 'app.glob.pagetotal' }, { total: filter.total }),
          size: 'small',
          onChange: this.onShowSizeChange
        }}
      />
    )
  }
  onShowSizeChange = (page, page_size) => {
    this.fetch({ page, page_size })
  }
  onUpload = (res) => {
    if (res.code != 0) {
      message.info(res.msg)
      return
    }
  }
  render() {
    const { TableList, SearchBar, onUpload, url } = this;
    const crumbs = [
      {
        icon: 'desktop',
        title: '订单管理',
      }, {
        icon: 'robot',
        title: '礼物订单',
      }
    ];
    const { info, showModel } = this.state;
    const { onClose } = this
    return (
      <>
        <CommonBreadCrumb items={crumbs} />
        <SearchBar />
        <TableList />
      </>
    );
  }
}

export default Index;
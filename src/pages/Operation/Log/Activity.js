
import React, { Component } from 'react';
import { connect } from 'dva';
import { Breadcrumb, Tabs, Button, Tag, Form, Row, Col, Input, Card, Popconfirm, Select, Table, message, DatePicker } from 'antd';
import CommonBreadCrumb from '@/components/CommonBreadCrumb';
import { formatMessage } from 'umi/locale';
import router from 'umi/router';
import ShardLog from './ShardLog';


const Search = Input.Search;
const FormItem = Form.Item;
const TextArea = Input.TextArea;
const Option = Select.Option;
const { RangePicker } = DatePicker;
const { TabPane } = Tabs;

@Form.create()
@connect(({
  log: {
    filter,
    list,
    turnoverFromTypes = {},
  }
}) => ({
  filter,
  list,
  turnoverFromTypes
}))
class Log extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showModel: false,
      info: {}
    }
  }

  changeFilter = (query) => {
    const { dispatch } = this.props;
    return new Promise((resole) => {
      dispatch({
        type: "log/filter",
        payload: { filter: query }
      })
      resole()
    })
  }

  fetch = (query) => {
    const { dispatch } = this.props;
    console.info('query__', query);
    this.changeFilter(query)
      .then(() => {
        dispatch({
          type: "log/fetch",
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
      if (values.time) {
        const [begin_time, end_time] = values.time;
        values.begin_time = begin_time.format('YYYY-MM-DD HH:mm:ss');
        values.end_time = end_time.format('YYYY-MM-DD HH:mm:ss');
        delete values.time;
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
      type: 'log/fetch',
      payload: { export: 1 },
    });
  }

  SearchBar = () => {
    const { props: { form: { getFieldDecorator }, turnoverFromTypes }, onSearch, onEdit, onReset } = this;
    const formItemLayout = {
      labelCol: { span: 8 },
      wrapperCol: { span: 16 },
    };
    return (
      <Card
        className={'styles-card'}
        bordered
      >
        <Form >
          <Row gutter={16} className="regDate">
            <Col lg={4} md={12} sm={24}>
              <Form.Item>
                {getFieldDecorator('id')(
                  <Input placeholder={'请输入ID'} />
                )}
              </Form.Item>
            </Col>
            <Col lg={4} md={12} sm={24}>
              <Form.Item>
                {getFieldDecorator('user_id')(
                  <Input placeholder={'请输入用户ID'} />
                )}
              </Form.Item>
            </Col>
            <Col lg={4} md={12} sm={24}>
              <Form.Item>
                {getFieldDecorator('from_type')(
                  <Select
                    placeholder={'获取渠道'}
                  >
                    {Object.keys(turnoverFromTypes)
                      .map((item, index) => {
                        return <Option value={item} key={index}>{turnoverFromTypes[item]}</Option>
                      })}
                  </Select>
                )}
              </Form.Item>
            </Col>
            <Col lg={8} md={12} sm={24}>
              <Form.Item>
                {getFieldDecorator('time')(
                  <RangePicker showTime={{ format: 'HH:mm:ss' }} />
                )}
              </Form.Item>
            </Col>
            <Col lg={7} md={12} sm={24}>
              <Button
                type="primary"
                onClick={onSearch}
              >
                {formatMessage({ id: 'app.content.search' })}
              </Button>
              <Button
                style={{ marginLeft: 8 }}
                onClick={() => { onReset() }}
              >
                重置
              </Button>
              <Button
                style={{ marginLeft: 8 }}
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
    const { list, filter, statusMap, dispatch } = this.props;
    const { onDel, onEdit } = this;
    const columns = [
      {
        title: 'ID',
        dataIndex: 'id',
        key: 'id',
        align: 'center',
      },
      {
        title: '用户ID',
        dataIndex: 'user_id',
        key: 'user_id',
        align: 'center',
      },
      {
        title: '关联人ID',
        dataIndex: 'relation_user_id',
        key: 'relation_user_id',
        align: 'center',
      },
      {
        title: '礼物ID',
        dataIndex: 'gift_id',
        key: 'gift_id',
        align: 'center',
      },
      {
        title: '钻石数',
        dataIndex: 'diamond',
        key: 'diamond',
        align: 'center',
      },
      {
        title: 'x_coin',
        dataIndex: 'x_coin',
        key: 'x_coin',
        align: 'center',
      },
      {
        title: '获取渠道',
        dataIndex: 'from_type_name',
        key: 'from_type_name',
        align: 'center',
      },
      {
        title: '时间',
        dataIndex: 'create_at',
        key: 'create_at',
        align: 'center',
      },
    ];
    return (
      <Table
        columns={columns}
        dataSource={list}
        align="center"
        bordered
        scroll={{ x: true }}
        rowKey={(record, index) => `${record.id}${index}`}
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
        title: '用户流水',
      }
    ];
    const { info, showModel } = this.state;
    const { onClose } = this
    return (
      <>
        <CommonBreadCrumb items={crumbs} />
        <Tabs defaultActiveKey="1">
          <TabPane tab="钻石及hellow币流水" key="1">
            <>
              <SearchBar />
              <TableList />
            </>
          </TabPane>
          <TabPane tab="钻石碎片流水" key="2">
              <ShardLog />
          </TabPane>
        </Tabs>
      </>
    );
  }
}

export default Log;
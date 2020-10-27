
import React, { Component } from 'react';
import { connect } from 'dva';
import { Breadcrumb, Tabs, Button, Tag, Form, Row, Col, Input, Card, Popconfirm, Select, Table, message, DatePicker } from 'antd';
import CommonBreadCrumb from '@/components/CommonBreadCrumb';
import { formatMessage } from 'umi/locale';
import router from 'umi/router';


const Search = Input.Search;
const FormItem = Form.Item;
const TextArea = Input.TextArea;
const Option = Select.Option;
const { RangePicker } = DatePicker;
const { TabPane } = Tabs;

@Form.create()
@connect(({
  shardLog: {
    filter,
    list,
    shardFromTypes = {},
  }
}) => ({
  filter,
  list,
  shardFromTypes
}))
class Index extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showModel: false,
      info: {},
      user_ids:[],
    }
  }

  changeFilter = (query) => {
    const { dispatch } = this.props;
    return new Promise((resole) => {
      dispatch({
        type: "shardLog/filter",
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
          type: "shardLog/fetch",
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
      type: 'shardLog/fetch',
      payload: { export: 1 },
    });
  }

  addShard = ()=>{

  }

  componentDidMount(){
    const { dispatch } = this.props;
    dispatch({
      type: "shardLog/fetch",
    })
  }

  SearchBar = () => {
    const { props: { form: { getFieldDecorator }, shardFromTypes }, onSearch, onEdit, onReset } = this;
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
                    placeholder={'碎片类型'}
                  >
                    {Object.keys(shardFromTypes)
                      .map((item, index) => {
                        return <Option value={item} key={index}>{shardFromTypes[item]}</Option>
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
            <Col lg={24} md={24} sm={24}>
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
              {/* <Button
                style={{ marginLeft: 8 }}
                onClick={this.addShard}
              >
                {`批量增加碎钻`}
              </Button> */}
            </Col>
          </Row>
        </Form>
      </Card>
    )
  }

  TableList = () => {
    const { list, filter, statusMap, dispatch, shardFromTypes } = this.props;
    const { onDel, onEdit } = this;
    const {user_ids} = this.state;
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
        title: '碎钻',
        dataIndex: 'diamond_shard',
        key: 'diamond_shard',
        align: 'center',
      },
      {
        title: '碎片类型',
        dataIndex: 'from_type',
        key: 'from_type',
        align: 'center',
        render(text){
          return shardFromTypes[text]||''
        }
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
        //   rowSelection={{
        //     onChange: (selectedRowKeys, selectedRows) => {
        //       console.log(selectedRowKeys,'selectedRowKeys',selectedRows)
        //       this.setState({
        //         user_ids:selectedRows.map((item)=> (item.user_id))
        //       })
        //     },
        //     selectedRowKeys:user_ids,
        // }}
        columns={columns}
        dataSource={list}
        align="center"
        bordered
        scroll={{ x: true }}
        rowKey={(record, index) => `${record.id}`}
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
  render() {
    const { TableList, SearchBar, url } = this;
    const { info, showModel } = this.state;
    const { onClose } = this
    return (
      <>
        <SearchBar />
        <TableList />
      </>
    );
  }
}

export default Index;

import React, { Component } from 'react';
import { connect } from 'dva';
import { Breadcrumb, Tabs, Button, Tag, Form, Row, Col, Input, Card, Popconfirm, Select, Table, message, DatePicker } from 'antd';
import CommonBreadCrumb from '@/components/CommonBreadCrumb';
import { formatMessage } from 'umi/locale';
import router from 'umi/router';
import ActivityAdd from './ActivityAdd';


const Search = Input.Search;
const FormItem = Form.Item;
const TextArea = Input.TextArea;
const Option = Select.Option;
const { RangePicker } = DatePicker;
const { TabPane } = Tabs;

@Form.create()
@connect(({
  voiceTag: {
    filter,
    list,
    statusMap = {}
  }
}) => ({
  filter,
  list,
  statusMap
}))
class Index extends Component {
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
        type: "voiceTag/filter",
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
          type: "voiceTag/fetch",
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
      // if (values.time) {
      //   const [begin_time, end_time] = values.time;
      //   values.begin_time = begin_time.format('YYYY-MM-DD HH:mm:ss');
      //   values.end_time = end_time.format('YYYY-MM-DD HH:mm:ss');
      //   delete values.time;
      // } else {
      //   values.begin_time = null;
      //   values.end_time = null;
      // }
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
      type: 'voiceTag/fetch',
      payload: { export: 1 },
    });
  }

  SearchBar = () => {
    const { props: { form: { getFieldDecorator }, statusMap }, onSearch, onEdit, onReset } = this;
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
                {getFieldDecorator('name')(
                  <Input placeholder={'请输入标签名'} />
                )}
              </Form.Item>
            </Col>
            <Col lg={4} md={12} sm={24}>
              <Form.Item>
                {getFieldDecorator('status')(
                  <Select
                    placeholder={'选择状态'}
                  >
                    {Object.keys(statusMap)
                      .map((item, index) => {
                        return <Option value={item} key={index}>{statusMap[item]}</Option>
                      })}
                  </Select>
                )}
              </Form.Item>
            </Col>
            {/* <Col lg={8} md={12} sm={24}>
              <Form.Item>
                {getFieldDecorator('time')(
                  <RangePicker showTime={{ format: 'HH:mm:ss' }} />
                )}
              </Form.Item>
            </Col> */}
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
                onClick={()=>{
                  this.setState(({})=>{
                    return {info:{}}
                  },()=>{
                    this.setState({
                      showModel:true
                    })
                    
                  })
                }}
              >
                {'新增'}
              </Button>
            </Col>
          </Row>
        </Form>
      </Card>
    )
  }
  onEdit=(info) =>{
    this.setState({
      info:info||{}
    },()=>{
      this.setState({
      showModel:true,
      })
    })
  }
  onClose=()=>{
    this.setState({
       showModel:false,
    })
  }
  onDel=(id)=>{
    const {dispatch} = this.props;
    dispatch({
      type:"voiceTag/del",
      payload:{id}
    })
  }

  TableList = () => {
    const { list, filter, statusMap = {}, dispatch } = this.props;
    const { onDel, onEdit } = this;
    const columns = [
      {
        title: 'ID',
        dataIndex: 'id',
        key: 'id',
        align: 'center',
      },
      {
        title: '标签名',
        dataIndex: 'name',
        key: 'name',
        align: 'center',
      },
      {
        title: '标签描述',
        dataIndex: 'content',
        key: 'content',
        align: 'center',
      },
      {
        title: 'url',
        dataIndex: 'icon_remote',
        key: 'icon_remote',
        align: 'center',
        render:(_,record)=>{
          return <img src={_} style={{width:'100px',height:'auto'}}/>
        }
      },
      {
        title: '时间',
        dataIndex: 'create_at',
        key: 'create_at',
        align: 'center',
      },
      {
        title: '状态',
        dataIndex: 'status',
        key: 'status',
        align: 'center',
        render(text){
          return <Tag color={text==1?'green':'grey'}>{statusMap[text]}</Tag>
        }
      },
      {
        title: '操作',
        dataIndex: 'active',
        key: 'active',
        align: 'center',
        render(_,info){
          return (<>
                   <Popconfirm
                    title={`确定是否${info.status==0?'上架':'下架'}？`}
                    onConfirm={()=>{
                      dispatch({
                          type:`voiceTag/SetStatus`,
                          payload:{
                            id:info.id,
                            status:+(!(+info.status))
                          }
                      })
                    }}
                    okText="确定"
                    cancelText="取消"
                  >
                    <Button type={info.status==0?'green':'danger'} size="small" style={{marginLeft:'8px'}}>{info.status==0?'上架':'下架'}</Button>
                  </Popconfirm>
                  <Button type="primary" size="small" onClick={()=>{onEdit(info)}} style={{marginLeft:'8px'}}>编辑</Button>
                  <Popconfirm
                    title="确定删除？"
                    onConfirm={onDel.bind(this,info.id)}
                    okText="确定"
                    cancelText="取消"
                  >
                    <Button type="danger" size="small" style={{marginLeft:'8px'}}>删除</Button>
                  </Popconfirm>
                </>)
        }
      }
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
        title: '运营管理',
      }, {
        icon: 'robot',
        title: '语音房标签管理',
      }
    ];
    const { info, showModel } = this.state;
    const { onClose } = this
    return (
      <>
        <CommonBreadCrumb items={crumbs} />
        <SearchBar />
        <TableList />
        {showModel&&<ActivityAdd {...{info, onClose}} />}
      </>
    );
  }
}

export default Index;
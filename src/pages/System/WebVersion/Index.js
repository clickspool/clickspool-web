
import React, { Component } from 'react';
import { connect } from 'dva';
import { Breadcrumb, Button, Tag, Form, Row, Col, Input, Card, Popconfirm, Select, Table } from 'antd';
import CommonBreadCrumb from '@/components/CommonBreadCrumb';
import { formatMessage } from 'umi/locale';
import router from 'umi/router';
import Edit from './components/Edit';
import apiConfig from '@/utils/apiConfig';

const Search = Input.Search;
const FormItem = Form.Item;
const TextArea = Input.TextArea;
const Option = Select.Option;


@Form.create()
@connect(({
  webVersion:{
    filter,
    list,
    statusMap={},
    countryMap=[],
  }
})=>({
  filter,
  list,
  statusMap,
  countryMap
}))
class Web extends Component {
  constructor(props) {
    super(props);
    this.state={
      showModel:false,
      detail:{}
    }
  }

  // tslint:disable-next-line:no-empty
  componentDidMount() {
   
   
   
  }

  changeFilter=(query)=>{
   const {dispatch} = this.props;
   return new Promise((resole)=>{
    dispatch({
      type:"webVersion/filter",
      payload:{filter:query}
    })
    resole()
   })
  }

 fetch=(query)=>{
   const { dispatch } = this.props;
   this.changeFilter(query)
   .then(()=>{
    dispatch({
      type:"webVersion/fetch",
    })
   })
  }

  onEdit=(detail) =>{
    this.setState({
      detail:detail||{}
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
      type:"webVersion/del",
      payload:{id}
    })
  }

  onSearch=()=>{
    const {form:{validateFields},} = this.props;
    validateFields((err, values) => {
        this.fetch(values);
    })
  }

  SearchBar=()=>{
    const {props:{form: { getFieldDecorator },countryMap}, onSearch, onEdit} = this;
    const formItemLayout = {
      labelCol: { span: 8 },
      wrapperCol: { span: 16 },
    };
    return (
      <Card
        className={'styles-card'}
        bordered
      >
        <Form { ...formItemLayout }>
          <Row gutter={16} className="regDate">
            <Col lg={6} md={12} sm={24}>
              <Form.Item label={'安卓版本'}>
                {getFieldDecorator('version')(
                  <Input placeholder={'请输入安卓版本'} />
                )}
              </Form.Item>
            </Col>
            <Col lg={6} md={12} sm={24}>
            <Form.Item label={'投放国家'}>
                        {getFieldDecorator('nation')(
                          <Select
                            placeholder="请选择投放国家"
                          >
                            {countryMap.map(item => {
                              return (
                                <Option key={item.id} value={item.id}>
                                  {item.name}
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
                onClick={onSearch}
              >
                {formatMessage({ id: 'app.content.search' })}
              </Button>
              <Button
                style={{ marginLeft: 8 }}
                onClick={()=>{onEdit()}}
              >
                新增
              </Button>
            </Col>
          </Row>
        </Form>
    </Card>
    )
  }

  TableList =()=>{
    const {list, filter, statusMap,dispatch, countryMap} = this.props;
    const { onDel, onEdit} = this;
    const columns = [
      {
        title: 'id',
        dataIndex: 'id',
        key: 'id',
      },
      {
        title: '对应安卓版本',
        dataIndex: 'version',
        key: 'version',
      },
      {
        title: '投放国家',
        dataIndex: 'nation',
        key: 'nation',
        render:(text)=>{
          return ((countryMap.find((item)=>{
            return item.id == text
          })||{})['name'])||'默认'
        }
      },
      {
        title: '说明',
        dataIndex: 'info',
        key: 'info',
      },
      {
        title: 'MD5值',
        dataIndex: 'md5',
        key: 'md5',
      },
      {
        title: 'zip包地址',
        dataIndex: 'url',
        key: 'url',
        width:'160px'
      },
      {
        title: '详细配置',
        dataIndex: 'ext_json',
        key: 'ext_json',
        width:'200px'
      },
      {
        title: '状态',
        dataIndex: 'status',
        key: 'status',
        render(text){
          return <Tag color={text==1?'green':'grey'}>{statusMap[text]}</Tag>
        }
      },
      {
        title: '操作',
        dataIndex: 'active',
        key: 'active',
        render(_,info){
          return (<>
                <b>({!!/f1s1\.cn/.test(apiConfig)? '测试环境' : '生产环境'})</b>
                   <Popconfirm
                    title="确定删除？"
                    onConfirm={()=>{
                      dispatch({
                          type:`webVersion/SetStatus`,
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
          pageSize:filter.page_size,
          showSizeChanger: true,
          pageSizeOptions: ['20', '30', '40'],
          onShowSizeChange: this.onShowSizeChange,
          total:filter.total,
          current: filter.page,
          showTotal: total => formatMessage({ id: 'app.glob.pagetotal' }, { total: filter.total }),
          size: 'small',
          onChange: this.onShowSizeChange
        }}
      />
    )
  }
  onShowSizeChange=(page, page_size)=>{
    fetch({page, page_size})
  }

  render() {
    const { TableList, SearchBar } = this;
    const crumbs = [
      {
        icon: 'desktop',
        title: '系统管理',
      }, {
        icon: 'robot',
        title: 'H5本地管理',
      }
    ];
    const { detail, showModel }  = this.state;
    const { onClose} = this
    return (
      <>
        <CommonBreadCrumb items={crumbs} />
        <SearchBar />
        <TableList />
        {showModel&&<Edit {...{detail, onClose}} />}
      </>
    );
  }
}

export default Web;
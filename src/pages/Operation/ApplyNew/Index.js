
import React, { Component } from 'react';
import { connect } from 'dva';
import { Breadcrumb, Button, Tag, Form, Row, Col, Input, Card, Popconfirm, Select, Table, message } from 'antd';
import CommonBreadCrumb from '@/components/CommonBreadCrumb';
import { formatMessage } from 'umi/locale';
import router from 'umi/router';
import Edit from './components/Edit';


const Search = Input.Search;
const FormItem = Form.Item;
const TextArea = Input.TextArea;
const Option = Select.Option;


@Form.create()
@connect(({
  virtualApply:{
    filter,
    list,
    commonStatusMap,
  }
})=>({
  filter,
  list,
  commonStatusMap
}))
class AutoApply extends Component {
  constructor(props) {
    super(props);
    this.state={
      showModel:false,
      detail:{}
    }
  }
  
  changeFilter=(query)=>{
   const {dispatch} = this.props;
   return new Promise((resole)=>{
    dispatch({
      type:"virtualApply/filter",
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
      type:"virtualApply/fetch",
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
      type:"virtualApply/del",
      payload:{id}
    })
  }

  onReset=()=>{
    const {form:{resetFields}} = this.props;
    resetFields();
    this.onSearch();
  }

  onSearch=()=>{
    const {form:{validateFields},} = this.props;
    validateFields((err, values) => {
        this.fetch(values);
    })
  }

  SearchBar=()=>{
    const {props:{form: { getFieldDecorator }, commonStatusMap}, onSearch, onEdit, onReset} = this;
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
            <Col lg={6} md={12} sm={24}>
              <Form.Item label={'ID'}>
                {getFieldDecorator('id')(
                  <Input placeholder={formatMessage({id:'app.applyNew.pid'})} />
                )}
              </Form.Item>
            </Col>
            <Col lg={6} md={12} sm={24}>
              <Form.Item label={formatMessage({id:'app.applyNew.title'})}>
                {getFieldDecorator('title')(
                  <Input placeholder={formatMessage({id:'app.applyNew.title'})} />
                )}
              </Form.Item>
            </Col>
            <Col lg={6} md={12} sm={24}>
              <Form.Item label={formatMessage({id:'app.applyNew.robot_id'})}>
                {getFieldDecorator('robot_id')(
                  <Input placeholder={formatMessage({id:'app.applyNew.robot_id'})} />
                )}
              </Form.Item>
            </Col>
            <Col lg={6} md={12} sm={24}>
              <Form.Item label={formatMessage({id:'app.activity.status'})}>
                {getFieldDecorator('status')(
                  <Select
                    placeholder={formatMessage({ id:'app.activity.status' })}
                  >
                    {Object.keys(commonStatusMap)
                    .map((item, index)=>{
                        return <Option value={item} key={index}>{commonStatusMap[item]}</Option>
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
                onClick={()=>{onReset()}}
              >
                重置
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
    const {list, filter, commonStatusMap, dispatch} = this.props;
    const { onDel, onEdit} = this;
    const columns = [
      {
        title: 'ID',
        dataIndex: 'id',
        key: 'id',
        align: 'center',
      },
      {
        title: formatMessage({id:'app.applyNew.title'}),
        dataIndex: 'title',
        key: 'title',
        align: 'center',
      },
      {
        title: formatMessage({id:'app.applyNew.robot_id'}),
        dataIndex: 'robot_id',
        key: 'robot_id',
        align: 'center',
      },
      {
        title: '状态',
        dataIndex: 'status',
        key: 'status',
        align: 'center',
        render(text){
          return <Tag color={text==1?'green':'grey'}>{commonStatusMap[text]}</Tag>
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
                          type:`virtualApply/SetStatus`,
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
  onUpload=(res)=>{
    if(res.code!=0){
      message.info(res.msg)
      return
    }
    console.log(res,'onUpload opt')
  }
  render() {
    const { TableList, SearchBar,onUpload,url } = this;
    const crumbs = [
      {
        icon: 'desktop',
        title: '运营管理',
      }, {
        icon: 'robot',
        title: '虚拟用户自动回复',
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

export default AutoApply;
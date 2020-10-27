
import React, { Component } from 'react';
import { connect } from 'dva';
import { Breadcrumb, Button, Tag, Form, Row, Col, Input, Card, Popconfirm, Select, Table, message, Drawer } from 'antd';
import CommonBreadCrumb from '@/components/CommonBreadCrumb';
import { formatMessage } from 'umi/locale';
import router from 'umi/router';
import style from './index.less';
import isEqual from "lodash/isEqual";


const Search = Input.Search;
const FormItem = Form.Item;
const TextArea = Input.TextArea;
const Option = Select.Option;


@Form.create()
@connect(({
  roomUsers: {
    filter,
    list
  }

}) => ({
  filter,
  list,
}))
class Index extends Component {
  constructor(props) {
    super(props);
    this.state = {
      detail: {},
      room_id: ''
    }
  }

  changeFilter = (query) => {
    const { dispatch } = this.props;
    return new Promise((resole) => {
      dispatch({
        type: "roomUsers/filter",
        payload: { filter: query }
      })
      resole()
    })
  }

  fetch = (query) => {
    const { dispatch } = this.props;
    this.changeFilter(query)
      .then(() => {
        dispatch({
          type: "roomUsers/fetch",
        })
      })
  }



  onSearch = () => {
    const { form: { validateFields }, } = this.props;
    validateFields((err, values) => {
      this.fetch(values);
    })
  }

  SearchBar = () => {
    const { props: { form: { getFieldDecorator }, commonStatusMap }, onSearch, onEdit, onReset } = this;
    const formItemLayout = {
      labelCol: { span: 8 },
      wrapperCol: { span: 16 },
    };
    return (
      <Card
        className={'styles-card'}
        bordered={false}
        bodyStyle={{ padding: 0 }}
      >
        <Form >
          <Row gutter={16} className="regDate">
            <Col lg={12} md={12} sm={24}>
              <Form.Item {...formItemLayout} label={'NICK ID'}>
                {getFieldDecorator('nick_id')(
                  <Input size="small" placeholder={formatMessage({ id: 'app.host.upper.nickID' })} />
                )}
              </Form.Item>
            </Col>
            <Col lg={12} md={12} sm={24}>
              <Button
                type="primary"
                onClick={onSearch}
                size='small'
                style={{ marginTop: 8 }}
              >
                {formatMessage({ id: 'app.content.search' })}
              </Button>
              <Button
                style={{ marginLeft: 8, marginTop: 8 }}
                onClick={() => { onReset() }}
                size='small'
              >
                重置
              </Button>
            </Col>
          </Row>
        </Form>
      </Card>
    )
  }



  TableList = () => {
    const { list, filter, dispatch, creatorId } = this.props;
    const { onDel, onEdit, InputDay } = this;
    const _this = this;
    const columns = [
      {
        title: '昵称',
        dataIndex: 'nickname',
        key: 'nickname',
        align: 'center',
        render:(text,record)=>{
          return text+`${creatorId==record.id?' (房主)':''}`
        }
      },
      {
        title: formatMessage({ id: 'app.host.upper.avatar' }),
        dataIndex: 'avatar',
        key: 'avatar',
        align: 'center',
        render: (_, record) => {
          return <img src={_} style={{ borderRadius: '100%', width: '30px', height: '30px' }} />
        }
      },
      {
        title: `NICKID`,
        dataIndex: 'nick_id',
        key: 'nick_id',
        align: 'center',
      },
      {
        title: '操作',
        dataIndex: 'active',
        key: 'active',
        align: 'center',
        render(_, info) {
          if(creatorId==info.id){
            return
          }
          return (<>
            <Popconfirm
              title={'确定是否踢出'}
              onConfirm={() => {
                dispatch({
                  type: `roomUsers/leaveRoom`,
                  payload: {
                    user_id: info.id,
                    room_id: _this.props.id
                  }
                })
              }}
              okText="确定"
              cancelText="取消"
            >
              <Button type="link">踢出房间</Button>
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

  // componentDidUpdate(prevProps, prevState) {
  //   const { room_id } = prevState;
  //   if (!isEqual(room_id, prevProps.id)) {
  //     this.setState({
  //       room_id: prevProps.id,
  //     });
  //     this.fetch({ room_id: prevProps.id })
  //   }
  // }

  componentDidMount(){
    this.fetch({ room_id: this.props.id})
  }

  render() {
    const { SearchBar, TableList } = this;
    return (
      <div className={`x`}>
        <style>
          {`
            .x table{
              font-size: 12px !important;
            }
            .x .ant-form-item{
              margin-bottom:0 !important;
            }
          `}
        </style>
        <SearchBar />
        <TableList />
      </div>
    );
  }
}

export default Index;
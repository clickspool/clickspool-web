
import React, { Component } from 'react';
import { connect } from 'dva';
import { Breadcrumb, Button, Tag, Form, Row, Col, Input, Card, Popconfirm, Select, Table, message, Tabs, Badge, Modal } from 'antd';
import CommonBreadCrumb from '@/components/CommonBreadCrumb';
import { formatMessage } from 'umi/locale';
import router from 'umi/router';
import style from './index.less';
import isEqual from "lodash/isEqual";
import RoomUsers from './RoomUsers';



const Search = Input.Search;
const FormItem = Form.Item;
const TextArea = Input.TextArea;
const Option = Select.Option;
var moment = require('moment');


@Form.create()
@connect(({
  upperRooms: {
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
      showModel: false,
      detail: {},
      inputday: '',
      month: [
        moment().locale('zh-cn').format('YYYY-MM'),
        moment().locale('zh-cn').subtract(1, 'month').format('YYYY-MM'),
        moment().locale('zh-cn').subtract(2, 'month').format('YYYY-MM')
      ],
      user_id: '',
      tab: '0'
    }
  }

  changeFilter = (query) => {
    const { dispatch } = this.props;
    return new Promise((resole) => {
      dispatch({
        type: "upperRooms/filter",
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
          type: "upperRooms/fetch",
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
      this.fetch(values);
    })
  }



  TableList = () => {
    const { list, filter, sex, dispatch, } = this.props;
    const { onDel, onEdit, InputDay } = this;
    const _this = this;
    const columns = [
      {
        title: '时间',
        dataIndex: 'begin_time',
        key: 'begin_time',
        align: 'center',
        render: (text, record) => {
          return (
            <>
              <p style={{ marginBottom: 0, fontSize: '12px' }}>{text ? text.split(' ')[0] : ''}</p>
              <p style={{ marginBottom: 0, fontSize: '12px' }}>{`${text ? text.split(' ')[1] : ''}-${record.end_time ? record.end_time.split(' ')[1] : ''}`}</p>
            </>
          )
        }
      },
      {
        title: `直播房名称`,
        dataIndex: 'name',
        key: 'name',
        align: 'center',
      },
      {
        title: `直播状态`,
        dataIndex: 'status',
        key: 'status',
        align: 'center',
        render(text) {
          return <Badge status={text == 1 ? "success" : 'default'} text={text == 1 ? "进行中" : '已结束'} />
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
    console.log(res, 'onUpload opt')
  }

  // componentDidUpdate(prevProps, prevState) {
  //   const { month, user_id } = prevState;
  //   if (!isEqual(user_id, prevProps.creator_id)) {
  //     this.setState({
  //       user_id: prevProps.creator_id,
  //       tab: '0'
  //     });
  //     this.fetch({ user_id: prevProps.creator_id, year_month: month[0] })
  //   }
  // }

  componentDidMount() {
    this.fetch({ user_id: this.props.creator_id, year_month: this.state.month[0] })
  }
  render() {
    const { TableList, SearchBar, props: { nickname, nick_id, creator_id: user_id }, fetch } = this;
    const { detail, month } = this.state;
    const { onClose } = this;
    function Close() {
      return <p style={{ fontSize: `12px` }}>关闭</p>
    }
    return (
      <>
        <div className={style.upper_room}>
          <Row>
            <Col span={8}>主播昵称:{nickname}</Col>
            <Col span={8}>NICKID:{nick_id}</Col>
            <Col span={8} />
          </Row>
          <Tabs activeKey={this.state.tab} onChange={(id) => {
            this.setState({
              tab: '' + id
            })
            this.fetch({ user_id, year_month: month[id] })
          }}>
            {
              month.map((item, key) => {
                return (
                  <Tabs.TabPane tab={item} key={key + ''} />
                )
              })
            }
          </Tabs>
          <TableList />
        </div>
        <Modal
          title={null}
          visible={this.state.showModel}
          onCancel={this.onClose}
          footer={null}
          closeIcon={<Close />}
        >
          {this.state.showModel && <RoomUsers {...detail} creatorId={this.props.creator_id} />}
        </Modal>
      </>
    );
  }
}

export default Index;
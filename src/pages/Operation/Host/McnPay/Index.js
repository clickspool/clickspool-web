
import React, { Component } from 'react';
import { connect } from 'dva';
import { Breadcrumb, Button, Tag, Form, Row, Col, Input, Card, Popconfirm, Select, Table, message, Drawer, Icon, Switch, Upload } from 'antd';
import CommonBreadCrumb from '@/components/CommonBreadCrumb';
import { formatMessage } from 'umi/locale';
import router from 'umi/router';
import style from './index.less';
import {getAuthority} from '@/utils/authority.js';
import apiConfig from '@/utils/apiConfig.js';


const Search = Input.Search;
const FormItem = Form.Item;
const TextArea = Input.TextArea;
const Option = Select.Option;


@Form.create()
@connect(({
  mcnpay: {
    filter,
    list,
  },
  mcn: {
    list: mcnList
  },
  global: {
    spinning,
    GlobalCountryMap
  },
}) => ({
  filter,
  list,
  spinning,
  GlobalCountryMap,
  mcnList
}))
class Index extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showModel: false,
      detail: {},
      inputday: '',
      info: {}
    }
  }

  changeFilter = (query) => {
    const { dispatch } = this.props;
    return new Promise((resole) => {
      dispatch({
        type: "mcnpay/filter",
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
          type: "mcnpay/fetch",
        })
      })
  }

  onEdit = (detail) => {
    this.setState({
      detail: detail || {}
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
  onDel = (id) => {
    const { dispatch } = this.props;
    dispatch({
      type: "mcnpay/del",
      payload: { id }
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
      this.fetch({ ...values, page: 1 });
    })
  }

  SearchBar = () => {
    const { props: { form: { getFieldDecorator }, commonStatusMap, mcnList }, onSearch, onEdit, onReset } = this;
    const formItemLayout = {
      labelCol: { span: 8 },
      wrapperCol: { span: 16 },
    };
    const _this = this;
    const props = {
      name: 'file',
      onChange(info) {
        const formData = new FormData();
        formData.append('money_mcn_csv',info.file.originFileObj);
        _this.props.dispatch({
          type: "mcnpay/importCsv",
          payload: formData
        })
        .then(()=>{
          _this.fetch()
        })
      },
      showUploadList:false
    };
    return (
      <Card
        className={'styles-card'}
        bordered
      >
        <Form >
          <Row gutter={16} className="regDate">
            <Col lg={5} md={12} sm={24}>
              <Form.Item {...formItemLayout} label={'ID'}>
                {getFieldDecorator('id')(
                  <Input placeholder={'ID'} />
                )}
              </Form.Item>
            </Col>
            <Col lg={5} md={12} sm={24}>
              <Form.Item {...formItemLayout} label={`UID`}>
                {getFieldDecorator('user_id')(
                  <Input placeholder={formatMessage({ id: 'app.host.upper.userId' })} />
                )}
              </Form.Item>
            </Col>
            <Col lg={14} md={12} sm={24} style={{
              position: 'relative',
              top: '3px'
            }}>
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
                style={{ marginLeft: 8, marginRight:8 }}
                onClick={() => { 
                  this.props.dispatch({
                    type: "mcnpay/getImportTemplate",
                    payload: {  }
                  })
                  .then((res)=>{
                    if(!res.code){
                      window.open(res.data.mcn_money_import_template)
                    }
                  })
                 }}
              >
                下载模板
              </Button>
              <Upload {...props}>
                <Button>
                  <Icon type="upload" /> MCN底薪成本导入
                </Button>
              </Upload>
              {/* <Button
                style={{ marginLeft: 8 }}
                onClick={() => { 
                
                
              }}
              >
                导入
              </Button> */}
            </Col>
          </Row>
        </Form>
      </Card>
    )
  }
  inputdayOnchange = (eve) => {
    const { value } = eve.target;
    if (/^[0-9]*$/.test(value) || value == '') {
      this.setState({
        inputday: eve.target.value
      })
    }

  }

  InputDay = (info) => {
    return (
      <>
        <p style={{ fontSize: '12px' }}>{`确定是否${+info.is_forbid_room != 0 ? '打开' : '关闭'}？`}</p>
        {
          +info.is_forbid_room == 0 &&
          <>
            <Input value={this.state.inputday} onChange={this.inputdayOnchange} size="small" placeholder="请输入禁播天数" />
            <p style={{ color: `#ff4d4f`, fontSize: '12px' }}>* 不填代表无限期禁播</p>
          </>
        }

      </>
    )
  }
  toggleManage = (info) => {
    const newState = { manageShow: !this.state.manageShow, }
    console.info('toggleManage__', info);
    if (info.id) {
      newState.manageInfo = info;
    }
    this.setState(newState);
  }
  toggleRecommend = ({ id, value }) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'mcnpay/setUserOfficialRec',
      payload: {
        user_id: id,
        is_recommend: value ? 1 : 0
      }
    });
  }

  batchSetIdentity = ({ id, action }) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'mcnpay/batchSetIdentity',
      payload: {
        user_ids: id+'',
        identity: 32,
        action
      }
    });
  }


  TableList = () => {
    const { list, filter, sex, dispatch, GlobalCountryMap, mcnList } = this.props;

    const { onDel, onEdit, InputDay, toggleManage, toggleRecommend } = this;
    const _this = this;
    const columns = [
      {
        title: 'ID',
        dataIndex: 'id',
        key: 'id',
        align: 'center',
      },
      {
        title: `用户ID`,
        dataIndex: 'user_id',
        key: 'user_id',
        align: 'center',
      },
      {
        title: `NAME`,
        dataIndex: 'name',
        key: 'name',
        align: 'center',
      },
      {
        title: `金币`,
        dataIndex: 'coin',
        key: 'coin',
        align: 'center',
      },
      {
        title: `小时`,
        dataIndex: 'hour',
        key: 'hour',
        align: 'center',
      },
      {
        title: `薪水`,
        dataIndex: 'salary',
        key: 'salary',
        align: 'center',
      },
      {
        title: `结算方式`,
        dataIndex: 'pay_type_name',
        key: 'pay_type_name',
        align: 'center',
      },
      {
        title: `达人分成比例`,
        dataIndex: 'mcn_percent',
        key: 'mcn_percent',
        align: 'center',
      },
      {
        title: `机构分成比例`,
        dataIndex: 'agent_percent',
        key: 'agent_percent',
        align: 'center',
      },
      {
        title: `达人分成金额`,
        dataIndex: 'mcn_money',
        key: 'mcn_money',
        align: 'center',
      },
      {
        title: `机构分成金额`,
        dataIndex: 'agent_money',
        key: 'agent_money',
        align: 'center',
      },
      {
        title: `用户类型名称`,
        dataIndex: 'user_type_name',
        key: 'user_type_name',
        align: 'center',
      },
      // mcn_percent 达人分成比例
      // agent_percent 机构分成比例
      // mcn_money 达人分成金额
      // agent_money 机构分成金额
      // sum_money 总金额
      // user_type_name 用户类型名称
      // {
      //   title: formatMessage({ id: 'app.host.upper.avatar' }),
      //   dataIndex: 'avatar',
      //   key: 'avatar',
      //   align: 'center',
      //   render: (_, record) => {
      //     return <img src={_} style={{ borderRadius: '100%', width: '50px', height: '50px' }} />
      //   }
      // },
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

  componentDidMount() {
    this.fetch()
  }

  render() {
    const { TableList, SearchBar, onUpload, url, toggleManage } = this;
    const { detail, showModel, info } = this.state;
    return (
      <>
        <SearchBar />
        <TableList />
        {/* <Drawer
          placement='right'
          onClose={this.onClose}
          visible={showModel}
          width='650px'
          closable={false}
        >
          {showModel && <UpperRoom {...info} />}
        </Drawer> */}
        {/* <Manage data={this.props.mcnList} visible={this.state.manageShow} info={this.state.manageInfo} close={() => { toggleManage(this.state.manageInfo) }} /> */}
      </>
    );
  }
}

export default Index;
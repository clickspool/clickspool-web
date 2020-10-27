
import React, { Component } from 'react';
import { connect } from 'dva';
import { Breadcrumb, Button, Tag, Form, Row, Col, Input, Card, Popconfirm, Select, Table, message, Drawer, Icon, Switch } from 'antd';
import CommonBreadCrumb from '@/components/CommonBreadCrumb';
import { formatMessage } from 'umi/locale';
import router from 'umi/router';
import style from './index.less';
import UpperRoom from './UpperRoom';
import Manage from './Manage';


const Search = Input.Search;
const FormItem = Form.Item;
const TextArea = Input.TextArea;
const Option = Select.Option;


@Form.create()
@connect(({
  upper: {
    filter,
    list,
    sex
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
  sex,
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
        type: "upper/filter",
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
          type: "upper/fetch",
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
      type: "upper/del",
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
    return (
      <Card
        className={'styles-card'}
        bordered
      >
        <Form >
          <Row gutter={16} className="regDate">
            <Col lg={5} md={12} sm={24}>
              <Form.Item {...formItemLayout} label={'NICK ID'}>
                {getFieldDecorator('nick_id')(
                  <Input placeholder={formatMessage({ id: 'app.host.upper.nickID' })} />
                )}
              </Form.Item>
            </Col>
            <Col lg={5} md={12} sm={24}>
              <Form.Item {...formItemLayout} label={`UID`}>
                {getFieldDecorator('creator_id')(
                  <Input placeholder={formatMessage({ id: 'app.host.upper.userId' })} />
                )}
              </Form.Item>
            </Col>
            <Col lg={5} md={12} sm={24}>
              <Form.Item {...formItemLayout} label={formatMessage({ id: 'app.host.upper.manage.sign' })}>
                {getFieldDecorator('is_signed')(
                  <Select>
                    <Option value=''>{formatMessage({ id: 'app.host.upper.filter.all' })}</Option>
                    <Option value={1}>{formatMessage({ id: 'app.host.upper.manage.sign.yes' })}</Option>
                    <Option value={0}>{formatMessage({ id: 'app.host.upper.manage.sign.no' })}</Option>
                  </Select>
                )}
              </Form.Item>
            </Col>
            <Col lg={5} md={12} sm={24}>
              <Form.Item {...formItemLayout} label={formatMessage({ id: 'app.host.upper.manage.organization' })}>
                {getFieldDecorator('organization_id')(
                  <Select>
                    <Option value=''>{formatMessage({ id: 'app.host.upper.filter.all' })}</Option>
                    {mcnList.map(item => (
                      <Option key={item.id} value={item.id}>{item.name}</Option>
                    ))}
                  </Select>
                )}
              </Form.Item>
            </Col>
            <Col lg={4} md={12} sm={24} style={{
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
      type: 'upper/setUserOfficialRec',
      payload: {
        user_id: id,
        is_recommend: value ? 1 : 0
      }
    });
  }

  batchSetIdentity = ({ id, action }) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'upper/batchSetIdentity',
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
        title: 'UID',
        dataIndex: 'creator_id',
        key: 'creator_id',
        align: 'center',
      },
      {
        title: `NICKID`,
        dataIndex: 'nick_id',
        key: 'nick_id',
        align: 'center',
      },
      {
        title: `昵称`,
        dataIndex: 'nickname',
        key: 'nickname',
        align: 'center',
      },
      {
        title: formatMessage({ id: 'app.host.upper.avatar' }),
        dataIndex: 'avatar',
        key: 'avatar',
        align: 'center',
        render: (_, record) => {
          return <img src={_} style={{ borderRadius: '100%', width: '50px', height: '50px' }} />
        }
      },
      {
        title: formatMessage({ id: 'app.host.upper.sex' }),
        dataIndex: 'sex',
        key: 'sex',
        align: 'center',
        render: (_, record) => {
          return sex[_];
        }
      },
      {
        title: '夜场主播',
        dataIndex: 'is_night_girl',
        render(text, record) {
          return <Popconfirm
            title={text?'取消夜场主播':'设置为夜场主播'}
            okText={formatMessage({ id: 'app.scene.category.offline_confirm' })}
            cancelText={formatMessage({ id: 'app.scene.category.offline_cancel' })}
            okType='danger'
            placement="topRight"
            // onCancel={_this.cancelSwitch}
            onConfirm={() => {
              _this.batchSetIdentity({
                id:record.id,
                action:text?'remove':'add'
              })
            }}
          >
            <Button size="small" type={`${text?'danger':'primary'}`}>{text?'取消夜场主播':'设置为夜场主播'}</Button>
          </Popconfirm>
        }
      },
      {
        title: formatMessage({ id: 'app.host.upper.nation' }),
        dataIndex: 'nation',
        key: 'nation',
        align: 'center',
        render: (text, record) => {
          const initNation = GlobalCountryMap.find((item) => {
            return item.id == text
          });
          return initNation ? initNation['name'] : '';
        }
      },
      {
        title: formatMessage({ id: 'app.host.upper.startUpTime' }),
        dataIndex: 'last_voice_at',
        key: 'last_voice_at',
        align: 'center',
      },
      {
        title: formatMessage({ id: 'app.host.upper.manage.sign' }),
        dataIndex: 'is_signed',
        align: 'center',
        render: (value) => {
          if (+value === 1) {
            return (
              <>
                <Icon style={{ color: 'green', marginRight: '3px' }} type="check-circle" />{formatMessage({ id: 'app.host.upper.manage.sign.status' })}
              </>
            );
          }
        }
      },
      {
        title: formatMessage({ id: 'app.host.upper.manage.organization' }),
        dataIndex: 'organization_id',
        align: 'center',
        render: (value) => {
          const orgnize = mcnList.find(item => item.id === value);
          return orgnize && orgnize.name;
        }
      },
      {
        title: `封禁截止时间`,
        dataIndex: 'room_forbid_until',
        key: 'room_forbid_until',
        align: 'center',
        render(text) {
          if (text == `0000-00-00 00:00:00`) {
            return ''
          }
          return text
        }
      },
      {
        title: formatMessage({ id: 'app.host.upper.session' }),
        dataIndex: '221',
        key: '221',
        align: 'center',
        render: (_, record) => {
          return <Button onClick={
            () => {
              this.setState({
                info: record
              }, () => {
                this.setState({
                  showModel: true
                })
              })
            }
          }>查看</Button>
        }
      },
      {
        title: '操作',
        dataIndex: 'active',
        key: 'active',
        // align: 'center',
        render(_, info) {
          return (<>
            <Button style={{ marginRight: '10px' }} type="primary" onClick={() => {
              toggleManage(info);
            }}>{formatMessage({ id: 'app.host.upper.manage' })}</Button>
            <Popconfirm
              title={<InputDay {...info} />}
              onConfirm={() => {
                dispatch({
                  type: `upper/modify`,
                  payload: {
                    user_id: info.creator_id,
                    day: +info.is_forbid_room == 0 ? (_this.state.inputday || 1000) : 0
                  }
                })
                  .then(() => {
                    _this.setState({
                      inputday: ''
                    })
                  })
              }}
              okText="确定"
              cancelText="取消"
            >
              {+info.is_forbid_room != 0 ?
                <Button type="primary">{formatMessage({ id: 'app.host.upper.open' })}{formatMessage({ id: 'app.host.upper.role' })}</Button>
                :
                <Button type="danger">{formatMessage({ id: 'app.host.upper.close' })}{formatMessage({ id: 'app.host.upper.role' })}</Button>
              }
            </Popconfirm>
            <div className={style.plan}>
              <label className={style['plan-label']}>{formatMessage({ id: 'app.host.upper.manage.join' })}</label>
              <Switch checkedChildren={formatMessage({ id: 'app.host.upper.manage.sign.yes' })} unCheckedChildren={formatMessage({ id: 'app.host.upper.manage.sign.no' })} checked={!!info.is_recommend} onChange={(value) => {
                toggleRecommend({ id: info.id, value });
              }} />
            </div>
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
        <Drawer
          placement='right'
          onClose={this.onClose}
          visible={showModel}
          width='650px'
          closable={false}
        >
          {showModel && <UpperRoom {...info} />}
        </Drawer>
        <Manage data={this.props.mcnList} visible={this.state.manageShow} info={this.state.manageInfo} close={() => { toggleManage(this.state.manageInfo) }} />
      </>
    );
  }
}

export default Index;
import { del } from '@/services/tag';
import { setUserStar, setUserRecBlackList, batchAddVipDay, batchAddDiamond, batchSetMcnOrRobot, batchAddDiamondShard } from '@/services/users';
import { type } from '@/utils/utils';
import Lightbox from 'react-image-lightbox';
import 'react-image-lightbox/style.css';
import AccountEdit from './AccountEdit';
import get from 'lodash/get';

import { connect } from 'dva';

import {
  Input,
  InputNumber,
  Breadcrumb,
  Icon,
  Button,
  Pagination,
  Divider,
  DatePicker,
  Table,
  Popconfirm,
  Badge,
  Card,
  Form,
  Row,
  Col,
  Select,
  Modal,
  Tag
} from 'antd';

import React, { PureComponent, Fragment } from 'react';

import { formatMessage } from 'umi/locale';

import _ from 'lodash';
import Link from 'umi/link';

import { operationEnum, getKey } from '../../../../config/role.enum';

import styles from './Users.less';
import CoinWrap from './CoinWrap.tsx';

const { Option } = Select;
const { RangePicker } = DatePicker;
const moment = require('moment');
const Search = Input.Search;
function toParseInt(str) {
  if (str) {
    return parseInt(str || 0);
  }
  return 0;
}
const platform = {
  '1': 'Android',
  '2': 'iOS',
  '3': 'H5',
}
const mix = {
  batchAddVipDay,
  batchAddDiamond
}

@connect(
  ({
    users: {
      data: { list, page, total_count },
      status,
      sex,
      country,
      user_star
    },
    users_info: {
      userTypesMap,
      globalCountryMap
    },
    routing: {
      location: { pathname },
    },
    memberInfo: {
      data: { keys },
    },
    mcn: {
      list: mcnList
    },

  }) => ({
    list,
    page,
    total_count,
    keys,
    pathname,
    status,
    sex,
    country,
    user_star,
    userTypesMap,
    globalCountryMap,
    mcnList
  })
)
@Form.create()
class Users extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      pagination: { page_size: 20, page: 1, total_count: props.total_count },
      addVisible: false,
      editVisible: false,
      editDataSource: {},
      showPreview: false,
      previewImg: '',
      showModal: 0,
      user_ids: '',
      showShard: false,
      disbShard: true,
      images: [],
      captions: [],
      photoIndex: 0,
      isOpen: false,
      showEdit: false,
      editRecord: {},
    };
    _.bindAll(this, [
      'updataConfiList',
      'SearchBtnHandle',
      'SearchResetBtnHandle',
      'addVisbleHandle',
      'handleTableChange',
      'delRole',
      'onCloseEditModel',
      'userEdit',
    ]);
  }
  componentDidMount() {
    // console.log(CoinWrap(),'CoinWrap');
    this.getEnumList().then(() => {
      this.updataConfiList();
    });
  }
  SearchResetBtnHandle = () => {
    const { pagination } = this.state;
    this.props.form.resetFields();
    this.setState({
      pagination: {
        page: 1,
        page_size: 20,
        status: '',
        name: '',
        user_id: '',
        sex: '',
        telephone: '',
        country: '',
        begin_time: '',
        end_time: '',
      },
    },
      () => {
        this.updataConfiList();
      }
    );
  };
  SearchBtnHandle = (e, isExport = 0) => {
    const { dispatch } = this.props;
    this.props.form.validateFields((err, values) => {
      const { pagination } = this.state;
      let time = {};

      if (values.pushtime && type(values.pushtime) === 'array') {
        time = {
          begin_time: moment(values.pushtime[0]).format('YYYY-MM-DD') + ' 00:00:00',
          end_time: moment(values.pushtime[1]).format('YYYY-MM-DD') + ((moment(values.pushtime[0]).format('YYYY-MM-DD') == moment(values.pushtime[1]).format('YYYY-MM-DD')) ? ' 23:59:59' : ' 00:00:00'),
        };
      }

      delete values['pushtime'];
      if (isExport) {
        return dispatch({
          type: 'users/getList',
          payload: Object.assign({}, pagination, values, { export: isExport, page: 1, ...time }),
        });
      }
      this.setState(
        {
          pagination: Object.assign({}, pagination, values, { page: 1, ...time }),
        },
        () => {
          this.updataConfiList();
        }
      );
    });
  };

  async getEnumList() {
    const { dispatch } = this.props;

    await dispatch({
      type: 'permission/getRoleList',
    });
    await dispatch({
      type: 'permission/getMemberStatusList',
    });
    // dispatch({
    //   type: 'users/getUserStatusList',
    // });
    dispatch({
      type: 'users/getUserSexList',
    });
    dispatch({
      type: 'users/getCountryList',
    });
    dispatch({
      type: 'users_info/getUserTypesMap',
    });
    dispatch({
      type: 'users_info/getGlobalCountryMap',
    });
  }

  updataConfiList() {
    const { dispatch } = this.props;
    const { pagination } = this.state;
    dispatch({
      type: 'users/getList',
      payload: pagination,
    });
  }
  addVisbleHandle(refresh) {
    this.setState({ addVisible: !this.state.addVisible }, () => {
      refresh === 'refresh' && this.updataConfiList();
    });
  }
  handleTableChange(page) {
    const { pagination } = this.state;
    this.setState(
      {
        pagination: Object.assign({}, pagination, { page }),
      },
      () => {
        this.updataConfiList();
      }
    );
  }

  delRole(id) {
    del({ id })
      .then(res => {
        if (!res.code) {
          this.updataConfiList();
        }
      })
      .catch(e => {
        console.log(e);
      });
  }
  userEdit(record) {
    this.setState({ editDataSource: record }, () => {
      this.onCloseEditModel();
    });
  }
  onCloseEditModel(refresh) {
    this.setState({ editVisible: !this.state.editVisible }, () => {
      refresh === 'refresh' && this.updataConfiList();
    });
  }
  onShowSizeChange = (current, pageSize) => {
    const { pagination } = this.state;
    this.setState(
      {
        pagination: Object.assign({}, pagination, { page: current, page_size: pageSize }),
      },
      () => {
        this.updataConfiList();
      }
    );
    console.log(current, pageSize);
  };
  handleImgClick = (img) => {
    this.setState({
      showPreview: true,
      previewImg: img
    })
  }

  handleCancel = () => {
    this.setState({
      showPreview: false,
    }, () => {
      this.setState({
        previewImg: '',
      })
    })
  }
  validateTel = (rule, value, callback) => {
    const form = this.props.form;
    const reg = /^1([38][0-9]|4[579]|5[0-3,5-9]|6[6]|7[0135678]|9[89])\d{8}$/;
    if (value && !reg.test(value)) {
      callback(formatMessage({ id: 'app.feedback.pleaseRightPhone' }));
    } else {
      callback();
    }
  }
  operationStar = (user_id, user_star) => {
    setUserStar({ user_id, user_star: !!~~user_star ? "0" : "1" })
      .then(res => {
        this.updataConfiList()
      })
  }

  batchSetIdentity = ({ id, action }) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'users_info/batchSetIdentity',
      payload: {
        user_ids: id + '',
        identity: 32,
        action
      }
    })
      .then(() => {
        this.updataConfiList();
      });
  }
  updateBackgroundTime = (user_id) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'users_info/updateBackgroundTime',
      payload: {
        user_id
      }
    })
      .then(() => {
        this.updataConfiList();
      });
  }

  updateLastActiveAt = (user_id) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'users_info/updateLastActiveAt',
      payload: {
        user_id
      }
    })
      .then(() => {
        this.updataConfiList();
      });
  }


  render() {
    const {
      list,
      page,
      total_count,
      roleList,
      keys,
      pathname,
      form: { getFieldDecorator },
      status,
      sex,
      country,
      userTypesMap,
      globalCountryMap = [],
      mcnList
    } = this.props;
    const { addVisible, editVisible, editDataSource, showModal, user_ids, user_ids_, showShard, disbShard, isOpen, images, photoIndex, captions } = this.state;
    const { onShowSizeChange, handleImgClick, updataConfiList } = this;
    const _this = this;
    const hasOperation = [{
      title: formatMessage({ id: 'app.user_.operation' }),
      dataIndex: 'operation',
      key: 'operation',
      width: `180px`,
      fixed: 'right',
      render(text, info) {
        return (
          <>
            <Popconfirm
              title={`确定${info.recommend_block == 0 ? '添加至黑名单' : '移出黑名单'}？`}
              onConfirm={() => {
                setUserRecBlackList({ action: info.recommend_block == 0 ? 'add' : 'remove', user_id: info.id })
                  .then(res => {
                    updataConfiList()
                  })
              }}
              okText="确定"
              cancelText="取消"
            >
              <Button type={info.recommend_block == 0 ? 'danger' : 'primary'} size="small" style={{ marginLeft: '8px' }}>{info.recommend_block == 0 ? '添加至黑名单' : '移出黑名单'}</Button>
            </Popconfirm>
            <Popconfirm
              title={`确定${info.is_mcn == 0 ? '设置达人' : '取消达人'}？`}
              onConfirm={() => {
                batchSetMcnOrRobot({ action: info.is_mcn == 0 ? 'add' : 'remove', user_ids: info.id, task_object: 'mcn' })
                  .then(res => {
                    updataConfiList()
                  })
              }}
              okText="确定"
              cancelText="取消"
            >
              <Button type={info.is_mcn == 0 ? 'primary' : 'danger'} size="small" style={{ marginLeft: '8px', marginTop: '4px' }}>{info.is_mcn == 0 ? '设置达人' : '取消达人'}</Button>
            </Popconfirm>
            <br />
            <Button type='primary' size="small"
              style={{ marginLeft: '8px', marginTop: '4px' }}
              onClick={() => {

                _this.setState({
                  editRecord: info
                }, () => {
                  _this.setState({
                    showEdit: true
                  })
                })
              }}
            >编辑</Button>
          </>
        )
      }
    }];
    const columns = [...[
      {
        title: formatMessage({ id: 'app.user_.user_id' }),
        dataIndex: 'id',
        key: 'id',
      },
      {
        title: formatMessage({ id: 'app.user_.nick_id' }),
        dataIndex: 'nick_id',
        key: 'nick_id',
      },
      {
        title: '昵称',
        dataIndex: 'nickname',
        key: 'nickname',
      },
      {
        title: formatMessage({ id: 'app.user_.avatar' }),
        dataIndex: 'avatar',
        key: 'avatar',
        align: 'center',
        render(value) {
          return <img src={`${value}?x-oss-process=image/resize,w_80`} style={{ width: '80px', height: '80px', borderRadius: '100%' }} onClick={() => { handleImgClick(value) }} />
        }
      },
      {
        title: '背景墙',
        dataIndex: 'background_count',
        key: 'background_count',
        align: 'center',
        render: (text, record) => {
          return <>
            <Tag
              color={text == 0 ? 'grey' : 'green'}
              style={text == 0 ? {} : { cursor: 'pointer' }}
              onClick={() => {
                console.log(1111)
                if (text) {
                  let image = []; let caption = [];
                  record.background_list.map((item, index) => {
                    image.push(item.thumbnail)
                    caption.push(item.type == 1 ? <><Tag color="green" onClick={() => {
                      window.open(item.file)
                    }}>视频</Tag>
                      <a href={item.file} target='_blank'>{item.file}</a>
                    </> : <><Tag color="#6656F5" onClick={() => {
                      window.open(item.file)
                    }}>图片</Tag>
                        <a href={item.file} target='_blank'>{item.file}</a>
                      </>)
                  })
                  _this.setState({ images: image, captions: caption }, () => {
                    _this.setState({ isOpen: true })
                  });
                }
              }}
            >{text == 0 ? '没有照片墙' : `照片墙数${text}`}</Tag>
            {!!text &&
              <Button
                size="small"
                type={'primary'}
                style={{ marginTop: "5px" }}
                onClick={() => {
                  _this.updateBackgroundTime(record.id)
                }}
              >刷新照片墙</Button>
            }
          </>
        }
      },
      {
        title: '夜场主播',
        dataIndex: 'is_night_girl',
        render(text, record) {
          return <Popconfirm
            title={text ? '取消夜场主播' : '设置为夜场主播'}
            okText={formatMessage({ id: 'app.scene.category.offline_confirm' })}
            cancelText={formatMessage({ id: 'app.scene.category.offline_cancel' })}
            okType='danger'
            placement="topRight"
            // onCancel={_this.cancelSwitch}
            onConfirm={() => {
              _this.batchSetIdentity({
                id: record.id,
                action: text ? 'remove' : 'add'
              })
            }}
          >
            <Button size="small" type={`${text ? 'danger' : 'primary'}`}>{text ? '取消夜场主播' : '设置为夜场主播'}</Button>
          </Popconfirm>
        }
      },
      {
        title: '是否是达人',
        dataIndex: 'is_mcn',
        key: 'is_mcn',
        align: 'center',
        render: (_) => {
          return <Tag color={_ == 0 ? 'grey' : 'green'}>{_ == 0 ? '非达人账号' : '达人账号'}</Tag>
        }
      },
      {
        title: formatMessage({ id: 'app.user.mcn' }),
        dataIndex: 'organization_id',
        key: 'organization_id',
        align: 'center',
        render: (value) => {
          return (
            <div>{get(mcnList.find(item => item.id == value), 'name')}</div>
          );
        }
      },
      {
        title: formatMessage({ id: 'app.virtual.account.type' }),
        dataIndex: 'login_type',
        key: 'login_type',
        render: (text) => {
          if (!userTypesMap) {
            return ''
          }
          return userTypesMap[+text]
        }
      },
      {
        title: formatMessage({ id: 'app.user_.username' }),
        dataIndex: 'login_account',
        align: 'center',
      },
      {
        title: formatMessage({ id: 'app.user_.sex' }),
        dataIndex: 'sex',
        key: 'sex',
        align: 'center',
        render(text) {
          return sex[text]
        }
      },
      {
        title: formatMessage({ id: 'app.user_.age' }),
        dataIndex: 'age',
        align: 'center',
        key: 'age',
      },
      {
        title: formatMessage({ id: 'app.user_.area' }),
        dataIndex: 'nation',
        key: 'nation',
        render: (text) => {
          return !!globalCountryMap.length && (globalCountryMap.find((item) => { return item.id == text }) || {}).name
        }
      },
      {
        title: formatMessage({ id: 'app.user_.diamond' }),
        dataIndex: 'diamond',
        key: 'diamond',
        align: 'center',
      },
      {
        title: `碎钻数`,
        dataIndex: 'diamond_shard',
        key: 'diamond_shard',
        align: 'center',
      },
      {
        title: formatMessage({ id: 'app.user_.x_coin' }),
        dataIndex: 'x_coin',
        key: 'x_coin',
        align: 'center',
      },
      {
        title: formatMessage({ id: 'app.user_.last_active_at' }),
        dataIndex: 'last_active_at',
        key: 'last_active_at',
        align: 'center',
        render: (text, record) => {
          return <>
            <p>{text}</p>
            <Button
              size="small"
              type={'primary'}
              style={{ marginTop: "5px" }}
              onClick={() => {
                _this.updateLastActiveAt(record.id)
              }}
            >刷新活跃时间</Button>
          </>
        }
      },
      {
        title: formatMessage({ id: 'app.user_.time' }),
        dataIndex: 'time',
        key: 'time',
        align: 'center',
        render: (h, record) => {
          return (<Fragment>
            <p>{formatMessage({ id: 'app.seed.update_at' })}: {record.update_at}</p>
            <p>{formatMessage({ id: 'app.scene.tools.create_time' })}: {record.create_at}</p>
          </Fragment>)
        },
      }
    ],
    ...hasOperation
    ];
    return (
      <>
        <style>
          {`
            .status-badge .ant-badge-status-dot{
                height:8px;
                width:8px
            }
              .regDate .ant-calendar-picker{
                width:100%;
              }
            .sup-required{
                color:#f5222d;
                margin-right:2px;
            }
            .web .ant-modal{
                width:auto !important
            }
            .web .ant-modal .ant-modal-body{
                padding:16px !important;
            }
            .public-DraftStyleDefault-block{
                margin:0;
            }
            `}
        </style>
        <div className={styles.breadcrumbBox}>
          <Breadcrumb>
            <Breadcrumb.Item>
              <Icon type="lock" />
              <span>{formatMessage({ id: 'menu.operation' })}</span>
            </Breadcrumb.Item>
            <Breadcrumb.Item>{formatMessage({ id: 'menu.operation.user' })}</Breadcrumb.Item>
            <Breadcrumb.Item>{formatMessage({ id: 'menu.operation.user.list' })}</Breadcrumb.Item>
          </Breadcrumb>
        </div>
        <div className={styles.addBtn}>
          <Card
            title={formatMessage({ id: 'menu.operation.user.list' })}
            className={styles.card}
            bordered
          >
            <Form layout="vertical" hideRequiredMark>
              <Row gutter={16}>
                <Col lg={3} md={12} sm={24}>
                  <Form.Item label={formatMessage({ id: 'app.user_.user_id' })}>
                    {getFieldDecorator('user_id')(
                      <Input placeholder={formatMessage({ id: 'app.users.pleaseID' })} />
                    )}
                  </Form.Item>
                </Col>
                <Col lg={3} md={12} sm={24}>
                  <Form.Item label={formatMessage({ id: 'app.user_.nick_id' })}>
                    {getFieldDecorator('nick_id')(
                      <Input placeholder={formatMessage({ id: 'app.user_.p_nick_id' })} />
                    )}
                  </Form.Item>
                </Col>
                <Col lg={3} md={12} sm={24}>
                  <Form.Item label={formatMessage({ id: 'app.virtual.account.type' })}>
                    {getFieldDecorator('login_type', {
                      initialValue: '',
                    })(
                      <Select>
                        <Option value="">{formatMessage({ id: 'app.virtual.account.allType' })}</Option>
                        {Object.keys(userTypesMap).map(item => {
                          return (
                            <Option key={item} value={item}>
                              {userTypesMap[item]}
                            </Option>
                          );
                        })}
                      </Select>
                    )}
                  </Form.Item>
                </Col>
                <Col lg={3} md={12} sm={24}>
                  <Form.Item label={formatMessage({ id: 'app.users.sex' })}>
                    {getFieldDecorator('sex', {
                      initialValue: '',
                    })(
                      <Select>
                        <Option value="">{formatMessage({ id: 'app.users.allSex' })}</Option>
                        {Object.keys(sex).map(item => {
                          return (
                            <Option key={item} value={item}>
                              {sex[item]}
                            </Option>
                          );
                        })}
                      </Select>
                    )}
                  </Form.Item>
                </Col>
                <Col lg={3} md={12} sm={24}>
                  <Form.Item label={'黑名单用户'}>
                    {getFieldDecorator('recommend_block')(
                      <Select placeholder={`请选择`}>
                        <Option value="0">非黑名单用户</Option>
                        <Option value='1'>黑名单用户</Option>
                      </Select>
                    )}
                  </Form.Item>
                </Col>
                <Col lg={4} md={12} sm={24}>
                  <Form.Item label={'达人账户'}>
                    {getFieldDecorator('is_mcn')(
                      <Select placeholder={`请选择`}>
                        <Option value="0">非达人账户</Option>
                        <Option value='1'>达人账户</Option>
                      </Select>
                    )}
                  </Form.Item>
                </Col>
                <Col lg={4} md={12} sm={24}>
                  <Form.Item label={formatMessage({ id: 'app.user.mcn' })}>
                    {getFieldDecorator('organization_id')(
                      <Select placeholder={formatMessage({ id: 'app.user.mcn.placeholer' })}>
                        {mcnList.map(item => {
                          return (
                            <Option key={item.id} value={item.id}>{item.name}</Option>
                          );
                        })}
                      </Select>
                    )}
                  </Form.Item>
                </Col>
                <Col lg={4} md={12} sm={24}>
                  <Form.Item label={'是否有背景墙'}>
                    {getFieldDecorator('have_background')(
                      <Select placeholder={`请选择`}>
                        <Option value="0">否</Option>
                        <Option value='1'>是</Option>
                      </Select>
                    )}
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item label={formatMessage({ id: 'app.user_.register_time' })}>
                    {getFieldDecorator('pushtime')(
                      <RangePicker
                        showTime={{ format: 'HH:mm:ss' }}
                        format="YYYY-MM-DD HH:mm:ss"
                        placeholder={[
                          formatMessage({ id: 'app.matters.create_at_start' }),
                          formatMessage({ id: 'app.matters.create_at_end' }),
                        ]}
                        style={{ width: '100%' }}
                        onChange={this.changeTimePicked}
                      />
                    )}
                  </Form.Item>
                </Col>
                <Col lg={6} md={12} sm={24}>
                  <Button type="primary" className={styles.btnSmt} onClick={this.SearchBtnHandle}>
                    {formatMessage({ id: 'app.content.search' })}
                  </Button>
                  <Button
                    type="primary"
                    className={styles.btnSmt}
                    onClick={(e) => { this.SearchBtnHandle(e, 1) }}
                    style={{ marginLeft: 8 }}
                  >
                    {formatMessage({ id: 'app.content.export' })}
                  </Button>
                  <Button
                    className={styles.btnSmt}
                    style={{ marginLeft: 8 }}
                    onClick={this.SearchResetBtnHandle}
                  >
                    {formatMessage({ id: 'app.content.reset' })}
                  </Button>
                </Col>
              </Row>
            </Form>
          </Card>
        </div>

        <div className={styles.sub_wrap} >
          <div className={styles.left_}>
            <Button disabled={showModal == 0 ? true : false} type={'primary'} size="small"
              onClick={() => {
                this.setState({
                  showModal: 1
                })
              }}
            >批量增加钻石</Button>
            <Button disabled={showModal == 0 ? true : false} type={'primary'} size="small"
              onClick={() => {
                this.setState({
                  showModal: 2
                })

              }}
            >批量设置为vip</Button>
            <Popconfirm
              title={`确定批量设置达人？`}
              onConfirm={() => {
                batchSetMcnOrRobot({ action: 'add', user_ids: user_ids_, task_object: 'mcn' })
                  .then(res => {
                    // updataConfiList();
                    _this.updataConfiList();
                    _this.setState({
                      showModal: 0,
                      user_ids: '',
                      user_ids_: '',
                      disbShard: true,
                    })
                  })
              }}
              okText="确定"
              cancelText="取消"
            >
              <Button style={{ marginLeft: 8 }} disabled={showModal == 0 ? true : false} type={'primary'} size="small" >批量设置为达人账户</Button>
            </Popconfirm>
            <Popconfirm
              title={`确定批量设置为机器人？`}
              onConfirm={() => {
                batchSetMcnOrRobot({ action: 'add', user_ids: user_ids_, task_object: 'robot' })
                  .then(res => {
                    _this.updataConfiList();
                    _this.setState({
                      showModal: 0,
                      user_ids: '',
                      user_ids_: '',
                      disbShard: true,
                    })
                  })
              }}
              okText="确定"
              cancelText="取消"
            >
              <Button style={{ marginLeft: 8 }} disabled={showModal == 0 ? true : false} type={'primary'} size="small" >批量设置为机器人账户</Button>
            </Popconfirm>
            <Button disabled={disbShard} type={'primary'} size="small"
              onClick={() => {
                this.setState({
                  showShard: true
                })
              }}
            >批量增加碎钻</Button>
            {/* <Button disabled={showModal==0?true:false} type={'primary'} size="small" 
             
            >批量设置为机器人</Button> */}
          </div>
          <div className={styles.right_}>
            <Pagination
              showTotal={total => formatMessage({ id: 'app.glob.pagetotal' }, { total: total })}
              pageSizeOptions={['20', '30', '40']}
              showSizeChanger
              onShowSizeChange={onShowSizeChange}
              current={toParseInt(this.state.pagination.page)}
              pageSize={this.state.pagination.page_size}
              onChange={this.handleTableChange}
              total={toParseInt(total_count)}
              size="small"
            />
          </div>
        </div>
        <Table
          rowSelection={{
            onChange: (selectedRowKeys, selectedRows) => {
              console.log(selectedRowKeys, 'selectedRowKeys', selectedRows)
              this.setState({
                user_ids: `${selectedRowKeys.join(',')}`,
                showModal: selectedRows.length == 0 ? 0 : 3,
                user_ids_: selectedRows.map((item) => { return item.id }).join(','),
                disbShard: selectedRows.length ? false : true
              })
            },
            selectedRowKeys: user_ids.split(','),
          }}
          rowKey="id"
          columns={columns}
          dataSource={list}
          pagination={false}
          bordered
          scroll={{ x: 3000 }}
          rowKey={(record, index) => `${record.id}${index}`}
        />
        <div className={styles.rightPagination}>
          <Pagination
            showTotal={total => formatMessage({ id: 'app.glob.pagetotal' }, { total: total })}
            pageSizeOptions={['20', '30', '40']}
            showSizeChanger
            onShowSizeChange={onShowSizeChange}
            current={toParseInt(this.state.pagination.page)}
            pageSize={this.state.pagination.page_size}
            onChange={this.handleTableChange}
            total={toParseInt(total_count)}
            size="small"
          />
        </div>
        <Modal
          title={'增加碎钻'}
          visible={showShard}
          onOk={() => {
            batchAddDiamondShard({
              user_ids: this.state.user_ids_, num: _this.setNumInputShrd.input.value
            })
              .then(res => {
                _this.setNumInputShrd.input.value = '';
                _this.updataConfiList();
                _this.setState({
                  showShard: false,
                  user_ids: '',
                  user_ids_: '',
                  disbShard: true,
                  showModal: 0,
                })
              })
          }}
          onCancel={() => {
            _this.setState({
              showShard: false
            })
          }}
          okText="保存"
          cancelText="取消"
        >
          {
            showShard &&
            <Input ref={(input) => this.setNumInputShrd = input} placeholder={'请输入碎钻石'} addonAfter={'碎钻'} />
          }
        </Modal>
        <Modal
          title={showModal == 1 ? '增加钻石' : showModal == 2 ? '设置vip' : ''}
          visible={showModal == 2 || showModal == 1}
          onOk={() => {
            mix[showModal == 2 ? `batchAddVipDay` : `batchAddDiamond`]({
              user_ids: this.state.user_ids_, [showModal == 2 ? 'day_num' : 'num']: _this.setNumInput.input.value
            })
              .then(res => {
                _this.setNumInput.input.value = '';
                _this.updataConfiList();
                _this.setState({
                  showModal: 0,
                  user_ids: '',
                  user_ids_: '',
                  disbShard: true,
                })
              })
          }}
          onCancel={() => {
            _this.setState({
              showModal: 3
            })
          }}
          okText="保存"
          cancelText="取消"
        >
          {
            (showModal == 1 || showModal == 2) &&
            <Input ref={(input) => this.setNumInput = input} placeholder={showModal == 1 ? '请输入钻石数' : showModal == 2 ? '请输入vip天数' : ''} addonAfter={showModal == 1 ? '钻石' : showModal == 2 ? '天' : ''} />
          }
        </Modal>
        <Modal
          title={null}
          visible={this.state.showPreview}
          onCancel={this.handleCancel}
          footer={null}
          closable={false}
          centered={true}
          maskClosable={true}
          wrapClassName={'web'} //对话框外部的类名，主要是用来修改这个modal的样式的
        >
          <div className="outer-iframe">
            <div className="d-iframe">
              {!this.state.previewImg && 'loading...'}
              {!!this.state.previewImg && <img src={this.state.previewImg} />}
            </div>
          </div>
        </Modal>
        {isOpen && (
          <Lightbox
            mainSrc={images[photoIndex]}
            nextSrc={images[(photoIndex + 1) % images.length]}
            prevSrc={images[(photoIndex + images.length - 1) % images.length]}
            onCloseRequest={() => this.setState({ isOpen: false, photoIndex: 0 })}
            onMovePrevRequest={() =>
              this.setState({
                photoIndex: (photoIndex + images.length - 1) % images.length,
              })
            }
            onMoveNextRequest={() =>
              this.setState({
                photoIndex: (photoIndex + 1) % images.length,
              })
            }
            imageCaption={captions[_this.state.photoIndex]}
          />
        )}
        {this.state.showEdit &&
          <AccountEdit visible={this.state.showEdit} record={this.state.editRecord} close={() => {
            this.setState({
              showEdit: false
            }, () => {
              this.updataConfiList()
            })
          }} />}
      </>
    );
  }
}
export default Users;

import { connect } from 'dva';
import React, { PureComponent, Fragment } from 'react';
//@ts-ignore
import { formatMessage } from 'umi/locale';
import CommonBreadCrumb from '@/components/CommonBreadCrumb';
import OperationBar from './components/OperationBar';
import classnames from 'classnames/bind';
import RefuseForm from './RefuseForm';
import PassForm from './PassForm';
import Preview from './components/Preview';
import AccountEdit from './AccountEdit';
import get from 'lodash/get';
// import styles from './applyList.less';

// import OperationBar from './components/OperationBar';
import styles from './list.less';
import {
  Icon,
  Input,
  Button,
  Table,
  Divider,
  Popconfirm,
  Tag,
  Modal,
  Form,
  Switch
} from 'antd';
import { format } from 'prettier';
import { Input } from 'antd';

const cx = classnames.bind(styles);
const { CheckOutlined } = Icon;

@connect(({ global: { GlobalCountryMap }, apply: { list, total, page, pageSize, tags, statuses = [], chatTagsMap, userTypeMap } }) => ({ GlobalCountryMap, list, total, page, pageSize, tags, statuses, chatTagsMap, userTypeMap }))
class Reply extends PureComponent<any, any> {
  voice: null;
  inputRef: LegacyRef<Input>;

  constructor(props) {
    super(props);
    this.state = {
      editShowing: false,
      previewShowing: false,
      playVoice: {},
      showEditModel: false,
      search: {}
    };
    this.input = React.createRef();
    this.inputRef = React.createRef()
  }

  pass = (score, record) => {
    console.info('pass__', score);
    this.props.dispatch({
      type: 'apply/patchStatus',
      payload: {
        recommend_score: score,
        id: record.id,
        status: 2
      }
    });
    this.hidePass();
  }
  refuse = (reason, record) => {
    if (reason && !reason.replace(/\s*/g, '')) {
      return;
    }
    this.props.dispatch({
      type: 'apply/patchStatus',
      payload: {
        id: record.id,
        status: 3,
        reason
      }
    });
    this.setState({
      reason: ''
    });
    this.hideRefuse();
  }
  showPass = (e, record) => {
    e.preventDefault();
    console.info('show_pass_', this.state.userTags);
    this.setState({
      passShowing: true
    });
  }
  showRefuse = (e, record) => {
    e.preventDefault();
    this.setState({
      refuseShowing: true
    });
  }
  reasonUpdate = (e) => {
    let reason = e.target.value;
    reason = reason.replace(/(^\s*)|(\s*$)/g, '');
    this.setState({ reason: e.target.value });
  }
  hidePass = (e?) => {
    this.setState({
      passShowing: false
    });
  }
  hideRefuse = (e?) => {
    this.setState({
      refuseShowing: false
    });
  }
  hidePreview = (e) => {
    this.setState({
      previewShowing: false,
      previewUrl: ''
    });
  }
  preview = (url) => {
    this.setState({
      previewShowing: true,
      previewUrl: url
    });
  }

  showEdit = (e, record) => {
    e.preventDefault();
    if (record) {
      this.setState({
        editRecord: record,
      });
    }
    this.setState({
      editShowing: true
    });
  }
  showAdd = () => {
    this.setState({
      addShowing: true
    });
  }
  hideAdd = () => {
    this.setState({
      addShowing: false
    });
  }
  hideEdit = () => {
    this.setState({
      editShowing: false,
      editRecord: null
    });
  }
  search = (values) => {
    this.setState({ search: values });
    const { pageSize } = this.props;
    const page = 1;
    this.props.dispatch({
      type: 'apply/updateState',
      payload: {
        filter: values
      }
    });
    this.props.dispatch({
      payload: { ...values, page, pageSize },
      type: 'apply/fetch'
    });
  }
  onShowSizeChange = (current, size) => {
    this.props.dispatch({
      type: 'apply/changePageSize',
      payload: {
        page: current,
        pageSize: size
      }
    });
    this.fetchPage(current, size);
  }
  fetchPage = (page = 1, pageSize = 20) => {
    const { search = {} } = this.state;
    this.setState({
      page,
      page_size: pageSize,
    })
    this.props.dispatch({
      type: 'apply/fetch',
      payload: {
        page,
        page_size: pageSize,
        ...search
      }
    });
  }

  cancelRecommendHandle = (id) => {
    Modal.confirm({
      title: '消息',
      content: '确定撤销？',
      okText: '确认',
      cancelText: '取消',
      onOk: () => {
        this.props.dispatch({
          type: 'apply/cancelRecommend',
          payload: { id }
        })
          .then(() => {
            this.props.dispatch({
              type: 'apply/fetch',
              payload: {
                page: this.props.page,
                page_size: this.props.pageSize,
                ...this.state.search
              }
            })
          })
      }
    });
  }

  InputCompress = () => {
    return <Input style={{ width: `200px` }} ref={this.inputRef} placeholder={'请输入压缩比范围 1~51'} />
  }
  toggleRecommend = ({ user_id, value, id }) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'apply/setUserCallAlert',
      payload: {
        user_id,
        is_alert: value ? 1 : 0,
        id
      }
    });
  }

  wipeWaterMark = (e) => {
    const { dispatch } = this.props;
    const { id } = e.currentTarget.dataset;
    dispatch({
      type: 'apply/deWatermarkVideo',
      payload: {
        id
      }
    });
  }

  render() {
    const crumbs = [
      {
        icon: 'desktop',
        title: formatMessage({ id: 'menu.operation' }),
      }, {
        title: formatMessage({ id: 'menu.operation.user.apply' }),
      }
    ];
    const { list, total, page, pageSize, tags, statuses, chatTagsMap, userTypeMap = {} } = this.props;
    const { showAdd, search, VioceTable, state: { playVoice }, InputCompress, toggleRecommend } = this;
    const _this = this;

    const columns = [
      {
        title: formatMessage({ id: 'app.message.template.id' }),
        dataIndex: 'id',
        align: 'center',
      },
      {
        title: 'nick_id',
        dataIndex: 'nick_id',
        align: 'center',
      },
      {
        title: '用户类型',
        dataIndex: 'type',
        align: 'center',
        width: 220,
        render: (value) => {
          const property: { color?: string } = {};
          // tslint:disable-next-line:prefer-conditional-expression
          if (+value === 1) {
            property.color = 'green';
          } else {
            property.color = 'grey';
          }
          return userTypeMap[value] ? (<Tag {...property}>{userTypeMap[value]}</Tag>) : ''
        }
      },
      {
        title: '头像',
        dataIndex: 'avatar',
        align: 'center',
        width: 150,
        render(text) {
          return <img src={text} style={{ width: 100, height: 100 }} />
        }
      },
      {
        title: '所属国家',
        dataIndex: 'nation',
        align: 'center',
        render(text) {
          if (text) {
            return (_this.props.GlobalCountryMap.find((item) => { return (item.id == text) }) || {})['name'] || '';
          }
        }
      },
      {
        title: '性别',
        dataIndex: 'sex',
        align: 'center',
        render(text) {
          return text == 1 ? '男' : '女'
        }
      },
      {
        title: formatMessage({ id: 'app.settings.basic.nickname' }),
        dataIndex: 'nickname',
        align: 'center',
      },

      {
        title: formatMessage({ id: 'app.virtual.accounts.time' }),
        dataIndex: 'time',
        align: 'center',
        render: (value, record) => {
          return (
            <Fragment>
              <div className={cx('time')}>{formatMessage({ id: 'app.group.list.edit_time' })}: {record.update_at}</div>
              <div className={cx('time')}>{formatMessage({ id: 'app.group.list.create_time' })}: {record.create_at}</div>
            </Fragment>
          );
        }
      },
      {
        title: formatMessage({ id: 'app.apply.account' }),
        dataIndex: 'user_id',
        align: 'center',
      },
      {
        title: formatMessage({ id: 'app.apply.video' }),
        dataIndex: 'remote_self_video',
        align: 'center',
        render: (value, record) => {

          return (
            <>
            <div className={styles.wraper} data-src={value}>
              <img className={styles.cover} src={`${value}?x-oss-process=video/snapshot,t_1000,f_jpg,w_400,m_fast`} onClick={() => { this.preview(value) }} />
              <Icon className={styles.play} type="play-circle" onClick={() => { this.preview(value) }} />
            </div>
              {!(~~record.compressed) &&
                <Popconfirm
                  title={
                    InputCompress()
                  }
                  icon={null}
                  onConfirm={() => {

                    const { value } = _this.inputRef.current.state;
                    if (/^[0-9]*$/.test(value) && (~~value) >= 0 && (~~value) <= 51) {
                      _this.props.dispatch({
                        type: 'apply/compressVideo',
                        payload: {
                          id: record.id,
                          crf: ~~value
                        }
                      }).then(res => {
                        if (res.code == 0) {
                          _this.inputRef.current.state.value = ""
                        }
                      })
                    }
                    // console.log(ev, 'ev')
                  }}
                  onCancel={() => {
                    _this.inputRef.current.state.value = ""
                  }}
                >
                  <Button className={styles['handle-button']} type="primary" size="small"
                  >
                    <Icon type="column-width" />
                  压缩
                </Button>
                </Popconfirm>
              }
              <Button disabled={+record.dewater_status === 2} icon={+record.dewater_status === 2 ? 'check' : ''} loading={+record.dewater_status === 1} className={styles['handle-button']} data-id={record.id} onClick={_this.wipeWaterMark} type="primary" size="small">
                {+record.dewater_status === 2 && '已'}去水印
              </Button>
            
            </>
          );
        }
      },
      {
        title: '申请音频',
        dataIndex: 'chat_tags',
        align: 'chat_tags',
        width: 150,
        render: (value, row, index) => {
          const { playVoice } = _this.state;
          if (value) {
            const v = JSON.parse(value);
            if (!(v && v[0])) { return }
            return <div className={styles.add_yuyin} onClick={() => {
              if (playVoice[`${index}${v[0].tag_id}`]) {
                _this.voice.pause();
                _this.setState({
                  playVoice: {}
                })
                return
              }
              if (this.voice) {
                _this.voice.pause();
              }
              _this.voice = new Audio(v[0].sound);

              _this.voice.loop = false;
              _this.voice.addEventListener('ended', () => {
                console.log(1, '执行监听')
                _this.setState({
                  playVoice: {}
                })
              }, false);
              _this.voice.play();
              _this.setState({
                playVoice: {
                  [`${index}${v[0].tag_id}`]: true
                }
              })
            }}>
              <div className={styles.r_yuyin} style={{ width: '100%' }}>
                {v[0].duration}'' <s className={playVoice[`${index}${v[0].tag_id}`] ? styles.bofang : null} />
              </div>
            </div>
          }
          return null
        }
      },
      {
        title: '音频标签',
        dataIndex: '_',
        align: '_',
        width: 150,
        render: (value, row, index) => {
          if (row.chat_tags && chatTagsMap) {
            const v = JSON.parse(row.chat_tags);
            if (!(v && v[0])) { return }
            const val = chatTagsMap.find((item, index) => { return item.id == v[0].tag_id })
            return <Tag key={val.id}>{val.name}</Tag>
          }
          return null
        }
      },
      {
        title: '音频描述',
        dataIndex: '_1',
        align: '_1',
        render: (value, row, index) => {

          if (row.chat_tags) {
            const v = JSON.parse(row.chat_tags);
            if (!(v && v[0])) { return }
            return JSON.parse(row.chat_tags)[0].content
          }
          return null
        }
      },
      {
        title: formatMessage({ id: 'app.apply.recommend.score' }),
        dataIndex: 'recommend_score',
        align: 'center'
      },
      {
        title: formatMessage({ id: 'app.apply.reapply' }),
        dataIndex: 'reapply_name',
        align: 'center',
      },
      {
        title: formatMessage({ id: 'app.group.tag.status' }),
        dataIndex: 'status',
        align: 'center',
        render: (value,) => {
          const property: { color?: string } = {};
          if (+value === 2) {
            property.color = 'green';
          }
          if (+value === 3) {
            property.color = 'red';
          }
          return <Tag {...property}>{formatMessage({ id: `app.apply.status${value}` })}</Tag>
        }
      },
      {
        title: formatMessage({ id: 'app.apply.auditor' }),
        dataIndex: 'check_member_name',
        align: 'center',
      },
      {
        title: formatMessage({ id: 'app.apply.reason' }),
        dataIndex: 'refuse_reason',
        align: 'center',
        width: 300,
      },
      {
        title: formatMessage({ id: 'app.virtual.accounts.operation' }),
        dataIndex: 'operation',
        align: 'center',
        fixed: 'right',
        width: '200px',
        render: (value, record) => {
          // return 1111;
          if (+record.status > 1) {
            return (
              <div className={styles.handle}>
                <span className={styles.edit} onClick={(e) => {
                  this.cancelRecommendHandle(record.id)
                }}>{formatMessage({ id: 'app.apply.reset' })}</span>
                <Divider type='vertical' />
                <span className={styles.delete} onClick={(e) => {
                  this.setState({ currentRecord: record, showEditModel: true });
                }}>{'编辑'}</span>

                {+record.status === 2 &&
                  <>
                    <Divider />
                    <div className={styles.plan}>
                      <label className={styles['plan-label']}>{formatMessage({ id: 'app.apply.callAlert' })}</label>
                      <Switch checkedChildren={formatMessage({ id: 'app.apply.callAlert.yes' })} unCheckedChildren={formatMessage({ id: 'app.apply.callAlert.no' })} checked={!!record.is_alert} onChange={(value) => {
                        toggleRecommend({ user_id: record.user_id, value, id: record.id });
                      }} />
                    </div>
                  </>
                }
              </div>
            )
          }
          return (
            <div className={styles.handle}>
              <span className={styles.edit} style={{ color: 'green' }} onClick={(e) => {
                const userTags = tags.filter(tag => record.tags.indexOf(tag.id) >= 0);
                const score = record.recommend_score || 0;
                this.setState({ score, currentRecord: record });
                this.showPass(e, record);
              }}>{formatMessage({ id: 'app.apply.pass' })}</span>
              <Divider type='vertical' />
              <span className={styles.delete} onClick={(e) => {
                this.setState({ currentRecord: record });
                this.showRefuse(e, record);
              }}>{formatMessage({ id: 'app.apply.refuse' })}</span>
              <Divider type='vertical' />
              <span className={styles.delete} onClick={(e) => {
                this.setState({ currentRecord: record, showEditModel: true });
              }}>{'编辑'}</span>
            </div>
          );
        }
      },
    ];
    return (
      <Fragment>
        <CommonBreadCrumb items={crumbs} />
        <div className={cx('operate')}>
          <OperationBar statuses={statuses} search={search} addTitle={formatMessage({ id: 'app.virtual.reply.add' })} add={showAdd} tags={tags} />
        </div>
        <Table
          className={cx('list')}
          bordered
          rowKey='id'
          // @ts-ignore
          columns={columns}
          dataSource={list}
          scroll={{ x: 3000 }}
          pagination={
            {
              position: 'both',
              pageSize,
              showSizeChanger: true,
              pageSizeOptions: ['20', '30', '40'],
              onShowSizeChange: this.onShowSizeChange,
              total,
              current: page,
              showTotal: total => formatMessage({ id: 'app.glob.pagetotal' }, { total: total }),
              size: 'small',
              onChange: this.fetchPage
            }
          }></Table>
        <PassForm visible={this.state.passShowing} record={this.state.currentRecord} score={get(this.state.currentRecord, 'recommend_score')} handleOk={this.pass} handleCancel={this.hidePass} />
        <RefuseForm visible={this.state.refuseShowing} record={this.state.currentRecord} handleOk={this.refuse} handleCancel={this.hideRefuse} />
        <Preview visible={this.state.previewShowing} url={this.state.previewUrl} hide={this.hidePreview} />
        {this.state.showEditModel && <AccountEdit record={this.state.currentRecord} close={() => {
          this.setState({
            showEditModel: false,
          }, () => {
            this.fetchPage(this.state.page || 1, this.state.pageSize || 1)
          })
        }} />}
      </Fragment>
    );
  }
}

export default Reply;

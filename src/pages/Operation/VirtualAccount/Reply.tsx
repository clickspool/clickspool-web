import { connect } from 'dva';
import React, { PureComponent, Fragment } from 'react';
//@ts-ignore
import { formatMessage } from 'umi/locale';
import CommonBreadCrumb from '@/components/CommonBreadCrumb';
import OperationBar from './components/OperationBar';
import EditTemplate from './EditReply';
import classnames from 'classnames/bind';

// import OperationBar from './components/OperationBar';
import styles from './Reply.less';
import {
  Breadcrumb,
  Icon,
  Input,
  Button,
  Table,
  Divider,
  Popconfirm,
  Tag,
  //  ,  Input, , Tag, Switch, Modal 
} from 'antd';
import content from '@/pages/Content/models/content';

const cx = classnames.bind(styles);
@connect(({ robotTemplate: { autoSendToolInfo, list, total, page, pageSize, tags, statuses = [], ruleTypes, gifts } }) => ({ autoSendToolInfo, list, total, page, pageSize, tags, statuses, ruleTypes, gifts }))
class Reply extends PureComponent<any, any> {
  constructor(props) {
    super(props);
    this.state = {
      editShowing: false,
    };
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
  deleteRecord = (record) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'robotTemplate/delete',
      payload: record
    });
  }
  putOnline = id => {
    this.props.dispatch({
      type: 'robotTemplate/patchStatus',
      payload: { id, status: 1 }
    });
  }
  putOffline = id => {
    this.props.dispatch({
      type: 'robotTemplate/patchStatus',
      payload: { id, status: 0 }
    });
  }
  search = (values) => {
    this.setState({ search: values });
    const { pageSize } = this.props;
    const page = 1;
    this.props.dispatch({
      type: 'robotTemplate/updateState',
      payload: {
        filter: values
      }
    });
    this.props.dispatch({
      payload: { ...values, page, pageSize },
      type: 'robotTemplate/fetch'
    });
  }
  onShowSizeChange = (current, size) => {
    this.props.dispatch({
      type: 'robotTemplate/changePageSize',
      payload: {
        page: current,
        pageSize: size
      }
    });
    this.fetchPage(current, size);
  }
  fetchPage = (page, pageSize) => {
    const { search = {} } = this.state;
    this.props.dispatch({
      type: 'robotTemplate/fetch',
      payload: {
        page,
        page_size: pageSize,
        ...search
      }
    });
  }

  render() {
    const crumbs = [
      {
        icon: 'desktop',
        title: formatMessage({ id: 'menu.operation' }),
      }, {
        icon: 'robot',
        title: formatMessage({ id: 'menu.operation.user.va_reply' }),
      }
    ];

    const { list, total, page, pageSize, tags, statuses, ruleTypes } = this.props;
    const { editShowing, addShowing, editRecord } = this.state;
    const { showEdit, hideEdit, deleteRecord, hideAdd, showAdd, search, putOnline, putOffline } = this;
    const columns = [
      {
        title: formatMessage({ id: 'app.message.template.id' }),
        dataIndex: 'id',
        align: 'center',
      },
      {
        title: formatMessage({ id: 'app.virtual.accounts.time' }),
        dataIndex: 'time',
        align: 'center',
        render: (value, record) => {
          return (
            <Fragment>
              <div className={cx('time')}>{formatMessage({ id: 'app.group.list.edit_time' })}: {record.update_time}</div>
              <div className={cx('time')}>{formatMessage({ id: 'app.group.list.create_time' })}: {record.create_time}</div>
            </Fragment>
          );
        }
      },
      {
        title: formatMessage({ id: 'app.message.template.name' }),
        dataIndex: 'title',
        align: 'center',
      },
      {
        title: formatMessage({ id: 'app.virtual.reply.account' }),
        dataIndex: 'robot_id',
        align: 'center',
      },
      {
        title: formatMessage({ id: 'app.virtual.reply.send_timing' }),
        dataIndex: 'send_timing',
        align: 'center',
      },
      {
        title: formatMessage({ id: 'app.virtual.reply.rule.title' }),
        dataIndex: 'rule_message_interval',
        align: 'center',
        render: (value, record) => {
          const { rule_message_count, rule_message_interval, rule_type } = record;
          let intervalValue = 0;
          let intervalUnit = '';
          const keys = {
            hint: formatMessage({ id: 'app.virtual.reply.rule.timeunit.hint' }),
            day: formatMessage({ id: 'app.virtual.reply.rule.timeunit.day' }),
            hour: formatMessage({ id: 'app.virtual.reply.rule.timeunit.hour' }),
            minute: formatMessage({ id: 'app.virtual.reply.rule.timeunit.minute' }),
            second: formatMessage({ id: 'app.virtual.reply.rule.timeunit.second' }),
          };
          const timeUnit = new Map([[keys.hint, 0], [keys.day, 60 * 60 * 24], [keys.hour, 60 * 60], [keys.minute, 60], [keys.second, 1]]);
          [...timeUnit].map(item => {
            if (intervalValue >= 1) { return }
            const [caption, count] = item;
            if (count && rule_message_interval % count === 0) {
              intervalValue = rule_message_interval / count;
              intervalUnit = caption;
            }
          });
          return (
            <p className={styles.rule}>{formatMessage({ id: 'app.virtual.reply.rule.desc' }, { count: rule_message_count, interval: intervalValue, unit: intervalUnit, rule_type: ruleTypes.get(rule_type) })}</p>
          );
        }
      },
      {
        title: formatMessage({ id: 'app.message.template.content' }),
        dataIndex: 'content',
        align: 'center',
        render: (value, record) => {
          let content;
          let type: any = '';
          if (record.message_type) {
            switch (record.message_type) {
              case '0':
                content = value;
                // app.virtual.reply.type.comment.makefriend
                type = formatMessage({ id: 'app.virtual.reply.type.comment.text' })
                if (+record.send_type === 2) {
                  type = formatMessage({ id: 'app.virtual.reply.type.comment.makefriend' })
                }
                break;
              case '1':
                content = (
                  <img className={styles.media} src={record.remote_url} alt={record.title} />
                )
                type = formatMessage({ id: 'app.virtual.reply.type.comment.pic' })
                break;
              case '2':
                type = formatMessage({ id: 'app.virtual.reply.type.comment.video' })
                content = (<video className={styles.media} muted loop autoPlay src={record.remote_url} />)
                break;
              case '4':
                type = formatMessage({ id: 'app.virtual.reply.type.comment.gif' })
                content = (<video className={styles.media} muted loop autoPlay src={record.remote_url} />)
                break;
              case '6':
                type = formatMessage({ id: 'app.virtual.reply.type.comment.video_phone' })
                content = (<video className={styles.media} muted loop autoPlay src={record.remote_url} />)
                break;
              default:
                const item = this.props.gifts.get(record.gift_id) || '';
                console.log(item, 'item')
                if (item) {
                  content = (<>{item.split(' ')[0]}<br />{item.split(' ')[1]}<br />{item.split(' ')[2]}</>);
                } else {
                  content = (<><span style={{ fontWeight: 'bold' }}>{formatMessage({ id: 'app.virtual.reply.scene.name' })}:</span></>);
                }
                type = formatMessage({ id: 'app.virtual.reply.type.reward' });
            }
          }
          return (
            <Fragment>
              {content}
              <div>
                <Tag className={cx('tag')}>
                  {type}
                </Tag>
              </div>
            </Fragment>
          );
        }
      },
      {
        title: formatMessage({ id: 'app.message.template.creater' }),
        dataIndex: 'member_nickname',
        align: 'center',
      },
      {
        title: formatMessage({ id: 'app.group.tag.status' }),
        dataIndex: 'status',
        align: 'center',
        render: (value, record) => {
          let color, satus;
          if (+value === 0) {
            color = 'gray';
            satus = formatMessage({ id: 'app.group.tag.offline' });
          } else {
            color = 'blue';
            satus = formatMessage({ id: 'app.group.tag.online' });
          }
          return <Tag color={color}>{satus}</Tag>
        }
      },
      {
        title: formatMessage({ id: 'app.virtual.accounts.operation' }),
        dataIndex: 'operation',
        align: 'center',
        render: (value, record) => {
          let caption, icon_type = 'edit', checked, statusEl, deleteEl;
          const deleteCaption = formatMessage({ id: 'app.scene.tools.delete' });
          if (record.status == 0) {
            checked = false;
            caption = formatMessage({ id: 'app.scene.category.online' });
            statusEl = (
              <Popconfirm
                title={formatMessage({ id: 'app.scene.category.online_hint' })}
                okText={formatMessage({ id: 'app.scene.category.offline_confirm' })}
                cancelText={formatMessage({ id: 'app.scene.category.offline_cancel' })}
                okType='danger'
                placement="topRight"
                // onCancel={this.cancelSwitch}
                onConfirm={() => { putOnline(record.id) }}
              >
                <a href="#" className={styles.edit}>{caption}</a>
              </Popconfirm>
            );
          } else {
            checked = true;
            caption = formatMessage({ id: 'app.scene.category.offline' });
            let confirm = formatMessage({ id: 'app.scene.category.offline_hint' });
            if (record.tool_count > 0) {
              confirm = formatMessage({ id: 'app.scene.category.has_tool_offline_hint' });
            }
            statusEl = (
              <Popconfirm
                title={confirm}
                okText={formatMessage({ id: 'app.scene.category.offline_confirm' })}
                cancelText={formatMessage({ id: 'app.scene.category.offline_cancel' })}
                okType='danger'
                placement="topRight"
                // onCancel={this.cancelSwitch}
                onConfirm={() => { putOffline(record.id) }}
              >
                <a href="#" className={`${styles.edit} ${styles.danger}`}>{caption}</a>
              </Popconfirm>
            );
          }
          deleteEl = (
            <Popconfirm
              title={formatMessage({ id: 'app.scene.tools.delete_confirm' })}
              okText={formatMessage({ id: 'app.scene.category.offline_confirm' })}
              cancelText={formatMessage({ id: 'app.scene.category.offline_cancel' })}
              okType='danger'
              placement="topRight"
              onConfirm={() => { deleteRecord(record) }}
            >
              <a href="#" className={styles.delete}>{deleteCaption}</a>
            </Popconfirm>
          );
          return (
            <div className={styles.handle}>
              <a href="#" className={styles.edit} onClick={(e) => { showEdit(e, record) }}>{formatMessage({ id: 'app.scene.tools.handle.edit' })}</a>
              <Divider type='vertical' />
              {statusEl}
              <Divider type='vertical' />
              {deleteEl}
            </div>
          );
        }
      },
    ];
    return (
      <Fragment>
        <CommonBreadCrumb items={crumbs} />
        <div className={cx('operate')}>
          <OperationBar statuses={statuses} ruleTypes={ruleTypes} search={search} addTitle={formatMessage({ id: 'app.virtual.reply.add' })} add={showAdd} tags={tags} />
        </div>
        <Table
          className={cx('list')}
          bordered
          rowKey='id'
          //@ts-ignore
          columns={columns}
          dataSource={list}
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
        {addShowing && <EditTemplate caption={formatMessage({ id: 'app.virtual.reply.add' })} visible={addShowing} close={hideAdd} />}
        {editRecord && <EditTemplate caption={formatMessage({ id: 'app.virtual.reply.edit' })} id={editRecord.id} record={editRecord} visible={!!this.state.editRecord} close={hideEdit} />}
      </Fragment>
    );
  }
}

export default Reply;

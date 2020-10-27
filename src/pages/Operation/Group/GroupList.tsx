import { connect } from 'dva';

import React, { PureComponent, Fragment } from 'react';
//@ts-ignore
import { formatMessage } from 'umi/locale';
import CommonBreadCrumb from '@/components/CommonBreadCrumb';
import classnames from 'classnames/bind';
import GroupEdit from './GroupEdit';
import OperationBar from './components/OperationBar';
import styles from './style.less';
import {
  Breadcrumb,
  Icon,
  Input,
  Button,
  Table,
  Divider,
  Popconfirm,
  //  ,  Input, , Tag, Switch, Modal 
} from 'antd';
/// <reference types='./css.d.ts' />

const cx = classnames.bind(styles);
@connect(({ groups: { list, total, page, pageSize, groupTypes, tags } }) => ({ list, total, page, pageSize, groupTypes, tags }))
class GroupList extends PureComponent<any, any> {
  constructor(props) {
    super(props);
    this.state = {
      editShowing: false,
      crumbs: [
        {
          icon: 'desktop',
          title: formatMessage({ id: 'menu.operation' }),
        },
        {
          icon: 'team',
          title: formatMessage({ id: 'menu.operation.group' }),
        },
        {
          title: formatMessage({ id: 'menu.operation.group.list' }),
        }
      ]
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
      type: 'groups/delete',
      payload: record
    });
  }
  search = (values) => {
    this.setState({ search: values });
    const { pageSize, page = 1 } = this.props;
    this.props.dispatch({
      type: 'groups/updateState',
      payload: {
        filter: values
      }
    });
    this.props.dispatch({
      payload: { ...values, page, pageSize },
      type: 'groups/fetch'
    });
  }
  onShowSizeChange = (current, size) => {
    this.props.dispatch({
      type: 'groups/changePageSize',
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
      type: 'groups/fetch',
      payload: {
        page,
        page_size: pageSize,
        ...search
      }
    });
  }

  render() {
    const { list, total, page, pageSize, groupTypes, tags } = this.props;
    const { editShowing, addShowing, editRecord, crumbs } = this.state;
    const { showEdit, hideEdit, deleteRecord, hideAdd, showAdd, search } = this;
    const columns = [
      {
        title: formatMessage({ id: 'app.group.id' }),
        dataIndex: 'id',
        align: 'center',
      },
      // {
      //   title: formatMessage({ id: 'app.virtual.accounts.avatar' }),
      //   dataIndex: 'avatar',
      //   align: 'center',
      //   render: (value, record) => {
      //     return (
      //       value && <img className={styles.avatar} src={`${value}?x-oss-process=image/resize,l_60`} alt={record.name} />
      //     );
      //   }
      // },
      {
        title: formatMessage({ id: 'app.group.name' }),
        dataIndex: 'name',
        align: 'center',
      },
      {
        title: formatMessage({ id: 'app.group.list.tag' }),
        dataIndex: 'tag_ids',
        align: 'center',
        render: (value, record) => {
          const tag_arr = value.map(item => tags.get(item));
          return tag_arr.join(', ');
        }
      },
      {
        title: formatMessage({ id: 'app.group.user_id' }),
        dataIndex: 'create_user_id',
        align: 'center',
      },
      {
        title: formatMessage({ id: 'app.group.group_type' }),
        dataIndex: 'group_type',
        align: 'center',
        render: value => groupTypes.get(value)
      },
      {
        title: formatMessage({ id: 'app.group.list.sort' }),
        dataIndex: 'sort',
        align: 'center',
      },
      {
        title: formatMessage({ id: 'app.group.list.member' }),
        dataIndex: 'group_member_num',
        align: 'center',
      },
      {
        title: formatMessage({ id: 'app.group.list.auto_message' }),
        dataIndex: 'auto_message',
        align: 'center',
        render: (value) => {
          return +value === 1 ? formatMessage({ id: 'app.group.list.auto_message.yes' }) : formatMessage({ id: 'app.group.list.auto_message.no' });
        }
      },
      {
        title: formatMessage({ id: 'app.group.push' }),
        dataIndex: 'auto_push_start',
        align: 'center',
        render: (value, record) => {
          return (
            <Fragment>
              {
                value && <div className="">
                  开始时间: {value}
                </div>
              }
              {
                record.auto_push_end &&
                <div className="">
                  结束时间: {record.auto_push_end}
                </div>
              }

            </Fragment>
          )
        }
      },
      {
        title: formatMessage({ id: 'app.group.auto_interval' }),
        dataIndex: 'auto_interval',
        align: 'center'
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
        title: formatMessage({ id: 'app.virtual.accounts.operation' }),
        dataIndex: 'operation',
        align: 'center',
        render: (value, record) => {
          const deleteEl = (<Popconfirm
            title={formatMessage({ id: 'app.scene.tools.delete_confirm' })}
            okText={formatMessage({ id: 'app.scene.category.offline_confirm' })}
            cancelText={formatMessage({ id: 'app.scene.category.offline_cancel' })}
            okType='danger'
            placement="topRight"
            onConfirm={() => { deleteRecord(record) }}
          >
            <div>
              <a href="#" className={styles.delete}>{formatMessage({ id: 'app.scene.tools.delete' })}</a>
            </div>

          </Popconfirm>);
          return (
            <div className={styles.handle}>
              <div><a href="#" className={styles.edit} onClick={(e) => { showEdit(e, record); }}>{formatMessage({ id: 'app.scene.tools.handle.edit' })}</a></div>
              <Divider className={cx('divide')} />
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
          <OperationBar search={search} add={showAdd} types={groupTypes} tags={tags} />
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
        {addShowing && <GroupEdit visible={addShowing} close={hideAdd} />}
        {editRecord && <GroupEdit record={editRecord} visible={!!this.state.editRecord} close={hideEdit} />}
      </Fragment>
    );
  }
}
export default GroupList;

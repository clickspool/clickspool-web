import { connect } from 'dva';
import React, { PureComponent, Fragment } from 'react';
//@ts-ignore
import { formatMessage } from 'umi/locale';
import CommonBreadCrumb from '@/components/CommonBreadCrumb';
import OperationBar from './components/OperationBar';
import EditTemplate from './Edit';
import {
  Breadcrumb,
  Icon,
  Input,
  Button,
  Table,
  Divider,
  Popconfirm,
  Tag,
} from 'antd';
import classnames from 'classnames/bind';
import styles from './index.less';

const cx = classnames.bind(styles);

@connect(({ mcn: { autoSendToolInfo, list, total, page, pageSize, tags, statuses = [], ruleTypes, gifts } }) => ({ autoSendToolInfo, list, total, page, pageSize, tags, statuses, ruleTypes, gifts }))
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
      type: 'mcn/delete',
      payload: record
    });
  }
  putOnline = id => {
    this.props.dispatch({
      type: 'mcn/patchStatus',
      payload: { id, status: 1 }
    });
  }
  putOffline = id => {
    this.props.dispatch({
      type: 'mcn/patchStatus',
      payload: { id, status: 0 }
    });
  }
  search = (values) => {
    this.setState({ search: values });
    const { pageSize } = this.props;
    const page = 1;
    this.props.dispatch({
      type: 'mcn/updateState',
      payload: {
        filter: values
      }
    });
    this.props.dispatch({
      payload: { ...values, page, pageSize },
      type: 'mcn/fetch'
    });
  }
  onShowSizeChange = (current, size) => {
    this.props.dispatch({
      type: 'mcn/changePageSize',
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
      type: 'mcn/fetch',
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
      },
      {
        icon: 'audio',
        title: formatMessage({ id: 'menu.operation.host' }),
      },
      {
        title: formatMessage({ id: 'menu.operation.host.mcn' }),
      }
    ];

    const { list, total, page, pageSize, tags, statuses, ruleTypes } = this.props;
    const { editShowing, addShowing, editRecord } = this.state;
    const { showEdit, hideEdit, deleteRecord, hideAdd, showAdd, } = this;
    const columns = [
      {
        title: formatMessage({ id: 'app.host.mcn.id' }),
        dataIndex: 'id',
        align: 'center',
      },
      {
        title: formatMessage({ id: 'app.host.mcn.name' }),
        dataIndex: 'name',
        align: 'center',
      },
      {
        title: formatMessage({ id: 'app.host.mcn.member_amount' }),
        dataIndex: 'user_count',
        align: 'center',
      },
      {
        title: formatMessage({ id: 'app.host.mcn.creator' }),
        dataIndex: 'operate_id',
        align: 'center',
      },
      {
        title: formatMessage({ id: 'app.host.mcn.manage' }),
        dataIndex: 'operation',
        align: 'center',
        render: (value, record) => {
          const deleteEl = (
            <Popconfirm
              title={formatMessage({ id: 'app.scene.tools.delete_confirm' })}
              okText={formatMessage({ id: 'app.scene.category.offline_confirm' })}
              cancelText={formatMessage({ id: 'app.scene.category.offline_cancel' })}
              okType='danger'
              placement="topRight"
              onConfirm={() => { deleteRecord(record) }}
            >
              <a href="#" className={styles.delete}>{formatMessage({ id: 'app.host.mcn.delete' })}</a>
            </Popconfirm>
          );
          return (
            <>
              <a href="#" className={styles.edit} onClick={(e) => { showEdit(e, record) }}>{formatMessage({ id: 'app.host.mcn.edit' })}</a>
              <Divider type='vertical' />
              {deleteEl}
            </>
          );
        }
      },
    ];
    return (
      <Fragment>
        <CommonBreadCrumb items={crumbs} />
        <div className={cx('operate')}>
          <h3 className={cx('title')}>{formatMessage({ id: 'app.host.mcn.title' })}</h3>
          <Button onClick={showAdd} type="primary">{formatMessage({ id: 'app.host.mcn.add' })}</Button>
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
        {addShowing && <EditTemplate caption={formatMessage({ id: 'app.host.mcn.new' })} visible={addShowing} close={hideAdd} />}
        {editRecord && <EditTemplate caption={formatMessage({ id: 'app.host.mcn.edit' })} id={editRecord.id} record={editRecord} visible={!!this.state.editRecord} close={hideEdit} />}
      </Fragment>
    );
  }
}

export default Reply;

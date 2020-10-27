import { connect } from 'dva';
import React, { PureComponent, Fragment } from 'react';
//@ts-ignore
import { formatMessage } from 'umi/locale';
import CommonBreadCrumb from '@/components/CommonBreadCrumb';
import OperationBar from './components/OperationBar';
import EditTemplate from './EditTemplate';
import classnames from 'classnames/bind';
// import OperationBar from './components/OperationBar';
import styles from './style.less';
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

const cx = classnames.bind(styles);
@connect(({ template: { list, total, page, pageSize, tags, statuses = [] } }) => ({ list, total, page, pageSize, tags, statuses }))
class TemplateList extends PureComponent<any, any> {
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
      type: 'template/delete',
      payload: record
    });
  }
  putOnline = id => {
    this.props.dispatch({
      type: 'template/patchStatus',
      payload: { id, status: 1 }
    });
  }
  putOffline = id => {
    this.props.dispatch({
      type: 'template/patchStatus',
      payload: { id, status: 0 }
    });
  }
  search = (values) => {
    this.setState({ search: values });
    const { pageSize, page = 1 } = this.props;
    this.props.dispatch({
      type: 'template/updateState',
      payload: {
        filter: values
      }
    });
    this.props.dispatch({
      payload: { ...values, page, pageSize },
      type: 'template/fetch'
    });
  }
  onShowSizeChange = (current, size) => {
    this.props.dispatch({
      type: 'template/changePageSize',
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
      type: 'template/fetch',
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
        title: formatMessage({ id: 'menu.operation.xiaomishutemplate' }),
      }
    ];
    // const [count, setCount] = React.useState<number>(0);
    // const [count, setCount] = React.useState(0);

    const { list, total, page, pageSize, tags, statuses } = this.props;
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
              <div className={cx('time')}>{formatMessage({ id: 'app.group.list.edit_time' })}: {record.update_at}</div>
              <div className={cx('time')}>{formatMessage({ id: 'app.group.list.create_time' })}: {record.create_at}</div>
            </Fragment>
          );
        }
      },
      {
        title: formatMessage({ id: 'app.group.list.sort' }),
        dataIndex: 'sort',
        align: 'center',
      },
      {
        title: formatMessage({ id: 'app.message.template.name' }),
        dataIndex: 'name',
        align: 'center',
      },
      {
        title: formatMessage({ id: 'app.message.template.content' }),
        dataIndex: 'content',
        align: 'center',
        width:300,
      },
      {
        title: formatMessage({ id: 'app.message.template.creater' }),
        dataIndex: 'operate_nickname',
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
          <OperationBar statuses={statuses} search={search} addTitle={formatMessage({ id: 'app.message.template.add' })} add={showAdd} tags={tags} />
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
        {addShowing && <EditTemplate caption={formatMessage({ id: 'app.message.template.add' })} visible={addShowing} close={hideAdd} />}
        {editRecord && <EditTemplate caption={formatMessage({ id: 'app.message.template.edit' })} id={editRecord.id} record={editRecord} visible={!!this.state.editRecord} close={hideEdit} />}
      </Fragment>
    );
  }
}

export default TemplateList;



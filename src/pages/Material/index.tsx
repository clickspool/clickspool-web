import { connect } from 'dva';
import React, { PureComponent, Fragment } from 'react';
//@ts-ignore
import { formatMessage } from 'umi/locale';
import CommonBreadCrumb from '@/components/CommonBreadCrumb';
import OperationBar from './components/OperationBar';
import EditTemplate from './Edit';
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
@connect(({ material: { list, total, page, pageSize, tags, statuses = [] } }) => ({ list, total, page, pageSize, tags, statuses }))
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
      type: 'daily/delete',
      payload: record
    });
  }
  putOnline = id => {
    this.props.dispatch({
      type: 'daily/patchStatus',
      payload: { id, status: 1 }
    });
  }
  putOffline = id => {
    this.props.dispatch({
      type: 'daily/patchStatus',
      payload: { id, status: 0 }
    });
  }
  search = (values) => {
    this.setState({ search: values });
    const { pageSize, page = 1 } = this.props;
    this.props.dispatch({
      type: 'daily/updateState',
      payload: {
        filter: values
      }
    });
    this.props.dispatch({
      payload: { ...values, page, pageSize },
      type: 'daily/fetch'
    });
  }
  onShowSizeChange = (current, size) => {
    this.props.dispatch({
      type: 'daily/changePageSize',
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
      type: 'daily/fetch',
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
        icon: 'star',
        title: formatMessage({ id: 'menu.explore' }),
      }, {
        title: formatMessage({ id: 'menu.explore.daily' }),
      }
    ];
    // const [count, setCount] = React.useState<number>(0);
    // const [count, setCount] = React.useState(0);

    const { list, total, page, pageSize, tags, statuses } = this.props;
    const { editShowing, addShowing, editRecord } = this.state;
    const { showEdit, hideEdit, deleteRecord, hideAdd, showAdd, search, putOnline, putOffline } = this;
    const columns = [
      {
        title: formatMessage({ id: 'app.material.id' }),
        dataIndex: 'mid',
        align: 'center',
        width:120
      },
      {
        title: formatMessage({ id: 'app.material.title' }),
        dataIndex: 'title',
        align: 'center',
        width:200
      },
      {
        title: formatMessage({ id: 'app.material.type' }),
        dataIndex: 'type',
        align: 'center',
        width:200,
        render:(text)=>{
          return 
        }
      },
      {
        title: formatMessage({ id: 'app.material.description' }),
        dataIndex: 'remote_cover',
        align: 'center',
        width: 300,
        render: (value) => {
          return (
            <img className={styles.icon} src={value} alt="" />
          );
        }
      },
      {
        title: formatMessage({ id: 'app.material.status' }),
        dataIndex: 'status',
        align: 'center',
        width:200,
        render: (value, record) => {
          let color, satus;
          if (+value === 0) {
            color = 'gray';
            satus = formatMessage({ id: 'app.material.revoke' });
          } else {
            color = 'blue';
            satus = formatMessage({ id: 'app.material.published' });
          }
          return <Tag color={color}>{satus}</Tag>
        }
      },
      {
        title: formatMessage({ id: 'app.material.time' }),
        dataIndex: 'create_time',
        align: 'center',
        render(text, record) {
          return (
            <Fragment>
              <div><Icon type='file-sync' /> {record.update_at}</div>
              <div><Icon type='file-add' /> {record.create_at}</div>
            </Fragment>
          );
        }
      },
      {
        title: formatMessage({ id: 'app.material.lastOperator' }),
        dataIndex: 'operationer',
        align: 'center',
        width:200
      },
      {
        title: formatMessage({ id: 'app.material.operation' }),
        dataIndex: 'operation',
        align: 'center',
        fixed: 'right',
        width: 150,
        render: (value, record) => {
          let caption, icon_type = 'edit', checked, statusEl, deleteEl;
          const deleteCaption = formatMessage({ id: 'app.scene.tools.delete' });
          if (record.status == 0) {
            checked = false;
            caption = formatMessage({ id: 'app.material.published' });
            statusEl = (
              <Popconfirm
                title={formatMessage({ id: 'app.material.sure' })}
                okText={formatMessage({ id: 'app.material.yes' })}
                cancelText={formatMessage({ id: 'app.material.cancel' })}
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
            caption = formatMessage({ id: 'app.material.revoke' });
            statusEl = (
              <Popconfirm
                title={formatMessage({ id: 'app.material.sureup' })}
                okText={formatMessage({ id: 'app.material.yes' })}
                cancelText={formatMessage({ id: 'app.material.cancel' })}
                okType='danger'
                placement="topRight"
                // onCancel={this.cancelSwitch}
                onConfirm={() => { putOffline(record.id) }}
              >
                <a href="#" className={`${styles.edit} ${styles.danger}`}>{caption}</a>
              </Popconfirm>
            );
          };
          return (
            <div className={styles.handle}>
              <a href="#" className={styles.edit} onClick={(e) => { showEdit(e, record) }}>{formatMessage({ id: 'app.material.edit' })}</a>
              <Divider type='vertical' />
              {statusEl}
            </div>
          );
        }
      },
    ];
    return (
      <Fragment>
        <CommonBreadCrumb items={crumbs} />
        <div className={cx('operate')}>
          <OperationBar statuses={statuses} search={search} addTitle={formatMessage({ id: 'app.material.add' })} add={showAdd} tags={tags} />
        </div>
        <Table
          className={cx('list')}
          bordered
          rowKey='id'
          //@ts-ignore
          columns={columns}
          dataSource={list}
          scroll={{ x: 2000 }}
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
        {addShowing && <EditTemplate caption={formatMessage({ id: 'app.explore.daily.add' })} visible={addShowing} close={hideAdd} />}
        {editRecord && <EditTemplate caption={formatMessage({ id: 'app.explore.daily.edit' })} id={editRecord.id} record={editRecord} visible={!!this.state.editRecord} close={hideEdit} />}
      </Fragment>
    );
  }
}

export default TemplateList;



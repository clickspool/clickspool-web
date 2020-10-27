import { connect } from 'dva';
import { Breadcrumb, Button, Icon, Input, Table, Tag, Switch, Popconfirm, Divider, Modal, Tabs } from 'antd';
import React, { PureComponent, Fragment } from 'react';
//@ts-ignore
import { formatMessage } from 'umi/locale';
import styles from './list.less';
import OperationBar from './components/OperationBar';
import CommonBreadCrumb from '@/components/CommonBreadCrumb';
import Single from './Single';
import Upper from './Upper/Index';

const { TabPane } = Tabs;

// @connect(({ gift: { list, statuses, total, page, pageSize, clients } }) => ({ list, statuses, total, page, pageSize, clients }))
class List extends PureComponent<any, any> {
  constructor(props) {
    super(props);
    this.state = {
      adding: false,
      editId: null,
      selectedRowKeys: [],
    }
  }

  search = (values) => {
    this.setState({ search: values });
    const { pageSize } = this.props;
    this.props.dispatch({
      type: 'gift/updateState',
      payload: {
        filter: values
      }
    });
    this.props.dispatch({
      payload: { ...values, page: 1, pageSize },
      type: 'gift/fetch'
    });
  }

  showEdit = (e, { id: editId }) => {
    e.preventDefault();
    this.setState({
      editId
    });
  }
  hideEdit = () => {
    this.setState({
      editId: null
    });
  }
  showAdd = () => {
    this.setState({
      adding: true
    });
  }
  hideAdd = () => {
    this.setState({
      adding: false
    });
  }

  onSelectChange = (selectedRowKeys) => {
    // console.info('selectedRowKeys', selectedRowKeys);
    let batchDisable = selectedRowKeys.length > 0 ? false : true;
    this.setState({
      batchDisable
    });
    this.setState({ selectedRowKeys });
  };
  // orderRefresh = () => {
  //   request('/admin/metools/flushToolsCache', {
  //     method: 'POST',
  //     headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
  //   });
  // }

  render() {
    const _this = this;
    const crumbs = [
      {
        icon: 'desktop',
        title: formatMessage({ id: 'menu.operation' }),
      },
      {
        icon: 'AudioOutlined',
        title: formatMessage({ id: 'menu.operation.host' }),
      }
    ];
    let columns = [
      {
        title: formatMessage({ id: 'app.scene.tools.id' }),
        dataIndex: 'id',
        align: 'center',
      },
      {
        title: formatMessage({ id: 'app.scene.tools.icon' }),
        dataIndex: 'icon',
        render(value, record) {
          return (
            <img className={styles.icon} src={value} alt={record.name} />
          );
        }
      },
      {
        title: formatMessage({ id: 'app.scene.tools.name' }),
        dataIndex: 'name',
      },
      {
        title: formatMessage({ id: 'app.gift.price' }),
        dataIndex: 'price',
      },
      {
        title: formatMessage({ id: 'app.scene.tools.status' }),
        dataIndex: 'status',
        render: (text, record) => {
          let color, status;
          if (text == 0) {
            color = 'gray';
            status = formatMessage({ id: 'app.scene.tools.offline' });
          } else {
            color = 'blue';
            status = formatMessage({ id: 'app.scene.tools.online' });
          }
          return <Tag color={color}>{status}</Tag>
        }
      },
      {
        title: formatMessage({ id: 'app.gift.sold' }),
        dataIndex: 'used_count',
      },
    
      {
        title: formatMessage({ id: 'app.scene.tools.time' }),
        dataIndex: 'create_at',
        render(text, record) {
          return (
            <Fragment>
              <div><Icon type='folder-open' theme="twoTone" /> {formatMessage({ id: 'app.scene.tools.update_time' })}: {record.update_time}</div>
              <div><Icon type='folder-add' theme="twoTone" /> {formatMessage({ id: 'app.scene.tools.create_time' })}: {record.create_time}</div>
            </Fragment>
          );
        }
      },
      {
        title: formatMessage({ id: 'app.scene.tools.handle' }),
        key: 'handle',
        render: (text, record) => {
          let caption, icon_type = 'edit', checked, statusEl, deleteEl;
          const deleteCaption = formatMessage({ id: 'app.scene.tools.delete' });
          if (record.status == 0) {
            const { cates } = this.props;
            const cate = cates.find(item => item.id === record.cate_id);
            let confirm = formatMessage({ id: 'app.scene.category.online_hint' });
            let cateOffline = false;
            if (cate && cate.status === '0') {
              cateOffline = true;
              confirm = formatMessage({ id: 'app.face.tools.category_offline_hint' });
            }
            checked = false;

            caption = formatMessage({ id: 'app.scene.category.online' });
            statusEl = (
              <Popconfirm
                title={confirm}
                okText={formatMessage({ id: 'app.scene.category.offline_confirm' })}
                cancelText={formatMessage({ id: 'app.scene.category.offline_cancel' })}
                okType='danger'
                placement="topRight"
                // onCancel={_this.cancelSwitch}
                onConfirm={
                  () => {
                    if (!cateOffline) {
                      this.putOnline(record.id);
                    }
                  }
                }
              >
                <a href="#" className={styles.edit}>{caption}</a>
              </Popconfirm>
            );
            deleteEl = (
              <Popconfirm
                title={formatMessage({ id: 'app.scene.tools.delete_confirm' })}
                okText={formatMessage({ id: 'app.scene.category.offline_confirm' })}
                cancelText={formatMessage({ id: 'app.scene.category.offline_cancel' })}
                okType='danger'
                placement="topRight"
                onConfirm={_this.delete.bind(_this, record)}
              >
                <a href="#" className={styles.delete}>{deleteCaption}</a>
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
                // onCancel={_this.cancelSwitch}
                onConfirm={_this.putOffline.bind(_this, record.id)}
              >
                <a href="#" className={`${styles.edit} ${styles.danger}`}>{caption}</a>
              </Popconfirm>
            );
            deleteEl = (
              <span className={styles.delete} onClick={_this.delete.bind(_this, record)}>{deleteCaption}</span>
            );
          }
          return (
            <div className={styles.handle}>
              <a href="#" className={styles.edit} onClick={(e) => { _this.showEdit(e, record) }}>{formatMessage({ id: 'app.scene.tools.handle.edit' })}</a>
              <Divider type='vertical' />
              {statusEl}
              <Divider type='vertical' />
              {deleteEl}
            </div>
          );
        },
      }
    ];
    columns = columns.map(item => {
      item.align = 'center';
      return item;
    });
    const { selectedRowKeys, batchLoading, batchDisable } = this.state;
    const rowSelection = {
      selectedRowKeys,
      onChange: this.onSelectChange,
    };

    return (
      <Fragment>
        <CommonBreadCrumb items={crumbs} />
        <div className={styles.pages}>
          <Tabs type="card" defaultActiveKey="1">
            <TabPane tab={formatMessage({ id: 'app.host.single' })} key="1">
              <Single />
            </TabPane>
            <TabPane tab={formatMessage({ id: 'app.host.upper' })} key="2">
              <Upper />
            </TabPane>
          </Tabs>
        </div>
      </Fragment>
    );
  }
}
export default List;

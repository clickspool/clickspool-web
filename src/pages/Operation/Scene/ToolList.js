import { connect } from 'dva';
import { Breadcrumb, Button, Icon, Input, Table, Tag, Switch, Popconfirm, Divider, Modal } from 'antd';
import React, { PureComponent, Fragment } from 'react';
import { formatMessage } from 'umi/locale';
import styles from './ToolList.less';
import OperationBar from './components/OperationBar';
import ToolEdit from './ToolEdit';

const Search = Input.Search;

@connect(({ tools: { list, statuses, positions, clients, total, page, pageSize }, categories: { list: cates } }) => ({ list, cates, positions, clients, statuses, total, page, pageSize }))
class List extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      adding: false,
      editId: null,
      selectedRowKeys: [],
      batchDisable: true,
      batchLoading: false,
    }
  }
  componentWillUnmount() {
    this.props.dispatch({
      type: 'tools/updateState',
      payload: {
        page: 1,
        filter: {}
      }
    });
  }

  fetchPage = (page, pageSize) => {
    const { search = {} } = this.state;
    this.props.dispatch({
      type: 'tools/fetch',
      payload: {
        page,
        page_size: pageSize,
        ...search
      }
    });
  }

  search = (values) => {
    this.setState({ search: values });
    const { pageSize } = this.props;
    this.props.dispatch({
      type: 'tools/updateState',
      payload: {
        filter: values
      }
    });
    this.props.dispatch({
      payload: { ...values, page: 1, pageSize },
      type: 'tools/fetch'
    });
  }

  delete = ({ id, status }) => {
    if (status == 1) {
      return Modal.warn({
        title: formatMessage({ id: 'app.scene.tools.delete_hint_title' }),
        content: formatMessage({ id: 'app.scene.tools.delete_hint_content' }),
        okText: formatMessage({ id: 'app.scene.tools.delete_hint_btn' })
      });
    }

    this.props.dispatch({
      payload: { id },
      type: 'tools/delete'
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
  putOnline = id => {
    this.props.dispatch({
      type: 'tools/patchStatus',
      payload: { id, status: 1 }
    });
  }
  putOffline = id => {
    this.props.dispatch({
      type: 'tools/patchStatus',
      payload: { id, status: 0 }
    });
  }
  batchOnline = () => {
    const ids = this.state.selectedRowKeys;
    Modal.confirm({
      title: formatMessage({ id: 'app.scene.tools.batch_online_hint' }, { selected: ids.length }),
      onOk: () => {
        this.props.dispatch({
          type: 'tools/batchModify',
          payload: { ids: ids.join(','), status: 1 }
        }).then(this.onSelectChange.bind(this, []));
      }
    });
  }
  // resetRowSelect = () => {
  //   this.setState({
  //     selectedRowKeys: []
  //   });
  // }
  batchOffline = () => {
    const ids = this.state.selectedRowKeys;
    Modal.confirm({
      title: formatMessage({ id: 'app.scene.tools.batch_offline_hint' }, { selected: ids.length }),
      onOk: () => {
        this.props.dispatch({
          type: 'tools/batchModify',
          payload: { ids: ids.join(','), status: 0 }
        }).then(this.onSelectChange.bind(this, []));
      }
    });
  }
  onShowSizeChange = (current, size) => {
    this.props.dispatch({
      type: 'tools/changePageSize',
      payload: {
        page: current,
        pageSize: size
      }
    });
    this.fetchPage(current, size);
  }
  onSelectChange = (selectedRowKeys) => {
    // console.info('selectedRowKeys', selectedRowKeys);
    let batchDisable = selectedRowKeys.length > 0 ? false : true;
    this.setState({
      batchDisable
    });
    this.setState({ selectedRowKeys });
  };

  render() {
    const _this = this;
    const { list, cates, statuses, total, pageSize, page, positions, clients } = this.props;
    let columns = [
      {
        title: formatMessage({ id: 'app.scene.tools.id' }),
        dataIndex: 'id',
        align: 'center',
      }, {
        title: formatMessage({ id: 'app.scene.tools.icon' }),
        dataIndex: 'icon',
        render(text, record) {
          return (
            <img className={styles.icon} src={text} alt={record.name} />
          );
        }
      },
      {
        title: formatMessage({ id: 'app.scene.tools.name' }),
        dataIndex: 'name',
      },
      {
        title: formatMessage({ id: 'app.scene.tools.position' }),
        dataIndex: 'position',
        render: (text, record) => {
          return positions.get(+text);
        }
      },
      {
        title: formatMessage({ id: 'app.scene.tools.client' }),
        dataIndex: 'client_name',
      },
      {
        title: formatMessage({ id: 'app.scene.tools.cate' }),
        dataIndex: 'cate_name',
      },
      {
        title: formatMessage({ id: 'app.scene.tools.show_name' }),
        dataIndex: 'show_name',
      },
      {
        title: formatMessage({ id: 'app.scene.tools.status' }),
        dataIndex: 'status',
        render: (text, record) => {
          let color, satus;
          if (text == 0) {
            color = 'gray';
            satus = formatMessage({ id: 'app.scene.tools.offline' });
          } else {
            color = 'blue';
            satus = formatMessage({ id: 'app.scene.tools.online' });
          }
          return <Tag color={color}>{satus}</Tag>
        }
      }, {
        title: formatMessage({ id: 'app.scene.tools.sort' }),
        dataIndex: 'sort',
      }, {
        title: formatMessage({ id: 'app.scene.tools.time' }),
        dataIndex: 'create_time',
        render(text, record) {
          return (
            <Fragment>
              <div><Icon type='folder-open' theme="twoTone" /> {formatMessage({ id: 'app.scene.tools.update_time' })}: {record.update_time}</div>
              <div><Icon type='folder-add' theme="twoTone" /> {formatMessage({ id: 'app.scene.tools.create_time' })}: {record.create_time}</div>
            </Fragment>
          );
        }
      }, {
        title: formatMessage({ id: 'app.scene.tools.handle' }),
        key: 'handle',
        render(text, record) {
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
                // onCancel={_this.cancelSwitch}
                onConfirm={_this.putOnline.bind(_this, record.id)}
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
        <Breadcrumb className='breadcrumb-box' separator='/'>
          <Breadcrumb.Item><Icon type="lock" /> {formatMessage({ id: 'menu.operation' })}</Breadcrumb.Item>
          <Breadcrumb.Item>{formatMessage({ id: 'menu.operation.video' })}</Breadcrumb.Item>
          <Breadcrumb.Item>{formatMessage({ id: 'menu.operation.video.tools' })}</Breadcrumb.Item>
        </Breadcrumb>
        <div className={styles['operations-wraper']}>
          <OperationBar positions={positions} clients={clients} cates={cates} statuses={statuses} batchOnline={this.batchOnline} batchOffline={this.batchOffline} batchLoading={batchLoading} batchDisable={batchDisable} search={this.search} />
          <Button type="primary" onClick={this.showAdd}>{formatMessage({ id: 'app.scene.tools.add' })}</Button>
        </div>

        {/* edit new */}
        {this.state.adding && <ToolEdit visible={this.state.adding} positions={positions} clients={clients} cates={cates} close={this.hideAdd.bind(this)} />}
        <Table rowSelection={rowSelection} bordered rowKey='id' columns={columns} dataSource={list} pagination={
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
        {/* edit exist */}
        {this.state.editId && <ToolEdit caption={formatMessage({ id: 'app.scene.tools.edit' })} id={this.state.editId} visible={!!this.state.editId} positions={positions} clients={clients} cates={cates} close={this.hideEdit.bind(this)} />}
        {/* <Modal visible={this.state.deleteHint}></Modal> */}
      </Fragment >
    );
  }
}
export default List;

import { connect } from 'dva';
import { Breadcrumb, Button, Icon, Input, Table, Tag, Switch, Popconfirm, Divider, Modal } from 'antd';
import React, { PureComponent, Fragment } from 'react';
//@ts-ignore
import { formatMessage } from 'umi/locale';
import styles from './TemplateList.less';
import OperationBar from './components/OperationBar';
import ToolEdit from './TemplateEdit';
import request from '@/utils/request';
import CommonBreadCrumb from '../../../components/CommonBreadCrumb';

const Search = Input.Search;

@connect(({ movies: { list, total, page, pageSize, clients, sdks, statuses } }) => ({ list, total, page, pageSize, clients, sdks, statuses }))
class List extends PureComponent<any, any> {
  constructor(props) {
    super(props);
    this.state = {
      adding: false,
      editId: null,
      selectedRowKeys: [],
      batchDisable: true,
      batchLoading: false,
      playingStates: new Map(),
      crumbs: [
        {
          icon: 'desktop',
          title: formatMessage({ id: 'menu.operation' }),
        },
        {
          icon: 'youtube',
          title: formatMessage({ id: 'menu.operation.movie' }),
        }
      ]
    }
  }
  componentWillUnmount() {
    this.props.dispatch({
      type: 'movies/updateState',
      payload: {
        page: 1,
        filter: {}
      }
    });
  }

  fetchPage = (page, pageSize) => {
    const { search = {} } = this.state;
    this.props.dispatch({
      type: 'movies/fetch',
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
      type: 'movies/updateState',
      payload: {
        filter: values
      }
    });
    this.props.dispatch({
      payload: { ...values, page: 1, pageSize },
      type: 'movies/fetch'
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
      type: 'movies/delete'
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
      type: 'movies/patchStatus',
      payload: { id, status: 1 }
    });
  }
  putOffline = id => {
    this.props.dispatch({
      type: 'movies/patchStatus',
      payload: { id, status: 0 }
    });
  }
  batchOnline = () => {
    const ids = this.state.selectedRowKeys;
    Modal.confirm({
      title: formatMessage({ id: 'app.scene.tools.batch_online_hint' }, { selected: ids.length }),
      onOk: () => {
        this.props.dispatch({
          type: 'movies/batchModify',
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
          type: 'movies/batchModify',
          payload: { ids: ids.join(','), status: 0 }
        }).then(this.onSelectChange.bind(this, []));
      }
    });
  }
  onShowSizeChange = (current, size) => {
    this.props.dispatch({
      type: 'movies/changePageSize',
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
  orderRefresh = () => {
    request('/admin/metools/flushToolsCache', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    });
  }
  videoPlay(e) {
    if (e.target.tagName !== 'VIDEO') {
      return;
    }
    const video = e.target;
    if (video.paused) {
      return video.play();
    }
    video.pause();
    // console.info('video.play__', video.paused);

  }
  onPlay = (e) => {
    const id = e.target.getAttribute('data-id');
    const playingStates: any = this.state;
    playingStates[id] = true;
    this.setState({
      playingStates
    });
  }
  onPause = (e) => {
    const id = e.target.getAttribute('data-id');
    const playingStates: any = this.state;
    playingStates[id] = false;
    this.setState({
      playingStates
    });
  }

  render() {
    const _this = this;
    const { videoPlay, onPlay, onPause } = this;
    const { list, cates, statuses, total, pageSize, page, positions, clients, sdks } = this.props;
    let columns = [
      {
        title: formatMessage({ id: 'app.movie.template.id' }),
        dataIndex: 'id',
        align: 'center',
      },
      {
        title: formatMessage({ id: 'app.scene.tools.icon' }),
        dataIndex: 'remote_cover',
        render(text, record) {
          return (
            <img className={styles.cover} src={text} alt={record.name} />
          );
        }
      },
      {
        title: formatMessage({ id: 'app.movie.template.preview' }),
        dataIndex: 'remote_preview',
        render: (text, record) => {
          const { playingStates } = this.state;
          const show = playingStates[record.id] ? `${styles.hide} ${styles.play}` : styles.play;
          return (
            <div className={styles.wraper}>
              <video data-id={record.id} onPlay={onPlay} onPause={onPause} onClick={videoPlay} className={styles.cover} src={text} />
              <Icon className={show} type="play-circle" />
            </div>
          );
        }
      },
      {
        title: formatMessage({ id: 'app.movie.template.version' }),
        dataIndex: 'android_version_start',
        render: (value, record) => {
          const { android_version_start, android_version_end, ios_version_start, ios_version_end, platform } = record;
          if (!android_version_start && !ios_version_start) {
            return formatMessage({ id: 'app.movie.template.version.nolimit' });
          }
          function format(start, end) {
            if (+start === 10000 && +end === 20000) {
              return formatMessage({ id: 'app.movie.template.version.nolimit' });
            }
            if (+end === 20000) {
              return formatMessage({ id: 'app.movie.template.version.limit' }, { start });
            }
            return `${start} - ${end}`;
          }
          return (
            <Fragment>
              {+platform !== 2 && android_version_start && <div className={styles.nowrap}><Icon style={{ color: '#6656F5' }} type="android" />:{format(android_version_start, android_version_end)}</div>}
              {+platform !== 1 && ios_version_start && <div className={styles.nowrap}><Icon style={{ color: '#6656F5' }} type="apple" />:{format(ios_version_start, ios_version_end)}</div>}
            </Fragment>
          );
        }
      },
      {
        title: formatMessage({ id: 'app.movie.template.sdk_version' }),
        dataIndex: 'sdk',
        render: (value) => {
          if (!value) {
            return formatMessage({ id: 'app.movie.template.version.nolimit' });
          }
          return sdks.get(value);
        }
      },
      {
        title: formatMessage({ id: 'app.scene.tools.name' }),
        dataIndex: 'name',
      },
      {
        title: formatMessage({ id: 'app.scene.tools.client' }),
        dataIndex: 'platform',
        render: (value) => {
          return clients.get(value);
        }
      },
      {
        title: formatMessage({ id: 'app.movie.template.image_count' }),
        dataIndex: 'image_count',
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
              <div><Icon type='folder-open' theme="twoTone" /> {formatMessage({ id: 'app.scene.tools.update_time' })}: {record.update_at}</div>
              <div><Icon type='folder-add' theme="twoTone" /> {formatMessage({ id: 'app.scene.tools.create_time' })}: {record.create_at}</div>
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
    const { crumbs } = this.state;

    return (
      <Fragment>
        <CommonBreadCrumb items={crumbs} />
        <div className={styles['operations-wraper']}>
          <OperationBar sdks={sdks} clients={clients} cates={cates} statuses={statuses} batchOnline={this.batchOnline} batchOffline={this.batchOffline} batchLoading={batchLoading} batchDisable={batchDisable} search={this.search} />
          <Button type="primary" onClick={this.showAdd}>{formatMessage({ id: 'app.movie.template.add' })}</Button>
        </div>

        {/* edit new */}
        {this.state.adding && <ToolEdit caption={formatMessage({ id: 'app.movie.template.add' })} visible={this.state.adding} positions={positions} clients={clients} cates={cates} close={this.hideAdd.bind(this)} />}
        <Table scroll={{ x: true }} rowSelection={rowSelection} bordered rowKey='id' columns={columns} dataSource={list} pagination={
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
        {/* <ToolEdit caption={formatMessage({ id: 'app.scene.tools.edit' })} id={this.state.editId} visible={!!this.state.editId || this.state.adding} positions={positions} clients={clients} cates={cates} close={this.state.adding ? this.hideAdd.bind(this) : this.hideEdit.bind(this)} /> */}
        {this.state.editId && <ToolEdit caption={formatMessage({ id: 'app.movie.template.edit' })} id={this.state.editId} visible={!!this.state.editId} list={list} positions={positions} clients={clients} cates={cates} close={this.hideEdit.bind(this)} />}
        {/* <Modal visible={this.state.deleteHint}></Modal> */}
      </Fragment >
    );
  }
}
export default List;

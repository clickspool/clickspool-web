import { connect } from 'dva';
import { Breadcrumb, Button, Icon, Input, Table, Tag, Switch, Popconfirm, Divider, Modal } from 'antd';
import React, { PureComponent, Fragment } from 'react';
//@ts-ignore
import { formatMessage } from 'umi/locale';
import styles from './list.less';
import OperationBar from './components/OperationBar';
import CommonBreadCrumb from '@/components/CommonBreadCrumb';
import GiftEdit from './GiftEdit';
// require('svgaplayerweb');
import { Downloader, Parser, Player } from 'svga.lite';
import request from '@/utils/request';

const Search = Input.Search;

@connect(({ gift: { list, statuses, total, page, pageSize, clients }, giftCategories: { list: cates } }) => ({ list, cates, statuses, total, page, pageSize, clients }))
class List extends PureComponent<any, any> {
  constructor(props) {
    super(props);
    this.state = {
      adding: false,
      editId: null,
      selectedRowKeys: [],
      batchDisable: true,
      batchLoading: false,
      currentEffect: 0,
    }
  }
  componentWillUnmount() {
    this.props.dispatch({
      type: 'gift/updateState',
      payload: {
        page: 1,
        filter: {}
      }
    });
  }

  fetchPage = (page, pageSize) => {
    const { search = {} } = this.state;
    this.props.dispatch({
      type: 'gift/fetch',
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
      type: 'gift/updateState',
      payload: {
        filter: values
      }
    });
    this.props.dispatch({
      payload: { ...values, page: 1, pageSize },
      type: 'gift/fetch'
    });
    this.resetEffect();
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
      type: 'gift/delete'
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
      type: 'gift/patchStatus',
      payload: { id, status: 1 }
    });
  }
  putOffline = id => {
    this.props.dispatch({
      type: 'gift/patchStatus',
      payload: { id, status: 0 }
    });
  }
  batchOnline = () => {
    const ids = this.state.selectedRowKeys;
    Modal.confirm({
      title: formatMessage({ id: 'app.scene.tools.batch_online_hint' }, { selected: ids.length }),
      onOk: () => {
        this.props.dispatch({
          type: 'gift/batchModify',
          payload: { id: ids.join(','), status: 1 }
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
          type: 'gift/batchModify',
          payload: { id: ids.join(','), status: 0 }
        }).then(this.onSelectChange.bind(this, []));
      }
    });
  }
  onShowSizeChange = (current, size) => {
    this.props.dispatch({
      type: 'gift/changePageSize',
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
  // orderRefresh = () => {
  //   request('/admin/metools/flushToolsCache', {
  //     method: 'POST',
  //     headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
  //   });
  // }

  playSVGA = async (id, url) => {
    const downloader = new Downloader()
    const parser = new Parser()
    const player = new Player(`#${id}`);

    const fileData = await downloader.get(url);
    const svgaData = await parser.do(fileData)

    player.set({
      loop: 1,
      fillMode: 'forwards'
    })

    // player
    //   .$on('start', () => console.log('event start'))
    //   .$on('pause', () => console.log('event pause'))
    //   .$on('stop', () => console.log('event stop'))
    //   .$on('end', () => console.log('event end'))
    //   .$on('clear', () => console.log('event clear'))
    // .$on('process', () => console.log('event process', player.progress))

    await player.mount(svgaData);
    this.setState({
      [id]: 'loaded',
      currentEffect: id,
    }, () => {
      player.start();
    });
  }

  resetEffect = (id?) => {
    // console.info('resetEffect__', id, `effect${id}`);
    if (!id) {
      this.setState({
        currentEffect: null
      });
    }
    if (`effect${id}` === this.state.currentEffect) {
      this.setState({
        currentEffect: null
      });
    }
  }

  render() {
    const _this = this;
    const { list, cates, statuses, total, pageSize, page, clients } = this.props;
    const crumbs = [
      {
        icon: 'desktop',
        title: formatMessage({ id: 'menu.operation' }),
      },
      {
        icon: 'gift',
        title: formatMessage({ id: 'menu.operation.gift' }),
      },
      {
        title: formatMessage({ id: 'menu.operation.gift.list' }),
      }
    ];
    let columns = [
      {
        title: formatMessage({ id: 'app.scene.tools.id' }),
        dataIndex: 'id',
        align: 'center',
      },
      {
        title: '道具名称',
        dataIndex: 'name',
        align: 'center',
      },
      {
        title: '道具key值',
        dataIndex: 'stat_key',
        align: 'center',
      },
      {
        title: formatMessage({ id: 'app.gift.tools.cate' }),
        dataIndex: 'cate_id',
        render: (value, record) => {
          const cate = cates.find(item => item.id == value) || {};
          return cate.name;
        }
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
        title: formatMessage({ id: 'app.gift.effect' }),
        dataIndex: 'effect',
        render: (value, record) => {
          if (!value) { return }
          const id = `effect${record.id}`;
          const { currentEffect } = this.state;
          const played = currentEffect === id;
          const canvasStyle = played ? `${styles.canvas}` : `${styles.hide}`;
          const coverStyle = played ? `${styles.hide}` : `${styles.icon}`;
          const iconStyle = played ? `${styles.hide}` : `${styles.play}`;
          return (<div className={styles.effect} onClick={() => {
            this.playSVGA(id, value);
          }}>
            <canvas className={canvasStyle} id={`${id}`} data-src={value}></canvas>
            <img className={coverStyle} src={record.icon} alt="" />
            {/* <Icon className={iconStyle} type="play-circle" /> */}
          </div>);
        },
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
        title: formatMessage({ id: 'app.gift.is_vip' }),
        dataIndex: 'is_vip',
        render: (value) => {
          return value > 0 ? formatMessage({ id: 'app.gift.is_vip.yes' }) : formatMessage({ id: 'app.gift.is_vip.no' })
        }
      },
      {
        title: formatMessage({ id: 'app.scene.tools.sort' }),
        dataIndex: 'sort',
      },
      // {
      //   title: formatMessage({ id: 'app.gift.sold' }),
      //   dataIndex: 'used_count',
      // },
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
        <div className={styles['operations-wraper']}>
          <OperationBar clients={clients} cates={cates} statuses={statuses} batchLoading={batchLoading} batchDisable={batchDisable} search={this.search} />
          {/* <Button className={styles.mrm} type="primary" onClick={this.orderRefresh}>{formatMessage({ id: 'app.meme.tools.order.refresh' })}</Button> */}
          <Button type="primary" onClick={this.showAdd}>{formatMessage({ id: 'app.scene.tools.add' })}</Button>
        </div>
        {/* edit new */}
        {this.state.adding && <GiftEdit visible={this.state.adding} cates={cates} clients={clients} close={this.hideAdd.bind(this)} />}
        <Table
          // rowSelection={rowSelection}
          bordered rowKey='id' columns={columns} dataSource={list} pagination={
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
        {this.state.editId && <GiftEdit caption={formatMessage({ id: 'app.scene.tools.edit' })} id={this.state.editId} visible={!!this.state.editId} list={list} cates={cates} clients={clients} close={this.hideEdit.bind(this)} resetEffect={this.resetEffect} />}
      </Fragment >
    );
  }
}
export default List;

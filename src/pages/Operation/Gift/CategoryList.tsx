import { connect } from 'dva';
import { Breadcrumb, Button, Col, Icon, Input, Modal, Row, Select, Table, Tag, Switch, Popconfirm, Divider } from 'antd';
import React, { PureComponent, Fragment } from 'react';
//@ts-ignore
import { formatMessage } from 'umi/locale';
import CategoryEdit from './CategoryEdit';
import CommonBreadCrumb from '@/components/CommonBreadCrumb';
import styles from './CategoryList.less';

const Search = Input.Search;

@connect(({ giftCategories: { list, total, page, pageSize } }) => ({ list, total, page, pageSize }))
class SceneCatefory extends PureComponent<any, any> {
  constructor(props) {
    super(props);
    this.state = {
      adding: false,
      editId: null
    };
  }

  fetchPage = (page, pageSize) => {
    this.props.dispatch({
      type: 'giftCategories/fetch',
      payload: {
        page,
        pageSize
      }
    });;
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
      type: 'giftCategories/patchStatus',
      payload: { id, status: 1 }
    });
  }
  putOffline = id => {
    this.props.dispatch({
      type: 'giftCategories/patchStatus',
      payload: { id, status: 0 }
    });
  }
  onShowSizeChange = (current, size) => {
    this.props.dispatch({
      type: 'giftCategories/changePageSize',
      payload: {
        page: current,
        pageSize: size
      }
    });
    this.fetchPage(current, size);
  }
  delete = ({ id, status }) => {
    // if (status == 1) {
    //   return Modal.warn({
    //     title: formatMessage({ id: 'app.scene.tools.delete_hint_title' }),
    //     content: formatMessage({ id: 'app.scene.tools.delete_hint_content' }),
    //     okText: formatMessage({ id: 'app.scene.tools.delete_hint_btn' })
    //   });
    // }
    this.props.dispatch({
      payload: { id },
      type: 'giftCategories/delete'
    });
  }

  render() {
    const { list, page, pageSize, total } = this.props;
    // console.info('pageSize', pageSize);
    const _this = this;
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
        title: formatMessage({ id: 'menu.operation.gift.category' }),
      }
    ];
    let columns = [{
      title: formatMessage({ id: 'app.scene.category.id' }),
      dataIndex: 'id',
    },
    {
      title: formatMessage({ id: 'app.scene.category.name' }),
      dataIndex: 'name',
    }, {
      title: formatMessage({ id: 'app.scene.category.desc' }),
      dataIndex: 'desc',
    }, {
      title: formatMessage({ id: 'app.scene.category.status' }),
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
    }, {
      title: formatMessage({ id: 'app.scene.category.sort' }),
      dataIndex: 'sort',
    }, {
      title: formatMessage({ id: 'app.scene.category.time' }),
      dataIndex: 'create_time',
      render: (text, record) => {
        return (
          <Fragment>
            <div><Icon type='folder-open' theme="twoTone" /> {formatMessage({ id: 'app.scene.category.update_time' })}: {record.update_time}</div>
            <div><Icon type='folder-add' theme="twoTone" /> {formatMessage({ id: 'app.scene.category.create_time' })}: {record.create_time}</div>
          </Fragment>
        );
      }
    }, {
      title: formatMessage({ id: 'app.gift.category.toolCount' }),
      dataIndex: 'tool_count',
    }, {
      title: formatMessage({ id: 'app.scene.category.handle' }),
      key: 'handle',
      render(text, record) {
        let caption, icon_type = 'edit', checked, statusEl;
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
        }
        const deleteEl = record.status === 0 && record.tool_count === 0 ? '' : (
          <Fragment>
            <Divider type='vertical' />
            <a href="#" className={`${styles.delete} ${styles.danger}`} onClick={_this.delete.bind(_this, record)}>{formatMessage({ id: 'app.scene.tools.delete' })}</a>
          </Fragment>
        );
        return (
          <div className={styles.handle}>
            <a href="#" className={styles.edit} onClick={(e) => { _this.showEdit(e, record) }}>{formatMessage({ id: 'app.scene.category.handle.edit' })}</a>
            <Divider type='vertical' />
            {statusEl}
            {/* {deleteEl} */}
          </div>
        );
      }
    },];
    columns = columns.map(item => {
      item.align = 'center';
      return item;
    });

    const operationBar = (
      <div className={styles.operate}>
        <div className={styles.title}>{formatMessage({ id: 'menu.operation.gift.category' })}</div>
        <Button type="primary" icon='plus' onClick={this.showAdd}>{formatMessage({ id: 'app.scene.category.add' })}</Button>
      </div>
    );

    return (
      <Fragment>
        <CommonBreadCrumb items={crumbs} />
        {operationBar}
        {this.state.adding && <CategoryEdit visible={this.state.adding} close={this.hideAdd.bind(this)} />}
        <Table bordered rowKey='id' columns={columns} dataSource={list} pagination={
          {
            position: 'both',
            pageSize,
            showSizeChanger: true,
            pageSizeOptions: ['20', '30', '40'],
            onShowSizeChange: this.onShowSizeChange,
            total,
            showTotal: total => formatMessage({ id: 'app.glob.pagetotal' }, { total: total }),
            size: 'small',
            onChange: this.fetchPage
          }
        } ></Table>
        {!!this.state.editId && <CategoryEdit caption={formatMessage({ id: 'app.scene.category.edit' })} id={this.state.editId} visible={!!this.state.editId} close={this.hideEdit.bind(this)} />}
      </Fragment>
    );
  }
}
export default SceneCatefory;

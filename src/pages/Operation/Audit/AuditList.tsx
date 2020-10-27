import { connect } from 'dva';
import { Breadcrumb, Button, Col, Icon, Input, Modal, Row, Select, Table, Tag, Switch, Popconfirm, Divider } from 'antd';
import React, { PureComponent, Fragment } from 'react';
//@ts-ignore
import { formatMessage } from 'umi/locale';
import CommonBreadCrumb from '@/components/CommonBreadCrumb';
import PreviewVideo from '@/components/PreviewVideo';
import OperationBar from './components/OperationBar';
import styles from './AuditList.less';

const Search = Input.Search;

@connect(({ audit: { list, total, page, pageSize, statusMap } }) => ({ list, total, page, pageSize, statusMap }))
class SceneCatefory extends PureComponent<any, any> {
  constructor(props) {
    super(props);
    this.state = {
      adding: false,
      editId: null,
      previewShowing: false,
      previewUrl: '',
      batchDisable: true,
    };
  }

  audit = (e, id, option) => {
    e.preventDefault();
    this.props.dispatch({
      type: 'audit/patchStatus',
      payload: {
        id,
        status: option === 'pass' ? 2 : 3,
      }
    });
  }

  fetchPage = (page, pageSize) => {
    const { search = {} } = this.state;
    this.props.dispatch({
      type: 'audit/fetch',
      payload: {
        page,
        page_size: pageSize,
        ...search
      }
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

  preview = (e) => {
    this.setState({
      previewShowing: true,
      previewUrl: e.currentTarget.dataset.url
    });
  }
  hidePreview = () => {
    this.setState({
      previewShowing: false,
      previewUrl: ''
    });
  }

  putOnline = id => {
    this.props.dispatch({
      type: 'audit/patchStatus',
      payload: { id, status: 1 }
    });
  }
  putOffline = id => {
    this.props.dispatch({
      type: 'audit/patchStatus',
      payload: { id, status: 0 }
    });
  }
  onShowSizeChange = (current, size) => {
    this.props.dispatch({
      type: 'audit/changePageSize',
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
      type: 'audit/delete'
    });
  }
  search = (values) => {
    this.setState({ search: values });
    const { pageSize } = this.props;
    const page = 1;
    this.props.dispatch({
      type: 'audit/updateState',
      payload: {
        filter: values
      }
    });
    this.props.dispatch({
      payload: { ...values, page, pageSize },
      type: 'audit/fetch'
    });
  }
  batchOnline = () => {
    const ids = this.state.selectedRowKeys;
    Modal.confirm({
      title: formatMessage({ id: 'app.audit.option.pass.batch.confirm' }, { selected: ids.length }),
      onOk: () => {
        this.props.dispatch({
          type: 'audit/batchModify',
          payload: { id: ids.join(','), status: 2 }
        }).then(this.onSelectChange.bind(this, []));
      }
    });
  }
  batchOffline = () => {
    const ids = this.state.selectedRowKeys;
    Modal.confirm({
      title: formatMessage({ id: 'app.audit.option.reject.batch.confirm' }, { selected: ids.length }),
      onOk: () => {
        this.props.dispatch({
          type: 'audit/batchModify',
          payload: { id: ids.join(','), status: 3 }
        }).then(this.onSelectChange.bind(this, []));
      }
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

  render() {
    const { list, page, pageSize, total, statusMap } = this.props;
    // console.info('pageSize', pageSize);
    const _this = this;
    const crumbs = [
      {
        icon: 'desktop',
        title: formatMessage({ id: 'menu.operation' }),
      },
      {
        icon: 'user',
        title: formatMessage({ id: 'menu.operation.user' }),
      },
      {
        icon: 'audit',
        title: formatMessage({ id: 'menu.operation.user.audit' }),
      }
    ];
    let columns = [
      {
        title: formatMessage({ id: 'app.scene.category.id' }),
        dataIndex: 'id',
      },
      {
        title: 'UID',
        dataIndex: 'uid',
      },
      {
        title: 'NICK_ID',
        dataIndex: 'nick_id',
      },
      {
        title: formatMessage({ id: 'app.audit.upload_at' }),
        dataIndex: 'create_at',
      },
      {
        title: formatMessage({ id: 'app.audit.content' }),
        dataIndex: 'video_url',
        render: (value, record) => {
          return (
            <div className={styles['video-box']} data-url={value} onClick={this.preview}>
              <img src={`${value}?x-oss-process=video/snapshot,t_1,f_jpg,w_100,h_100,m_fast,ar_auto
          `} alt={formatMessage({ id: 'app.audit.content' })} />
              <Icon type='play-circle' style={{ position: 'absolute', left: '50%', top: '50%', transform: 'translate3d(-50%,-50%,0)', fontSize: '30px', color: '#fff', opacity: '.6', }} />
            </div>
          );
        }
      },
      {
        title: formatMessage({ id: 'app.audit.status' }),
        dataIndex: 'status',
        render: (value) => {
          let color, status;
          switch (+value) {
            case 3:
              color = 'gray';
              status = formatMessage({ id: 'app.audit.status.fail' });
              break;
            case 2:
              color = 'green';
              status = formatMessage({ id: 'app.audit.status.pass' });
              break;
            case 1:
              color = 'blue';
              status = formatMessage({ id: 'app.audit.status.waiting' });
              break;

            default:
              return <></>;
          }
          return <Tag color={color}>{status}</Tag>
        }
      },
      {
        title: formatMessage({ id: 'app.scene.category.handle' }),
        key: 'handle',
        render(text, record) {
          let caption, checked, statusEl;
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
          return (
            <div className={styles.handle}>
              <a href="#" className={styles.edit} onClick={(e) => { _this.audit(e, record.id, 'pass') }}>{formatMessage({ id: 'app.audit.option.pass' })}</a>
              <Divider type='vertical' />
              <Popconfirm
                title={formatMessage({ id: 'app.audit.option.reject.confirm' })}
                okText={formatMessage({ id: 'app.audit.option.reject.confirm.yes' })}
                cancelText={formatMessage({ id: 'app.audit.option.reject.confirm.no' })}
                okType='danger'
                placement="topRight"
                // onCancel={_this.cancelSwitch}
                onConfirm={(e) => { _this.audit(e, record.id, 'reject') }}
              >
                <a href="#" className={`${styles.edit} ${styles.danger}`}>{formatMessage({ id: 'app.audit.option.reject' })}</a>
              </Popconfirm>
            </div>
          );
        }
      },];
    columns = columns.map(item => {
      item['align'] = 'center';
      return item;
    });

    const operationBar = (
      <div className={styles.operate}>
        <div className={styles.title}>{formatMessage({ id: 'menu.operation.gift.category' })}</div>
        <Button type="primary" icon='plus' onClick={this.showAdd}>{formatMessage({ id: 'app.scene.category.add' })}</Button>
      </div>
    );
    const { selectedRowKeys, batchLoading, batchDisable } = this.state;
    const rowSelection = {
      selectedRowKeys,
      onChange: this.onSelectChange,
    };

    return (
      <Fragment>
        <CommonBreadCrumb items={crumbs} />
        <div className={styles.operate}>
          <OperationBar statuses={[]} search={this.search} batchOnline={this.batchOnline} batchOffline={this.batchOffline} batchLoading={batchLoading} batchDisable={batchDisable} />
        </div>

        <Table rowSelection={rowSelection} bordered rowKey='id' columns={columns} dataSource={list} pagination={
          {
            position: 'both',
            pageSize,
            current: page,
            showSizeChanger: true,
            pageSizeOptions: ['20', '30', '40'],
            onShowSizeChange: this.onShowSizeChange,
            total,
            showTotal: total => formatMessage({ id: 'app.glob.pagetotal' }, { total: total }),
            size: 'small',
            onChange: this.fetchPage
          }
        } ></Table>
        <PreviewVideo visible={this.state.previewShowing} url={this.state.previewUrl} hide={this.hidePreview} />
      </Fragment>
    );
  }
}
export default SceneCatefory;

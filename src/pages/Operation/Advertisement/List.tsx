import { connect } from 'dva';
import { Breadcrumb, Button, Icon, Input, Table, Tag, Switch, Popconfirm, Divider, Modal } from 'antd';
import React, { PureComponent, Fragment } from 'react';
//@ts-ignore
import { formatMessage } from 'umi/locale';
import styles from './list.less';
import OperationBar from './components/OperationBar';
import CommonBreadCrumb from '@/components/CommonBreadCrumb';
import request from '@/utils/request';

const Search = Input.Search;

@connect(({ advertisement: { list, statuses, total, page, pageSize, clients } }) => ({ list, statuses, total, page, pageSize }))
class List extends PureComponent<any, any> {
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
  upload = React.createRef();
  componentWillUnmount() {
    this.props.dispatch({
      type: 'advertisement/updateState',
      payload: {
        page: 1,
        filter: {}
      }
    });
  }

  fetchPage = (page, pageSize) => {
    const { search = {} } = this.state;
    this.props.dispatch({
      type: 'advertisement/fetch',
      payload: {
        page,
        page_size: pageSize,
        ...search
      }
    });
  }
  import = (e) => {
    console.info('import', e, this.upload.current.files);
    const params = new FormData();
    params.append('advert_csv', this.upload.current.files[0]);
    this.props.dispatch({
      type: 'advertisement/upload',
      payload: params
    });
  }

  search = (values) => {
    this.setState({ search: values });
    const { pageSize } = this.props;
    this.props.dispatch({
      type: 'advertisement/updateState',
      payload: {
        filter: values
      }
    });
    this.props.dispatch({
      payload: { ...values, page: 1, pageSize },
      type: 'advertisement/fetch'
    });
  }

  getImportTemplate = () => {
    this.props.dispatch({
      type: 'advertisement/getImportTemplate'
    });
  }

  onShowSizeChange = (current, size) => {
    this.props.dispatch({
      type: 'advertisement/changePageSize',
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
  delete = ({ id }) => {
    this.props.dispatch({
      payload: { ids: id },
      type: 'advertisement/delete'
    });
  };
  batchDelete = () => {
    const ids = this.state.selectedRowKeys;
    Modal.confirm({
      title: formatMessage({ id: 'app.advertisement.batch_delete.warning' }, { selected: ids.length }),
      onOk: () => {
        this.props.dispatch({
          type: 'advertisement/delete',
          payload: { ids: ids.join(',') }
        }).then(this.onSelectChange.bind(this, []));
      }
    });
  };

  render() {
    const _this = this;
    const { list, cates, statuses, total, pageSize, page, clients } = this.props;
    const crumbs = [
      {
        icon: 'desktop',
        title: formatMessage({ id: 'menu.operation' }),
      },
      {
        title: formatMessage({ id: 'menu.operation.advertisement' }),
      }
    ];
    let columns = [
      {
        title: formatMessage({ id: 'app.advertisement.id' }),
        dataIndex: 'id',
        align: 'center',
      },
      {
        title: formatMessage({ id: 'app.advertisement.date' }),
        dataIndex: 'advert_date',
      },
      {
        title: formatMessage({ id: 'app.advertisement.agent' }),
        dataIndex: 'agent',
      },
      {
        title: formatMessage({ id: 'app.advertisement.platform' }),
        dataIndex: 'platform',
      },
      {
        title: formatMessage({ id: 'app.advertisement.country' }),
        dataIndex: 'country',
      },
      {
        title: formatMessage({ id: 'app.advertisement.show_count' }),
        dataIndex: 'show_count',
      },
      {
        title: formatMessage({ id: 'app.advertisement.click_count' }),
        dataIndex: 'click_count',
      },
      {
        title: formatMessage({ id: 'app.advertisement.ctr' }),
        dataIndex: 'ctr',
      },
      {
        title: formatMessage({ id: 'app.advertisement.cvr' }),
        dataIndex: 'cvr',
      },
      {
        title: formatMessage({ id: 'app.advertisement.install_count' }),
        dataIndex: 'install_count',
      },
      {
        title: formatMessage({ id: 'app.advertisement.consume' }),
        dataIndex: 'consume',
      },
      {
        title: formatMessage({ id: 'app.advertisement.cpi' }),
        dataIndex: 'cpi',
      },
      {
        title: formatMessage({ id: 'app.scene.tools.time' }),
        dataIndex: 'create_at',
        render(text, record) {
          return (
            <Fragment>
              <div><Icon type='folder-open' theme="twoTone" /> {formatMessage({ id: 'app.scene.tools.update_time' })}: {record.update_at}</div>
              <div><Icon type='folder-add' theme="twoTone" /> {formatMessage({ id: 'app.scene.tools.create_time' })}: {record.create_at}</div>
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
          checked = true;
          caption = formatMessage({ id: 'app.scene.category.offline' });
          deleteEl = (
            <Popconfirm
              title={formatMessage({ id: 'app.scene.tools.delete_confirm' })}
              okText={formatMessage({ id: 'app.scene.category.offline_confirm' })}
              cancelText={formatMessage({ id: 'app.scene.category.offline_cancel' })}
              okType='danger'
              placement="topRight"
              onConfirm={() => { this.delete(record) }}
            >
              <a href="#" className={styles.delete}>{deleteCaption}</a>
            </Popconfirm>
          );
          return (
            <div className={styles.handle}>
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
          <OperationBar list={list} batchLoading={batchLoading} batchDisable={batchDisable} search={this.search} batchDelete={this.batchDelete} />
          <Button className={styles.mrm} onClick={this.getImportTemplate}>{formatMessage({ id: 'app.advertisement.download' })}</Button>
          <label className={`${styles.import} ant-btn ant-btn-primary`} htmlFor='upload'>{formatMessage({ id: 'app.advertisement.import' })}</label>
          <input ref={this.upload} className={styles.upload} type="file" id="upload" onChange={this.import} multiple></input>
        </div>
        <Table
          rowSelection={rowSelection}
          bordered rowKey='id'
          //@ts-ignore
          columns={columns}
          dataSource={list}
          scroll={{ x: true }}
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
      </Fragment >
    );
  }
}
export default List;

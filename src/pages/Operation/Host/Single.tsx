import { connect } from 'dva';
import { Breadcrumb, Button, Icon, Input, Table, Tag, Switch, Popconfirm, Divider, Modal, Badge, Popover } from 'antd';
import React, { PureComponent, Fragment } from 'react';
//@ts-ignore
import { formatMessage } from 'umi/locale';
import styles from './list.less';
import OperationBar from './components/OperationBar';
import RoomUsers from './Upper/RoomUsers';
import RoomOperation from './components/RoomOperation'
import CommonBreadCrumb from '@/components/CommonBreadCrumb';
import VoiceTag from './VoiceTag';
import VoiceModal from './VoiceModal';

const Search = Input.Search;

@connect(({ show: { list, statuses, total, page, pageSize, clients }, faceCategories: { list: cates } }) => ({ list, cates, statuses, total, page, pageSize, clients }))
class List extends PureComponent<any, any> {
  constructor(props) {
    super(props);
    this.state = {
      adding: false,
      editId: null,
      selectedRowKeys: [],
      batchDisable: true,
      batchLoading: false,
      showVoiceModal: false,
      info: {},
      popoverVisible: false,
    }
  }
  componentWillUnmount() {
    this.props.dispatch({
      type: 'show/updateState',
      payload: {
        page: 1,
        filter: {}
      }
    });
  }

  fetchPage = (page, pageSize) => {
    const { search = {} } = this.state;
    this.props.dispatch({
      type: 'show/fetch',
      payload: {
        page,
        page_size: pageSize,
        ...search
      }
    });
  }

  search = (values, isExport) => {
    this.setState({ search: values });
    const { pageSize } = this.props;
    this.props.dispatch({
      type: 'show/updateState',
      payload: {
        filter: values
      }
    });
    const params = { ...values, page: 1, pageSize };
    if (isExport) { params.export = 1 }
    this.props.dispatch({
      payload: params,
      type: 'show/fetch'
    });
  }
  tableChange = (pagination, filters, sorter, extra) => {
    console.info('tableChange__', { pagination, sorter });
    const { search = {} } = this.state;
    const { pageSize } = pagination;
    const { field, order } = sorter;
    if (field) {
      const params = { ...search, page: 1, pageSize };
      if (order) {
        params.order_by_type = order === 'ascend' ? 'asc' : 'desc';
        params.order_by = field;
      }
      this.props.dispatch({
        payload: params,
        type: 'show/fetch'
      });
    }
  }

  onShowSizeChange = (current, size) => {
    this.props.dispatch({
      type: 'show/changePageSize',
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
  onClose = () => {
    this.setState({
      showModel: false,
    })
  }
  hidePopover = () => {
    this.setState({
      popoverVisible: false
    });
  }
  handlePopoverVisibleChange = (visible) => {
    this.setState({
      popoverVisible: visible
    });
  }
  render() {
    const _this = this;
    const { list, cates, statuses, total, pageSize, page, clients, dispatch } = this.props;

    let columns = [
      {
        title: formatMessage({ id: 'app.host.show.id' }),
        dataIndex: 'id',
        align: 'center',
      },
      {
        title: formatMessage({ id: 'app.host.show.uid' }),
        dataIndex: 'creator_id',
        align: 'center',
      },
      {
        title: formatMessage({ id: 'app.host.show.nickid' }),
        dataIndex: 'nick_id',
        align: 'center',
      },
      {
        title: formatMessage({ id: 'app.host.show.avatar' }),
        dataIndex: 'avatar',
        render(value, record) {
          return (
            <img className={styles.icon} src={value} alt={record.name} />
          );
        }
      },
      {
        title: formatMessage({ id: 'app.host.show.nickname' }),
        dataIndex: 'nickname',
      },
      {
        title: formatMessage({ id: 'app.host.show.gender' }),
        dataIndex: 'sex',
        render: (value) => {
          const genderEnum = [formatMessage({ id: 'app.host.show.gender.unknown' }), formatMessage({ id: 'app.host.show.gender.male' }), formatMessage({ id: 'app.host.show.gender.female' })];
          return genderEnum[+value];
        }
      },
      {
        title: formatMessage({ id: 'app.host.show.title' }),
        dataIndex: 'name',
      },
      {
        title: formatMessage({ id: 'app.host.show.coins.host' }),
        dataIndex: 'creator_coins',
      },
      {
        title: formatMessage({ id: 'app.host.show.coins.sum' }),
        dataIndex: 'sum_coins',
      },
      {
        title: formatMessage({ id: 'app.host.show.vioceTag' }),
        dataIndex: '_',
        render: (t, record) => {
          return <VoiceTag {...record} onClick={() => {
            _this.setState(({ }) => {
              return { info: record }
            }, () => {
              _this.setState({
                showVoiceModal: true
              })
            })
          }} />
        }
      },
     
      {
        title: formatMessage({ id: 'app.host.show.time' }),
        dataIndex: 'begin_time',
        render(text, record) {
          if (!record.begin_time) return '';
          return (
            <Fragment>
              {`${record.begin_time || ''} — ${record.end_time || ''}`}
            </Fragment>
          );
        }
      },
      {
        title: formatMessage({ id: 'app.host.show.last' }),
        dataIndex: 'duration',
        sorter: true,
        render: (value) => {
          if (!(value > 0)) { return '' }
          return (`${value}${formatMessage({ id: 'app.host.show.duration.unit' })}`);
        }
      },
      {
        title: `直播状态`,
        dataIndex: 'status',
        key: 'status',
        align: 'center',
        render(text) {
          return <Badge status={text == 1 ? "success" : 'default'} text={text == 1 ? "进行中" : '已结束'} />
        }
      },
      {
        title: formatMessage({ id: 'app.host.show.operation' }),
        dataIndex: 'active',
        key: 'active',
        align: 'center',
        render(_, info) {
          return <
            RoomOperation info={info} dispatch={dispatch} checkMember={() => {
              _this.setState({
                detail: info
              }, () => {
                _this.setState({
                  showModel: true
                })
              })

            }}
          />
        }
      },
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
        <div className={styles['operations-wraper']}>
          <OperationBar clients={clients} cates={cates} statuses={statuses} batchLoading={batchLoading} batchDisable={batchDisable} search={this.search} />
        </div>
        <Table
          // rowSelection={rowSelection}
          scroll={{ x: true }}
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
          }
          onChange={this.tableChange}
        ></Table>
        {this.state.showVoiceModal && <VoiceModal {...this.state.info} onCancel={(flag, id) => {
          if (flag) {
            this.props.dispatch({
              type: 'show/fetchSingle',
              payload: {
                id
              }
            });
          }
          this.setState({ showVoiceModal: false })
        }} />}
        <Modal
          title={null}
          visible={this.state.showModel}
          onCancel={this.onClose}
          footer={null}
        // closeIcon={<Close />}
        >
          {this.state.showModel && <RoomUsers {...this.state.detail} creatorId={this.state.detail.creator_id} />}
        </Modal>
      </Fragment >
    );
  }
}
export default List;

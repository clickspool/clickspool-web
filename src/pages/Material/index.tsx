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
@connect(({ material: { list, total, page, page_size, types, statuses = {}, merchantMap } }) => ({ list, total, page, page_size, types, statuses, merchantMap }))
class TemplateList extends PureComponent<any, any> {
  constructor(props) {
    super(props);
    this.state = {
      editShowing: false,
      addShowing: false,
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
      type: 'material/delete',
      payload: record
    });
  }
  putOnline = record => {
    this.props.dispatch({
      type: 'material/patchStatus',
      payload: { ...record, status: 1 }
    });
  }
  putOffline = record => {
    this.props.dispatch({
      type: 'material/patchStatus',
      payload: { ...record, status: 0 }
    });
  }
  search = (values) => {
    this.setState({ search: values });
    // const { page_size, page = 1 } = this.props;
    this.props.dispatch({
      payload: { ...values },
      type: 'material/fetch'
    });
  }
  onShowSizeChange = (current, size) => {
    this.props.dispatch({
      type: 'material/changePage_size',
      payload: {
        page: current,
        page_size: size
      }
    });
    this.fetchPage(current, size);
  }
  fetchPage = (page, page_size) => {
    const { search = {} } = this.state;
    this.props.dispatch({
      type: 'material/fetch',
      payload: {
        page,
        page_size: page_size,
        ...search
      }
    });
  }

  render() {
    const crumbs = [
      {
        icon: 'monitor',
        title: formatMessage({ id: 'menu.afiliate' }),
      },
      //  {
      //   title: formatMessage({ id: 'menu.afiliate' }),
      // }
    ];
    // const [count, setCount] = React.useState<number>(0);
    // const [count, setCount] = React.useState(0);

    const { list, total, page, page_size, types, statuses } = this.props;
    const { editShowing, addShowing, editRecord } = this.state;
    const { showEdit, hideEdit, deleteRecord, hideAdd, showAdd, search, putOnline, putOffline } = this;
    const columns = [
      {
        title: formatMessage({ id: 'app.material.id' }),
        dataIndex: 'mid',
        align: 'center',
        width: 120
      },
      {
        title: formatMessage({ id: 'app.material.title' }),
        dataIndex: 'title',
        align: 'center',
        width: 200
      },
      {
        title: formatMessage({ id: 'app.material.type' }),
        dataIndex: 'type',
        align: 'center',
        width: 200,
        render: (text) => {
          return types[text]
        }
      },
      {
        title: formatMessage({ id: 'app.material.destinationlink' }),
        dataIndex: 'destination_link',
        align: 'center',
        width: 200
      },
      {
        title: formatMessage({ id: 'app.material.promotepic' }),
        dataIndex: 'images',
        align: 'center',
        width: 200,
        render: (value) => {
          if (value && value.length) {
            return (
              <>
                {
                  value.map((item, index) => {
                    return <img className={styles.icon} src={item} height={100} alt="" key={index} />
                  })
                }
              </>
            );
          }
          return null;
        }
      },
      {
        title: formatMessage({ id: 'app.material.promotevideo' }),
        dataIndex: 'videos',
        align: 'center',
        width: 200,
        render: (value) => {
          if (value && value.length) {
            return (
              <>
                {
                  value.map((item, index) => {
                    return <video className={styles.icon} src={item} key={index} />
                  })
                }
              </>
            );
          }
          return null;
        }
      },
      {
        title: formatMessage({ id: 'app.material.description' }),
        dataIndex: 'description',
        align: 'center',
        width: 300
      },
      {
        title: formatMessage({ id: 'app.material.status' }),
        dataIndex: 'status',
        align: 'center',
        width: 200,
        render: (value, record) => {
          let color;
          // tslint:disable-next-line:prefer-conditional-expression
          if (+value === 0) {
            color = 'gray';
            // satus = formatMessage({ id: 'app.material.revoke' });
          } else {
            color = 'blue';
            // satus = formatMessage({ id: 'app.material.published' });
          }
          return <Tag color={color}>{statuses[value]}</Tag>
        }
      },
      {
        title: formatMessage({ id: 'app.material.time' }),
        dataIndex: 'create_time',
        align: 'center',
        width: 200,
        render(text, record) {
          return (
            <Fragment>
              <div><Icon type='file-add' /> {record.created_at}</div>
              <div><Icon type='file-sync' /> {record.updated_at}</div>
            </Fragment>
          );
        }
      },
      {
        title: formatMessage({ id: 'app.material.operation' }),
        dataIndex: 'operation',
        align: 'center',
        fixed: 'right',
        width: 150,
        render: (value, record) => {
          let caption, icon_type = 'edit', checked, statusEl, deleteEl;
          if (record.status == 0) {
            checked = false;
            caption = formatMessage({ id: 'app.material.published' });
            statusEl = (
              <Popconfirm
                title={formatMessage({ id: 'app.material.sureup' })}
                okText={formatMessage({ id: 'app.material.yes' })}
                cancelText={formatMessage({ id: 'app.material.cancel' })}
                okType='danger'
                placement="topRight"
                // onCancel={this.cancelSwitch}
                onConfirm={() => { putOnline(record) }}
              >
                <a href="#" className={styles.edit}>{caption}</a>
              </Popconfirm>
            );
          } else {
            checked = true;
            caption = formatMessage({ id: 'app.material.revoke' });
            statusEl = (
              <Popconfirm
                title={formatMessage({ id: 'app.material.suredown' })}
                okText={formatMessage({ id: 'app.material.yes' })}
                cancelText={formatMessage({ id: 'app.material.cancel' })}
                okType='danger'
                placement="topRight"
                // onCancel={this.cancelSwitch}
                onConfirm={() => { putOffline(record) }}
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
          <OperationBar statuses={statuses} search={search} addTitle={formatMessage({ id: 'app.material.add' })} add={showAdd} />
        </div>
        <Table
          className={cx('list')}
          bordered
          rowKey='mid'
          //@ts-ignore
          columns={columns}
          dataSource={list || []}
          scroll={{ x: 2000 }}
          pagination={
            {
              position: 'both',
              pageSize: page_size,
              showSizeChanger: true,
              page_sizeOptions: ['20', '30', '40'],
              onShowSizeChange: this.onShowSizeChange,
              total,
              current: page,
              showTotal: total => formatMessage({ id: 'app.glob.pagetotal' }, { total: total }),
              size: 'small',
              onChange: this.fetchPage
            }
          }></Table>
        {addShowing && <EditTemplate caption={formatMessage({ id: 'app.material.add' })} visible={addShowing} close={hideAdd} />}
        {editRecord && <EditTemplate caption={formatMessage({ id: 'app.material.edit' })} id={editRecord.id} record={editRecord} visible={!!this.state.editRecord} close={hideEdit} />}
      </Fragment>
    );
  }
}

export default TemplateList;



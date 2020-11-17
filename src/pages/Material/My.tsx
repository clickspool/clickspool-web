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
@connect(({ myMaterial: { list, total, page, page_size }, material: { types, statuses = {}, merchantMap } }) => ({ list, total, page, page_size, types, statuses, merchantMap }))
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
      type: 'myMaterial/delete',
      payload: record
    });
  }
  putOnline = record => {
    this.props.dispatch({
      type: 'myMaterial/patchStatus',
      payload: { ...record, status: 1 }
    });
  }
  putOffline = record => {
    this.props.dispatch({
      type: 'myMaterial/patchStatus',
      payload: { ...record, status: 0 }
    });
  }
  search = (values) => {
    this.setState({ search: values });
    // const { page_size, page = 1 } = this.props;
    this.props.dispatch({
      payload: { ...values },
      type: 'myMaterial/fetch'
    });
  }
  onShowSizeChange = (current, size) => {
    this.props.dispatch({
      type: 'myMaterial/changePage_size',
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
      type: 'myMaterial/fetch',
      payload: {
        page,
        page_size,
        ...search
      }
    });
  }

  render() {
    const crumbs = [
      {
        icon: 'bank',
        title: formatMessage({ id: 'menu.afiliate' }),
      }, {
        title: formatMessage({ id: 'menu.afiliate.my' }),
      }
    ];
    // const [count, setCount] = React.useState<number>(0);
    // const [count, setCount] = React.useState(0);

    const { list, total, page, page_size, types, statuses } = this.props;
    const { editShowing, addShowing, editRecord } = this.state;
    const { showEdit, hideEdit, deleteRecord, hideAdd, showAdd, search, putOnline, putOffline } = this;
    const columns = [
      {
        title: formatMessage({ id: 'app.material.id' }),
        dataIndex: 'aid',
        align: 'center',
      },
      {
        title: formatMessage({ id: 'app.material.title' }),
        dataIndex: 'title',
        align: 'center',
      },
      {
        title: formatMessage({ id: 'app.material.type' }),
        dataIndex: 'type',
        align: 'center',
        render: (text) => {
          return types[text]
        }
      },
      {
        title: formatMessage({ id: 'app.material.destinationlink' }),
        dataIndex: 'promotion_url',
        align: 'center',
        width: 200
      },
      {
        title: formatMessage({ id: 'app.material.description' }),
        dataIndex: 'description',
        align: 'center',
        width: 200
      },
      {
        title: formatMessage({ id: 'app.material.promotetime' }),
        dataIndex: 'created_at',
        align: 'center',
        width: 200
      },
      {
        title: formatMessage({ id: 'app.material.operation' }),
        dataIndex: 'operation',
        align: 'center',
        // fixed: 'right',
        render: (value, record) => {
          // tslint:disable-next-line:no-shadowed-variable
          return <Button onClick={(e) => {
            showEdit(e, record);
          }}>{formatMessage({ id: "app.material.detail" })}</Button>
        }
      },
    ];
    return (
      <Fragment>
        <CommonBreadCrumb items={crumbs} />
        {/* <div className={cx('operate')}>
          <OperationBar statuses={statuses} search={search} addTitle={formatMessage({ id: 'app.material.add' })} add={showAdd} />
        </div> */}
        <Table
          className={cx('list')}
          bordered
          rowKey='aid'
          //@ts-ignore
          columns={columns}
          dataSource={list || []}
          // scroll={{ x: 2000 }}
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
        {/* {addShowing && <EditTemplate caption={formatMessage({ id: 'app.material.add' })} visible={addShowing} close={hideAdd} />} */}
        {editRecord && <EditTemplate caption={editRecord.title} mine={true} mym={true} record={editRecord} visible={!!this.state.editRecord} close={hideEdit} />}
      </Fragment>
    );
  }
}

export default TemplateList;



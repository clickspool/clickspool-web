import { connect } from 'dva';
import React, { PureComponent, Fragment } from 'react';
//@ts-ignore
import { formatMessage } from 'umi/locale';
import CommonBreadCrumb from '@/components/CommonBreadCrumb';
import OperationBar from './components/OperationBar';
import classnames from 'classnames/bind';
import RefuseForm from './RefuseForm';
import PassForm from './PassForm';

// import OperationBar from './components/OperationBar';
import styles from './list.less';
import {
  Icon,
  Input,
  Button,
  Table,
  Divider,
  Popconfirm,
  Tag,
  Modal,
  Form
} from 'antd';
import { format } from 'prettier';

const cx = classnames.bind(styles);

@connect(({ withdraw: { list, total, page, pageSize, tags, statuses = [], ruleTypes } }) => ({ list, total, page, pageSize, tags, statuses, ruleTypes }))
class Reply extends PureComponent<any, any> {
  input;
  constructor(props) {
    super(props);
    this.state = {
      editShowing: false,
      previewShowing: false,
    };
    this.input = React.createRef();
  }

  refuse = (reason) => {
    if (reason && !reason.replace(/\s*/g, '')) {
      return;
    }
    this.setState({
      reason: ''
    });
    const record = this.state.currendRecord;
    this.setStatus(record.id, 4, reason);//设置状态为失败
    this.hideRefuse();
  }
  showRefuse = (record, editDisable?) => {
    const newState: any = {
      refuseShowing: true,
      currendRecord: record,
      refuseEditAble: !editDisable
    };
    if (editDisable) {
      newState.defaultRefuseReason = record.reason;
    }
    this.setState(newState);
  }
  hideRefuse = (e?) => {
    this.setState({
      refuseShowing: false
    });
  }

  search = (values) => {
    this.setState({ search: values });
    const { pageSize } = this.props;
    const page = 1;
    this.props.dispatch({
      type: 'withdraw/updateState',
      payload: {
        filter: values
      }
    });
    this.props.dispatch({
      payload: { ...values, page, pageSize },
      type: 'withdraw/fetch'
    });
  }
  onShowSizeChange = (current, size) => {
    this.props.dispatch({
      type: 'withdraw/changePageSize',
      payload: {
        page: current,
        pageSize: size
      }
    });
    this.fetchPage(current, size);
  }
  fetchPage = (page, pageSize) => {
    const { search = {} } = this.state;
    this.props.dispatch({
      type: 'withdraw/fetch',
      payload: {
        page,
        page_size: pageSize,
        ...search
      }
    });
  }
  setStatus = (id, apply_status, reason = '') => {
    this.props.dispatch({
      type: 'withdraw/patchStatus',
      payload: {
        apply_status,
        id,
        reason
      }
    });
  }

  render() {
    const crumbs = [
      {
        icon: 'snippets',
        title: formatMessage({ id: 'menu.order' }),
      }, {
        title: formatMessage({ id: 'menu.order.withdraw' }),
      }
    ];

    const { list, total, page, pageSize, tags, statuses } = this.props;
    const { search } = this;
    const columns = [
      {
        title: formatMessage({ id: 'app.withdraw.id' }),
        dataIndex: 'id',
        align: 'center',
      },
      {
        title: formatMessage({ id: 'app.virtual.accounts.time' }),
        dataIndex: 'time',
        align: 'center',
        render: (value, record) => {
          return (
            <Fragment>
              {record.create_at && <div className={cx('time')}>{formatMessage({ id: 'app.withdraw.create_time' })}: {record.create_at}</div>}
              {record.check_at && <div className={cx('time')}>{formatMessage({ id: 'app.withdraw.check_time' })}: {record.check_at}</div>}
              {record.payment_at && <div className={cx('time')}>{formatMessage({ id: 'app.withdraw.pay_time' })}: {record.payment_at}</div>}
              {record.arrive_at && <div className={cx('time')}>{formatMessage({ id: 'app.withdraw.arrive_time' })}: {record.arrive_at}</div>}
              {record.fail_at && <div className={cx('time')}>{formatMessage({ id: 'app.withdraw.fail_time' })}: {record.fail_at}</div>}
            </Fragment>
          );
        }
      },
      {
        title: formatMessage({ id: 'app.apply.account' }),
        dataIndex: 'user_id',
        align: 'center',
      },
      {
        title: formatMessage({ id: 'app.withdraw.pay_name' }),
        dataIndex: 'pay_name',
        align: 'center',
      },
      {
        title: formatMessage({ id: 'app.withdraw.pay_account' }),
        dataIndex: 'pay_account',
        align: 'center',
      },
      {
        title: formatMessage({ id: 'app.withdraw.coin' }),
        dataIndex: 'x_coin',
        align: 'center',
      },
      {
        title: formatMessage({ id: 'app.withdraw.money' }),
        dataIndex: 'money',
        align: 'center',
      },
      {
        title: formatMessage({ id: 'app.withdraw.predict' }),
        dataIndex: 'service_charge_money',
        align: 'center',
        render: (value, record) => {
          return record.money - record.service_charge_money;
        }
      },
      {
        title: formatMessage({ id: 'app.group.tag.status' }),
        dataIndex: 'apply_status',
        align: 'center',
        render: (value) => {
          if (+value === 1) {
            return formatMessage({ id: 'app.withdraw.status.1' });
          }
          if (+value === 4) {
            return formatMessage({ id: 'app.withdraw.status.refused' });
          }
          return statuses[value]
        }
      },
      {
        title: formatMessage({ id: 'app.withdraw.auditor' }),
        dataIndex: 'operate_name',
        align: 'center',
      },
      {
        title: formatMessage({ id: 'app.virtual.accounts.operation' }),
        dataIndex: 'operation',
        align: 'center',
        render: (value, record) => {
          let handleEl;
          const status = +record.apply_status;
          const captionPass = status === 3 ? '' : formatMessage({ id: `app.withdraw.status${status}.pass` });
          const captionRefuse = formatMessage({ id: `app.withdraw.status${status}.refuse` });
          const pass = (e) => {
            e.preventDefault();
            if (status === 4) {
              return this.showRefuse(record, true);
            }
            this.setStatus(record.id, status + 1);
          }
          const cancel = (e) => {
            e.preventDefault();
            if (status === 0) {
              return this.showRefuse(record);
            }
            if (status === 4) {
              return this.setStatus(record.id, 0);
            }
            this.setStatus(record.id, status - 1);
          }
          return (
            <div className={styles.handle}>
              {captionPass && (
                <Fragment>
                  <a href="#" className={styles.edit} onClick={pass}>{captionPass}</a> <Divider type='vertical' />
                </Fragment>
              )}
              <a href="#" className={styles.delete} onClick={cancel}>{captionRefuse}</a>
            </div>
          );
        }
      },
    ];

    return (
      <Fragment>
        <CommonBreadCrumb items={crumbs} />
        <div className={cx('operate')}>
          <OperationBar statuses={statuses} search={search} tags={tags} />
        </div>
        <Table
          className={cx('list')}
          bordered
          rowKey='id'
          //@ts-ignore
          columns={columns}
          dataSource={list}
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
        <RefuseForm
          reason={this.state.defaultRefuseReason}
          editAble={this.state.refuseEditAble}
          visible={this.state.refuseShowing}
          handleOk={this.refuse}
          handleCancel={this.hideRefuse}
        />
      </Fragment>
    );
  }
}

export default Reply;

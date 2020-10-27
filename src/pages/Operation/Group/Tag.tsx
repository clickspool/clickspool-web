import React, { Fragment, PureComponent } from 'react';
import { connect } from 'dva';
import CommonBreadCrumb from '@/components/CommonBreadCrumb';
// @ts-ignore
import { formatMessage } from 'umi/locale';
import { Button, Table, Popconfirm, Divider, Tag, Modal } from 'antd';
// @ts-ignore
import TagEdit from './TagEdit.tsx';
import styles from './Tag.less';
import classnames from 'classnames/bind';
const cx = classnames.bind(styles);
/// <reference types='./css.d.ts' />
@connect(({ tag: { list, total, page, pageSize } }) => ({ list, total, page, pageSize }))
class TagList extends PureComponent<any, any> {
  constructor(props) {
    super(props);
    this.state = {
      adding: false,
      editId: null,
      crumbs: [
        {
          icon: 'desktop',
          title: formatMessage({ id: 'menu.operation' }),
        },
        {
          icon: 'team',
          title: formatMessage({ id: 'menu.operation.group' }),
        },
        {
          icon: 'tag',
          title: formatMessage({ id: 'menu.operation.group.tag' }),
        }
      ]
    };
  }
  deleteRecord = ({ id, status }) => {
    if (status == 1) {
      return Modal.warn({
        title: formatMessage({ id: 'app.scene.tools.delete_hint_title' }),
        content: formatMessage({ id: 'app.scene.tools.delete_hint_content' }),
        okText: formatMessage({ id: 'app.scene.tools.delete_hint_btn' })
      });
    }

    return this.props.dispatch({
      payload: { id },
      type: 'tag/delete'
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
      type: 'tag/patchStatus',
      payload: { id, status: 1 }
    });
  }
  putOffline = id => {
    this.props.dispatch({
      type: 'tag/patchStatus',
      payload: { id, status: 0 }
    });
  }
  onShowSizeChange = (current, size) => {
    this.props.dispatch({
      type: 'tag/changePageSize',
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
      type: 'tag/fetch',
      payload: {
        page,
        page_size: pageSize,
        ...search
      }
    });
  }
  render() {
    const { list, total, page, pageSize } = this.props;
    const { showAdd, hideAdd, showEdit, hideEdit, putOffline, putOnline, deleteRecord, onShowSizeChange, fetchPage } = this;
    const { crumbs } = this.state;
    const operationBar = (
      <div className={cx('operate')}>
        <div className={cx('title')}>{formatMessage({ id: 'app.group.tag' })}</div>
        <Button type="primary" icon='plus' onClick={showAdd}>{formatMessage({ id: 'app.group.tag.add' })}</Button>
      </div>
    );
    const columns = [
      {
        title: formatMessage({ id: 'app.group.tag.id' }),
        dataIndex: 'id',
        align: 'center',
      },
      {
        title: formatMessage({ id: 'app.group.tag.tag' }),
        dataIndex: 'name',
        align: 'center',
      },
      {
        title: formatMessage({ id: 'app.group.tag.remark' }),
        dataIndex: 'desc',
        align: 'center',
      },
      {
        title: formatMessage({ id: 'app.group.tag.status' }),
        dataIndex: 'status',
        align: 'center',
        render: (value, record) => {
          let color, satus;
          if (+value === 0) {
            color = 'gray';
            satus = formatMessage({ id: 'app.group.tag.offline' });
          } else {
            color = 'blue';
            satus = formatMessage({ id: 'app.group.tag.online' });
          }
          return <Tag color={color}>{satus}</Tag>
        }
      },
      {
        title: formatMessage({ id: 'app.group.tag.recommend' }),
        dataIndex: 'is_recommend',
        align: 'center',
        render: (value, record) => {
          let color, satus;
          if (+value === 0) {
            color = 'gray';
            satus = formatMessage({ id: 'app.group.tag.recommend.no' });
          } else {
            color = 'blue';
            satus = formatMessage({ id: 'app.group.tag.recommend.yes' });
          }
          return <Tag color={color}>{satus}</Tag>
        }
      },
      {
        title: formatMessage({ id: 'app.group.tag.order' }),
        dataIndex: 'sort',
        align: 'center',
      },
      {
        title: formatMessage({ id: 'app.group.tag.time' }),
        dataIndex: 'time',
        align: 'center',
        render: (value, record) => {
          return (
            <Fragment>
              <div className={cx('time')}>{formatMessage({ id: 'app.group.list.edit_time' })}: {record.update_at}</div>
              <div className={cx('time')}>{formatMessage({ id: 'app.group.list.create_time' })}: {record.create_at}</div>
            </Fragment>
          );
        }
      },
      {
        title: formatMessage({ id: 'app.group.tag.group_amount' }),
        dataIndex: 'tag_group_num',
        align: 'center',
      },
      {
        title: formatMessage({ id: 'app.group.tag.material_amount' }),
        dataIndex: 'tag_material_num',
        align: 'center',
      },
      {
        title: formatMessage({ id: 'app.virtual.accounts.operation' }),
        dataIndex: 'operation',
        align: 'center',
        render: (text, record) => {
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
                onConfirm={putOnline.bind(this, record.id)}
              >
                <a href="#" className={styles.edit}>{caption}</a>
              </Popconfirm>
            );
            deleteEl = +record.tag_group_num === 0 && +record.tag_material_num === 0 ? (
              <Fragment>
                <Divider type='vertical' />
                <Popconfirm
                  title={formatMessage({ id: 'app.scene.tools.delete_confirm' })}
                  okText={formatMessage({ id: 'app.scene.category.offline_confirm' })}
                  cancelText={formatMessage({ id: 'app.scene.category.offline_cancel' })}
                  okType='danger'
                  placement="topRight"
                  onConfirm={deleteRecord.bind(this, record)}
                >
                  <a href="#" className={styles.delete}>{deleteCaption}</a>
                </Popconfirm>
              </Fragment>

            ) : '';
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
                onConfirm={() => putOffline(record.id)}
              >
                <a href="#" className={`${styles.edit} ${styles.danger}`}>{caption}</a>
              </Popconfirm>
            );
            deleteEl = '';
          }
          return (
            <div className={styles.handle}>
              <a href="#" className={styles.edit} onClick={(e) => { showEdit(e, record) }}>{formatMessage({ id: 'app.scene.tools.handle.edit' })}</a>
              <Divider type='vertical' />
              {statusEl}
              {deleteEl}
            </div>
          );
        }
      },
    ];
    return (
      <Fragment>
        <CommonBreadCrumb items={crumbs} />
        {operationBar}
        {this.state.adding && <TagEdit caption={formatMessage({ id: 'app.meme.subcate.add' })} visible={this.state.adding} close={hideAdd} />}
        <Table
          className={cx('list')}
          bordered
          rowKey='id'
          // @ts-ignore
          columns={columns}
          dataSource={list}
          pagination={
            {
              position: 'both',
              pageSize,
              showSizeChanger: true,
              pageSizeOptions: ['20', '30', '40'],
              onShowSizeChange: onShowSizeChange,
              total,
              current: page,
              showTotal: total => formatMessage({ id: 'app.glob.pagetotal' }, { total: total }),
              size: 'small',
              onChange: fetchPage
            }
          }
        />
        {!!this.state.editId && <TagEdit caption={formatMessage({ id: 'app.scene.category.edit' })} id={this.state.editId} visible={!!this.state.editId} close={hideEdit} />}
      </Fragment>
    );
  }
}
export default TagList;

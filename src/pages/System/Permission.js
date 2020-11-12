import { del,lockMember,unlockMember } from '@/services/permission';
import { type } from '@/utils/utils';

import { connect } from 'dva';

import {
  Input,
  Breadcrumb,
  Icon,
  Button,
  Pagination,
  Divider,
  Table,
  Popconfirm,
  Badge,
} from 'antd';

import React, { PureComponent } from 'react';

import { formatMessage } from 'umi/locale';

import { operationEnum, getKey } from '../../../config/role.enum';

import styles from './Permission.less';
import PermissionAdd from './PermissionAdd';
import PermissionEdit from './PermissionEdit';

const Search = Input.Search;

function toParseInt(str) {
  if (str) {
    return parseInt(str || 0);
  }
  return 0;
}

@connect(
  ({
    permission: { data, roleList, statusList },
    routing: {
      location: { pathname },
    },
    memberInfo: {
      data: { keys },
    },
  }) => ({
    data,
    roleList,
    statusList,
    keys,
    pathname,
  })
)
class Permission extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      pagination: { page: 1, total_page: 0, page_size: 20 },
      addVisible: false,
      editVisible: false,
      editDataSource: {},
      isEditPw: false,
    };
    this.updataConfiList = this.updataConfiList.bind(this);
    this.onSearch = this.onSearch.bind(this);
    this.addVisbleHandle = this.addVisbleHandle.bind(this);
    this.handleTableChange = this.handleTableChange.bind(this);
    this.delRole = this.delRole.bind(this);
    this.onCloseEditModel = this.onCloseEditModel.bind(this);
    this.userEdit = this.userEdit.bind(this);
  }
  componentDidMount() {
    this.getEnumList().then(() => {
      this.updataConfiList();
    });
  }

  onSearch(value) {
    this.setState(
      {
        pagination: { page: 1, nickname: value.trim() },
      },
      () => {
        this.updataConfiList();
      }
    );
  }

  async getEnumList() {
    const { dispatch } = this.props;
    await (() => {
      dispatch({
        type: 'permission/getRoleList',
      });
    })();
    await (() => {
      dispatch({
        type: 'permission/getMemberStatusList',
      });
    })();
  }

  updataConfiList() {
    const { dispatch } = this.props;
    const { pagination } = this.state;
    dispatch({
      type: 'permission/getList',
      payload: pagination,
    });
  }
  addVisbleHandle(refresh) {
    this.setState({ addVisible: !this.state.addVisible }, () => {
      refresh === 'refresh' && this.updataConfiList();
    });
  }
  handleTableChange(page) {
    const { dispatch } = this.props;
    dispatch({
      type: 'permission/getList',
      payload: { page },
    });
  }

  delRole(id) {
    del({ member_id: id })
      .then(res => {
        if (!res.code) {
          this.updataConfiList();
        }
      })
  }
  userEdit(record, flag) {
    this.setState({ editDataSource: record, isEditPw: flag ? flag : false }, () => {
      this.onCloseEditModel();
    });
  }
  onCloseEditModel(refresh) {
    this.setState({ editVisible: !this.state.editVisible }, () => {
      refresh === 'refresh' && this.updataConfiList();
    });
  }

  lockHandle=(item,status)=>{
    const {id:member_id} = item;

    if(status==1){
      lockMember({ member_id })
      .then(res => {
        if (!res.code) {
          this.updataConfiList();
        }
      })
      return
    }
    unlockMember({ member_id })
      .then(res => {
        if (!res.code) {
          this.updataConfiList();
        }
      })
  }

  render() {
    const { data, roleList, statusList, keys, pathname } = this.props;
    const { addVisible, editVisible, editDataSource, isEditPw } = this.state;
    const columns = [
      {
        title: formatMessage({ id: 'app.permission.table.menberid' }),
        dataIndex: 'id',
        key: 'id',
      },
      {
        title: formatMessage({ id: 'app.permission.table.name' }),
        dataIndex: 'nickname',
        key: 'nickname',
      },
      {
        title: formatMessage({ id: 'app.permission.table.phone' }),
        dataIndex: 'email',
        key: 'email',
      },
      {
        title: formatMessage({ id: 'app.permission.table.role' }),
        dataIndex: 'role_names',
        key: 'role_names',
        render: text => {
          const roleNames = [];
          Object.keys(text).forEach((item, index) => {
            if (index === Object.keys(text).length - 1) {
              roleNames.push(<span key={item}>{text[item]}</span>);
            } else {
              roleNames.push(
                <span key={item}>
                  {text[item]}
                  <Divider type="vertical" />
                </span>
              );
            }
          });

          return roleNames;
        },
      },
      {
        title: formatMessage({ id: 'app.permission.table.status' }),
        dataIndex: 'status',
        key: 'status',
        render: text => {
          if (text == 2) {
            return (
              <span className="status-badge">
                {statusList[text]}
                <Badge status="warning" offset={[10, -8]} />
              </span>
            );
          } else {
            return (
              <span className="status-badge">
                {statusList[text]}
                <Badge status="success" offset={[10, -8]} />
              </span>
            );
          }
        },
      },
      {
        title: formatMessage({ id: 'app.permission.time' }),
        dataIndex: 'group',
        key: 'group',
        render: (text, record) => (
          <div>
            <p>
              {formatMessage({ id: 'app.role.creat-time' })}:{record.create_time}
            </p>
            <p>
              {formatMessage({ id: 'app.role.update-time' })}:{record.update_time}
            </p>
          </div>
        ),
      },
      {
        title: formatMessage({ id: 'app.image.table.operation' }),
        key: 'op',
        width: '250px',
        render: (text, record) => (
          <span>
            {/* {type(keys) == 'array' && keys.indexOf(getKey(pathname, operationEnum.edit)) > -1 && ( */}
              <a href="#" onClick={() => this.userEdit(record)}>
                {formatMessage({ id: 'app.permission.edit' })}
              </a>
            {/* )} */}
            <Divider type="vertical" />
            {/* {type(keys) == 'array' && keys.indexOf(getKey(pathname, operationEnum.edit)) > -1 && ( */}
              <a href="#" onClick={() => this.userEdit(record, true)}>
                {formatMessage({ id: 'app.permission.password' })}
              </a>
            {/* )} */}
            <Divider type="vertical" />
            {
              record.status==1&& (<a href="#" onClick={this.lockHandle.bind(this,record,record.status)}>
              {formatMessage({ id: 'app.permission.lock' })}
            </a>)
            }
            {
              record.status==2&& (<a href="#" className={styles.dengerColor} onClick={this.lockHandle.bind(this,record,record.status)}>
              {formatMessage({ id: 'app.permission.unlock' })}
            </a>)
            }
            <Divider type="vertical" />
            {/* {type(keys) == 'array' && keys.indexOf(getKey(pathname, operationEnum.del)) > -1 && ( */}
              <Popconfirm
                title={formatMessage({ id: 'app.image.makesure' })}
                onConfirm={() => this.delRole(record.id)}
              >
                <a href="#" className={styles.dengerColor}>
                  {formatMessage({ id: 'app.image.del' })}
                </a>
              </Popconfirm>
            {/* )} */}
          </span>
        ),
      },
    ];
    return (
      <div>
        <style>
          {`
            .status-badge .ant-badge-status-dot{
                height:8px;
                width:8px
            }
            `}
        </style>
        <div className={styles.breadcrumbBox}>
          <Breadcrumb>
            <Breadcrumb.Item>
              <Icon type="lock" />
              <span>{formatMessage({ id: 'menu.operation' })}</span>
            </Breadcrumb.Item>
            <Breadcrumb.Item>{formatMessage({ id: 'menu.system.permission' })}</Breadcrumb.Item>
          </Breadcrumb>
        </div>
        <div className={styles.addBtn}>
          <div>
            <Search
              placeholder={formatMessage({ id: 'app.permission.table.name' })}
              enterButton={formatMessage({ id: 'app.pages.search' })}
              size="default"
              onSearch={this.onSearch}
            />
          </div>
          <div className={styles.btnBox}>
            {/* {type(keys) == 'array' && keys.indexOf(getKey(pathname, operationEnum.add)) > -1 && ( */}
              <Button type="primary" onClick={this.addVisbleHandle}>
                {formatMessage({ id: 'app.permission.addaccount' })}
              </Button>
            {/* )} */}
          </div>
          <div />
          <div />
        </div>
        {/* {type(keys) == 'array' && keys.indexOf(getKey(pathname, operationEnum.select)) > -1 && ( */}
          <Table
            columns={columns}
            dataSource={data.data}
            pagination={false}
            bordered
            scroll={{ x: 1300 }}
            rowKey={(record, index) => `${record.id}${index}`}
          />
        {/* )} */}
        {/* {type(keys) == 'array' && keys.indexOf(getKey(pathname, operationEnum.select)) > -1 && ( */}
          <div className={styles.rightPagination}>
            <Pagination
               showTotal={total => formatMessage({ id: 'app.glob.pagetotal' },{total:total})}
              current={toParseInt(data.page)}
              pageSize={this.state.pagination.page_size}
              onChange={this.handleTableChange}
              total={toParseInt(data.total_count)}
            />
          </div>
        {/* )} */}
        {addVisible && <PermissionAdd visible={addVisible} onCallback={this.addVisbleHandle} />}
        {editVisible && (
          <PermissionEdit
            visible={editVisible}
            editDataSource={editDataSource}
            onCallback={this.onCloseEditModel}
            isEditPw={isEditPw}
          />
        )}
      </div>
    );
  }
}
export default Permission;

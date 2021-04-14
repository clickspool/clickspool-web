import { del,lockMember,unlockMember } from '@/services/permission';
import { type } from '@/utils/utils';
import  moment from 'moment';

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
import UsersEdit from './UsersEdit';

const Search = Input.Search;

function toParseInt(str) {
  if (str) {
    return parseInt(str || 0);
  }
  return 0;
}

@connect(
  ({
    permission: { roleList, statusList,memberList:data },
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
    // this.getEnumList().then(() => {
      this.updataConfiList();
    // });
  }

  onSearch(value) {
    this.setState(
      {
        pagination: { page: 1, uid: value.trim() },
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
      type: 'permission/fetchUserMemberList',
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
      type: 'permission/getPublisherList',
      payload: { page,page_size:20 },
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
        title: 'ID',
        dataIndex: 'id',
        key: 'id',
      },
      {
        title: 'User Name',
        dataIndex: 'user_name',
        key: 'user_name',
      },
      {
        title: 'User coins',
        dataIndex: 'user_coins',
        key: 'user_coins',
      },
      {
        title: 'User type',
        dataIndex: 'user_type',
        key: 'user_type',
        render:(text)=>{
          return text==1?'Email':'Other'
        }
      },
      {
        title: 'Google user id',
        dataIndex: 'google_user_id',
        key: 'google_user_id',
      },
      {
        title: 'Facebook bussiness id',
        dataIndex: 'facebook_bussiness_id',
        key: 'facebook_bussiness_id',
      },
      {
        title: 'User email',
        dataIndex: 'user_mail',
        key: 'user_mail',
      },
      {
        title: 'User sex',
        dataIndex: 'user_sex',
        key: 'user_sex',
      },
      {
        title: 'User birthday',
        dataIndex: 'user_birth',
        key: 'user_birth',
      },
      {
        title: 'User birthday',
        dataIndex: 'user_birth',
        key: 'user_birth',
      },
      {
        title: 'User invite code',
        dataIndex: 'user_invite_code',
        key: 'user_invite_code',
      },
      {
        title: 'Register IP',
        dataIndex: 'reg_ip',
        key: 'reg_ip',
      },
      {
        title: 'Register time',
        dataIndex: 'reg_time',
        key: 'reg_time',
        render:(text)=>{
          return moment(~~`${text}000`).format('YYYY-MM-DD HH:mm:ss')
        }
      },
      {
        title: 'Login time',
        dataIndex: 'login_time',
        key: 'login_time',
        render:(text)=>{
          return moment(~~`${text}000`).format('YYYY-MM-DD HH:mm:ss')
        }
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
        <Breadcrumb style={{borderBottom:' 1px solid #ccc',paddingBottom:' 10px'}}>
            <Breadcrumb.Item>
              <Icon type="user" />
              <span>{formatMessage({ id: 'menu.opUser' })}</span>
            </Breadcrumb.Item>
            {/* <Breadcrumb.Item>{formatMessage({ id: 'menu.opUser' })}</Breadcrumb.Item> */}
          </Breadcrumb>
        </div>
        <div className={styles.addBtn}>
          <div>
            <Search
              placeholder={'User ID'}
              enterButton={formatMessage({ id: 'app.pages.search' })}
              size="default"
              onSearch={this.onSearch}
            />
          </div>
          <div className={styles.btnBox}>
            {/* {type(keys) == 'array' && keys.indexOf(getKey(pathname, operationEnum.add)) > -1 && ( */}
              {/* <Button type="primary" onClick={this.addVisbleHandle}>
                {formatMessage({ id: 'app.permission.addaccount' })}
              </Button> */}
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
        {editVisible && (
          <UsersEdit
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

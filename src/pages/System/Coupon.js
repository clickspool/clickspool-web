import { del,lockMember,unlockMember } from '@/services/permission';
import { type } from '@/utils/utils';
import  moment from 'moment';
import CouponEdit from './CouponEdit';

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
    permission: { roleList, statusList,couponList:data },
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
        pagination: { page: 1, id: value.trim() },
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
      type: 'permission/fetchCouponList',
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
    const { data, roleList, statusList, keys, pathname , dispatch} = this.props;
    const { addVisible, editVisible, editDataSource, isEditPw } = this.state;
    const columns = [
      {
        title: 'ID',
        dataIndex: 'id',
        key: 'id',
      },
      {
        title: 'Coupon title',
        dataIndex: 'coupon_title',
        key: 'coupon_title',
      },
      {
        title: 'Coupon state',
        dataIndex: 'coupon_state',
        key: 'coupon_state',
      },
      {
        title: 'Coupon amount',
        dataIndex: 'coupon_amount',
        key: 'coupon_amount',
      },
      {
        title: 'Coupon code',
        dataIndex: 'coupon_code',
        key: 'coupon_code',
      },
      {
        title: 'Coins expire time',
        dataIndex: 'coins_expire_time',
        key: 'coins_expire_time',
      },
      {
        title: 'Coupon coins',
        dataIndex: 'coupon_coins',
        key: 'coupon_coins',
      },
      {
        title: 'Created time',
        dataIndex: 'created_at',
        key: 'created_at',
      },
      {
        title: 'Updated time',
        dataIndex: 'updated_at',
        key: 'updated_at',
      },
      {
        title: 'Operation',
        dataIndex: 'operation',
        key: 'operation',
        fixed: 'right',
        width:'150px',
        render:(text,record)=>{
          return <Button type="link"
            onClick={()=>{
              dispatch({
                type:'permission/update',
                payload:{
                  coupon:record
                }
              });
              setTimeout(()=>{
                this.setState({
                  editVisible:true
                })
              })
            }}
          >Edit</Button>
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
              placeholder={'Coupon id'}
              enterButton={formatMessage({ id: 'app.pages.search' })}
              size="default"
              onSearch={this.onSearch}
            />
            
          </div>
          <div className={styles.btnBox}>
            <Button type="primary" style={{marginLeft:'8px'}}
              onClick={()=>{
                dispatch({
                  type:'permission/update',
                  payload:{
                    coupon:{}
                  }
                });
                setTimeout(()=>{
                  this.setState({
                    editVisible:true
                  })
                })
              }}
            
            >Add Coupon</Button>
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
            scroll={{ x: 2600 }}
            rowKey={(record, index) => `${record.id}${index}`}
          />
        {/* )} */}
        {/* {type(keys) == 'array' && keys.indexOf(getKey(pathname, operationEnum.select)) > -1 && ( */}
          <div className={styles.rightPagination}>
            <Pagination
               showTotal={total => formatMessage({ id: 'app.glob.pagetotal' },{total:total})}
              current={toParseInt(data.page)}
              pageSize={this.state.pagination.page_size||20}
              onChange={this.handleTableChange}
              total={toParseInt(data.total_count)}
            />
          </div>
        {/* )} */}
        {editVisible && (
          <CouponEdit close={(r)=>{
            if(r){
              this.updataConfiList();
            }
            this.setState({
              editVisible:false
            })
          }}/>
        )}
      </div>
    );
  }
}
export default Permission;

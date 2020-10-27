import { del } from '@/services/role';
import { type } from '@/utils/utils';

import { connect } from 'dva';

import { Input, Breadcrumb, Icon, Button, Pagination, Divider, Table, Popconfirm } from 'antd';

import React, { PureComponent } from 'react';

import { formatMessage } from 'umi/locale';
import router from 'umi/router';

import { operationEnum, getKey } from '../../../config/role.enum';

import styles from './Role.less';

const Search = Input.Search;

function toParseInt(str) {
  if (str) {
    return parseInt(str || 0);
  }
  return 0;
}

@connect(
  ({
    role: {
      data: { data, page, total_count },
    },
    routing: {
      location: { pathname },
    },
    memberInfo: {
      data: { keys },
    },
  }) => ({
    data,
    page,
    total_count,
    keys,
    pathname,
  })
)
class Role extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      pagination: { total_page: props.total_page, page: props.page, page_size: 20 },
    };
    this.updataConfiList = this.updataConfiList.bind(this);
    this.onSearch = this.onSearch.bind(this);
    this.addGlob = this.addGlob.bind(this);
    this.handleTableChange = this.handleTableChange.bind(this);
    this.delRole = this.delRole.bind(this);
  }
  componentDidMount() {
    this.updataConfiList();
  }

  onSearch(value) {
    const { pagination } = this.state;
    this.setState(
      {
        pagination: Object.assign({}, pagination, { page: 1, name: value.trim() }),
      },
      () => {
        this.updataConfiList();
      }
    );
  }

  updataConfiList() {
    const { dispatch } = this.props;
    const { pagination } = this.state;
    dispatch({
      type: 'role/getList',
      payload: pagination,
    });
  }
  addGlob() {
    router.push('/system/role/add');
  }
  handleTableChange(page) {
    const { dispatch } = this.props;
    dispatch({
      type: 'image/getList',
      payload: { page },
    });
  }

  delRole(id) {
    del({ role_id: id })
      .then(res => {
        if (!res.code) {
          this.updataConfiList();
        }
      })
      .catch(e => {
      });
  }
  roleEdit(record) {
    router.push(`/system/role/edit/${record.id}`);
  }

  render() {
    const { data, page, total_count, keys, pathname } = this.props;

    const columns = [
      {
        title: formatMessage({ id: 'app.role.rolename' }),
        dataIndex: 'name',
        key: 'name',
      },
      {
        title: formatMessage({ id: 'app.role.data' }),
        dataIndex: 'group',
        key: 'group',
        render: (text, record) => (
          <div>
            <p>
              {formatMessage({ id: 'app.role.creat-time' })}:{record.create_at}
            </p>
            <p>
              {formatMessage({ id: 'app.role.update-time' })}:{record.update_at}
            </p>
          </div>
        ),
      },
      {
        title: formatMessage({ id: 'app.image.table.operation' }),
        key: 'operation',
        width: '150px',
        render: (text, record) => (
          <span>
            {type(keys) == 'array' && keys.indexOf(getKey(pathname, operationEnum.edit)) > -1 && (
              <a href="#" onClick={() => this.roleEdit(record)}>
                {formatMessage({ id: 'app.image.edit' })}
              </a>
            )}
            <Divider type="vertical" />
            {type(keys) == 'array' && keys.indexOf(getKey(pathname, operationEnum.del)) > -1 && (
              <Popconfirm
                title={formatMessage({ id: 'app.image.makesure' })}
                onConfirm={() => this.delRole(record.id)}
              >
                <a href="#" className={styles.dengerColor}>
                  {formatMessage({ id: 'app.image.del' })}
                </a>
              </Popconfirm>
            )}
          </span>
        ),
      },
    ];
    return (
      <div>
        <div className={styles.breadcrumbBox}>
          <Breadcrumb>
            <Breadcrumb.Item>
              <Icon type="lock" />
              <span>{formatMessage({ id: 'menu.system' })}</span>
            </Breadcrumb.Item>
            <Breadcrumb.Item>{formatMessage({ id: 'menu.system.role' })}</Breadcrumb.Item>
          </Breadcrumb>
        </div>
        <div className={styles.addBtn}>
          <div>
            <Search
              placeholder={formatMessage({ id: 'app.role.rolename' })}
              enterButton={formatMessage({ id: 'app.pages.search' })}
              size="default"
              onSearch={this.onSearch}
            />
          </div>
          <div className={styles.btnBox}>
            {type(keys) == 'array' && keys.indexOf(getKey(pathname, operationEnum.add)) > -1 && (
              <Button type="primary" onClick={this.addGlob}>
                {formatMessage({ id: 'app.versions.add' })}
              </Button>
            )}
          </div>
          <div />
          <div />
        </div>
        <Table
          columns={columns}
          dataSource={data}
          pagination={false}
          bordered
          scroll={{ x: 1300 }}
          rowKey={(record, index) => `${record.id}${index}`}
        />
        <div className={styles.rightPagination}>
          <Pagination
             showTotal={total => formatMessage({ id: 'app.glob.pagetotal' },{total:total})}
            current={toParseInt(page)}
            pageSize={this.state.pagination.page_size}
            onChange={this.handleTableChange}
            total={toParseInt(total_count)}
          />
        </div>
      </div>
    );
  }
}
export default Role;

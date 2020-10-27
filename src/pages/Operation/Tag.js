import { del } from '@/services/tag';
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

import styles from './Group.less';
import TagAdd from './TagAdd';
import TagEdit from './TagEdit';

const Search = Input.Search;

function toParseInt(str) {
  if (str) {
    return parseInt(str || 0);
  }
  return 0;
}

@connect(
  ({
    tags: {
      data: { data, page, total_count },
      statusList,
    },
    routing: {
      location: { pathname },
    },
    memberInfo: {
      data: { keys },
    },
  }) => ({
    statusList,
    data,
    page,
    total_count,
    keys,
    pathname,
  })
)
class Tag extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      pagination: { page_size: 20, page: props.page, total_count: props.total_count },
      addVisible: false,
      editVisible: false,
      editDataSource: {},
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
      type: 'tags/getTagStatusList',
      payload: {},
    }).then(() => {
      dispatch({
        type: 'tags/getList',
        payload: pagination,
      });
    });
  }
  addVisbleHandle(refresh) {
    this.setState({ addVisible: !this.state.addVisible }, () => {
      refresh === 'refresh' && this.updataConfiList();
    });
  }
  handleTableChange(page) {
    const { pagination } = this.state;
    this.setState(
      {
        pagination: Object.assign({}, pagination, { page }),
      },
      () => {
        this.updataConfiList();
      }
    );
  }

  delRole(id) {
    del({ id })
      .then(res => {
        if (!res.code) {
          this.updataConfiList();
        }
      })
      .catch(e => {
        console.log(e);
      });
  }
  userEdit(record) {
    this.setState({ editDataSource: record }, () => {
      this.onCloseEditModel();
    });
  }
  onCloseEditModel(refresh) {
    this.setState({ editVisible: !this.state.editVisible }, () => {
      refresh === 'refresh' && this.updataConfiList();
    });
  }

  render() {
    const { data, page, total_count, roleList, statusList, keys, pathname } = this.props;
    const { addVisible, editVisible, editDataSource } = this.state;
    const columns = [
      {
        title: 'id',
        dataIndex: 'id',
        key: 'id',
      },
      {
        title: formatMessage({ id: 'app.group.table.name' }),
        dataIndex: 'name',
        key: 'name',
      },
      {
        title: formatMessage({ id: 'app.group.table.des' }),
        dataIndex: 'description',
        key: 'description',
        render: (text, record) => {
          if (!text) {
            return ' ';
          }
          return `${text}`;
        },
      },
      {
        title: formatMessage({ id: 'app.image.table.create_time' }),
        dataIndex: 'create_at',
        key: 'create_at',
      },
      {
        title: formatMessage({ id: 'app.image.table.update_time' }),
        dataIndex: 'update_at',
        key: 'update_at',
      },
      {
        title: formatMessage({ id: 'app.group.table.sort' }),
        dataIndex: 'sort',
        key: 'sort',
      },
      {
        title: formatMessage({ id: 'app.image.table.status' }),
        dataIndex: 'status',
        key: 'status',
        render: text => {
          return statusList[text];
        },
      },
      {
        title: formatMessage({ id: 'app.image.table.operation' }),
        key: 'operation',
        width: '250px',
        render: (text, record) => (
          <span>
            {type(keys) == 'array' && keys.indexOf(getKey(pathname, operationEnum.edit)) > -1 && (
              <a href="#" onClick={() => this.userEdit(record)}>
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
            <Breadcrumb.Item>{formatMessage({ id: 'menu.operation.group' })}</Breadcrumb.Item>
          </Breadcrumb>
        </div>
        <div className={styles.addBtn}>
          <div>
            <Search
              placeholder={formatMessage({ id: 'app.glob.pleaseInputGroupName' })}
              enterButton={formatMessage({ id: 'app.pages.search' })}
              size="default"
              onSearch={this.onSearch}
            />
          </div>
          <div className={styles.btnBox}>
            {type(keys) == 'array' && keys.indexOf(getKey(pathname, operationEnum.add)) > -1 && (
              <Button type="primary" onClick={this.addVisbleHandle}>
                {formatMessage({ id: 'app.versions.add' })}
              </Button>
            )}
          </div>
          <div />
          <div />
        </div>
        {type(keys) == 'array' && keys.indexOf(getKey(pathname, operationEnum.select)) > -1 && (
          <Table
            columns={columns}
            dataSource={data}
            pagination={false}
            bordered
            scroll={{ x: 1300 }}
            rowKey={(record, index) => `${record.id}${index}`}
          />
        )}
        {type(keys) == 'array' && keys.indexOf(getKey(pathname, operationEnum.select)) > -1 && (
          <div className={styles.rightPagination}>
            <Pagination
               showTotal={total => formatMessage({ id: 'app.glob.pagetotal' },{total:total})}
              current={toParseInt(page)}
              pageSize={this.state.pagination.page_size}
              onChange={this.handleTableChange}
              total={toParseInt(total_count)}
            />
          </div>
        )}
        {addVisible && <TagAdd visible={addVisible} onCallback={this.addVisbleHandle} />}
        {editVisible && (
          <TagEdit
            visible={editVisible}
            editDataSource={editDataSource}
            onCallback={this.onCloseEditModel}
          />
        )}
      </div>
    );
  }
}
export default Tag;

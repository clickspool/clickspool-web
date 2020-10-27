import { del } from '@/services/image';
import { type } from '@/utils/utils';

import { connect } from 'dva';

import {
  Input,
  Breadcrumb,
  Icon,
  Button,
  Pagination,
  Divider,
  Tag,
  Table,
  Popconfirm,
  Popover,
  message,
} from 'antd';

import React, { PureComponent } from 'react';

import _ from 'lodash';

import { formatMessage } from 'umi/locale';

import copy from 'copy-to-clipboard';

import { operationEnum, getKey } from '../../../config/role.enum';

import styles from './Image.less';
import ImageAdd from './ImageAdd';
import ImageEdit from './ImageEdit';

const Search = Input.Search;

function getGroupName(source, id) {
  if (type(source) === 'array') {
    return source.filter(item => {
      return item.id === id;
    });
  }
  return [{}];
}
function toParseInt(str) {
  if (str) {
    return parseInt(str || 0);
  }
  return 0;
}
function getStatus(index) {
  const arr = [
    formatMessage({ id: 'app.config.forbid' }),
    formatMessage({ id: 'app.config.start' }),
  ];
  return arr[index];
}

@connect(
  ({
    image: { data, source, editModel, addVisibleModel },
    routing: {
      location: { pathname },
    },
    memberInfo: {
      data: { keys },
    },
  }) => ({
    data,
    source,
    editModel,
    addVisibleModel,
    keys,
    pathname,
  })
)
class Image extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      pagination: {
        page: 1,
        page_size: 20,
      },
    };
    this.updataConfiList = this.updataConfiList.bind(this);
    this.onSearch = this.onSearch.bind(this);
    this.addGlob = this.addGlob.bind(this);
    this.handleTableChange = this.handleTableChange.bind(this);
    this.delImage = this.delImage.bind(this);
  }
  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'image/getSource',
    });
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
      type: 'image/getList',
      payload: pagination,
    });
  }
  addGlob() {
    const { dispatch } = this.props;
    dispatch({
      type: 'image/addModelVisbleStatus',
      payload: { addVisibleModel: true },
    });
  }
  handleTableChange(page) {
    const { dispatch } = this.props;
    dispatch({
      type: 'image/getList',
      payload: { page },
    });
  }

  delImage(id) {
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
  imageEdit(record) {
    const { dispatch } = this.props;

    dispatch({
      type: 'image/editInfoStatus',
      payload: { ...record },
    });
    dispatch({
      type: 'image/editModelVisbleStatus',
      payload: { editModel: true },
    });
  }
  copyImageLink = url => {
    copy(url);
    message.success(formatMessage({ id: 'app.glob.copysucc' }));
  };

  render() {
    const { data, source, editModel, addVisibleModel, keys, pathname } = this.props;
    const { breadcrumb } = this.state;
    const columns = [
      {
        title: 'ID',
        dataIndex: 'id',
        key: 'id',
        width: '80px',
      },
      {
        title: formatMessage({ id: 'app.image.table.groupID' }),
        dataIndex: 'group',
        key: 'group',
        width: '80px',
      },
      {
        title: formatMessage({ id: 'app.image.table.groupName' }),
        dataIndex: 'group_name',
        key: 'group_name',
        width: '150px',
        render: (text, record) => {
          if (getGroupName(source, record.group)[0]) {
            return getGroupName(source, record.group)[0]['name'] || '';
          }
          return '';
        },
      },
      {
        title: formatMessage({ id: 'app.image.table.sort' }),
        dataIndex: 'sort',
        key: 'sort',
        width: '150px',
      },
      // {
      //   title: formatMessage({ id: 'app.image.table.groupDes' }),
      //   dataIndex: 'group_des',
      //   key: 'group_des',
      //   width: '150px',
      //   render: (text, record) => {
      //     if (getGroupName(source, record.group)[0]) {
      //       return getGroupName(source, record.group)[0]['note'] | '';
      //     }
      //     return '';
      //   },
      // },
      {
        title: formatMessage({ id: 'app.image.table.name' }),
        dataIndex: 'name',
        key: 'name',
        width: '150px',
      },
      {
        title: formatMessage({ id: 'app.image.table.note' }),
        dataIndex: 'note',
        key: 'note',
        width: '150px',
      },
      {
        title: formatMessage({ id: 'app.image.table.picture_url' }),
        dataIndex: 'picture_url',
        key: 'picture_url',
        width: '150px',
        render: picture => (
          <Popover content={formatMessage({ id: 'app.glob.copyOnclick' })}>
            <div
              className={styles.imageWidthBox}
              onClick={() => {
                this.copyImageLink(picture);
              }}
            >
              <img className={styles.imageWidth} src={picture} />
            </div>
          </Popover>
        ),
      },
      {
        title: formatMessage({ id: 'app.image.table.link_url' }),
        dataIndex: 'link_url',
        width: '150px',
        key: 'link_url',
      },
      {
        title: formatMessage({ id: 'app.image.table.status' }),
        dataIndex: 'status',
        key: 'status',
        width: '80px',
        render: text => {
          return getStatus(text);
        },
      },
      {
        title: formatMessage({ id: 'app.image.table.data' }),
        dataIndex: 'data',
        width: '230px',
        key: 'data',
        render: text => {
          return text || '';
        },
      },
      {
        title: formatMessage({ id: 'app.image.table.start_time' }),
        dataIndex: 'start_time',
        width: '150px',
        key: 'start_time',
      },
      {
        title: formatMessage({ id: 'app.image.table.end_time' }),
        dataIndex: 'end_time',
        width: '150px',
        key: 'end_time',
      },
      {
        title: formatMessage({ id: 'app.image.table.operation' }),
        key: 'operation',
        width: '150px',
        // fixed: 'right',
        render: (text, record) => (
          <span>
            {type(keys) == 'array' && keys.indexOf(getKey(pathname, operationEnum.edit)) > -1 && (
              <a href="#" onClick={() => this.imageEdit(record)}>
                {formatMessage({ id: 'app.image.edit' })}
              </a>
            )}
            <Divider type="vertical" />
            {type(keys) == 'array' && keys.indexOf(getKey(pathname, operationEnum.del)) > -1 && (
              <Popconfirm
                title={formatMessage({ id: 'app.image.makesure' })}
                onConfirm={() => this.delImage(record.id)}
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
              <span>{formatMessage({ id: 'menu.operation' })}</span>
            </Breadcrumb.Item>
            <Breadcrumb.Item>{formatMessage({ id: 'menu.operation.image' })}</Breadcrumb.Item>
          </Breadcrumb>
        </div>
        <div className={styles.addBtn}>
          <div>
            {type(keys) == 'array' && keys.indexOf(getKey(pathname, operationEnum.select)) > -1 && (
              <Search
                placeholder={formatMessage({ id: 'app.glob.pleaseInputName' })}
                enterButton={formatMessage({ id: 'app.pages.search' })}
                size="default"
                onSearch={this.onSearch}
              />
            )}
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
        {type(keys) == 'array' && keys.indexOf(getKey(pathname, operationEnum.select)) > -1 && (
          <Table
            columns={columns}
            dataSource={data.list}
            pagination={false}
            bordered
            rowKey={(record, index) => `${record.id}${index}`}
            scroll={{ x: 1300 }}
          />
        )}
        {type(keys) == 'array' && keys.indexOf(getKey(pathname, operationEnum.select)) > -1 && (
          <div className={styles.rightPagination}>
            <Pagination
               showTotal={total => formatMessage({ id: 'app.glob.pagetotal' },{total:total})}
              current={toParseInt(data.page)}
              pageSize={this.state.pagination.page_size}
              onChange={this.handleTableChange}
              total={toParseInt(data.total_count)}
            />
          </div>
        )}
        {editModel && <ImageEdit visible={editModel} />}
        {addVisibleModel && <ImageAdd visible={addVisibleModel} />}
      </div>
    );
  }
}
export default Image;

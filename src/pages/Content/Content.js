import * as contentapi from '@/services/content';
import { getList } from '@/services/tag';
import { type, removeObjUndefined } from '@/utils/utils';

import { connect } from 'dva';

import {
  message,
  Input,
  Breadcrumb,
  Icon,
  Button,
  Pagination,
  Table,
  Modal,
  Form,
  Row,
  Col,
  Card,
  Select,
  DatePicker,
  Tag,
} from 'antd';

import React, { PureComponent } from 'react';

import _ from 'lodash';

import { formatMessage } from 'umi/locale';
import router from 'umi/router';

import { operationEnum, getKey } from '../../../config/role.enum';

import styles from './Content.less';
import ContentEdit from './ContentEdit';

const { Option } = Select;
const { RangePicker } = DatePicker;
const Search = Input.Search;
const moment = require('moment');
function toParseInt(str) {
  if (str) {
    return parseInt(str || 0);
  }
  return 0;
}

const btnStatus = {
  onlineBtn: true,
  offlineBtn: true,
  delBtn: true,
};

@Form.create()
@connect(
  ({
    content: {
      data: { data, page, total_count },
      statusList,
      sourceList,
      catesList,
      contentTags,
      adminContentCates,
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
    statusList,
    sourceList,
    catesList,
    contentTags,
    adminContentCates,
    pathname,
    keys,
  })
)
class Content extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      pagination: {
        page: 1,
        page_size: 20,
        order_by: 'update_at desc',
        type: '',
        status: '',
        name: '',
        id: '',
        type: '',
        online_start_date: '',
        online_end_date: '',
        start_date: '',
        end_date: '',
      },
      cateStatus: '0',
      selectedRowKeys: [],
      visible: false,
      categoryVisible: false,
      editSource: {},
      adminTagList: [],
      btnStatus,
    };
    this.updataConfiList = this.updataConfiList.bind(this);
    this.handleTableChange = this.handleTableChange.bind(this);
    this.confirm = this.confirm.bind(this);
    this.onSelectChange = this.onSelectChange.bind(this);
    this.categoryModel = this.categoryModel.bind(this);
    this.handleChangeCate = this.handleChangeCate.bind(this);
    this.okModalCate = this.okModalCate.bind(this);
    this.hideModalCate = this.hideModalCate.bind(this);
  }
  componentDidMount() {
    const { dispatch } = this.props;
    this.updataConfiList();
    dispatch({
      type: 'content/getContentSourceList',
    });
    dispatch({
      type: 'content/getContentStatusList',
    });
    dispatch({
      type: 'content/getContentCates',
      payload: {},
    });
    dispatch({
      type: 'content/getContentTags',
      payload: {},
    });
    dispatch({
      type: 'content/getAdminContentCates',
      payload: {},
    });
    getList({ page_size: 10000, page: 1, status: 1 }).then(res => {
      try {
        this.state.adminTagList = res.data.data || [];
      } catch (error) {
        this.state.adminTagList = [];
      }
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
  contentEdit(record) {
    this.setState({ visible: true, editSource: record });
  }
  onSelectChange(selectedRowKeys) {
    this.setState({ selectedRowKeys });
  }
  onCloseDrawer = () => {
    this.setState({ visible: false });
    this.updataConfiList();
  };

  updataConfiList() {
    const { dispatch } = this.props;
    const { pagination } = this.state;
    return dispatch({
      type: 'content/getList',
      payload: pagination,
    });
  }
  categoryModel() {
    const { categoryVisible, selectedRowKeys } = this.state;
    const { data } = this.props;
    // if(!selectedRowKeys.length||selectedRowKeys.length>1){
    //   message.error(`${formatMessage({id:'app.glob.onlyOne'})}`);
    //   return
    // }
    // const cateStatus = data.filter((item)=>{
    //   return item.id==this.state.selectedRowKeys[0]
    //   })[0].type;

    this.setState({
      categoryVisible: !categoryVisible,
      // cateStatus
    });
  }
  confirm(api, content) {
    const { selectedRowKeys } = this.state;
    // if(!selectedRowKeys.length){
    //   message.error(`${formatMessage({id:'app.content.none'})}${content}${formatMessage({id:'app.content.element'})}`);
    //   return
    // }
    Modal.confirm({
      title: formatMessage({ id: 'app.content.tips' }),
      content: `${formatMessage({ id: 'app.content.confirm' })}${content}?`,
      okText: formatMessage({ id: 'app.content.confirm' }),
      cancelText: formatMessage({ id: 'app.content.cancel' }),
      onOk: close => {
        contentapi[api]({ id: selectedRowKeys.join(',') }).then(res => {
          if (res && !res.code) {
            this.updataConfiList().then(() => {
              close();
              this.setState({ selectedRowKeys: [] });
            });
          }
        });
      },
    });
  }
  handleChangeCate(value) {
    this.setState(
      {
        cateStatus: value,
      },
      () => {}
    );
  }
  okModalCate() {
    contentapi
      .contentCateChange({
        content_id: this.state.selectedRowKeys.join(','),
        type: this.state.cateStatus,
      })
      .then(res => {
        if (res && !res.code) {
          this.updataConfiList();
          this.setState({
            categoryVisible: false,
            selectedRowKeys: [],
            cateStatus: '0',
          });
        }
      });
  }
  hideModalCate() {
    const { categoryVisible } = this.state;

    this.setState({
      categoryVisible: !categoryVisible,
    });
  }
  SearchResetBtnHandle = () => {
    const { pagination } = this.state;
    this.props.form.resetFields();
    this.setState(
      {
        pagination: {
          page: 1,
          page_size: 20,
          order_by: 'update_at desc',
          type: '',
          status: '',
          name: '',
          id: '',
          type: '',
        },
      },
      () => {
        this.updataConfiList();
      }
    );
  };

  SearchBtnHandle = () => {
    this.props.form.validateFields((err, values) => {
      const { pagination } = this.state;
      let time = {};
      if (values.pushtime && type(values.pushtime) === 'array') {
        time = {
          online_start_date: moment(values.pushtime[0]).format('YYYY-MM-DD'),
          online_end_date: moment(values.pushtime[1]).format('YYYY-MM-DD'),
        };
      }
      if (values.checktime && type(values.checktime) === 'array') {
        time = Object.assign({}, time, {
          start_date: moment(values.checktime[0]).format('YYYY-MM-DD'),
          end_date: moment(values.checktime[0]).format('YYYY-MM-DD'),
        });
      }

      if (values.status == '1') {
        this.setState({
          btnStatus: Object.assign({}, btnStatus, { onlineBtn: false }),
        });
      }
      if (values.status == '2') {
        this.setState({
          btnStatus: Object.assign({}, btnStatus, { offlineBtn: false }),
        });
      }
      if (values.status == '3') {
        this.setState({
          btnStatus: Object.assign({}, btnStatus, { delBtn: false }),
        });
      }

      this.setState(
        {
          pagination: Object.assign({}, pagination, removeObjUndefined(values), {
            page: 1,
            ...time,
          }),
        },
        () => {
          this.updataConfiList();
        }
      );
    });
  };

  selectUpdateTime = val => {
    const { pagination } = this.state;
    this.setState(
      {
        pagination: Object.assign({}, pagination, { order_by: val.key }),
      },
      () => {
        this.updataConfiList();
      }
    );
  };

  render() {
    const {
      data,
      page,
      total_count,
      sourceList,
      statusList,
      catesList,
      adminContentCates,
      form: { getFieldDecorator },
      keys,
      pathname,
    } = this.props;
    const { selectedRowKeys, visible, categoryVisible, editSource, btnStatus } = this.state;
    const { handleChangeCate } = this;
    const rowSelection = {
      selectedRowKeys,
      onChange: this.onSelectChange,
    };
    const columns = [
      {
        title: formatMessage({ id: 'app.content.contentId' }),
        dataIndex: 'id',
        key: 'id',
      },
      {
        title: formatMessage({ id: 'app.content.content_pic' }),
        dataIndex: 'covers',
        key: 'covers',
        width: '150px',
        render: text => (
          <div style={{ width: '150px', height: '225px', overflow: 'hidden' }}>
            <img src={text} style={{ width: '150px' }} />
          </div>
        ),
      },
      {
        title: formatMessage({ id: 'app.content.title' }),
        dataIndex: 'name',
        key: 'name',
        render: (text, record) => (
          <p key={text}>
            {record.is_top == '1' && (
              <Tag color="green">{formatMessage({ id: 'app.model.settingTop' })}</Tag>
            )}
            {text}
          </p>
        ),
      },
      {
        title: formatMessage({ id: 'app.content.content_category' }),
        dataIndex: 'type_name',
        key: 'type_name',
      },
      {
        title: formatMessage({ id: 'app.content.content_source' }),
        dataIndex: 'source_name',
        key: 'source_name',
      },
      {
        title: formatMessage({ id: 'app.content.content_date' }),
        dataIndex: 'update_at',
        key: 'update_at',
        render: (text, record) => (
          <div>
            {/* <p>{formatMessage({id:'app.content.check'})}:</p> */}
            <p>
              {formatMessage({ id: 'app.content.online' })}:{text}
            </p>
          </div>
        ),
      },
      {
        title: formatMessage({ id: 'app.content.status' }),
        dataIndex: 'status',
        key: 'status',
        render: (text, record) => statusList[text],
      },
      {
        title: formatMessage({ id: 'app.image.table.operation' }),
        key: 'operation',
        width: '250px',
        render: (text, record) => (
          <span>
            {type(keys) == 'array' && keys.indexOf(getKey(pathname, operationEnum.edit)) > -1 && (
              <a href="#" onClick={() => this.contentEdit(record)}>
                {formatMessage({ id: 'app.image.edit' })}
              </a>
            )}
          </span>
        ),
      },
    ];
    return (
      <div className="content-box">
        <style>
          {`
            .content-box .ant-form-vertical .ant-form-item{
              padding-bottom: 0px;
            }
          `}
        </style>
        <div className={styles.breadcrumbBox}>
          <Breadcrumb>
            <Breadcrumb.Item>
              <Icon type="lock" />
              <span>{formatMessage({ id: 'menu.content' })}</span>
            </Breadcrumb.Item>
            <Breadcrumb.Item>{formatMessage({ id: 'menu.content.ct' })}</Breadcrumb.Item>
          </Breadcrumb>
        </div>
        <div className={styles.addBtn}>
          <Card title={formatMessage({ id: 'menu.content.ct' })} className={styles.card} bordered>
            <Form layout="vertical" hideRequiredMark>
              <Row gutter={16}>
                <Col lg={6} md={12} sm={24}>
                  <Form.Item label={formatMessage({ id: 'app.content.publicTime' })}>
                    {getFieldDecorator('pushtime')(
                      <RangePicker
                        placeholder={[
                          formatMessage({ id: 'app.content.publicStartTime' }),
                          formatMessage({ id: 'app.content.publicEndTime' }),
                        ]}
                        style={{ width: '100%' }}
                      />
                    )}
                  </Form.Item>
                </Col>
                <Col xl={{ span: 6, offset: 2 }} lg={{ span: 8 }} md={{ span: 12 }} sm={24}>
                  <Form.Item label={formatMessage({ id: 'app.content.checkTime' })}>
                    {getFieldDecorator('checktime')(
                      <RangePicker
                        placeholder={[
                          formatMessage({ id: 'app.content.checkStartTime' }),
                          formatMessage({ id: 'app.content.checkEndTime' }),
                        ]}
                        style={{ width: '100%' }}
                      />
                    )}
                  </Form.Item>
                </Col>
                <Col xl={{ span: 8, offset: 2 }} lg={{ span: 10 }} md={{ span: 24 }} sm={24}>
                  <Form.Item label={formatMessage({ id: 'app.content.content_source' })}>
                    {getFieldDecorator('source', {
                      initialValue: '',
                    })(
                      <Select>
                        <Option value="">{formatMessage({ id: 'app.content.allSource' })}</Option>
                        {Object.keys(sourceList).map(item => {
                          return (
                            <Option key={item} value={item}>
                              {sourceList[item]}
                            </Option>
                          );
                        })}
                      </Select>
                    )}
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={16}>
                <Col lg={6} md={12} sm={24}>
                  <Form.Item label={formatMessage({ id: 'app.content.content_category' })}>
                    {getFieldDecorator('type', {
                      initialValue: '',
                    })(
                      <Select>
                        <Option value="">{formatMessage({ id: 'app.content.allcates' })}</Option>
                        {Object.keys(catesList).map(item => {
                          return (
                            <Option key={item} value={item}>
                              {catesList[item]}
                            </Option>
                          );
                        })}
                      </Select>
                    )}
                  </Form.Item>
                </Col>
                <Col lg={{ span: 8 }} xl={{ span: 6, offset: 2 }} md={{ span: 12 }} sm={24}>
                  <Form.Item label={formatMessage({ id: 'app.content.status' })}>
                    {getFieldDecorator('status', {
                      initialValue: '',
                    })(
                      <Select>
                        <Option value="">{formatMessage({ id: 'app.content.allstatus' })}</Option>
                        {Object.keys(statusList).map(item => {
                          return (
                            <Option key={item} value={item}>
                              {statusList[item]}
                            </Option>
                          );
                        })}
                      </Select>
                    )}
                  </Form.Item>
                </Col>
                <Col lg={{ span: 10 }} xl={{ span: 8, offset: 2 }} md={{ span: 24 }} sm={24}>
                  <Form.Item label={formatMessage({ id: 'app.content.inputContentId' })}>
                    {getFieldDecorator('id')(
                      <Input
                        placeholder={formatMessage({ id: 'app.content.pleaseInputContentId' })}
                      />
                    )}
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={16}>
                <Col lg={6} md={12} sm={24}>
                  <Form.Item label={formatMessage({ id: 'app.content.title' })}>
                    {getFieldDecorator('name')(
                      <Input
                        placeholder={formatMessage({ id: 'app.content.pleaseInputContentName' })}
                      />
                    )}
                  </Form.Item>
                </Col>
                <Col lg={{ span: 8 }} xl={{ span: 6, offset: 2 }} md={{ span: 12 }} sm={24}>
                  {type(keys) == 'array' &&
                    keys.indexOf(getKey(pathname, operationEnum.select)) > -1 && (
                      <Button
                        type="primary"
                        className={styles.btnSmt}
                        onClick={this.SearchBtnHandle}
                      >
                        {formatMessage({ id: 'app.content.search' })}
                      </Button>
                    )}
                  <Button
                    className={styles.btnSmt}
                    style={{ marginLeft: 8 }}
                    onClick={this.SearchResetBtnHandle}
                  >
                    {formatMessage({ id: 'app.content.reset' })}
                  </Button>
                </Col>
                <Col lg={{ span: 10 }} xl={{ span: 12, offset: 2 }} md={{ span: 24 }} sm={24} />
              </Row>
            </Form>
          </Card>
        </div>
        <Card bordered className={styles.card}>
          {type(keys) == 'array' && keys.indexOf(getKey(pathname, operationEnum.online)) > -1 && (
            <Button
              type="primary"
              disabled={!btnStatus.onlineBtn}
              onClick={() => {
                this.confirm('contentOnline', formatMessage({ id: 'app.content.online' }));
              }}
            >
              {formatMessage({ id: 'app.content.online' })}
            </Button>
          )}
          {type(keys) == 'array' && keys.indexOf(getKey(pathname, operationEnum.offline)) > -1 && (
            <Button
              type="danger"
              style={{ marginLeft: 8 }}
              disabled={!btnStatus.offlineBtn}
              onClick={() => {
                this.confirm('contentOffline', formatMessage({ id: 'app.content.offline' }));
              }}
            >
              {formatMessage({ id: 'app.content.offline' })}
            </Button>
          )}
          {type(keys) == 'array' && keys.indexOf(getKey(pathname, operationEnum.del)) > -1 && (
            <Button
              type="danger"
              style={{ marginLeft: 8 }}
              disabled={!btnStatus.delBtn}
              onClick={() => {
                this.confirm('del', formatMessage({ id: 'app.content.del' }));
              }}
            >
              {formatMessage({ id: 'app.content.del' })}
            </Button>
          )}
          {type(keys) == 'array' && keys.indexOf(getKey(pathname, operationEnum.category)) > -1 && (
            <Button
              style={{ marginLeft: 8 }}
              onClick={() => {
                this.categoryModel();
              }}
            >
              {formatMessage({ id: 'app.content.category' })}
            </Button>
          )}
          {type(keys) == 'array' && keys.indexOf(getKey(pathname, operationEnum.online)) > -1 && (
            <Button
              type="primary"
              style={{ marginLeft: 8 }}
              disabled={!btnStatus.onlineBtn}
              onClick={() => {
                this.confirm('getcontentTop', formatMessage({ id: 'app.model.settingTop' }));
              }}
            >
              {formatMessage({ id: 'app.model.settingTop' })}
            </Button>
          )}
          {type(keys) == 'array' && keys.indexOf(getKey(pathname, operationEnum.online)) > -1 && (
            <Button
              type="danger"
              style={{ marginLeft: 8 }}
              disabled={!btnStatus.onlineBtn}
              onClick={() => {
                this.confirm('cancelContentTop', formatMessage({ id: 'app.model.cancelTop' }));
              }}
            >
              {formatMessage({ id: 'app.model.cancelTop' })}
            </Button>
          )}

          {this.state.pagination.order_by == 'update_at desc' && (
            <Select
              labelInValue
              defaultValue={{ key: 'update_at desc' }}
              style={{ width: 240, float: 'right', marginTop: '2px' }}
              onChange={this.selectUpdateTime}
            >
              <Option value="update_at asc">
                {formatMessage({ id: 'app.content.onlineTimeUp' })}
              </Option>
              <Option value="update_at desc">
                {formatMessage({ id: 'app.content.onlineTimeDown' })}
              </Option>
            </Select>
          )}
          {this.state.pagination.order_by == 'update_at asc' && (
            <Select
              labelInValue
              defaultValue={{ key: 'update_at asc' }}
              style={{ width: 240, float: 'right', marginTop: '2px' }}
              onChange={this.selectUpdateTime}
            >
              <Option value="update_at asc">
                {formatMessage({ id: 'app.content.onlineTimeUp' })}
              </Option>
              <Option value="update_at desc">
                {formatMessage({ id: 'app.content.onlineTimeDown' })}
              </Option>
            </Select>
          )}
        </Card>
        {type(keys) == 'array' && keys.indexOf(getKey(pathname, operationEnum.select)) > -1 && (
          <Table
            rowSelection={rowSelection}
            columns={columns}
            dataSource={data}
            pagination={false}
            bordered
            scroll={{ x: 1300 }}
            rowKey={record => `${record.id}`}
          />
        )}
        {type(keys) == 'array' && keys.indexOf(getKey(pathname, operationEnum.select)) > -1 && (
          <div className={styles.rightPagination}>
            <Pagination
              showTotal={total => formatMessage({ id: 'app.glob.pagetotal' },{total:total})}
              current={toParseInt(page || 0)}
              pageSize={this.state.pagination.page_size || 20}
              onChange={this.handleTableChange}
              total={toParseInt(total_count || 0)}
            />
          </div>
        )}
        {visible && (
          <ContentEdit
            visible={visible}
            editSource={editSource}
            adminTagList={this.state.adminTagList}
            onCloseDrawer={this.onCloseDrawer}
          />
        )}
        {!!categoryVisible && (
          <Modal
            visible={categoryVisible}
            onOk={this.okModalCate}
            onCancel={this.hideModalCate}
            okText={formatMessage({ id: 'app.content.confirm' })}
            cancelText={formatMessage({ id: 'app.content.cancel' })}
          >
            <Select
              defaultValue={this.state.cateStatus}
              onChange={handleChangeCate}
              style={{ width: 400 }}
            >
              <Option value="0">{formatMessage({ id: 'app.glob.noSetting' })}</Option>
              {Object.keys(adminContentCates).map(item => {
                return (
                  <Option key={item} value={item}>
                    {adminContentCates[item]}
                  </Option>
                );
              })}
            </Select>
          </Modal>
        )}
      </div>
    );
  }
}
export default Content;

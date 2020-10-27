import { type, removeObjUndefined } from '@/utils/utils';
import * as pushapi from '@/services/push';

import { connect } from 'dva';

import {
  Input,
  Breadcrumb,
  Icon,
  Button,
  Pagination,
  Popover,
  Table,
  Form,
  Row,
  Col,
  Card,
  Select,
  DatePicker,
  Modal,
} from 'antd';

import React, { PureComponent } from 'react';

import _ from 'lodash';

import { formatMessage } from 'umi/locale';
import router from 'umi/router';

import { operationEnum, getKey } from '../../../config/role.enum';

import styles from './Push.less';
import PushAdd from './PushAdd';
import PushEdit from './PushEdit';

const moment = require('moment');
const { Option } = Select;
const { RangePicker } = DatePicker;
const Search = Input.Search;

function getGroupName(source, id) {
  if (type(source) === 'array') {
    return source.filter(item => {
      return item.id === id;
    });
  }
  return '';
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
const push_way_enum = [
  formatMessage({ id: 'app.push.pushNow' }),
  formatMessage({ id: 'app.push.pushSettingTime' }),
];

@Form.create()
@connect(
  ({
    contentpush: { data, listStatus },
    routing: {
      location: { pathname },
    },
    memberInfo: {
      data: { keys },
    },
  }) => ({
    data,
    listStatus,
    keys,
    pathname,
  })
)
class Push extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      pagination: {
        page: 1,
        id: '',
        push_title: '',
        status: '',
        order_by: '',
        start_date: '',
        end_date: '',
      },
      selectedRowKeys: [],
      visible: false,
      pushAddVisble: false,
      pushEditVisble: false,
      editSource: {},
    };
    this.updataConfiList = this.updataConfiList.bind(this);
    this.pushAddVisbleHandle = this.pushAddVisbleHandle.bind(this);
    this.handleTableChange = this.handleTableChange.bind(this);
    this.pushEditVisbleHandle = this.pushEditVisbleHandle.bind(this);
    this.confirm = this.confirm.bind(this);
  }
  componentDidMount() {
    const { dispatch } = this.props;
    this.updataConfiList();
    dispatch({
      type: 'contentpush/getContentPushStatusList',
      payload: {},
    });
  }

  updataConfiList() {
    const { dispatch } = this.props;
    const { pagination } = this.state;
    return dispatch({
      type: 'contentpush/getList',
      payload: pagination,
    });
  }
  handleTableChange(page) {
    const { dispatch } = this.props;
    dispatch({
      type: 'contentpush/getList',
      payload: { ...this.state.pagination, page },
    });
  }

  pushEditVisbleHandle(refresh, record) {
    const { pushEditVisble } = this.state;
    if (refresh === 'refresh') {
      this.setState({ pushEditVisble: !pushEditVisble }, () => {
        this.updataConfiList();
      });
      return;
    }
    this.setState({ pushEditVisble: !pushEditVisble, editSource: record });
  }

  pushAddVisbleHandle = refresh => {
    const { pushAddVisble } = this.state;
    if (refresh === 'refresh') {
      this.setState({ pushAddVisble: !pushAddVisble }, () => {
        this.updataConfiList();
      });
      return;
    }
    this.setState({ pushAddVisble: !pushAddVisble });
  };
  confirm(api, content, params) {
    Modal.confirm({
      title: formatMessage({ id: 'app.content.tips' }),
      content: `${formatMessage({ id: 'app.content.confirm' })}${content || ''}?`,
      okText: formatMessage({ id: 'app.content.confirm' }),
      cancelText: formatMessage({ id: 'app.content.cancel' }),
      onOk: close => {
        pushapi[api]({ id: params.id, status: params.status }).then(res => {
          if (res && !res.code) {
            this.updataConfiList().then(() => {
              close();
            });
          }
        });
      },
    });
  }
  SearchBtnHandle = () => {
    this.props.form.validateFields((err, values) => {
      const { pagination } = this.state;
      // moment(new Date(beginDay + 1000 * 60 * 60 * 24 * i)).format('YYYY-MM-DD')
      this.setState(
        {
          pagination: Object.assign(
            {},
            pagination,
            removeObjUndefined(values),
            {
              start_date:
                (values.push_time &&
                  values.push_time.length == 2 &&
                  moment(values.push_time[0]).format('YYYY-MM-DD')) ||
                '',
              end_date:
                (values.push_time &&
                  values.push_time.length == 2 &&
                  moment(values.push_time[1]).format('YYYY-MM-DD')) ||
                '',
            },
            { page: 1 }
          ),
        },
        () => {
          this.updataConfiList();
        }
      );
    });
  };
  SearchResetBtnHandle = () => {
    this.props.form.validateFields((err, values) => {
      const { pagination } = this.state;
      this.props.form.resetFields();
      this.setState(
        {
          pagination: {
            page: 1,
            id: '',
            push_title: '',
            status: '',
            order_by: '',
            start_date: '',
            end_date: '',
          },
        },
        () => {
          this.updataConfiList();
        }
      );
    });
  };

  render() {
    const {
      data,
      form: { getFieldDecorator },
      listStatus,
      keys,
      pathname,
    } = this.props;
    const { visible, pushAddVisble, pushEditVisble, editSource } = this.state;
    const columns = [
      {
        title: 'id',
        dataIndex: 'id',
        key: 'id',
      },
      {
        title: formatMessage({ id: 'app.push.pushDate' }),
        dataIndex: 'publish_time',
        key: 'publish_time',
        render: (text, record) => {
          return moment(Number(text)).format('YYYY-MM-DD HH:mm:ss');
        },
      },
      {
        title: formatMessage({ id: 'app.content.contentId' }),
        dataIndex: 'content_id',
        key: 'content_id',
      },
      {
        title: formatMessage({ id: 'app.push.title' }),
        dataIndex: 'push_title',
        key: 'push_title',
      },
      {
        title: formatMessage({ id: 'app.push.pushDes' }),
        dataIndex: 'push_message',
        key: 'push_message',
      },
      {
        title: formatMessage({ id: 'app.push.readCount' }),
        dataIndex: 'source',
        key: 'source',
      },
      {
        title: formatMessage({ id: 'app.push.pushMode' }),
        dataIndex: 'push_way',
        key: 'push_way',
        render: (text, record) => <div>{push_way_enum[parseInt(text) - 1]}</div>,
      },
      {
        title: formatMessage({ id: 'app.push.status' }),
        dataIndex: 'status',
        key: 'status',
        render: (text, record) => <div>{listStatus[text]}</div>,
      },
      {
        title: formatMessage({ id: 'app.image.table.operation' }),
        key: 'operation',
        width: '380px',
        render: (text, record) => (
          <span>
            {type(keys) == 'array' &&
              keys.indexOf(getKey(pathname, operationEnum.comfrim)) > -1 &&
              record.status == 1 && (
                <Button
                  type="primary"
                  onClick={() => {
                    this.confirm(
                      'contentPushConfirm',
                      formatMessage({ id: 'app.push.push' }),
                      record
                    );
                  }}
                >
                  {formatMessage({ id: 'app.push.confirmPush' })}
                </Button>
              )}
            {type(keys) == 'array' && keys.indexOf(getKey(pathname, operationEnum.edit)) > -1 && (
              <Button
                onClick={() => {
                  this.pushEditVisbleHandle('', record);
                }}
                style={{ marginLeft: '10px' }}
              >
                {formatMessage({ id: 'app.push.edit' })}
              </Button>
            )}
            {type(keys) == 'array' && keys.indexOf(getKey(pathname, operationEnum.del)) > -1 && (
              <Button
                type="danger"
                onClick={() => {
                  this.confirm('del', formatMessage({ id: 'app.push.del' }), record);
                }}
                style={{ marginLeft: '10px' }}
              >
                {formatMessage({ id: 'app.push.del' })}
              </Button>
            )}
            <Popover
              content={
                <ul className={styles.popoverBox}>
                  <li>{formatMessage({ id: 'app.push.recall' })}</li>
                  <li onClick={this.hide}>{formatMessage({ id: 'app.push.cancel' })}</li>
                  <li onClick={this.hide}>{formatMessage({ id: 'app.push.history' })}</li>
                </ul>
              }
            >
              <Button style={{ marginLeft: '10px' }}>
                <Icon type="setting" />
                {formatMessage({ id: 'app.push.more' })}
              </Button>
            </Popover>
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
            <Breadcrumb.Item>{formatMessage({ id: 'menu.content.push' })}</Breadcrumb.Item>
          </Breadcrumb>
        </div>
        <div className={styles.addBtn}>
          <Card title={formatMessage({ id: 'menu.content.push' })} className={styles.card} bordered>
            <Form layout="vertical" hideRequiredMark>
              <Row gutter={16}>
                <Col lg={6} md={12} sm={24}>
                  <Form.Item label={formatMessage({ id: 'app.push.pushDateScope' })}>
                    {getFieldDecorator('push_time')(
                      <RangePicker
                        placeholder={[
                          formatMessage({ id: 'app.push.pushStartTime' }),
                          formatMessage({ id: 'app.push.pushEndTime' }),
                        ]}
                        style={{ width: '100%' }}
                      />
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
                        {Object.keys(listStatus).map(item => {
                          return (
                            <Option key={item} value={item}>
                              {listStatus[item]}
                            </Option>
                          );
                        })}
                      </Select>
                    )}
                  </Form.Item>
                </Col>
                <Col lg={{ span: 10 }} xl={{ span: 8, offset: 2 }} md={{ span: 24 }} sm={24}>
                  <Form.Item label={formatMessage({ id: 'app.push.title' })}>
                    {getFieldDecorator('push_title')(
                      <Input placeholder={formatMessage({ id: 'app.push.title' })} />
                    )}
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={16}>
                <Col lg={6} md={12} sm={24}>
                  <Form.Item label={formatMessage({ id: 'app.content.inputContentId' })}>
                    {getFieldDecorator('content_id')(
                      <Input
                        placeholder={formatMessage({ id: 'app.content.pleaseInputContentId' })}
                      />
                    )}
                  </Form.Item>
                </Col>
                <Col lg={{ span: 10 }} xl={{ span: 6, offset: 2 }} md={{ span: 12 }} sm={24}>
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
                  {type(keys) == 'array' &&
                    keys.indexOf(getKey(pathname, operationEnum.select)) > -1 && (
                      <Button style={{ marginLeft: 8 }} onClick={this.SearchResetBtnHandle}>
                        {formatMessage({ id: 'app.content.reset' })}
                      </Button>
                    )}
                  {type(keys) == 'array' && keys.indexOf(getKey(pathname, operationEnum.add)) > -1 && (
                    <Button
                      type="primary"
                      className={styles.btnSmt}
                      style={{ marginLeft: 8 }}
                      onClick={this.pushAddVisbleHandle}
                    >
                      {formatMessage({ id: 'app.content.add' })}
                    </Button>
                  )}
                </Col>
              </Row>
            </Form>
          </Card>
        </div>
        {type(keys) == 'array' && keys.indexOf(getKey(pathname, operationEnum.select)) > -1 && (
          <Table
            columns={columns}
            dataSource={data.data}
            pagination={false}
            bordered
            scroll={{ x: 1300 }}
            rowKey={(record, index) => `${record.id}${index}`}
          />
        )}
        <div className={styles.rightPagination}>
          <Pagination
             showTotal={total => formatMessage({ id: 'app.glob.pagetotal' },{total:total})}
            current={toParseInt(data.page)}
            pageSize={10}
            onChange={this.handleTableChange}
            total={toParseInt(data.total_count)}
          />
        </div>
        {pushAddVisble && (
          <PushAdd
            visible={pushAddVisble}
            visiblePushTime={false}
            onCallBack={this.pushAddVisbleHandle}
          />
        )}
        {pushEditVisble && (
          <PushEdit
            visible={pushEditVisble}
            onCallBack={this.pushEditVisbleHandle}
            editSource={editSource}
          />
        )}
      </div>
    );
  }
}
export default Push;

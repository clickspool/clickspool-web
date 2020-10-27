
import BreadcrumbBox from '@/components/BreadcrumbBox';
import { delNillObject, toParseInt, momentToString } from '@/utils/utils';
import { messDel } from '@/services/message';

import { connect } from 'dva';

import {
  Layout,
  Menu,
  Input,
  Breadcrumb,
  Icon,
  Button,
  Pagination,
  Divider,
  DatePicker,
  Table,
  Popconfirm,
  Badge,
  Card,
  Form,
  Row,
  Modal,
  Col,
  Select,
  Mention
} from 'antd';

import React, { PureComponent, Fragment } from 'react';

import _ from 'lodash';

import Link from 'umi/link';
import router from 'umi/router';
import { formatMessage } from 'umi/locale';

import styles from './index.less';
const { MonthPicker, RangePicker } = DatePicker;
const { confirm } = Modal;
const { Option } = Select;
const Search = Input.Search;
const moment = require('moment');

import { message_type_enum, send_user_ids_enum, send_type_enum, send_user_tag_enum, send_platform_enum } from './relatedEnum'

@Form.create()
@connect(({
  mess: {
    data,
    type,
    status,
    sendTypes
  },
  global: { GlobalCountryMap },
}) => {
  return {
    data,
    type,
    status,
    sendTypes,
    GlobalCountryMap
  }
})
export default class messagePush extends PureComponent {
  constructor(props) {
    super(props)
    this.state = {
      filters: {
        page_size: 20,
        page: 1,
      }
    }
  }

  handleTableChange = (page, pageSize) => {
    this.handleSubmit({
      page
    })
  }
  onShowSizeChange = (current, page_size) => {
    this.handleSubmit({
      page_size,
      page: current
    })
  }
  rmMessInfo = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'mess/rmMessInfo',
    })
  }

  handleSubmit = (t) => {
    const { getFieldsValue } = this.props.form;
    const searchParamer = getFieldsValue();
    const paramers = {}
    if (searchParamer.send_time) {
      paramers.send_time_start = searchParamer.send_time[0];
      paramers.send_time_end = searchParamer.send_time[1];
      searchParamer.send_time = null
    }
    if (searchParamer.create_time) {
      paramers.create_time_start = searchParamer.create_time[0];
      paramers.create_time_end = searchParamer.create_time[1];
      searchParamer.create_time = null
    }
    this.setState(({ filters }) => {
      return Object.assign(filters, searchParamer, paramers, !!Object.keys(t).length ? t : { page: 1 })
    }, () => {
      this.getList()
    })
  }
  handleOnReset = () => {
    this.props.form.resetFields();
    this.setState({
      filters: {
        page_size: 20,
        page: 1,
      }
    }, () => {
      this.getList()
    })
  }

  skipLink = (arg = {}, link, copy) => {
    const { dispatch } = this.props;
    if (link) {
      router.push(link);
      return
    }
    if (copy) {
      router.push(`/operation/assistant/messagepush/update/${arg.id}/copy`);
      return
    }
    if (arg.id) {
      router.push(`/operation/assistant/messagepush/update/${arg.id}`);
      return
    }
    dispatch({
      type: 'mess/messageEdit',
      payload: {}
    })
    router.push('/operation/assistant/messagepush/update');

  }

  showDelConfirm = (id) => {
    const _this = this;
    confirm({
      title: formatMessage({ id: 'form.operation.tip' }),
      content: formatMessage({ id: 'form.operation.tipDelContent' }),
      onOk() {
        return new Promise((resolve, reject) => {
          messDel({ id })
            .then(() => {
              resolve()
              _this.getList();
            })

        }).catch(() => console.log('Oops errors!'));
      },
      onCancel() { },
    });
  }

  FormSearch = () => {
    const { form: { getFieldDecorator }, type, status, GlobalCountryMap } = this.props;
    const { filters: { send_time, create_time, message_type = '', status: stateStatus = '' } } = this.state;
    return (
      <div className={styles.addBtn}>
        <Card className={styles.card} bordered>
          <Form layout="vertical" hideRequiredMark>
            <Row gutter={10}>
              <Col lg={8} md={12} sm={24}>
                <Form.Item label={formatMessage({ id: 'form.operation.sendTime' })}>
                  {getFieldDecorator('send_time')(
                    <RangePicker
                      showTime
                      format="YYYY-MM-DD HH:mm:ss"
                      style={{ width: '100%' }}
                    />
                  )}
                </Form.Item>
              </Col>
              <Col lg={8} md={12} sm={24}>
                <Form.Item label={formatMessage({ id: 'form.operation.createTime' })}>
                  {getFieldDecorator('create_time')(
                    <RangePicker
                      showTime
                      format="YYYY-MM-DD HH:mm:ss"
                      style={{ width: '100%' }}
                    />
                  )}
                </Form.Item>
              </Col>
              <Col lg={8} md={12} sm={24}>
                <Form.Item label={formatMessage({ id: 'form.operation.mediaType' })}>
                  {getFieldDecorator('message_type', {
                    initialValue: '',
                  })(
                    <Select>
                      <Option value="">{formatMessage({ id: 'form.operation.allmediaType' })}</Option>
                      {
                        Object.keys(type).map((item, index) => {
                          return <Option value={item} key={index}>{type[item]}</Option>
                        })
                      }
                    </Select>
                  )}
                </Form.Item>
              </Col>
              <Col lg={8} md={12} sm={24}>
                <Form.Item label={formatMessage({ id: 'app.activity.status' })}>
                  {getFieldDecorator('status', {
                    initialValue: '',
                  })(
                    <Select>
                      <Option value="">{formatMessage({ id: 'app.activity.allstatus' })}</Option>
                      {
                        Object.keys(status).map((item, index) => {
                          return <Option value={item} key={index}>{status[item]}</Option>
                        })
                      }
                    </Select>
                  )}
                </Form.Item>
              </Col>
              <Col lg={8} md={12} sm={24}>
                <Form.Item label={formatMessage({ id: 'app.activity.sendtype' })}>
                  {getFieldDecorator('send_type', {
                    initialValue: '',
                  })(
                    <Select>
                      <Option value="">{formatMessage({ id: 'app.activity.allsendtype' })}</Option>
                      {
                        Object.keys(this.props.sendTypes).map((item, index) => {
                          return <Option value={item} key={index}>{this.props.sendTypes[item]}</Option>
                        })
                      }
                    </Select>
                  )}
                </Form.Item>
              </Col>
              <Col lg={8} md={12} sm={24}>
                <Form.Item label={`国家`}>
                  {getFieldDecorator('send_nation')(
                    <Select
                      placeholder={`请选择国家`}
                    >
                      {
                        GlobalCountryMap.map((item, index) => {
                          return <Option value={item.id} key={index}>{item.name}</Option>
                        })
                      }
                    </Select>
                  )}
                </Form.Item>
              </Col>
              <Col lg={8} md={12} sm={24} >
                <Button type="primary" onClick={this.handleSubmit.bind(this, {})}>
                  {formatMessage({ id: 'form.operation.search' })}
                </Button>
                <Button style={{ marginLeft: '8px' }} onClick={this.handleOnReset}>
                  {formatMessage({ id: 'form.operation.reset' })}
                </Button>
                <Button type="primary" style={{ marginLeft: '8px' }} onClick={this.skipLink.bind(this)}>
                  {formatMessage({ id: 'operation.messagepush.add' })}
                </Button>
              </Col>
            </Row>
          </Form>
        </Card>
      </div>
    )
  }

  TableList = () => {
    const { data: { list }, status, type, GlobalCountryMap } = this.props;
    const columns = [
      {
        title: 'ID',
        dataIndex: 'id',
        key: 'id',
        width: 80,
      },
      {
        title: formatMessage({ id: 'form.operation.createTime' }),
        dataIndex: 'create_time',
        key: 'create_time',
        width: 80,
      },
      {
        title: formatMessage({ id: 'form.operation.sendTime' }),
        dataIndex: 'send_timing',
        key: 'send_timing',
        width: 80,
        render: (text, record) => {
          return text || ''
        }
      },
      {
        title: formatMessage({ id: 'operation.messagepush.title' }),
        dataIndex: 'title',
        key: 'title',
        width: 80,
      },
      {
        title: `国家`,
        dataIndex: 'send_nation',
        key: 'send_nation',
        width: 80,
        render: (text, record) => {
          if(text==0 ||!text){
            return ''
          }
          return GlobalCountryMap.find((item)=>(item.id == text))?GlobalCountryMap.find((item)=>(item.id == text))['name']:""
        }
      },
      {
        title: formatMessage({ id: 'app.activity.sendtype' }),
        dataIndex: 'send_type',
        key: 'send_type',
        width: 120,
        render: (text, record) => {
          return this.props.sendTypes[text]
        }
      },
      {
        title: formatMessage({ id: 'operation.messagepush.pushContent' }),
        dataIndex: 'content',
        key: 'content',
        width: 150,
      },
      {
        title: formatMessage({ id: 'form.operation.mediaType' }),
        dataIndex: 'message_type',
        key: 'message_type',
        width: 80,
        render: (text, record) => {
          return type[text]
        }
      },
      {
        title: 'URL',
        dataIndex: 'url',
        key: 'url',
        width: 130,
        render: (text) => {
          return (
            <div style={{ wordWrap: 'break-word', wordBreak: 'break-all' }}>{text}</div>
          )
        }
      },
      {
        title: formatMessage({ id: 'operation.messagepush.client' }),
        dataIndex: 'platform_name',
        key: 'platform_name',
        width: 80,
        render: (text) => {
          return text
        }
      },
      {
        title: formatMessage({ id: 'operation.messagepush.uidtag' }),
        dataIndex: 'send_user_tag_name',
        key: 'send_user_tag_name',
        width: 200,
        render: (text, record) => {
          const pushClientTime = parseInt(record.send_user_reg_end) ? `${parseInt(record.send_user_reg_start) ? record.send_user_reg_start : ''}${formatMessage({ id: 'operation.messagefaq.to' })}${record.send_user_reg_end}` : '';
          const pushClientRange = !!record.send_user_ids ? record['send_user_ids'] : '';
          return (
            <Fragment>
              <p>{formatMessage({ id: 'operation.messagepush.pushClientTag' })}:{text}</p>
              {!!pushClientTime && <p>{formatMessage({ id: 'operation.messagepush.pushClientTime' })}:{pushClientTime}</p>}
              {!!pushClientRange && <p>{formatMessage({ id: 'operation.messagepush.pushClientRange' })}:{pushClientRange}</p>}
            </Fragment>
          )
        }
      },
      {
        title: formatMessage({ id: 'operation.messagepush.createUser' }),
        dataIndex: 'member_nickname',
        key: 'member_nickname',
        width: 80,
      },
      {
        title: formatMessage({ id: 'form.operation.status' }),
        dataIndex: 'status',
        key: 'status',
        width: 80,
        render: (text) => {
          const status_style = (text == 1) ? { color: '#52c41a' } : (text == 2) ? { color: '#f5222d' } : {};
          return <span style={status_style}>{status[text]}</span>
        }
      },
      {
        title: formatMessage({ id: 'operation.messagepush.operation' }),
        width: 300,
        render: (text, record) => {
          return (
            <div>
              <Button type="link" onClick={this.skipLink.bind(this, { ...record }, '', 'copy')}>{formatMessage({ id: 'form.operation.copy' })}</Button>
              <Button type="link" style={{ marginLeft: '6px' }} onClick={this.skipLink.bind(this, record, '', '')}>{formatMessage({ id: 'form.operation.edit' })}</Button>
              <Button type="link" style={{ marginLeft: '6px' }} onClick={this.skipLink.bind(this, record, `/operation/assistant/messagepush/detail/${record.id}`, '')}>{formatMessage({ id: 'form.operation.detail' })}</Button>
              <Button type="link" onClick={this.showDelConfirm.bind(this, record.id)} style={{ color: '#ff4d4f', marginLeft: '6px' }}>{formatMessage({ id: 'form.operation.del' })}</Button>
            </div>
          )
        }
      },
    ]
    return (
      <Table
        columns={columns}
        dataSource={list}
        pagination={false}
        bordered
        scroll={{ x: 1300 }}
        rowKey={(record, index) => `${record.id}${index}`}
      />
    )
  }

  componentDidMount = () => {
    const { dispatch } = this.props;
    this.rmMessInfo();
    Promise.all([dispatch({
      type: 'mess/messTypes',
    }), dispatch({
      type: 'mess/messStatuses',
    }), dispatch({
      type: 'mess/sendTypes',
    })

    ])
      .then(() => {
        this.getList();
      })
  }

  getList = () => {
    const { dispatch } = this.props;
    const { filters } = this.state;
    dispatch({
      type: 'mess/getList',
      payload: momentToString(filters)
    });
  }

  render = () => {
    const { data: { total_count, total_page } } = this.props;
    const { filters } = this.state
    const src = [
      { icon: 'desktop', name: formatMessage({ id: 'menu.operation' }) },
      { name: formatMessage({ id: 'menu.operation.xiaomishupush' }) }
    ]
    const { FormSearch, TableList } = this;

    return (<Fragment>
      <BreadcrumbBox src={src} />
      <FormSearch />
      <TableList />
      <div className={styles.rightPagination}>
        <Pagination
          showTotal={total => formatMessage({ id: 'app.glob.pagetotal' }, { total: total })}
          pageSizeOptions={['20', '30', '40']}
          showSizeChanger
          onShowSizeChange={this.onShowSizeChange}
          current={toParseInt(filters.page) || 1}
          pageSize={filters.page_size}
          onChange={this.handleTableChange}
          total={toParseInt(total_count)}
        />
      </div>
    </Fragment>)
  }
}
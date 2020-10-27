
import BreadcrumbBox from '@/components/BreadcrumbBox';
import { messAdd, messModify, uploadMultiMedia } from '@/services/message';
import { delNillObject, toParseInt, momentToString, stringToMoment } from '@/utils/utils';
import Uploader from '@/components/Uploader/index';

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
  Col,
  Select,
  Upload,
  Radio,
  message
} from 'antd';

import React, { PureComponent, Fragment } from 'react';

import Link from 'umi/link';
import { formatMessage } from 'umi/locale';
import router from 'umi/router';

import get from 'lodash/get';
import isNil from 'lodash/isNil';

import styles from './index.less';
const { Option } = Select;
const Search = Input.Search;
const moment = require('moment');

import { message_type_enum, send_user_ids_enum, send_type_enum, send_user_tag_enum, send_platform_enum } from './relatedEnum'

@Form.create()
@connect(({ mess: { messInfo }, global: { GlobalCountryMap } }) => {
  return {
    messInfo,
    GlobalCountryMap
  }
})
export default class messagePush extends PureComponent {
  constructor(props) {
    super(props)
  }
  state = {
    filters: {},
    disabled: false,
    duration: 0,
  }


  uploadMultiMediaHandle = () => {

  }

  handleSubmit = () => {
    const { getFieldsValue } = this.props.form;
    const { filters } = this.state;
    const { copy, id } = this.props.computedMatch.params;
    const searchParamer = getFieldsValue();
    if (!get(searchParamer, 'title')) {
      return message.error(formatMessage({ id: 'form.operation.ptitle' }));
    }
    if (!get(searchParamer, 'content')) {
      return message.error(formatMessage({ id: 'form.operation.pcontent' }));
    }
    if (!get(searchParamer, 'send_type') && get(searchParamer, 'send_type') != 0) {
      return message.error(formatMessage({ id: 'form.operation.psendmss' }));
    }
    this.setState({
      disabled: true
    })

    let paramer = { ...filters, ...searchParamer };
    paramer = momentToString(paramer);
    let send_timing = paramer.send_timing ? { send_timing: paramer.send_timing.substring(0, paramer.send_timing.length - 3) } : {};
    paramer = { ...paramer, ...send_timing };
    if (!get(paramer, 'message_type')) {
      paramer = { ...paramer, message_type: 0 };
    }
    if ((id || id === '0' || id === 0) && !copy) {
      messModify(
        paramer
      ).then((res) => {
        this.setState({
          disabled: false
        })
        if (!res.code) {
          this.onCancel()

        }
      })
      return
    }
    delete (paramer.status);
    messAdd(
      { ...paramer, id: '' }
    ).then((res) => {
      if (!res.code) {
        this.onCancel()
      }
      this.setState({
        disabled: false
      })
    })
  }
  onCancel = () => {
    router.push('/operation/assistant/messagepush');
  }

  getDetail = () => {
    const { dispatch } = this.props;
    const { id } = this.props.computedMatch.params;
    if (id || id === '0' || id === 0) {
      dispatch({
        type: 'mess/messInfo',
        payload: { id }
      })
        .then(res => {
          if (!res.code) {
            this.setState({
              duration: res.data.duration
            })
          }
        })
    }
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    const { messInfo } = nextProps;
    if (messInfo != prevState.filters && Object.keys(prevState.filters).length == 0) {
      return {
        filters: messInfo
      }
    }
    return null
  }

  componentDidMount = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'global/getGlobalCountryMap',
    })
    this.getDetail();
  }

  onChangeUseridsTag = (ev) => {
    const { value: send_user_ids_tag } = ev.target
    this.setState(({ filters }) => ({
      filters: { ...filters, send_user_ids_tag }
    }))
  }
  onChangeSendType = (ev) => {
    const { value: send_type } = ev.target;
    this.setState(({ filters }) => ({
      filters: { ...filters, send_type }
    }))
  }
  getMediaMatter = (matter, flag) => {
    if (flag) {
      matter = {
        url: '',
        thumb_base64: '',
        duration: 0,
        message_type: 0,
        size: '',
        weight_high: '',
        path: '',
      }
    }
    this.setState(({ filters }) => ({
      filters: { ...filters, ...matter },
      duration: matter.duration
    }))
  }
  onChangeDuration = (e) => {
    const { value: duration } = e.target;
    this.setState(({ filters }) => ({
      duration,
      filters: { ...filters, duration }
    }))

  }
  render = () => {
    const { copy, id } = this.props.computedMatch.params;
    const { form: { getFieldDecorator }, GlobalCountryMap } = this.props;

    const { filters, disabled, filters: { message_type } } = this.state;

    const src = [
      { icon: 'desktop', name: formatMessage({ id: 'menu.operation' }) },
      { link: '/operation/messagepush', name: formatMessage({ id: 'menu.operation.xiaomishupush' }) },
      { name: formatMessage({ id: isNil(id) ? 'operation.messagepush.add' : 'form.operation.edit' }) }
    ]
    const gridStyle = {
      width: '25%',
      textAlign: 'left',
      paddingLeft: '10px'
    };
    const gridFullStyle = {
      width: '100%',
      textAlign: 'left',
      paddingLeft: '10px'
    };
    const radioStyle = {
      display: 'block',
      height: '30px',
      lineHeight: '30px',
    };

    return (
      <div className={'message_push_up'}>
        <Form layout="vertical" hideRequiredMark>
          <Card
            title={
              <BreadcrumbBox src={src} className={styles.breadcrumb_Box} />
            }
            className={styles.card_wrap}
          >
            <Card.Grid style={gridFullStyle}>
              <Row type="flex" justify="start" gutter={16}>
                <Col style={{ width: '140px', textAlign: 'right' }}><span className={`${styles.detail_title} ${styles.required}`}>{formatMessage({ id: 'operation.messagepush.title' })}</span></Col>
                <Col span={18}>
                  <Form.Item>
                    {getFieldDecorator('title', {
                      initialValue: filters.title || '',
                    })(
                      <Input placeholder={formatMessage({ id: 'operation.messagepush.title' })} />
                    )}
                  </Form.Item>
                </Col>
              </Row>
              <Row type="flex" justify="start" gutter={16}>
                <Col style={{ width: '140px', textAlign: 'right' }}><span className={`${styles.detail_title} ${styles.required}`}>{formatMessage({ id: 'operation.messagepush.pushContent' })}</span></Col>
                <Col span={18}>
                  <Form.Item>
                    {getFieldDecorator('content', {
                      initialValue: filters.content || '',
                    })(
                      <Input.TextArea rows={4} placeholder={formatMessage({ id: 'operation.messagepush.pushContent' })} />
                    )}
                  </Form.Item>
                </Col>
              </Row>
              <Row type="flex" justify="start" gutter={16}>
                <Col style={{ width: '140px', textAlign: 'right' }}><span className={styles.detail_title}>{formatMessage({ id: 'operation.messagepush.upload' })}</span></Col>
                <Col span={18}>
                  <Form.Item>
                    <Uploader {...filters} callback={this.getMediaMatter} />
                  </Form.Item>
                </Col>
              </Row>
              {(message_type == 2 || message_type == 3) && <Row type="flex" justify="start" gutter={16}>
                <Col style={{ width: '140px', textAlign: 'right' }}><span className={styles.detail_title}>{formatMessage({ id: 'operation.messagepush.duration' })}</span></Col>
                <Col span={4}>
                  <Form.Item>
                    <Input value={this.state.duration} addonAfter={'Second'} placeholder={formatMessage({ id: 'operation.messagepush.duration' })} onChange={this.onChangeDuration} />
                  </Form.Item>
                </Col>
              </Row>}
            </Card.Grid>
          </Card>

          <Card className={styles.card_wrap}>
            <Card.Grid style={gridFullStyle}>
              <Row type="flex" justify="start" gutter={16}>
                <Col style={{ width: '140px', textAlign: 'right' }}><span className={`${styles.detail_title}`}>{formatMessage({ id: 'operation.messagepush.client' })}</span></Col>
                <Col span={18}>
                  <Form.Item>
                    {getFieldDecorator('send_platform', {
                      initialValue: filters.send_platform || "0",
                    })(
                      <Radio.Group>
                        {Object.keys(send_platform_enum).map((item, key) => {
                          return (<Radio key={key} value={item}>{send_platform_enum[item]}</Radio>)
                        })}
                      </Radio.Group>
                    )}
                  </Form.Item>
                </Col>
              </Row>
              <Row type="flex" justify="start" gutter={16}>
                <Col style={{ width: '140px', textAlign: 'right' }}><span className={styles.detail_title}>{`选择国家`}</span></Col>
                <Col span={18}>
                  <Form.Item>
                    {getFieldDecorator('send_nation', (!!filters.send_nation && filters.send_nation != 0) ? {
                      initialValue: +filters.send_nation,
                    } : {})(
                      <Select style={{ width: '400px' }} placeholder={`请选择国家`}>
                        {GlobalCountryMap.map((item, key) => {
                          return (<Option key={key} value={item.id}>{item.name}</Option>)
                        })}
                      </Select>
                    )}
                  </Form.Item>
                </Col>
              </Row>
              <Row type="flex" justify="start" gutter={16}>
                <Col style={{ width: '140px', textAlign: 'right' }}><span className={styles.detail_title}>{formatMessage({ id: 'operation.messagepush.pushClientTag' })}</span></Col>
                <Col span={18}>
                  <Form.Item>
                    {getFieldDecorator('send_user_tag', {
                      initialValue: filters.send_user_tag || "0",
                    })(
                      <Radio.Group>
                        {Object.keys(send_user_tag_enum).map((item, key) => {
                          return (<Radio key={key} value={item}>{send_user_tag_enum[item]}</Radio>)
                        })}
                      </Radio.Group>
                    )}
                  </Form.Item>
                </Col>
              </Row>
              <Row type="flex" justify="start" gutter={16}>
                <Col style={{ width: '140px', textAlign: 'right' }}><span className={styles.detail_title}>{formatMessage({ id: 'operation.messagepush.pushClientTime' })}</span></Col>
                <Col style={{ width: '300px' }}>
                  {!!filters.send_user_reg_start &&
                    <Form.Item>
                      {getFieldDecorator('send_user_reg_start', {
                        initialValue: filters.send_user_reg_start,
                      })(
                        <DatePicker
                          style={{ width: '100%' }}
                          format="YYYY-MM-DD HH:mm:ss"
                          showTime
                          placeholder={formatMessage({ id: 'operation.messagepush.startRegisterTime' })}
                        />
                      )}
                    </Form.Item>}
                  {!filters.send_user_reg_start &&
                    <Form.Item>
                      {getFieldDecorator('send_user_reg_start')(
                        <DatePicker
                          style={{ width: '100%' }}
                          format="YYYY-MM-DD HH:mm:ss"
                          showTime
                          placeholder={formatMessage({ id: 'operation.messagepush.startRegisterTime' })}
                        />
                      )}
                    </Form.Item>}
                </Col>
                <Col style={{ width: '300px' }}>
                  {
                    !!filters.send_user_reg_end &&
                    <Form.Item>
                      {getFieldDecorator('send_user_reg_end', {
                        initialValue: filters.send_user_reg_end,
                      })(
                        <DatePicker
                          style={{ width: '100%' }}
                          showTime
                          format="YYYY-MM-DD HH:mm:ss"
                          placeholder={formatMessage({ id: 'operation.messagepush.endRegisterTime' })}
                        />
                      )}
                    </Form.Item>
                  }
                  {
                    !filters.send_user_reg_end &&
                    <Form.Item>
                      {getFieldDecorator('send_user_reg_end')(
                        <DatePicker
                          style={{ width: '100%' }}
                          showTime
                          format="YYYY-MM-DD HH:mm:ss"
                          placeholder={formatMessage({ id: 'operation.messagepush.endRegisterTime' })}
                        />
                      )}
                    </Form.Item>
                  }
                </Col>
              </Row>
              <Row type="flex" justify="start" gutter={16}>
                <Col style={{ width: '140px', textAlign: 'right' }}><span className={styles.detail_title}>{formatMessage({ id: 'operation.messagepush.pushClientRange' })}</span></Col>
                <Col style={{ width: '230px' }}>
                  {getFieldDecorator('send_user_ids', {
                    initialValue: filters.send_user_ids || '',
                  })(
                    <Input placeholder={`UID1,UID2,UID3...`} style={{ width: '100%' }} />
                  )}
                </Col>
                <Col style={{ width: '230px' }}>
                  <span style={{ color: "#f5222d", lineHeight: '32px' }}>{formatMessage({ id: 'form.operation.tipmess' })}</span>
                </Col>
              </Row>
            </Card.Grid>
            <Card.Grid style={gridFullStyle}>
              <Row type="flex" justify="start" gutter={16}>
                <Col style={{ width: '140px', textAlign: 'right' }}><span className={`${styles.detail_title} ${styles.required}`}>{formatMessage({ id: 'operation.messagepush.sendMethod' })}</span></Col>
                <Col span={18}>
                  <Form.Item style={{ paddingBottom: '0px', marginBottom: '6px' }}>
                    {getFieldDecorator('send_type', {
                      initialValue: filters.send_type || '',
                    })(
                      <Radio.Group onChange={this.onChangeSendType}>
                        {Object.keys(send_type_enum).map((item, key) => {
                          if (key === (Object.keys(send_type_enum).length - 1)) {
                            return (<Radio key={key} value={item}>{send_type_enum[item]}</Radio>)
                          }
                          return (<Radio key={key} value={item} style={radioStyle}>{send_type_enum[item]}</Radio>)
                        })}

                      </Radio.Group>
                    )}
                  </Form.Item>
                  {!filters.send_timing &&
                    <Form.Item>
                      {getFieldDecorator('send_timing')(
                        <DatePicker
                          style={{ width: '220px', marginTop: '2px' }}
                          showTime
                          format="YYYY-MM-DD HH:mm"
                          placeholder={formatMessage({ id: 'operation.messagepush.psendtime' })}
                          disabled={!!(filters.send_type != 3)}
                        />
                      )}
                    </Form.Item>
                  }
                  {!!filters.send_timing &&
                    <Form.Item>
                      {getFieldDecorator('send_timing', {
                        initialValue: filters.send_timing,
                      })(
                        <DatePicker
                          style={{ width: '220px', marginTop: '2px' }}
                          showTime
                          format="YYYY-MM-DD HH:mm"
                          placeholder={formatMessage({ id: 'operation.messagepush.psendtime' })}
                          disabled={!!(filters.send_type != 3)}
                        />
                      )}
                    </Form.Item>}
                </Col>
              </Row>
              <Row type="flex" justify="start" gutter={16}>
                <Col style={{ width: '30%' }}>
                </Col>
                <Button type="primary" disabled={disabled} onClick={this.handleSubmit}>
                  {formatMessage({ id: 'operation.messagepush.submit' })}
                </Button>
                <Button style={{ marginLeft: '30px' }} onClick={this.onCancel}>
                  {formatMessage({ id: 'form.operation.cancel' })}
                </Button>
              </Row>
            </Card.Grid>
          </Card>
        </Form>
      </div>
    )
  }
}
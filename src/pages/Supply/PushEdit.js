import { contentDetail } from '@/services/content';
import { contentPushModify } from '@/services/push';

import { connect } from 'dva';

import { Input, Form, Modal, Select, Row, Col, DatePicker, message, Radio } from 'antd';

import React from 'react';

import { formatMessage } from 'umi/locale';

import styles from './Content.less';
import { removeObjUndefined, checkRate } from '@/utils/utils';
import _ from 'lodash';

const moment = require('moment');
const FormItem = Form.Item;
const TextArea = Input.TextArea;
const Option = Select.Option;
const { RangePicker } = DatePicker;
const RadioGroup = Radio.Group;
const Search = Input.Search;

@Form.create()
class PushEdit extends React.Component {
  state = {
    isShowPushTime: this.props.editSource.push_way == '2',
    contentTitle: '',
    contentTime: '',
    record: this.props.editSource,
  };
  onOk = () => {
    this.props.form.validateFields((err, values) => {
      if (!err) {
        const params = values;
        if (params.push_time && values.push_way == 2) {
          params.push_time = values.push_time.format('YYYY-MM-DD HH:mm:ss');
        }
        if (values.push_way == 1) {
          params.push_time = '';
        }
        params.id = this.props.editSource.id;
        contentPushModify(params).then(res => {
          if (res && !res.code) {
            this.props.onCallBack('refresh');
          }
        });
        // console.log(values.push_time.format('YYYY-MM-DD HH:mm:ss'))
        // console.log(values);
      }
    });
  };
  onCancel = () => {
    this.props.onCallBack();
  };
  getContent = id => {
    if (!id.trim()) {
      return;
    }
    contentDetail({ page: 1, id }).then(res => {
      if (res && !res.code) {
        if (!res.data.name || !res.data.update_at) {
          return message.warning(formatMessage({ id: 'app.push.noData' }));
        }
        this.setState({
          contentTitle: res.data.name,
          contentTime: res.data.update_at,
        });
      }
    });
  };
  onChange = ev => {
    const { isShowPushTime } = this.state;
    if (ev.target.value == 2) {
      this.setState({ isShowPushTime: true });
    } else {
      this.setState({ isShowPushTime: false });
    }
  };
  compareConyentIdNum = (rule, value, callback) => {
    const form = this.props.form;
    if (!checkRate(value)) {
      callback(formatMessage({ id: 'app.glob.pleaseInputNum' }));
    } else {
      if (parseInt(value) < 0 || /\./g.test(value + '')) {
        callback(formatMessage({ id: 'app.glob.pleaseInputZindex' }));
      }
      callback();
    }
  };
  componentDidMount() {
    const {
      editSource: { content_id },
    } = this.props;
    this.getContent(content_id);
  }

  render() {
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 6 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 18 },
      },
    };
    const { isShowPushTime, contentTitle, contentTime, record } = this.state;
    const {
      form: { getFieldDecorator },
      visible,
      editInfo,
      source,
    } = this.props;
    console.log(isShowPushTime);
    return (
      !!visible && (
        <Modal
          title={formatMessage({ id: 'app.versions.edit' })}
          visible={visible}
          cancelText={formatMessage({ id: 'app.model.cancel' })}
          okText={formatMessage({ id: 'app.model.okText' })}
          onOk={this.onOk}
          onCancel={this.onCancel}
          width="500px"
        >
          <Form>
            <FormItem {...formItemLayout} label={formatMessage({ id: 'app.push.pushWay' })}>
              {getFieldDecorator('push_way', {
                initialValue: record.push_way,
                rules: [
                  {
                    required: true,
                    message: formatMessage({ id: 'app.push.pushWay' }),
                  },
                ],
              })(
                <RadioGroup onChange={this.onChange}>
                  <Radio value="1">{formatMessage({ id: 'app.push.pushNow' })}</Radio>
                  <Radio value="2">{formatMessage({ id: 'app.push.pushSettingTime' })}</Radio>
                </RadioGroup>
              )}
            </FormItem>
            {isShowPushTime && (
              <FormItem {...formItemLayout} label={formatMessage({ id: 'app.push.pushTime' })}>
                {getFieldDecorator('push_time', {
                  initialValue: moment(Number(record.publish_time)),
                  rules: [
                    {
                      required: true,
                      message: formatMessage({ id: 'app.push.pushTime' }),
                    },
                  ],
                })(
                  <DatePicker
                    style={{ width: '100%' }}
                    format="YYYY-MM-DD HH:mm:ss"
                    showTime={{ defaultValue: moment('00:00:00', 'HH:mm:ss') }}
                  />
                )}
              </FormItem>
            )}
            <FormItem {...formItemLayout} label={formatMessage({ id: 'app.push.contentId' })}>
              {getFieldDecorator('content_id', {
                initialValue: record.content_id,
                rules: [
                  {
                    required: true,
                    message: formatMessage({ id: 'app.glob.pleaseInputcontentID' }),
                  },
                  { validator: this.compareConyentIdNum },
                ],
              })(
                <Search
                  placeholder={formatMessage({ id: 'app.push.contentId' })}
                  enterButton={formatMessage({ id: 'app.push.getContent' })}
                  size="large"
                  onSearch={value => {
                    this.getContent(value);
                  }}
                />
              )}
            </FormItem>
            <FormItem {...formItemLayout} label={formatMessage({ id: 'app.push.contentTitle' })}>
              {getFieldDecorator('content_title', {
                initialValue: contentTitle,
              })(<Input disabled />)}
            </FormItem>
            <FormItem {...formItemLayout} label={formatMessage({ id: 'app.push.onlineTime' })}>
              {getFieldDecorator('online_time', {
                initialValue: contentTime,
              })(<Input disabled />)}
            </FormItem>
            <FormItem {...formItemLayout} label={formatMessage({ id: 'app.push.insetPushTitle' })}>
              {getFieldDecorator('push_title', {
                initialValue: record.push_title,
                rules: [
                  {
                    required: true,
                    message: formatMessage({ id: 'app.glob.pleaseInputcontentTitle' }),
                  },
                ],
              })(<Input />)}
            </FormItem>
            <FormItem {...formItemLayout} label={formatMessage({ id: 'app.push.insetPushDes' })}>
              {getFieldDecorator('push_message', {
                initialValue: record.push_message,
                rules: [
                  {
                    required: true,
                    message: formatMessage({ id: 'app.glob.pleaseInputcontentDes' }),
                  },
                ],
              })(<Input.TextArea rows={4} />)}
            </FormItem>
          </Form>
        </Modal>
      )
    );
  }
}

export default PushEdit;

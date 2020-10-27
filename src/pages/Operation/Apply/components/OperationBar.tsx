import { Form, Row, Col, Select, Button, Input, DatePicker } from 'antd';
import React, { PureComponent } from 'react';
import { connect } from 'dva';
//@ts-ignore
import { formatMessage } from 'umi/locale';
import styles from './OperationBar.less';
///<reference types='../css.d.ts' />


//@ts-ignore
@Form.create()
@connect(({ apply: { userTypeMap } }) => ({ userTypeMap }))
class OperationBar extends PureComponent<any, any> {
  handleValues = () => {
    this.props.form.validateFields((errors, values) => {
      if (errors) return
      Object.keys(values).map(key => {
        if (!values[key]) return;
        if (values[key].format) {
          values[key] = values[key].format('YYYY-MM-DD HH:mm:ss');
        }
      })
      this.props.search(values);
    })
  }
  reset = () => {
    this.props.form.resetFields();
    this.props.search();
  }
  render() {
    const { form: { getFieldDecorator }, statuses, userTypeMap={} } = this.props;
    const Option = Select.Option;

    const statusesEl = Object.keys(statuses).map(id => {
      return (
        <Option key={id} value={id}>{statuses[id]}</Option>
      );
    });

    const userEl = Object.keys(userTypeMap).map(id => {
      return (
        <Option key={id} value={id}>{userTypeMap[id]}</Option>
      );
    });

    return (
      <Form autoComplete='off' className={styles['search-wraper']}>
        <Row className={`operation-bar ${styles.operations}`} gutter={10} type='flex'>
          <Col span={20}>
            <Row className={styles.row}>
              <div className={styles.operation}>
                {getFieldDecorator('user_id')(<Input placeholder={formatMessage({ id: 'app.apply.account' })} onPressEnter={this.handleValues} />)}
              </div>
              <div className={styles.operation}>
                {getFieldDecorator('nick_id')(<Input placeholder={formatMessage({ id: 'app.apply.nick_id' })} onPressEnter={this.handleValues} />)}
              </div>
              <div className={styles.operation}>
                {getFieldDecorator('nickname')(<Input placeholder={formatMessage({ id: 'app.apply.nickname' })} onPressEnter={this.handleValues} />)}
              </div>
              <div className={styles.operation}>
                {getFieldDecorator('type')(
                  <Select placeholder={'用户类型'}>
                    {userEl}
                  </Select>)
                }
              </div>
              <div className={styles.operation}>
                {getFieldDecorator('status')(
                  <Select placeholder={formatMessage({ id: 'app.scene.tools.search.status' })}>
                    <Option value='' className={styles.all}>{formatMessage({ id: 'app.scene.tools.search.allstatus' })}</Option>
                    {statusesEl}
                  </Select>)
                }
              </div>
              <Form.Item className={`${styles.row} ${styles.range}`} label={formatMessage({ id: 'app.apply.search.date' })}>
                <Form.Item
                  style={{ display: 'inline-block', marginBottom: 0, width: 'calc(50% - 12px)' }}
                >
                  {getFieldDecorator('begin_time')(
                    <DatePicker />
                  )}
                </Form.Item>
                <span style={{ display: 'inline-block', width: '24px', textAlign: 'center' }}>-</span>
                <Form.Item
                  style={{ display: 'inline-block', marginBottom: 0, width: 'calc(50% - 12px)' }}
                >
                  {getFieldDecorator('end_time')(
                    <DatePicker />
                  )}
                </Form.Item>
              </Form.Item>
            </Row>
          </Col>
          <Col span={4} className={styles.row}>
            <div className={styles['operation-btn']}>
              <Button type="primary" icon="search" onClick={this.handleValues}>{formatMessage({ id: 'app.scene.tools.search.btn' })}</Button>
            </div>
            <div className={styles['operation-btn']}>
              <Button type="primary" onClick={this.reset}>{formatMessage({ id: 'app.scene.tools.search.reset' })}</Button>
            </div>
          </Col>
        </Row>
      </Form>
    );
  }
}
export default OperationBar;
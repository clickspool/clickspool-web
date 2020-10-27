import { Form, Row, Col, Select, Button, Input } from 'antd';
import React, { PureComponent } from 'react';
//@ts-ignore
import { formatMessage } from 'umi/locale';
import styles from './OperationBar.css';
///<reference types='../css.d.ts' />


//@ts-ignore
@Form.create()
class OperationBar extends PureComponent<any, any> {
  handleValues = () => {
    this.props.form.validateFields((errors, values) => {
      if (errors) return
      this.props.search(values);
    })
  }
  reset = () => {
    this.props.form.resetFields();
    this.props.search();
  }
  render() {
    const { form: { getFieldDecorator }, statuses } = this.props;
    const Option = Select.Option;

    const statusesEl = Object.keys(statuses).map(id => {
      return (
        <Option key={id} value={id}>{statuses[id]}</Option>
      );
    });

    return (
      <Form autoComplete='off' className={styles['search-wraper']}>
        <Row className={`operation-bar ${styles.operations}`} gutter={10} type='flex'>
          <Col span={8}>
            <Row className={styles.row}>
              <div className={styles.operation}>
                {getFieldDecorator('name')(<Input placeholder={formatMessage({ id: 'app.message.template.search.name' })} onPressEnter={this.handleValues} />)}
              </div>
              <div className={styles.operation}>
                {getFieldDecorator('status')(
                  <Select placeholder={formatMessage({ id: 'app.scene.tools.search.status' })}>
                    <Option value='' className={styles.all}>{formatMessage({ id: 'app.scene.tools.search.allstatus' })}</Option>
                    {statusesEl}
                  </Select>)
                }
              </div>
            </Row>
          </Col>
          <Col span={9}>
            <div className={styles['operation-btn']}>
              <Button type="primary" icon="search" onClick={this.handleValues}>{formatMessage({ id: 'app.scene.tools.search.btn' })}</Button>
            </div>
            <div className={styles['operation-btn']}>
              <Button type="primary" onClick={this.reset}>{formatMessage({ id: 'app.scene.tools.search.reset' })}</Button>
            </div>
          </Col>
          <Col span={7} className={styles.pullright}>
            <div className={styles['operation-btn']}>
              <Button type="primary" onClick={this.props.add}>{this.props.addTitle}</Button>
            </div>
          </Col>
        </Row>
      </Form>
    );
  }
}
export default OperationBar;
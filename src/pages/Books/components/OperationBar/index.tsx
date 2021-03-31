import React, { PureComponent } from 'react';
import { Form, Row, Col, Select, Button, Input, DatePicker } from 'antd';
//@ts-ignore
import { formatMessage } from 'umi/locale';
import styles from './style.m.less';


//@ts-ignore
@Form.create()
class OperationBar extends PureComponent<any, any> {
  public handleValues = () => {
    this.props.form.validateFields((errors, values) => {
      this.props.search(values);
    })
  }
  public reset = () => {
    this.props.form.resetFields();
    this.props.search();
  }
  public render() {
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
          <Col span={6}>
              <Form.Item
                  style={{ display: 'inline-block', marginBottom: 0}}
                >
                  {getFieldDecorator('book_title')(
                    <Input  placeholder={'Book Title'}/>
                  )}
                </Form.Item>
          </Col>
        
          <Col span={6}>
            <div className={styles['operation-btn']}>
              <Button type="primary" icon="search" onClick={this.handleValues}>{formatMessage({ id: 'app.material.search' })}</Button>
            </div>
            <div className={styles['operation-btn']}>
              <Button onClick={this.reset}>{formatMessage({ id:  "app.material.reset" })}</Button>
            </div>
          </Col>
          <Col span={2}>
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
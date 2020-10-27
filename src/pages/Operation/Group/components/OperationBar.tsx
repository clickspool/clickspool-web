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
    const { form: { getFieldDecorator }, tags = new Map(), types = new Map() } = this.props;
    const Option = Select.Option;

    const tagsEl = [...tags].map(([k, v]) => {
      return <Option key={k} value={k}>{v}</Option>;
    });
    const typesEl = [...types].map(([k, v]) => {
      return (
        <Option key={k} value={k}>{v}</Option>
      );
    });

    return (
      <Form autoComplete='off' className={styles['search-wraper']}>
        <Row className={`operation-bar ${styles.operations}`} gutter={10} type='flex'>
          <Col span={8}>
            <Row className={styles.row}>
              <div className={styles.operation}>
                {getFieldDecorator('id')(<Input placeholder={formatMessage({ id: 'app.group.id' })} type='number' onPressEnter={this.handleValues} />)}
              </div>
              <div className={styles.operation}>
                {getFieldDecorator('name')(<Input placeholder={formatMessage({ id: 'app.group.name' })} onPressEnter={this.handleValues} />)}
              </div>
              <div className={styles.operation}>
                {getFieldDecorator('create_user_id')(<Input placeholder={formatMessage({ id: 'app.group.user_id' })} onPressEnter={this.handleValues} />)}
              </div>
            </Row>
            <Row className={styles.row}>
              <div className={styles.operation}>
                {getFieldDecorator('tag_id')(
                  <Select placeholder={formatMessage({ id: 'app.group.search.tags' })}>
                    <Option value='' className={styles.all}>{formatMessage({ id: 'app.group.search.all_tags' })}</Option>
                    {tagsEl}
                  </Select>)
                }
              </div>
              <div className={styles.operation}>
                {getFieldDecorator('group_type')(
                  <Select placeholder={formatMessage({ id: 'app.group.search.type' })}>
                    <Option value='' className={styles.all}>{formatMessage({ id: 'app.group.search.all_types' })}</Option>
                    {typesEl}
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
              <Button type="primary" onClick={this.props.add}>{formatMessage({ id: 'app.group.add' })}</Button>
            </div>
          </Col>
        </Row>
      </Form>
    );
  }
}
export default OperationBar;
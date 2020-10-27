import { Form, Row, div, Select, Button, Input, DatePicker } from 'antd';
import { PureComponent } from 'react';
import { formatMessage } from 'umi/locale';
import styles from './OperationBar.css';

@Form.create()
class OperationBar extends PureComponent {
  handleValues = () => {
    this.props.form.validateFields((errors, values) => {
      if (errors) return
      Object.keys(values).map(key => {
        if (!values[key]) return;
        if (values[key].format) {
          values[key] = values[key].format('YYYYMMDD');
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
    const { form: { getFieldDecorator, getFieldValue }, positions = new Map(), clients = new Map(), cates = [], statuses = {}, batchLoading, batchDisable, batchOnline, batchOffline, batchDelete } = this.props;
    const Option = Select.Option;
    let selectedPositions = [];

    const statusesEl = Object.keys(statuses).map(id => {
      let optionTitle = '';
      if (id == 0) {
        optionTitle = formatMessage({ id: 'app.face.tools.status.offline' });
      } else {
        optionTitle = formatMessage({ id: 'app.face.tools.status.online' });
      }
      return (
        <Option key={id} value={id}>{optionTitle}</Option>
      );
    });

    const inputWidth = 4, btnWidth = 2;
    return (
      <Form autoComplete='off' className={styles['search-wraper']}>
        <Row className={`operation-bar ${styles.operations}`} gutter={10} type='flex'>
          <div className={styles.operation}>
            {getFieldDecorator('advert_date')(<DatePicker placeholder={formatMessage({ id: 'app.advertisement.date' })} />)}
          </div>
          <div className={styles.operation}>
            {getFieldDecorator('platform')(<Input placeholder={formatMessage({ id: 'app.advertisement.platform' })} onPressEnter={this.handleValues} />)}
          </div>
          <div className={styles.operation}>
            {getFieldDecorator('country')(<Input placeholder={formatMessage({ id: 'app.advertisement.country' })} onPressEnter={this.handleValues} />)}
          </div>
          <div className={styles['operation-btn']}>
            <Button type="primary" icon="search" onClick={this.handleValues}>{formatMessage({ id: 'app.scene.tools.search.btn' })}</Button>
          </div>
          <div className={styles['operation-btn']}>
            <Button type="primary" onClick={this.reset}>{formatMessage({ id: 'app.scene.tools.search.reset' })}</Button>
          </div>
          {batchDelete && <div className={styles['operation-btn']}>
            <Button type="danger" onClick={batchDelete} loading={batchLoading} disabled={batchDisable}>{formatMessage({ id: 'app.advertisement.batch_delete' })}</Button>
          </div>}
          {batchOnline && <div className={styles['operation-btn']}>
            <Button type="primary" onClick={batchOnline} loading={batchLoading} disabled={batchDisable}>{formatMessage({ id: 'app.scene.tools.batch_online' })}</Button>
          </div>}
          {batchOffline && <div className={styles['operation-btn']}>
            <Button type="danger" onClick={batchOffline} loading={batchLoading} disabled={batchDisable}>{formatMessage({ id: 'app.scene.tools.batch_offline' })}</Button>
          </div>}
        </Row>
      </Form>
    );
  }
}
export default OperationBar;
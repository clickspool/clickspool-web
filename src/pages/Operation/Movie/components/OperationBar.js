import { Form, Row, div, Select, Button, Input } from 'antd';
import { PureComponent } from 'react';
import { formatMessage } from 'umi/locale';
import styles from './OperationBar.css';

@Form.create()
class OperationBar extends PureComponent {
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
    const { form: { getFieldDecorator, getFieldValue }, positions = new Map(), sdks, clients = new Map(), cates = [], statuses = {}, batchLoading, batchDisable, batchOnline, batchOffline } = this.props;
    const Option = Select.Option;
    let selectedPositions = [];

    const clientsEl = [...clients].map(client => {
      return <Option key={client[0]} value={client[0]}>{client[1]}</Option>;
    });
    const sdksEl = [...sdks].map(sdk => {
      if (!sdk[0]) { return }
      return <Option key={sdk[0]} value={sdk[0]}>{sdk[1]}</Option>;
    });
    const selectedCate = getFieldValue('cate_id');
    selectedPositions = [...positions].filter(item => {
      return selectedCate === item.pid;
    });
    // console.info('selectedPositions__', { selectedCate, selectedPositions, positions, cates });
    const positionEl = [...selectedPositions].map(position => {
      return <Option key={position.id} value={position.id}>{position.name}</Option>;
    });
    const statusesEl = Object.keys(statuses).map(id => {
      let status;
      if (+id === 1) {
        status = formatMessage({ id: 'app.scene.tools.online' });
      } else {
        status = formatMessage({ id: 'app.scene.tools.offline' });
      }

      return (
        <Option key={id} value={id}>{status}</Option>
      );
    });

    const inputWidth = 4, btnWidth = 2;
    return (
      <Form autoComplete='off' className={styles['search-wraper']}>
        <Row className={`operation-bar ${styles.operations}`} gutter={10} type='flex'>
          <div className={styles.operation}>
            {getFieldDecorator('id')(<Input placeholder={formatMessage({ id: 'app.movie.template.id' })} type='number' onPressEnter={this.handleValues} />)}
          </div>
          <div className={styles.operation}>
            {getFieldDecorator('name')(<Input placeholder={formatMessage({ id: 'app.movie.template.name' })} onPressEnter={this.handleValues} />)}
          </div>
          <div className={styles.operation}>
            {getFieldDecorator('sdk')(
              <Select placeholder={formatMessage({ id: 'app.movie.template.sdk_version' })}>
                <Option value='' className={styles.all}>{formatMessage({ id: 'app.movie.template.sdk_version.all' })}</Option>
                {sdksEl}
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
          <div className={styles['operation-btn']}>
            <Button type="primary" icon="search" onClick={this.handleValues}>{formatMessage({ id: 'app.scene.tools.search.btn' })}</Button>
          </div>
          <div className={styles['operation-btn']}>
            <Button type="primary" onClick={this.reset}>{formatMessage({ id: 'app.scene.tools.search.reset' })}</Button>
          </div>
          <div className={styles['operation-btn']}>
            <Button type="primary" onClick={batchOnline} loading={batchLoading} disabled={batchDisable}>{formatMessage({ id: 'app.scene.tools.batch_online' })}</Button>
          </div>
          <div className={styles['operation-btn']}>
            <Button type="danger" onClick={batchOffline} loading={batchLoading} disabled={batchDisable}>{formatMessage({ id: 'app.scene.tools.batch_offline' })}</Button>
          </div>
        </Row>
      </Form>
    );
  }
}
export default OperationBar;
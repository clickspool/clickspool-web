import { Form, Row, div, Select, Button, Input } from 'antd';
import { PureComponent } from 'react';
import { formatMessage } from 'umi/locale';
import styles from './OperationBar.css';

@Form.create()
class OperationBar extends PureComponent {
  handleValues = () => {
    this.props.form.validateFields((errors, values) => {
      if (errors) return
      const { positions } = this.props;
      const position = positions.find(item => {
        return item.id === values.position;
      });
      if (values.position && values.cate_id !== position.pid) {
        delete values.position;
      }
      this.props.search(values);
    })
  }
  reset = () => {
    this.props.form.resetFields();
    this.props.search();
  }
  render() {
    const { form: { getFieldDecorator, getFieldValue }, positions = new Map(), clients = new Map(), cates = [], statuses = {}, batchLoading, batchDisable, batchOnline, batchOffline } = this.props;
    const Option = Select.Option;
    let selectedPositions = [];

    const clientsEl = [...clients].map(client => {
      return <Option key={client[0]} value={client[0]}>{client[1]}</Option>;
    });
    const catesEl = cates.map(cate => {
      const statusEl = cate.status == 0 ? ` (${formatMessage({ id: 'app.scene.category.status_offline' })})` : '';
      let cateEl = cate.name;
      if (cate.status == 0) {
        cateEl = (<><span className={styles.offline}>{cate.name}{statusEl}</span></>);
      }
      return (
        <Option key={cate.id} value={cate.id}>{cateEl}</Option>
      );
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
      return (
        <Option key={id} value={id}>{statuses[id]}</Option>
      );
    });

    const inputWidth = 4, btnWidth = 2;
    return (
      <Form autoComplete='off' className={styles['search-wraper']}>
        <Row className={`operation-bar ${styles.operations}`} gutter={10} type='flex'>
          <div className={styles.operation}>
            {getFieldDecorator('id')(<Input placeholder={formatMessage({ id: 'app.scene.tools.id' })} type='number' onPressEnter={this.handleValues} />)}
          </div>
          <div className={styles.operation}>
            {getFieldDecorator('name')(<Input placeholder={formatMessage({ id: 'app.scene.tools.search.name' })} onPressEnter={this.handleValues} />)}
          </div>
          <div className={styles.operation}>
            {getFieldDecorator('cate_id')(
              <Select placeholder={formatMessage({ id: 'app.scene.tools.search.cate_name' })}>
                <Option value='' className={styles.all}>{formatMessage({ id: 'app.scene.tools.search.allcates' })}</Option>
                {catesEl}
              </Select>)
            }
          </div>
          <div className={styles.operation}>
            {getFieldDecorator('position')(
              <Select disabled={!(selectedPositions.length > 0)} placeholder={formatMessage({ id: 'app.meme.tools.search.position' })}>
                <Option value='' className={styles.all}>{formatMessage({ id: 'app.scene.tools.search.allpositions' })}</Option>
                {positionEl}
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
          <div className={styles.operation}>
            {getFieldDecorator('client_apply')(
              <Select placeholder={formatMessage({ id: 'app.scene.tools.search.client' })}>
                {clientsEl}
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
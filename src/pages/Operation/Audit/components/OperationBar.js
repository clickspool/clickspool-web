import { Form, Row, div, Select, Button, Input } from 'antd';
import { PureComponent } from 'react';
import { formatMessage } from 'umi/locale';
import styles from './OperationBar.css';

@Form.create()
class OperationBar extends PureComponent {
  handleValues = () => {
    this.props.form.validateFields((errors, values) => {
      if (errors) return
      // const { positions } = this.props;
      // const position = positions.find(item => {
      //   return item.id === values.position;
      // });
      // if (values.position && values.cate_id !== position.pid) {
      //   delete values.position;
      // }
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

    const statusesEl = [
      {
        id: 1,
        title: formatMessage({
          id: 'app.audit.status.waiting'
        })
      },
      {
        id: 2,
        title: formatMessage({
          id: 'app.audit.status.pass'
        })
      },
      {
        id: 3,
        title: formatMessage({
          id: 'app.audit.status.fail'
        })
      },
    ].map(({ id, title }) => {
      return (
        <Option key={id} value={id}>{title}</Option>
      );
    });
    const mcnEl = [
      {
        id: 0,
        title: formatMessage({
          id: 'app.audit.search.mcn.not'
        })
      },
      {
        id: 1,
        title: formatMessage({
          id: 'app.audit.search.mcn.is'
        })
      },
    ].map(({ id, title }) => {
      return (
        <Option key={id} value={id}>{title}</Option>
      );
    });

    const inputWidth = 4, btnWidth = 2;
    return (
      <Form autoComplete='off' className={styles['search-wraper']}>
        <Row className={`operation-bar ${styles.operations}`} gutter={10} type='flex'>
          <div className={styles.operation}>
            {getFieldDecorator('status')(
              <Select placeholder={formatMessage({ id: 'app.scene.tools.search.status' })}>
                <Option value='' className={styles.all}>{formatMessage({ id: 'app.scene.tools.search.allstatus' })}</Option>
                {statusesEl}
              </Select>)
            }
          </div>
          <div className={styles.operation}>
            {getFieldDecorator('is_mcn')(
              <Select placeholder={formatMessage({ id: 'app.audit.search.mcn' })}>
                {mcnEl}
              </Select>)
            }
          </div>
          <div className={styles['operation-btn']}>
            <Button type="primary" icon="search" onClick={this.handleValues}>{formatMessage({ id: 'app.scene.tools.search.btn' })}</Button>
          </div>
          <div className={styles['operation-btn']}>
            <Button type="primary" onClick={this.reset}>{formatMessage({ id: 'app.scene.tools.search.reset' })}</Button>
          </div>
          {batchOnline && <div className={styles['operation-btn']}>
            <Button type="primary" onClick={batchOnline} loading={batchLoading} disabled={batchDisable}>{formatMessage({ id: 'app.audit.option.pass.batch' })}</Button>
          </div>}
          {batchOffline && <div className={styles['operation-btn']}>
            <Button type="danger" onClick={batchOffline} loading={batchLoading} disabled={batchDisable}>{formatMessage({ id: 'app.audit.option.reject.batch' })}</Button>
          </div>}
        </Row>
      </Form>
    );
  }
}
export default OperationBar;
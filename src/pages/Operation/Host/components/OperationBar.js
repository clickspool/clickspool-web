import { Form, Row, Col, div, Select, Button, Input, DatePicker } from 'antd';
import { PureComponent } from 'react';
import get from 'lodash/get';
import { formatMessage } from 'umi/locale';
import styles from './OperationBar.less';

const { RangePicker } = DatePicker;
@Form.create()
class OperationBar extends PureComponent {
  handleValues = (extra) => {
    this.props.form.validateFields((errors, values) => {
      if (errors) return
      Object.keys(values).map(key => {
        if (!values[key]) return;
        if (key === 'range') {
          console.info('search_key__', values[key]);
          // values[key] = values[key].format('YYYY-MM-DD HH:mm:ss');
          let [begin_time, end_time] = values[key];
          values.begin_time = begin_time.format('YYYY-MM-DD HH:mm:ss');
          values.end_time = end_time.format('YYYY-MM-DD HH:mm:ss');
          delete values.range;
        }
      })

      this.props.search(values, get(extra || {}, 'export'));
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

    return (
      <Form autoComplete='off' className={styles['search-wraper']}>
        <Row className={`operation-bar ${styles.operations}`} gutter={10} type='flex'>
          <Col className={styles['search-col']} span={18}>
            <div className={`${styles.operation} ${styles.flex2}`}>
              <Form.Item label={formatMessage({ id: 'app.host.show.date.range' })}>
                {getFieldDecorator('range')(<RangePicker />)}
              </Form.Item>
            </div>
            <div className={`${styles.operation} ${styles.flex1}`}>
              <Form.Item label={formatMessage({ id: 'app.host.show.nickid' })}>
                {getFieldDecorator('nick_id')(<Input placeholder={formatMessage({ id: 'app.host.show.nickid' })} type='number' onPressEnter={this.handleValues} />)}
              </Form.Item>
            </div>
            <div className={`${styles.operation} ${styles.flex1}`}>
              <Form.Item label={formatMessage({ id: 'app.host.show.duration' })}>
                {getFieldDecorator('duration_min')(
                  <Select placeholder={formatMessage({ id: 'app.host.show.duration.placeholder' })}>
                    <Option value='' className={styles.all}>{formatMessage({ id: 'app.host.show.duration.all' })}</Option>
                    <Option value={30} className={styles.all}>{formatMessage({ id: 'app.host.show.duration.30' })}</Option>
                  </Select>)
                }
              </Form.Item>
            </div>
            <div className={`${styles.operation} ${styles.flex1}`}>
              <Form.Item label={formatMessage({ id: 'app.host.show.status' })}>
                {getFieldDecorator('status')(
                  <Select placeholder={formatMessage({ id: 'app.host.show.duration.placeholder' })}>
                    <Option value='' className={styles.all}>{formatMessage({ id: 'app.host.show.duration.all' })}</Option>
                    <Option value={1} className={styles.all}>{formatMessage({ id: 'app.host.show.status.on' })}</Option>
                    <Option value={2} className={styles.all}>{formatMessage({ id: 'app.host.show.status.off' })}</Option>
                  </Select>)
                }
              </Form.Item>
            </div>
          </Col>
          <Col className={styles['search-col']} span={6}>
            <div className={styles['operation-btn']}>
              <Button type="primary" icon="search" onClick={this.handleValues}>{formatMessage({ id: 'app.scene.tools.search.btn' })}</Button>
            </div>
            <div className={styles['operation-btn']}>
              <Button onClick={this.reset}>{formatMessage({ id: 'app.scene.tools.search.reset' })}</Button>
            </div>
            <div className={styles['operation-btn']}>
              <Button onClick={() => {
                this.handleValues({ export: 1 });
              }}>{formatMessage({ id: 'app.host.show.export' })}</Button>
            </div>
          </Col>
        </Row>
      </Form >
    );
  }
}
export default OperationBar;
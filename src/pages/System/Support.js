import { feedbackAdd } from '@/services/permission';

import { connect } from 'dva';

import { Input, Form, Modal, Select, message, Breadcrumb, Icon, Row, Col, Button } from 'antd';

import React from 'react';

import { formatMessage } from 'umi/locale';

import styles from './Permission.less';

const FormItem = Form.Item;

const Option = Select.Option;

@Form.create()
@connect(({ permission: { publisherInfo } }) => ({
  publisherInfo,
}))
class Index extends React.Component {

  onOk = () => {
    const {
      publisherInfo
    } = this.props;
    this.props.form.validateFields((err, values) => {
      if (!err) {
        feedbackAdd({ ...values })
        .then((res)=>{
          if(!res.code){
            this.props.form.resetFields();
          }
        })
      }
    });
  };
  onCancel = () => {
    this.props.onCallback();
  };
  uploadImage = () => { };
  componentDidMount() { }
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
    const {
      form: { getFieldDecorator },
      visible,
      publisherInfo,
    } = this.props;

    return (
      <>
        <div className={styles.breadcrumbBox}>
        <Breadcrumb style={{borderBottom:' 1px solid #ccc',paddingBottom:' 10px'}}>
            <Breadcrumb.Item>
              <Icon type="diff" />
              <span>{formatMessage({ id: 'menu.support' })}</span>
            </Breadcrumb.Item>
            {/* <Breadcrumb.Item>{formatMessage({ id: 'menu.support' })}</Breadcrumb.Item> */}
          </Breadcrumb>
        </div>
        <Row>
          <Col span={24} style={{
            background:' #fff',
            padding: '20px',
            borderRadius: '5px',
          }}>
            If you hava any question, please email to contactus@clickspool.com
            <Button type="primary" style={{marginLeft:'8px'}}>
                 <a href="mailto:contactus@clickspool.com"> Send Email</a>
            </Button>
                </Col>
            </Row>
      </>
    );
  }
}

export default Index;

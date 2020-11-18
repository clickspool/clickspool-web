import { modify, pModifyPublisher } from '@/services/permission';

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
        pModifyPublisher({...publisherInfo,...values})
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
              <Icon type="solution" />
              <span>{formatMessage({ id: 'menu.profile' })}</span>
            </Breadcrumb.Item>
            {/* <Breadcrumb.Item>{formatMessage({ id: 'menu.profile' })}</Breadcrumb.Item> */}
          </Breadcrumb>
        </div>
        <Row>
          <Col span={12} style={{
            background:' #fff',
            padding: '20px',
            borderRadius: '5px',
          }}>
            <Form>
              <FormItem
                {...formItemLayout}
                label={formatMessage({ id: 'app.permission.table.name' })}
              >
                {getFieldDecorator('nickname', {
                  initialValue: publisherInfo.nickname,
                  rules: [
                    {
                      required: true,
                      message: formatMessage({ id: 'app.global.form.pleaseName' }),
                    },
                  ],
                })(<Input placeholder={formatMessage({ id: 'app.permission.table.name' })}/>)}
              </FormItem>
              
              <FormItem
                {...formItemLayout}
                label={"First Name"}
              >
                {getFieldDecorator('first_name', {
                  initialValue: publisherInfo.first_name,
                  rules: [
                    {
                      required: true,
                      message: "Please input first name",
                    },
                  ],
                })(<Input placeholder={"First Name"}/>)}
              </FormItem>
              <FormItem
                {...formItemLayout}
                label={"Last Name"}
              >
                {getFieldDecorator('last_name', {
                  initialValue: publisherInfo.last_name,
                  rules: [
                    {
                      required: true,
                      message: "Please input last_name",
                    },
                  ],
                })(<Input  placeholder={"Last Name"}/>)}
              </FormItem>
              <FormItem
                {...formItemLayout}
                label={"Telephone"}
              >
                {getFieldDecorator('phone_number', {
                  initialValue: publisherInfo.phone_number,
                  rules: [
                    {
                      required: true,
                      message: "Please input telephone",
                    },
                  ],
                })(<Input placeholder={"Telephone"}/>)}
              </FormItem>
            </Form>
            <Row>
              <Col span={18} />
              <Col span={6} style={{textAlign:'center'}}>
                <Button type="primary" onClick={this.onOk}>
                  {formatMessage({ id: "app.permission.save" })}
                </Button>
              </Col>

            </Row>

          </Col>
        </Row>
      </>
    );
  }
}

export default Index;

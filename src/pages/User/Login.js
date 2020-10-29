import { connect } from 'dva';

import { Form, Icon, Input, Button } from 'antd';

import React, { Component } from 'react';

import router from 'umi/router';
import { FormattedMessage,setLocale } from 'umi/locale';

import { goLinkMenuKeys, goLinkRouter } from '../../../config/role.enum';

import styles from './Login.less';

const FormItem = Form.Item;

@connect(({ login, loading, memberInfo: { data: { keys } } }) => ({
  login,
  submitting: loading.effects['login/login'],
  keys,
}))
@Form.create()
class LoginPage extends Component {
  /**
   * 登陆 并 获取用户权限
   */
  handleSubmit = e => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        const { dispatch } = this.props;
        dispatch({
          type: 'login/login',
          payload: {
            ...values,
          },
        }).then(() => {
          const {
            login: { token },
          } = this.props;
          if (token) {
            dispatch({
              type: 'memberInfo/getMemberInfo',
              payload: {},
            }).then(() => {
              const { keys } = this.props;
              let key = '';
              for (var ii = 0; ii < goLinkMenuKeys.length; ii++) {
                if (keys.indexOf(goLinkMenuKeys[ii]) > -1) {
                  key = goLinkMenuKeys[ii];
                  break;
                }
              }
              router.push('/welcome');
            });
          }
        });
      }
    });
  };
 
  changeLan=()=>{
    // let lang = navigator.language||navigator.userLanguage;//常规浏览器语言和IE浏览器
    // lang = lang.substr(0, 2);
    // if(lang!='zh'){
      setLocale('en-US')
    // }
  }
  componentDidMount(){
    this.changeLan()
  }
  render() {
    const { getFieldDecorator } = this.props.form;
    return (
      <div>
        <div className={styles.main}>
          <Form onSubmit={this.handleSubmit} className="login-form">
            <FormItem>
              {getFieldDecorator('telephone', {
                rules: [{ required: true, message: 'Please input your phone!' }],
              })(
                <Input
                  prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
                  placeholder="Phone"
                />
              )}
            </FormItem>
            <FormItem>
              {getFieldDecorator('password', {
                rules: [{ required: true, message: 'Please input your Password!' }],
              })(
                <Input
                  prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
                  type="password"
                  placeholder="Password"
                />
              )}
            </FormItem>
            <FormItem>
              <Button type="primary" htmlType="submit" className="login-form-button" block>
                <FormattedMessage id="app.login.login" />
              </Button>
            </FormItem>
          </Form>
        </div>
      </div>
    );
  }
}

export default LoginPage;

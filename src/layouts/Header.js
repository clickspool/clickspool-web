import GlobalHeader from '@/components/GlobalHeader';
import TopNavHeader from '@/components/TopNavHeader';
import Authorized from '@/utils/Authorized';
import { removeAuthority } from '@/utils/authority';
import { modifySelfPassword } from '@/services/user';

import { connect } from 'dva';

import { Layout, message, Modal, Form, Input, Icon } from 'antd';

import React, { PureComponent } from 'react';

import { formatMessage } from 'umi/locale';

import Animate from 'rc-animate';

import router from 'umi/router';

import styles from './Header.less';

const { Header } = Layout;
const FormItem = Form.Item;

@Form.create()
class HeaderView extends React.Component {
  state = {
    visible: true,
    isUpataPsw: false,
  };

  static getDerivedStateFromProps(props, state) {
    if (!props.autoHideHeader && !state.visible) {
      return {
        visible: true,
      };
    }
    return null;
  }

  componentDidMount() {
    const { dispatch } = this.props;

    document.addEventListener('scroll', this.handScroll, { passive: true });
  }

  componentWillUnmount() {
    document.removeEventListener('scroll', this.handScroll);
  }

  getHeadWidth = () => {
    const { isMobile, collapsed, setting } = this.props;
    const { fixedHeader, layout } = setting;
    if (isMobile || !fixedHeader || layout === 'topmenu') {
      return '100%';
    }
    return collapsed ? 'calc(100% - 80px)' : 'calc(100% - 256px)';
  };
  compareToFirstPassword = (rule, value, callback) => {
    const form = this.props.form;
    if (value && value !== form.getFieldValue('password')) {
      callback('Two passwords that you enter is inconsistent!');
    } else {
      callback();
    }
  };

  validateToNextPassword = (rule, value, callback) => {
    const form = this.props.form;
    if (value && this.state.confirmDirty) {
      form.validateFields(['confirm'], { force: true });
    }
    callback();
  };
  handleOk = () => {
    this.props.form.validateFields((err, values) => {
      if (!err) {
        modifySelfPassword({ ...values }).then(res => {
          if (res && !res.code) {
            removeAuthority();
            router.push('/user/login');
          }
        });
      }
    });
  };
  confirm = () => {
    Modal.confirm({
      title: formatMessage({ id: 'app.config.message' }),
      content: formatMessage({ id: 'app.config.comfirmLogout' }),
      okText: formatMessage({ id: 'app.model.okText' }),
      cancelText: formatMessage({ id: 'app.model.cancel' }),
      onOk: close => {
        removeAuthority();
        close();
        router.push('/user/login');
      },
    });
  };

  handleNoticeClear = type => {
    message.success(
      `${formatMessage({ id: 'component.noticeIcon.cleared' })} ${formatMessage({
        id: `component.globalHeader.${type}`,
      })}`
    );
    const { dispatch } = this.props;
    dispatch({
      type: 'global/clearNotices',
      payload: type,
    });
  };

  handleMenuClick = ({ key }) => {
    const { dispatch } = this.props;
    // if (key === 'userCenter') {
    //   router.push('/account/center');
    //   return;
    // }
    // if (key === 'triggerError') {
    //   router.push('/exception/trigger');
    //   return;
    // }
    // if (key === 'userinfo') {
    //   router.push('/account/settings/base');
    //   return;
    // }
    if (key === 'updataPassword') {
      this.setState({
        isUpataPsw: true,
      });
      // this.confirm()
      // dispatch({
      //   type: 'login/logout',
      // });
    }
    if (key === 'logout') {
      this.confirm();
      // dispatch({
      //   type: 'login/logout',
      // });
    }
  };

  handleNoticeVisibleChange = visible => {
    if (visible) {
      const { dispatch } = this.props;
      dispatch({
        type: 'global/fetchNotices',
      });
    }
  };

  handScroll = () => {
    const { autoHideHeader } = this.props;
    const { visible } = this.state;
    if (!autoHideHeader) {
      return;
    }
    const scrollTop = document.body.scrollTop + document.documentElement.scrollTop;
    if (!this.ticking) {
      this.ticking = true;
      requestAnimationFrame(() => {
        if (this.oldScrollTop > scrollTop) {
          this.setState({
            visible: true,
          });
        }
        if (scrollTop > 300 && visible) {
          this.setState({
            visible: false,
          });
        }
        if (scrollTop < 300 && !visible) {
          this.setState({
            visible: true,
          });
        }
        this.oldScrollTop = scrollTop;
        this.ticking = false;
      });
    }
  };

  handleConfirmBlur = e => {
    const value = e.target.value;
    this.setState({ confirmDirty: this.state.confirmDirty || !!value });
  };

  compareToFirstPassword = (rule, value, callback) => {
    const form = this.props.form;
    if (value && value !== form.getFieldValue('password')) {
      callback('Two passwords that you enter is inconsistent!');
    } else {
      callback();
    }
  };

  validateToNextPassword = (rule, value, callback) => {
    const form = this.props.form;
    if (value && this.state.confirmDirty) {
      form.validateFields(['confirm'], { force: true });
    }
    callback();
  };
  handleCancel = () => {
    this.setState({
      isUpataPsw: false,
    });
  };

  render() {
    const { isMobile, handleMenuCollapse, setting } = this.props;
    const { navTheme, layout, fixedHeader } = setting;
    const { visible, isUpataPsw } = this.state;
    const { getFieldDecorator } = this.props.form;
    const isTop = layout === 'topmenu';
    const width = this.getHeadWidth();
    const HeaderDom = visible ? (
      <Header style={{ padding: 0, width }} className={fixedHeader ? styles.fixedHeader : ''}>
        {isTop && !isMobile ? (
          <TopNavHeader
            theme={navTheme}
            mode="horizontal"
            Authorized={Authorized}
            onCollapse={handleMenuCollapse}
            onNoticeClear={this.handleNoticeClear}
            onMenuClick={this.handleMenuClick}
            onNoticeVisibleChange={this.handleNoticeVisibleChange}
            {...this.props}
          />
        ) : (
          <GlobalHeader
            onCollapse={handleMenuCollapse}
            onNoticeClear={this.handleNoticeClear}
            onMenuClick={this.handleMenuClick}
            onNoticeVisibleChange={this.handleNoticeVisibleChange}
            {...this.props}
          />
        )}
      </Header>
    ) : null;
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 8 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 },
      },
    };
    return (
      <div>
        <Animate component="" transitionName="fade">
          {HeaderDom}
        </Animate>
        {!!isUpataPsw && (
          <Modal
            title={formatMessage({ id: 'app.config.password' })}
            visible={this.state.isUpataPsw}
            onOk={this.handleOk}
            onCancel={this.handleCancel}
            okText={formatMessage({ id: 'app.content.confirm' })}
            cancelText={formatMessage({ id: 'app.content.cancel' })}
          >
            <Form>
              <FormItem {...formItemLayout} label={formatMessage({ id: 'app.config.password' })}>
                {getFieldDecorator('password', {
                  rules: [
                    {
                      required: true,
                      message: formatMessage({ id: 'app.glob.pleaseInputPWD' }),
                    },
                    {
                      validator: this.validateToNextPassword,
                    },
                  ],
                })(<Input type="password" />)}
              </FormItem>
              <FormItem
                {...formItemLayout}
                label={formatMessage({ id: 'app.config.passwordagain' })}
              >
                {getFieldDecorator('confirm', {
                  rules: [
                    {
                      required: true,
                      message: formatMessage({ id: 'app.glob.pleaseInputPWDA' }),
                    },
                    {
                      validator: this.compareToFirstPassword,
                    },
                  ],
                })(<Input type="password" onBlur={this.handleConfirmBlur} />)}
              </FormItem>
            </Form>
          </Modal>
        )}
      </div>
    );
  }
}

export default connect(({ memberInfo, global, setting, loading }) => ({
  currentUser: memberInfo.data,
  collapsed: global.collapsed,
  fetchingNotices: loading.effects['global/fetchNotices'],
  notices: global.notices,
  setting,
}))(HeaderView);

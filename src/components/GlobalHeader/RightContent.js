/*
 * @Author: senla.liu
 * @Date: 2019-12-20 22:26:39
 * @LastEditors  : senla.liu
 * @LastEditTime : 2020-01-17 09:56:45
 * @FilePath: \\xchat-web/src/components/GlobalHeader/RightContent.js
 */
import { Spin, Menu, Icon, Dropdown, Avatar, Select } from 'antd';

import React, { PureComponent } from 'react';

import { FormattedMessage } from 'umi/locale';

import router from 'umi/router';

import SelectLang from '../SelectLang';

import styles from './index.less';

import { getGlobalCountryMap } from '@/services/api';

import get from 'lodash/get';

import { formatMessage } from 'umi/locale';

import qs from 'qs';

const {Option} = Select;

export default class GlobalHeaderRight extends PureComponent {

  state = {
    country:[],
    sell:0
  }

  getUnreadData = noticeData => {
    const unreadMsg = {};
    Object.entries(noticeData).forEach(([key, value]) => {
      if (!unreadMsg[key]) {
        unreadMsg[key] = 0;
      }
      if (Array.isArray(value)) {
        unreadMsg[key] = value.filter(item => !item.read).length;
      }
    });
    return unreadMsg;
  };

  handleChange = val => {
    if(val){
      router.replace({
        pathname: window.location.pathname,
        query: {
          global_system_state: val,
        },
      });
      return
    }
    router.replace({
      pathname: window.location.pathname,
    });
  }

  componentDidMount() {
    const query =qs.parse(window.location.search.substr(1));
    this.setState({
      sell : +(query.global_system_state||0)
    });
    getGlobalCountryMap()
    .then(res=>{
      const {code,data} = res;
      if(!code){
        this.setState({
          country:data
        })
      }
    })
  }

  render() {
    const { currentUser, onMenuClick, theme } = this.props;
    const { handleChange } = this;
    
    const menu = (
      <Menu className={styles.menu} selectedKeys={[]} onClick={onMenuClick}>
        <Menu.Item key="updataPassword">
          <Icon type="lock" />
          <FormattedMessage id="menu.account.password" defaultMessage="updata password" />
        </Menu.Item>
        <Menu.Item key="logout">
          <Icon type="logout" />
          <FormattedMessage id="menu.account.logout" defaultMessage="logout" />
        </Menu.Item>
      </Menu>
    );
    let className = styles.right;
    if (theme === 'dark') {
      className = `${styles.right}  ${styles.dark}`;
    }

    return (
      <div className={className}>
        <Select value={this.state.sell} style={{ width: 120 }} onChange={handleChange}>
            <Option value={0}>{formatMessage({ id: 'app.config.country' })}</Option>
            {
              get(this, 'state.country', []).map((item,index)=>{
                  return <Option value={item.id} key={index}>{item.name}</Option>
              })
            }
          </Select>
        <SelectLang className={styles.action} />
        {currentUser.nickname ? (
          <Dropdown overlay={menu}>
            <span className={`${styles.action} ${styles.account}`}>
              <Avatar
                size="small"
                className={styles.avatar}
                // src={currentUser.avatar}
                alt="avatar"
              >
                {currentUser.nickname.substr(-2)}
              </Avatar>
              <span className={styles.name}>{currentUser.nickname}</span>
            </span>
          </Dropdown>
        ) : (
          <Spin size="small" style={{ marginLeft: 8, marginRight: 8 }} />
        )}
      </div>
    );
  }
}

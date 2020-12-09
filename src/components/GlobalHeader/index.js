import { Icon } from 'antd';

import React, { PureComponent } from 'react';

import Link from 'umi/link';

import Debounce from 'lodash-decorators/debounce';

import RightContent from './RightContent';
import styles from './index.less';

export default class GlobalHeader extends PureComponent {
  componentWillUnmount() {
    this.triggerResizeEvent.cancel();
  }
  /* eslint-disable*/
  @Debounce(600)
  triggerResizeEvent() {
    // eslint-disable-line
    const event = document.createEvent('HTMLEvents');
    event.initEvent('resize', true, false);
    window.dispatchEvent(event);
  }
  toggle = () => {
    const { collapsed, onCollapse, isMobile } = this.props;
    onCollapse(!collapsed);
    this.triggerResizeEvent();
  };
  render() {
    const { collapsed, isMobile, logo } = this.props;
    return (
      <div className={styles.header}>
        {isMobile && (
          <>
            <Icon
              className={styles.trigger}
              type={collapsed ?  'menu-fold':'menu-unfold'}
              onClick={this.toggle}
            />
          </>
        )}
        <RightContent {...this.props} />
      </div>
    );
  }
}

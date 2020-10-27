import SelectLang from '@/components/SelectLang';

import React from 'react';

import Link from 'umi/link';
import { FormattedMessage } from 'umi/locale';

import logo from '../assets/logo.png';

import styles from './UserLayout.less';

class UserLayout extends React.PureComponent {
  render() {
    const { children } = this.props;
    return (
      // @TODO <DocumentTitle title={this.getPageTitle()}>
      <div className={styles.container}>
        <div className={styles.lang}>
          <SelectLang />
        </div>
        <div className={styles.content}>
          <div className={styles.top}>
            <div className={styles.header}>
              <Link to="/">
                <img alt="logo" className={styles.logo} src={logo} />
                <span className={styles.title}>clickspool</span>
              </Link>
            </div>
            <div className={styles.desc}>
                clickspool
              <span>
                <FormattedMessage id="layout.user.des" defaultMessage="运营管理系统" />
              </span>
            </div>
          </div>
          {children}
        </div>
      </div>
    );
  }
}

export default UserLayout;

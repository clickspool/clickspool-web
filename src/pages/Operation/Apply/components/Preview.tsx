import React, { PureComponent } from 'react';
import classnames from 'classnames/bind';
import styles from './Preview.less';
const cx = classnames.bind(styles);
class Preview extends PureComponent<any, any> {
  render() {
    const { url, visible, hide } = this.props;
    console.info('Preview__', { url, visible, hide });
    return (
      <div className={cx('wraper', { hide: !visible })}>
        <div className={styles.mask} onClick={hide}></div>
        <video className={styles.content} controls src={url} />
      </div>
    );
  }
}
export default Preview;
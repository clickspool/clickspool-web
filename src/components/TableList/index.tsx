import React, { useEffect, useState } from 'react';

import { Icon, Tooltip, Message } from 'antd';
import classnames from 'classnames/bind';
import copy from 'copy-to-clipboard';
import styles from './index.less';
import { contentDetail } from '@/services/content';

const cx = classnames.bind(styles);

export default function index(props) {
  const { list, types, merchantMap, setMine } = props;
  const [unfold, setUnfold] = useState({})
  useEffect(() => {

  }, []);

  if (!list.length) {
    return ''
  }
  return <div className={cx('table_list')}>
    <ul>
      {list.map((item, indexx) => {
        return <li key={indexx} className={indexx === +Object.keys(unfold)[0] ? cx('unfold') : ''}>
          <div className={cx('wrap_')}>
            <div className={cx('wrap_box', 'image_box')}>
              <img className={cx('image')} src={item.images[0]} />
            </div>
            <div className={cx('wrap_box','des_')}>
              {item.description}
            </div>
            {merchantMap[item.merchant_id] && <div className={cx('wrap_box', 'flex_box')}>
              {merchantMap[item.merchant_id]}
            </div>
            }
            <div className={cx('wrap_box', 'flex_box')}>
              <Tooltip title="Get Code">
                <div className={cx('icon_box')} onClick={() => {
                  if(item.promotion_url){
                     if (copy(item.promotion_url)) {
                      Message.success("copy success");
                    } else {
                      Message.error("copy fail");
                    }
                    return
                  }
                  setMine(item.mid);
                }}>
                  <Icon type="link" />
                </div>
              </Tooltip>
              <Tooltip title="Detailed information">
                <div className={cx('icon_box')} style={{marginLeft:'5px'}} onClick={() => {
                   props.handleDetail(item);
                 }}>
                  <Icon type="idcard" />
                </div>
              </Tooltip>
            </div>
            {item.type !== undefined && <div className={cx('wrap_box', 'flex_box')}>
              {types[item.type]}
            </div>
            }
          </div>
        </li>
      })}
    </ul>
  </div>

}

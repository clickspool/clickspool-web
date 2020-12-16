import React, { useEffect, useState } from 'react';

import { Icon, Tooltip, Message } from 'antd';
import classnames from 'classnames/bind';
import copy from 'copy-to-clipboard';
import styles from './index.less';

const cx = classnames.bind(styles);

export default function index(props) {
  const { list, types, merchantMap, promotion_url } = props;
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
            <div className={cx('des_')}>
              {item.description}
            </div>
            {merchantMap[item.merchant_id] && <div className={cx('wrap_box', 'flex_box')}>
              {merchantMap[item.merchant_id]}
            </div>
            }
            <div className={cx('wrap_box', 'flex_box')}>
              <Tooltip title="Get Code">
                <div className={cx('icon_box')} onClick={()=>{
                  if(copy('1111')){
                    Message.success("copy success");
                  }else{
                    Message.error("copy fail");
                  }
                }}>
                  <Icon type="link" />
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

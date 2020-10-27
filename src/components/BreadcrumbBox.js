
import {
  Breadcrumb,
  Icon,
} from 'antd';

import React, { PureComponent,Fragment } from 'react';
import Link from 'umi/link';

import styles from './BreadcrumbBox.less'


export default function BreadcrumbBox(props){
  return (
    <div className={`${styles.breadcrumbBox} ${props.className||''}`}>
              <Breadcrumb>
              {
                props.src.map((item,key)=>{
                 return (<Breadcrumb.Item key={key}>
                          {!!item.icon&&<Icon type={item.icon} />}
                          {!item.link&&<span>{item.name}</span>}
                          {!!item.link&&<Link to={item.link}>{item.name}</Link>}
                      </Breadcrumb.Item>)
                })
              }
              </Breadcrumb> 
       </div>
    )
}
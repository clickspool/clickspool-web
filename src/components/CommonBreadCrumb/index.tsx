import React from 'react';
import { Breadcrumb, Icon } from 'antd';

interface CommonBreadCrumbProps {
  items: { title: string, icon?: string }[],
}
const CommonBreadCrumb: React.FC<CommonBreadCrumbProps> = (props) => {
  const { items } = props;
  return (
    <Breadcrumb className='breadcrumb-box'  style={{borderBottom:' 1px solid #ccc',paddingBottom:' 10px'}} separator='/'>
      {
        items.map(item => (
          <Breadcrumb.Item key={item.title}>
            {!!item.icon && <Icon type={item.icon} style={{ marginRight: '4px' }} />}
            {item.title}
          </Breadcrumb.Item>
        ))
      }
    </Breadcrumb>
  );
}
export default CommonBreadCrumb;

import React from 'react';
import { Button, Icon } from 'antd';
import './tag.less';

export default function index(props) {

  return <div onClick={() => {
    props.onClick()
  }}>
    <style>
      {
        `
        .__wrap_{
          width:120px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          cursor: pointer;
        }
        .__wrap_ .name{
          text-align: center;
          cursor: pointer;
        }
        .__wrap_ img{
          width:100%;
          height:auto;
          cursor: pointer;
        }
        `
      }
    </style>
    {
      props.tag_id != 0 &&
      <div className='__wrap_'>
        <div className='name'>{props.name}</div>
        <img src={props.tag_info.icon_remote} />
      </div>
    }
    {
      props.tag_id == 0 &&
      <Button type="primary" icon="plus" size='small'>
        新增房间标签
    </Button>
    }
  </div>

}
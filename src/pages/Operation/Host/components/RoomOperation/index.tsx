import React from 'react';
import { Button, Popover, Popconfirm, Tooltip } from 'antd';
//@ts-ignore
import { formatMessage } from 'umi/locale';
import styles from './style.less';
class RoomOperation extends React.Component<any, any> {
  state = {
    popoverVisible: false,
  }
  handlePopoverVisibleChange = (visible) => {
    this.setState({
      popoverVisible: visible
    });
  }
  hidePopover = () => {
    this.setState({
      popoverVisible: false
    });
  }
  render() {
    const { info, dispatch, checkMember } = this.props;
    const { popoverVisible } = this.state;
    const { handlePopoverVisibleChange, hidePopover } = this;
    if (info.status == 2) {
      return '';
    }
    const select = [...new Array(6)].map((v, index) => {
      const order = index + 1;
      return (
        <div className={styles.orders} key={index}>
          <div className={styles.order} onClick={() => {
            dispatch({
              type: 'upperRooms/setRoomTop',
              payload: {
                room_id: info.id,
                action: 0,
                sort: index
              }
            }).then(() => {
              dispatch({
                type: 'show/reload',
              });
            });
            hidePopover();
          }}>{order}</div>
        </div>
      );
    })
    return (
      <>
        {info.is_top ?
          <Tooltip title={formatMessage({ id: 'app.host.upper.room.unsetTop' })}>
            <Button onClick={() => {
              dispatch({
                type: 'upperRooms/setRoomTop',
                payload: {
                  room_id: info.id,
                  action: 1,
                }
              }).then(() => {
                dispatch({
                  type: 'show/fetchSingle',
                  payload: {
                    id: info.id
                  }
                });
              });
            }} size="small">{`${formatMessage({ id: 'app.host.upper.room.setToped' })} ${+info.order + 1}`}</Button>
          </Tooltip>
          :
          <Popover
            content={select}
            trigger="click"
            visible={popoverVisible}
            onVisibleChange={handlePopoverVisibleChange}
            overlayClassName={styles.sort}
          >
            <Button type="primary" size="small">{formatMessage({ id: 'app.host.upper.room.setTop' })}</Button>
          </Popover>
        }
        <Button
          type="primary"
          size="small"
          style={{ marginLeft: '8px' }}
          onClick={checkMember}
        >{formatMessage({ id: 'app.host.upper.checkUser' })}</Button>
        <Popconfirm
          title={formatMessage({ id: 'app.host.upper.room.close' })}
          onConfirm={() => {
            dispatch({
              type: 'upperRooms/closeRoom',
              payload: {
                room_id: info.id,
              }
            }).then(() => {
              dispatch({
                type: 'show/fetchSingle',
                payload: {
                  id: info.id
                }
              });
            });
          }}
          okText={formatMessage({ id: 'app.host.upper.room.confirm.yes' })}
          cancelText={formatMessage({ id: 'app.host.upper.room.confirm.no' })}
        >
          <Button
            type="danger"
            size="small"
            style={{ marginLeft: '8px' }}
          >{formatMessage({ id: 'app.host.upper.room.close' })}</Button>
        </Popconfirm>
      </>
    )
  }
}

export default RoomOperation;
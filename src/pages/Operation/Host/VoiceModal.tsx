import React from 'react';
import { Modal, Select, Tag } from 'antd';
import { fetch, setRoomTag } from '@/pages/Operation/VoiceTag/services';


export default class Index extends React.Component {
  constructor(props) {
    super(props);
  }

  state = {
    list: [],
    value: props.tag_id,
  }

  componentDidMount() {
    fetch({ page_size: 200, page: 1 })
      .then(res => {
        console.log(res, 'res')
        if (res.code == 0) {
          this.setState({
            list: res.data.list
          })
        }
      })
  }

  render() {
    const { list, value} = this.state;
    const items = this.state.value != '0' ? { value: this.state.value } : {};
    return (
      <Modal
        title="选择标签"
        visible={true}
        onOk={() => {
          if(this.props.id && value ==0){
            this.props.onCancel()
            return
          }
          setRoomTag({
            room_id:this.props.id,
            tag_id:value
          }).then((res)=>{
            if(res.code==0){
              this.props.onCancel(1,this.props.id)
            }else{
              this.props.onCancel()
            }
          })
        
        }}
        onCancel={() => {
          this.props.onCancel()
        }}
        width="400px"
      >
        <style>
          {
            `
              .s_option{
                width:100%;
                height:30px;
                white-space:nowrap
              }
              .s_option img{
                width:60px;
                height:30px;
                float:left
              }
              .s_option .name{
                float:left;
                margin-left:4px;
                margin-right:6px;
                line-height:30px;
              }
              `
          }
        </style>

        <Select
          style={{ width: 300, height: 30 }}
          {...items}
          placeholder="请选择标签"
          onChange={(v) => {
            this.setState({
              value: v
            })
          }}
        >
          {
            !!list.length && list.map((item, index) => {
              return <Select.Option value={item.id} key={index}>
                {<p className={'s_option'}><img src={item.icon_remote} /> <span className={'name'}>{item.name}</span><Tag color={item.status == 1 ? 'green' : 'grey'}>{item.status == 1 ? '上架' : '下架'}</Tag></p>}
              </Select.Option>
            })
          }
        </Select>
      </Modal>
    );
  }
}
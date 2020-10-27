import { getPlatform } from '@/utils/utils';
import { del } from '@/services/setting';

import { connect } from 'dva';

import { Input, Button, Tag, Popconfirm, Icon,Tabs } from 'antd';

import React from 'react';

import { formatMessage } from 'umi/locale';

import styles from './Setting.less';

const { TextArea } = Input;
const TabPane = Tabs.TabPane

@connect(({ settingInfo }) => ({
  settingInfo,
}))
class SettingBox extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.handleEditVisible = this.handleEditVisible.bind(this);
  }
  state={
    editTag:'1'
  }
  componentDidMount() {
    
  }
  async handleEditVisible() {
    const { dispatch, vmdata } = this.props;
    const {editTag} = this.state;
   
   await dispatch({
      type: 'settingInfo/editInfo',
      payload:editTag?vmdata[editTag]:vmdata[(Object.keys(vmdata).length==2)?'1':Object.keys(vmdata)[0]]
    })
   await dispatch({
      type: 'settingInfo/editModelVisble',
      payload: { editModel: true },
    });
  }
  handleDel = () => {
    const {editTag } = this.state;
    const { dispatch, id,vmdata } = this.props;
   
    del({ id:(editTag?vmdata[editTag]:vmdata[(Object.keys(vmdata).length==2)?'1':Object.keys(vmdata)[0]])['id'] }).then(res => {
      if (res && !res.code) {
        this.props.onCallBack();
      }
    });
  };
  callback=(key)=>{
    this.setState({
      editTag:key
    })
  }
  render() {
    const {vmdata } = this.props;
    const {callback } = this;
    
    return (
      <div className={styles.settingBox}>
        <div className={styles.bt10}>
        {vmdata[1]&&<span>
            {vmdata[1].name} [{vmdata[1].title}]：
          </span>
        }
         {vmdata[2]&&!vmdata[1]&&<span>
            {vmdata[2].name} [{vmdata[2].title}]：
          </span>
        }
           {vmdata[1]&&<Tag color="green">{getPlatform(vmdata[1].platform)}</Tag>}
          {vmdata[2]&&<Tag color="green">{getPlatform(vmdata[2].platform)}</Tag>}
          {vmdata[1]&&<Tag color="blue">{vmdata[1].type|| formatMessage({ id: 'app.global.form.defaultType' })}</Tag>}
          {!vmdata[1]&&vmdata[2]&&<Tag color="blue">{vmdata[2].type || formatMessage({ id: 'app.global.form.defaultType' })}</Tag>}
          <div className={styles.fr}>
            <Popconfirm
              title="Are you sure？"
              key={this.props.id}
              onConfirm={this.handleDel}
              icon={<Icon type="question-circle-o" style={{ color: 'red' }} />}
            >
              <Button type="danger" size="default" style={{ marginRight: '10px' }}>
                {formatMessage({ id: 'app.push.del' })}
              </Button>
            </Popconfirm>
            <Button type="primary" size="default" onClick={this.handleEditVisible}>
              {formatMessage({ id: 'app.config.edit' })}
            </Button>
          </div>
        </div>
        {vmdata[2]&&vmdata[1]&&
          <Tabs defaultActiveKey='1' onChange={callback}>
              <TabPane tab={getPlatform(vmdata[1].platform)} key='1' >
              <TextArea rows={6} value={vmdata[1].value} />
              </TabPane>
              <TabPane tab={getPlatform(vmdata[2].platform)} key='2'>
                  <TextArea rows={6} value={vmdata[2].value} />
              </TabPane>
          </Tabs>
        }
        {(vmdata[1]&&!vmdata[2])&&  
          <TextArea rows={6} value={vmdata[1].value} />
        }
         {(vmdata[2]&&!vmdata[1])&&  
          <TextArea rows={6} value={vmdata[2].value} />
        }
      </div>
    );
  }
}
export default SettingBox;

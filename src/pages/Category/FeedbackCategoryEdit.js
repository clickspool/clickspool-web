import { modifyFaqCate, addFaqCate,delFaqCate } from '@/services/faq';
import { Input, Form, Modal,Switch,Icon,Select ,Row,Col,message   } from 'antd';
import { connect } from 'dva';
import styles from './category.less'
import React,{Fragment} from 'react';
import { formatMessage } from 'umi/locale';
import _ from 'lodash';

import { removeObjUndefined, checkRate } from '@/utils/utils';

const FormItem = Form.Item;

@Form.create()
@connect(
  ({
    global:{
      languageList
    },
    feedbackcate: {
      data: {list},
      faqCateStatusList,
      posmap
    },
  }) => ({
    list,
    faqCateStatusList,
    languageList,
    posmap
  })
)
class FeedbackCategoryEdit extends React.Component {
  state={
    is_recommend:1,
    modifyList:{},
    multi_name:[]
  }
  onOk = () => {
    const {is_recommend,modifyList,multi_name} = this.state;
    this.props.form.validateFields((err, values) => {
      if (!err) {
        let params = values;
        params = removeObjUndefined(params);
        if(!multi_name.length){
          return message.warning(formatMessage({ id:'app.glob.mustOne' }));
        }
        if(!values.display_pos.length){
          return message.warning(formatMessage({ id:'app.glob.selectPos' }));
        }
        if (params.sort) {
          if (!checkRate(params.sort)) {
            return message.warning(formatMessage({ id: 'app.glob.pleaseInputNum' }));
          } else {
            if (parseInt(params.sort) < 0 || /\./g.test(params.sort + '')) {
              return message.warning(formatMessage({ id: 'app.glob.pleaseInputZindex' }));
            }
          }
        }
        params = _.merge({},modifyList,params,{is_recommend,display_pos:values.display_pos.join(',')},{multi_name:JSON.stringify(multi_name)})
        modifyFaqCate(params).then(res => {
          if (res && !res.code) {
            this.props.onCallback('refresh');
          }
        });
      }
    });
  };
  onCancel = () => {
    this.props.onCallback();
  };
  onChangeSwitch=(checked,ev)=>{
     this.setState({
        is_recommend:~~checked
     })
  }
  onChangeName=(ev)=>{
    const {multi_name} = this.state;
    const {name,value} = ev.target;
    const initValue = !!value?[{lan:parseInt(name),name:value}]:[];
    const nameResult = multi_name.reduce((pre,cur)=>{
      if(name != cur.lan){
        pre.push(cur)
      }
      return pre
    },[])
    this.setState({
      multi_name:[...nameResult,...initValue]
    },()=>{ 
      // console.log(this.state.multi_name,'multi_name')
    })
  }
  componentDidMount() {
    const {modifyId,list,dispatch} = this.props;
    if(modifyId){
      const modifyList = list.filter((item)=>{
        if(item.id==modifyId){
            return item
        }
    })
    this.setState({
      modifyList:modifyList[0],
      is_recommend:modifyList[0].is_recommend,
      multi_name:JSON.parse(modifyList[0].multi_name||'[]')
    })
    }
    dispatch({
      type: 'feedbackcate/faqCateDisplayPosMap',
    });
  }
  render() {
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 6 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 18 },
      },
    };
    const {
      form: { getFieldDecorator },
      faqCateStatusList,
      languageList,
      posmap
    } = this.props;
    const {is_recommend,modifyList, multi_name} = this.state;
    const defaultVal = (item,multi_name)=>{
      if(!multi_name){
        return '';
      }
     return !!multi_name.length&&multi_name.filter((iitem)=>{return iitem.lan==item.value})[0]?multi_name.filter((iitem)=>{return iitem.lan==item.value})[0]['name']:''
    }
    return (
        <Modal
          title={formatMessage({ id: 'app.versions.edit' })}
          cancelText={formatMessage({ id: 'app.model.cancel' })}
          okText={formatMessage({ id: 'app.model.okText' })}
          onOk={this.onOk}
          onCancel={this.onCancel}
          width="1000px"
          visible={true}
        >
        {
          !!languageList.length&&(
            <Fragment>
               <Row>
                { languageList.map((item,index)=>(
                      <Col span={8} key={index}>
                        <Row style={{marginBottom:'24px'}}>
                            <Col span={10}><p className={styles['lan-wrap-label']}>{`${item.name}${formatMessage({ id:'app.group.table.name' })}`}</p></Col>
                            <Col span={14}>
                                <Input name={`${item.value}`} onChange={this.onChangeName} defaultValue={defaultVal(item,multi_name)}  placeholder={`${item.name}${formatMessage({ id:'app.group.table.name' })}`}/>
                            </Col>
                        </Row>
                      </Col>
                  ))
                }
              </Row>
            </Fragment>
          )
        }
          <Form>
            <FormItem {...formItemLayout} label={formatMessage({ id: 'app.group.table.des' })}>
              {getFieldDecorator('desc',{
                initialValue: modifyList.desc||'',
              })(<Input />)}
            </FormItem>
            <FormItem {...formItemLayout} label={formatMessage({ id: 'app.group.table.sort' })}>
              {getFieldDecorator('sort',{
                initialValue: modifyList.sort||'',
              })(<Input />)}
            </FormItem>
            <FormItem {...formItemLayout} label={formatMessage({ id: 'app.activity.status' })}>
                  {getFieldDecorator('status', {
                    initialValue: modifyList.status||Object.keys(faqCateStatusList)[0],
                  })(
                    <Select>
                        {
                          Object.keys(faqCateStatusList).map((item)=>(
                              <Select.Option value={item} key={item}>{faqCateStatusList[item]}</Select.Option>
                            ))  
                        }
                    </Select>
                  )}
              </FormItem>
              {!!posmap.length&&<FormItem {...formItemLayout} label={formatMessage({ id: 'app.faq.pos' })}>
                {getFieldDecorator('display_pos', {
                      initialValue: modifyList.display_pos?modifyList.display_pos.split(','):[],
                    })(
                      <Select  mode="multiple" placeholder={formatMessage({ id: 'app.glob.selectPos' })}>
                          {
                            posmap.map((item,index)=>(
                                <Select.Option value={item.value+''} key={index}>{item.name}</Select.Option>
                              ))  
                          }
                      </Select>
                    )}
              </FormItem>}
            <FormItem {...formItemLayout} label={formatMessage({ id: 'app.feedbackcategory.is_recommend' })}>
              {getFieldDecorator('is_recommend')(
                <Switch checkedChildren={<Icon type="check" />} unCheckedChildren={<Icon type="close" />} defaultChecked={!!parseInt(is_recommend)} onChange={this.onChangeSwitch}/>
              )}
            </FormItem>
          </Form>
        </Modal>
      )
  }
}

export default FeedbackCategoryEdit;

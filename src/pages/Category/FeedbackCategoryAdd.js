import { modifyFaqCate, addFaqCate,delFaqCate } from '@/services/faq';
import { Input, Form, Modal,Switch,Icon,Select ,Row,Col ,message } from 'antd';
import { connect } from 'dva';
import React, {Fragment}from 'react';
import { formatMessage } from 'umi/locale';
import _ from 'lodash';
import { removeObjUndefined, checkRate } from '@/utils/utils';
import styles from './category.less'


const FormItem = Form.Item;

@Form.create()
@connect(
  ({
    global:{
      languageList
    },
    feedbackcate: {
      faqCateStatusList,
      posmap
    },
  }) => ({
    faqCateStatusList,
    languageList,
    posmap
  })
)
class FeedbackCategoryAdd extends React.Component {
  state={
    is_recommend:1,
    multi_name:[]
  }
  onOk = () => {
    const {is_recommend,multi_name} = this.state;
    this.props.form.validateFields((err, values) => {
      console.log(values,'values');
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
              return message.warning(formatMessage({ id:'app.glob.pleaseInputZindex'}));
            }
          }
        }
        params = _.merge({},params,{is_recommend,display_pos:values.display_pos.join(',')},{multi_name:JSON.stringify(multi_name)})
        addFaqCate(params).then(res => {
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
    console.log(checked,'checked')
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
    const { dispatch } = this.props;
 
    dispatch({
      type: 'feedbackcate/faqCateDisplayPosMap',
    });
  }
  render() {
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 4 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 20 },
      },
    };
    const {
      form: { getFieldDecorator },
      faqCateStatusList,
      languageList,
      posmap
    } = this.props;
    const {is_recommend} = this.state;

    return (
        <Modal
          title={formatMessage({ id: 'app.versions.add' })}
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
                                <Input name={`${item.value}`} onChange={this.onChangeName} placeholder={`${item.name}${formatMessage({ id:'app.group.table.name' })}`}/>
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
              {getFieldDecorator('des')(<Input />)}
            </FormItem>
            <FormItem {...formItemLayout} label={formatMessage({ id: 'app.group.table.sort' })}>
              {getFieldDecorator('sort')(<Input />)}
            </FormItem>
            <FormItem {...formItemLayout} label={formatMessage({ id: 'app.activity.status' })}>
                  {getFieldDecorator('status', {
                    initialValue: Object.keys(faqCateStatusList)[0],
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
           {!!posmap.length&& 
           <FormItem {...formItemLayout} label={formatMessage({ id: 'app.faq.pos' })}>
              {getFieldDecorator('display_pos', {
                    initialValue: [],
                  })(
                    <Select mode="multiple" placeholder={formatMessage({ id: 'app.glob.selectPos' })}>
                        {
                          posmap.map((item,index)=>(
                              <Select.Option value={item.value} key={index}>{item.name}</Select.Option>
                            ))  
                        }
                    </Select>
                  )}
            </FormItem>}
            <FormItem {...formItemLayout} label={formatMessage({ id: 'app.feedbackcategory.is_recommend' })}>
              {getFieldDecorator('is_recommend',{
                valuePropName:'checked',
                initialValue: !!is_recommend
              })(
                <Switch checkedChildren={<Icon type="check" />} unCheckedChildren={<Icon type="close" />}/>
              )}
            </FormItem>
          </Form>
        </Modal>
      )
  }
}

export default FeedbackCategoryAdd;

import React, { Component } from 'react';
import { Row, Col, Card,Breadcrumb,Icon,Form, Input,Select,Switch,Button,Modal,message,   } from 'antd';
import { delFaq,modifyFaq,addFaq ,getFaqInfo} from '@/services/faq';
import { formatMessage } from 'umi/locale';
import Link from 'umi/link';
import _ from 'lodash';
import { connect } from 'dva';
import { EditorState, convertToRaw, ContentState } from 'draft-js';
import { Editor } from 'react-draft-wysiwyg';
import draftToHtml from 'draftjs-to-html';
import htmlToDraft from 'html-to-draftjs';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import styles from './Group.less';
import router from 'umi/router';
import apiConfig from '@/utils/apiConfig';
import { getAuthority } from '@/utils/authority';
import QRCode from 'qrcode.react';

const formItemLayout = {
    labelCol: { span: 2 },
    wrapperCol: { span: 10 },
  };
const formTailLayout = {
    labelCol: { span: 4 },
    wrapperCol: { span: 8, offset: 4 },
};
const { Option } = Select;
@connect(
    ({
      customer: {
        category,
        version,
      },
      routing: {
        location: { pathname },
      },
      memberInfo: {
        data: { keys },
      },
      faq:{
        data: { list, page, total_count },
        statusList
      }
    }) => ({
      list,
      page,
      total_count,
      keys,
      pathname,
      category,
      version,
      statusList,
    })
  )
  @Form.create()
class FaqEdit extends Component {
    constructor(props) {
        super(props);
        const html = '';
        const contentBlock = htmlToDraft(html);
        let editorState  = null;
        if (contentBlock) {
          const contentState = ContentState.createFromBlockArray(contentBlock.contentBlocks);
          editorState = EditorState.createWithContent(contentState);
        }
          this.state = {
            editorState,
            oldHtml:'',
            isFocusTextArea:false,
            editorContent: undefined,
            defaultChecked:false,
            previewurl:/test/.test(apiConfig)?`http://test-h5.xuansky.cn/faqdetail/index.html?type=help&id=`:`http://h5.feishiapp.com/faqdetail/index.html?type=help&id=`,
            showPreview:false,
            id:'',
            filter:{
                title:'',
                content:'',
                category:'',
                status:0,
                is_recommend:false,
                sort:'',
            }
          };
        }
      
    // state = {
    //     editorContent: undefined,
    //     contentState:  EditorState.createEmpty(),
    //     editorState: EditorState.createEmpty(),
    // };

    onEditorChange = (editorContent) => {
        this.setState({
            editorContent,
        });
    };

    clearContent = () => {
        this.setState({
            contentState: '',
        });
    };

    onContentStateChange = (contentState) => {
        console.log('contentState', contentState);
    };

    onEditorStateChange = (editorState) => {
        this.setState({
            editorState,
        });
    };

    imageUploadCallBack = file => new Promise(
        (resolve, reject) => {
            const xhr = new XMLHttpRequest(); // eslint-disable-line no-undef
            //  xhr.open('POST', 'https://api.imgur.com/3/image');
            
             xhr.open('POST', `${apiConfig}/admin/upload/uploadImage`);
            // xhr.setRequestHeader('Authorization', 'Client-ID 8d26ccd12712fca');
            const data = new FormData(); // eslint-disable-line no-undef
            // data.append('image', file);
            data.append('uploadImage', file);
            data.append('token', getAuthority());
            xhr.send(data);
            xhr.addEventListener('load', () => {
                const response = JSON.parse(xhr.responseText);
                resolve(response);
            });
            xhr.addEventListener('error', () => {
                const error = JSON.parse(xhr.responseText);
                reject(error);
            });
        }
    );

    async getEnumList() {
        const { dispatch } = this.props;
        await (() => {
          dispatch({
            type: 'permission/getRoleList',
          });
        })();
        await (() => {
          dispatch({
            type: 'permission/getMemberStatusList',
          });
          dispatch({
            type: 'customer/getCategory',
          });
        })();
        dispatch({
          type: 'faq/getFaqCateStatusList',
        });
        dispatch({
            type: 'customer/getAllVersion',
          });
      }
      updataConfiList() {
        this.setState({
            id:this.props.match.params.id
        })  
        getFaqInfo(
          {id:this.props.match.params.id}
        ).then((res)=>{
          if(res&&!res.code){
            const html = res.data.content;
            const contentBlock = htmlToDraft(html);
            if (contentBlock) {
              const contentState = ContentState.createFromBlockArray(contentBlock.contentBlocks);
              const editorState = EditorState.createWithContent(contentState);
              this.setState({
                editorState,
                oldHtml:html,
                filter:{
                  title:res.data.title,
                  content:res.data.content,
                  category:res.data.category,
                  status:res.data.status,
                  is_recommend:res.data.is_recommend==0?false:true,
                  sort:res.data.sort,
                  version:res.data.version,
              }
              })
            }
          }
        })
      }
      handleAddFaq=(index)=>{
        const {filter,editorState,editorContent,id,isFocusTextArea,oldHtml} = this.state;
        this.props.form.validateFields((err, values) => {
            if(err){
                message.warn(Object.values(err)[0].errors[0].message)
                return
            }
            let arg;
           
            arg = Object.assign({},filter,values,{id}) ;
            if(!values.content&&!isFocusTextArea){
                arg.content = oldHtml
            }else{
                arg.content = draftToHtml(editorContent)+'';
            }
           
            arg.is_recommend = arg.is_recommend?1:0;
            if(index==1){
                modifyFaq(
                    arg
                )
                  .then((res)=>{
                      if(res&&!res.code){
                        this.setState({
                            previewurl:`${this.state.previewurl}${id}`
                        },()=>{
                            setTimeout(()=>{
                                this.handleCancelPage()
                              },2000)
                        });
                      }
                  })
                return
            }
            if(index==2){
                modifyFaq(
                    Object.assign({},arg,{status:1})
                )
                  .then((res)=>{
                      if(res&&!res.code){
                        this.setState({
                            previewurl:`${this.state.previewurl}${id}`
                        },()=>{
                            setTimeout(()=>{
                                this.handleCancelPage()
                              },2000)
                        });
                      }
                  })
                return
            }
            if(index==3){
                modifyFaq(
                    Object.assign({},arg,{status:0})
                )
                  .then((res)=>{
                      if(res&&!res.code){
                          setTimeout(()=>{
                            this.handleCancelPage()
                          },2000)
                          
                        
                      }
                  })
                return
            }
        })
      }

      componentDidMount() {
        this.getEnumList().then(() => {
          this.updataConfiList();
        });
      }
      handleCancel=()=>{
        this.setState({
            showPreview:false
        })
      }
      handleCancelPage=()=>{
            router.push('/feedback/faq');
      }

      handleSwitch=(item)=>{
        this.setState({
            filter:Object.assign({},this.state.filter,{is_recommend:item})
        })
      }

    render() {
        const { editorContent, editorState, } = this.state;
        const {category,statusList,version} = this.props;
        const { getFieldDecorator } = this.props.form;

        return (
          <div>
              <style>
                  {
                      `
                      .sup-required{
                          color:#f5222d;
                          margin-right:2px;
                      }
                      .web .ant-modal{
                          width:auto !important
                      }
                      .web .ant-modal .ant-modal-body{
                          padding:16px !important;
                      }
                      .public-DraftStyleDefault-block{
                          margin:0;
                      }
                      `
                  }
              </style>
            <div className={styles.breadcrumbBox}>
            <Breadcrumb style={{borderBottom:' 1px solid #ccc',paddingBottom:' 10px'}}>
                <Breadcrumb.Item>
                  <Icon type="lock" />
                  <span>{formatMessage({ id: 'menu.feedback' })}</span>
                </Breadcrumb.Item>
                <Breadcrumb.Item>
                    <Link to="/feedback/faq">{formatMessage({ id: 'menu.feedback.faq' })}</Link>
                </Breadcrumb.Item>
                <Breadcrumb.Item>{formatMessage({ id:  'app.faq.edit' })}</Breadcrumb.Item>
              </Breadcrumb>
            </div>
         
            <div className="gutter-example button-demo">
                <Row gutter={16}>
                    <Col className="gutter-row" md={24}>
                        <div className="gutter-box">
                            <Card title={formatMessage({ id:'menu.feedback.faq' })} bordered >
                            <Form layout="vertical">
                                    <Form.Item {...formItemLayout} label={formatMessage({ id: 'app.faq.title' })+'：'}>
                                        {getFieldDecorator('title', {
                                            rules: [{
                                            required: true,
                                            message: formatMessage({ id: 'app.faq.pleasetitle' }),
                                            }],
                                            initialValue: this.state.filter.title,
                                        })(
                                            <Input placeholder={formatMessage({ id: 'app.faq.pleasetitle' })}/>
                                        )}
                                    </Form.Item>
                                    <Form.Item {...formItemLayout} label={formatMessage({ id: 'app.faq.id' })+'：'}>
                                        {getFieldDecorator('sort',{
                                            initialValue: this.state.filter.sort,
                                        })(
                                            <Input placeholder={formatMessage({ id: 'app.faq.pleasesort' })}/>
                                        )}
                                    </Form.Item>
                                    <Form.Item  {...formItemLayout}  label={formatMessage({ id: 'app.faq.isrecommend' })+'：'}>
                                            {getFieldDecorator('is_recommend', {
                                                initialValue: this.state.filter.is_recommend,
                                            })(
                                                <Switch onChange={this.handleSwitch} checkedChildren={formatMessage({ id:'app.faq.yes'})} unCheckedChildren={formatMessage({ id:'app.faq.no'})} checked={this.state.filter.is_recommend} />
                                            )}
                                    </Form.Item>
                                    <Form.Item  {...formItemLayout}  label={formatMessage({ id: 'app.feedback.issueCategory' })+'：'}>
                                        {getFieldDecorator('category', {
                                            initialValue:this.state.filter.category,
                                        })(
                                        <Select
                                            placeholder={formatMessage({ id: 'app.faq.pleaseCategory'})}
                                        >
                                            {/* <Option value="">
                                            {formatMessage({ id: 'app.feedback.allIssueCategory' })}
                                            </Option> */}
                                            {category.map((item,index) => {
                                            return (
                                                <Option key={index} value={item.id}>
                                                {item.name}
                                                </Option>
                                            );
                                            })}
                                        </Select>
                                        )}
                                    </Form.Item>
                                    <Form.Item {...formItemLayout}  label={formatMessage({ id: 'app.feedback.versions' })}>
                                            {getFieldDecorator('version', {
                                            initialValue: this.state.filter.version,
                                            })(
                                            <Select>
                                                {version.list.map((item, index) => {
                                                return (
                                                    <Option key={index} value={item}>
                                                    {item}
                                                    </Option>
                                                );
                                                })}
                                            </Select>
                                            )}
                                        </Form.Item>
                                </Form>
                                <Row gutter={16}>
                                    <Col lg={2} md={6} sm={24}>
                                        <span style={{color:'rgba(0, 0, 0, 0.85)'}}><span className="sup-required">*</span>{formatMessage({ id: 'app.faq.content' })}：</span>
                                    </Col>  
                                    <Col lg={22} md={18} sm={24}>
                                        <Editor
                                            editorState={editorState}
                                            toolbarClassName="home-toolbar"
                                            wrapperClassName="home-wrapper"
                                            editorClassName="home-editor"
                                            onEditorStateChange={this.onEditorStateChange}
                                            toolbar={{
                                                history: { inDropdown: true },
                                                inline: { inDropdown: false },
                                                list: { inDropdown: true },
                                                textAlign: { inDropdown: true },
                                                image: { uploadCallback: this.imageUploadCallBack },
                                            }}
                                            onContentStateChange={this.onEditorChange}
                                            placeholder="请输入内容"
                                            spellCheck
                                            onFocus={() => {this.setState({isFocusTextArea:true})}}
                                            onBlur={() => {console.log('blur')}}
                                            onTab={() => {console.log('tab'); return true;}}
                                            localization={{ locale: 'zh', translations: {'generic.add': '添加链接'} }}
                                        />
                                    </Col>     
                                </Row>
                                <style>{`
                                    .home-editor {
                                        min-height: 300px;
                                    }
                                `}</style>
                            </Card>
                            <div>
                            <Button type="primary"  style={{ marginLeft: 8 }} className={styles.btnSmt} onClick={()=>{this.handleAddFaq(1)}}>
                                {formatMessage({ id: 'app.faq.submit'})}
                            </Button>
                            {
                                this.state.filter.status==0 &&
                                <Button type="danger"  style={{ marginLeft: 8 }} className={styles.btnSmt} onClick={()=>{this.handleAddFaq(2)}}>
                                    {formatMessage({ id: 'app.faq.submitissue'})}
                                </Button>
                            }
                             {
                                this.state.filter.status==1 &&
                            <Button type="danger"  style={{ marginLeft: 8 }} className={styles.btnSmt} onClick={()=>{this.handleAddFaq(3)}}>
                                {formatMessage({ id: 'app.faq.submitdown'})}
                            </Button>
                             }
                            <Button  style={{ marginLeft: 8 }} className={styles.btnSmt} onClick={this.handleCancelPage}>
                                {formatMessage({ id:'app.faq.cancel' })}
                            </Button>
                            </div>
                        </div>
                    </Col>
                </Row>
            </div>
        
            </div>
        );
    }
}

export default FaqEdit;
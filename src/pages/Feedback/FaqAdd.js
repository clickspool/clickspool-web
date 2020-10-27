import React, { Component } from 'react';
import { Row, Col, Card,Breadcrumb,Icon,Form, Input,Select,Switch,Button,Modal,message   } from 'antd';
import { delFaq,modifyFaq,addFaq } from '@/services/faq';
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
class FaqAdd extends Component {
    constructor(props) {
        super(props);
        const html = '';
        const contentBlock = htmlToDraft(html);
        let editorState=null;
        if (contentBlock) {
            const contentState = ContentState.createFromBlockArray(contentBlock.contentBlocks);
            editorState = EditorState.createWithContent(contentState);
            }
          this.state = {
            editorState,
            editorContent: undefined,
            defaultChecked:false,
            previewurl:/test/.test(apiConfig)?`http://test-h5.xuansky.cn/faqdetail/index.html?type=help&id=`:`https://h5.feishiapp.com/faqdetail/index.html?type=help&id=`,
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

    imageUploadCallBack = file =>{
        return new Promise(
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
} 

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

      updataConfiList=()=> {
        // const html = '<p></p><img src="http://faceme-test.oss-cn-beijing.aliyuncs.com//image/sp/2019/01/25/a7e5ef144e74967f0fae41110fa456f3.jpg" alt="undefined" style="float:left;height: auto;width: auto"/><p>Hey this <strong>editor</strong> rocks 😀</p>';
        // const contentBlock = htmlToDraft(html);
        // if (contentBlock) {
        //   const contentState = ContentState.createFromBlockArray(contentBlock.contentBlocks);
        //   const editorState = EditorState.createWithContent(contentState);
        //   this.setState({
        //     editorState
        //   })
        // }
        // const { dispatch } = this.props;
        // const { pagination } = this.state;
        // dispatch({
        //   type: 'faq/getList',
        //   payload: pagination,
        // });
        // router.push('/feedback/faq/add');
      }

      handleAddFaq=(index)=>{
        const {filter,editorState,editorContent,id} = this.state;
        this.props.form.validateFields((err, values) => {
            if(err){
                message.warn(Object.values(err)[0].errors[0].message)
                return
            }
            let arg;

            arg = Object.assign({},filter,values) ;
            arg.content = draftToHtml(editorContent)+'';
            if(id!=''){
                arg.id = id;
            }
            if(index==0&&id==''){
                addFaq(
                    Object.assign({},arg,{status:0})
                )
                  .then((res)=>{
                      if(res&&!res.code){
                        this.setState({
                            id:res.data.id,
                            previewurl:`${this.state.previewurl}${res.data.id}`
                        },()=>{
                            this.setState({
                                showPreview:true
                            })
                        });
                      }
                  })
                return
            }
            if(index==0&&id!=''){
                modifyFaq(
                    Object.assign({},arg,{status:0})
                )
                  .then((res)=>{
                      if(res&&!res.code){
                        this.setState({
                            previewurl:`${this.state.previewurl}`
                        },()=>{
                            this.setState({
                                showPreview:true
                            })
                        });
                      }
                  })
                return
            }
            if(index==1&&id==''){
                    addFaq(
                        Object.assign({},arg,{status:0})
                    )
                      .then((res)=>{
                          if(res&&!res.code){
                            this.setState({
                                id:res.data.id,
                                previewurl:`${this.state.previewurl}${res.data.id}`
                            },()=>{
                                setTimeout(()=>{
                                    this.handleCancelPage()
                                  },2000)
                            });
                          }
                      })
                    return
            }
            if(index==1&&id!=''){
                modifyFaq(
                    Object.assign({},arg,{status:0})
                )
                  .then((res)=>{
                      if(res&&!res.code){
                        this.setState({
                            previewurl:`${this.state.previewurl}`
                        },()=>{
                            setTimeout(()=>{
                                this.handleCancelPage()
                              },2000)
                        });
                      }
                  })
                return
            }
            if(index==2&&id==''){
                addFaq(
                    Object.assign({},arg,{status:1})
                )
                  .then((res)=>{
                      if(res&&!res.code){
                        this.setState({
                            id:res.data.id,
                            previewurl:`${this.state.previewurl}${res.data.id}`
                        },()=>{
                            setTimeout(()=>{
                                this.handleCancelPage()
                              },2000)
                        });
                      }
                  })
                return
            }
            if(index==2&&id!=''){
                modifyFaq(
                    Object.assign({},arg,{status:1})
                )
                  .then((res)=>{
                      if(res&&!res.code){
                        this.setState({
                            previewurl:`${this.state.previewurl}`
                        },()=>{
                            setTimeout(()=>{
                                this.handleCancelPage()
                              },2000)
                        });
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

    render() {
        const { editorContent, editorState } = this.state;
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
              <Breadcrumb>
                <Breadcrumb.Item>
                  <Icon type="lock" />
                  <span>{formatMessage({ id: 'menu.feedback' })}</span>
                </Breadcrumb.Item>
                <Breadcrumb.Item>
                    <Link to="/feedback/faq">{formatMessage({ id: 'menu.feedback.faq' })}</Link>
                </Breadcrumb.Item>
                <Breadcrumb.Item>{formatMessage({ id: 'app.faq.add' })}</Breadcrumb.Item>
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
                                        })(
                                            <Input placeholder={formatMessage({ id: 'app.faq.pleasetitle' })}/>
                                        )}
                                    </Form.Item>
                                    <Form.Item {...formItemLayout} label={formatMessage({ id: 'app.faq.id' })+'：'}>
                                        {getFieldDecorator('sort')(
                                            <Input placeholder={formatMessage({ id: 'app.faq.pleasesort' })}/>
                                        )}
                                    </Form.Item>
                                    <Form.Item  {...formItemLayout}  label={formatMessage({ id: 'app.faq.isrecommend' })+'：'}>
                                            {getFieldDecorator('is_recommend', {
                                                initialValue: false,
                                            })(
                                                <Switch checkedChildren={formatMessage({ id:'app.faq.yes'})} unCheckedChildren={formatMessage({ id:'app.faq.no'})} defaultChecked={this.state.filter.is_recommend} />
                                            )}
                                    </Form.Item>
                                    <Form.Item  {...formItemLayout}  label={formatMessage({ id: 'app.feedback.issueCategory' })+'：'}>
                                        {getFieldDecorator('category', {
                                            initialValue: category[0].id,
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
                                            initialValue: version.list[0],
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
                                            onFocus={() => {console.log('focus')}}
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
                            {/* <Button type="primary" className={styles.btnSmt} onClick={()=>{this.handleAddFaq(0)}}>
                                {formatMessage({ id: 'app.faq.preview' })}
                            </Button> */}
                            <Button type="primary"  style={{ marginLeft: 8 }} className={styles.btnSmt} onClick={()=>{this.handleAddFaq(1)}}>
                                {formatMessage({ id: 'app.faq.submit'})}
                            </Button>
                            <Button type="danger"  style={{ marginLeft: 8 }} className={styles.btnSmt} onClick={()=>{this.handleAddFaq(2)}}>
                                {formatMessage({ id: 'app.faq.submitissue'})}
                            </Button>
                            <Button  style={{ marginLeft: 8 }} className={styles.btnSmt} onClick={this.handleCancelPage}>
                                {formatMessage({ id:'app.faq.cancel' })}
                            </Button>
                            </div>
                        </div>
                    </Col>
                      {/*<Col className="gutter-row" md={24}>
                        
                        <Card title="同步转换HTML" bordered={false}>
                            <pre>{draftToHtml(editorContent)}</pre>
                        </Card>
                    </Col>
                   <Col className="gutter-row" md={8}>
                        <Card title="同步转换MarkDown" bordered={false}>
                            <pre style={{whiteSpace: 'pre-wrap'}}>{draftToMarkdown(editorContent)}</pre>
                        </Card>
                    </Col>
                    <Col className="gutter-row" md={8}>
                        <Card title="同步转换JSON" bordered={false}>
                            <pre style={{whiteSpace: 'normal'}}>{JSON.stringify(editorContent)}</pre>
                        </Card>
                    </Col> */}
                </Row>
            </div>
            {/* <Modal
                title={null}
                visible={this.state.showPreview}
                onCancel={this.handleCancel}
                footer={null}
                closable={false}
                centered={true}
                maskClosable={true}
                wrapClassName={'web'} //对话框外部的类名，主要是用来修改这个modal的样式的
                >
                    <QRCode value={this.state.previewurl} />,
                </Modal> */}
            </div>
        );
    }
}

export default FaqAdd;
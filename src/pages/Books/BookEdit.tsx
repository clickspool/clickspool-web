import CustomUpload from '@/components/CustomUpload/Index';
// tslint:disable-next-line:ordered-imports
import { Button, Col, DatePicker, Divider, Form, Icon, Input, Modal, Popconfirm, Row, Select, message, Upload } from 'antd';
import { uploadMultiMedia } from "./services/index"
import { connect } from 'dva';
import React, { PureComponent } from 'react';
import { CopyToClipboard } from 'react-copy-to-clipboard';
//@ts-ignore
import { formatMessage } from 'umi/locale';
import { Editor } from '@tinymce/tinymce-react';
import get from 'lodash/get';
import isArray from 'lodash/isArray';
const FormItem = Form.Item;
const { Option } = Select;

const uploadButton = (
  <div>
    <Icon type='plus' />
  </div>
);

const FormUploader = React.forwardRef((props, ref) => {
  const { value = [] } = props;
  // tslint:disable-next-line:variable-name
  const reg = /(http|ftp|https):\/\/[\w\-_]+(\.[\w\-_]+)+([\w\-\.,@?^=%&amp;:/~\+#]*[\w\-\@?^=%&amp;/~\+#])?/;

  // tslint:disable-next-line:variable-name
  let file_list: any = isArray(value) ? value : [];

  file_list = !!file_list.length && file_list.map((item, index) => {
    return {
      uid: item,
      name: item,
      status: 'done',
      url: `${item}?x-oss-process=image/resize,w_80,h_80`
    }
  })
  console.log(file_list, 'file_list')

  const handleEditorChange = (val) => {
    props.onChange(val)
  }
  return <Upload
    accept={"image/*"}
    listType="picture-card"
    fileList={file_list}
    showUploadList={{ showPreviewIcon: true, showDownloadIcon: true, showRemoveIcon: true }}
    onPreview={(e) => {
      window.open(e.name);
      return
    }}
    onDownload={(e) => {
      window.open(e.name);
      return
    }}
    customRequest={(options) => {
      console.log(options, 'options')
      props.handleChange(options, 'image')
    }}
    onRemove={(file) => {
      console.log(file, 'file')
      props.handleOnRemove(file)
    }}
  >
    {file_list.length >= 1 ? null : uploadButton}
  </Upload>
}
)


const FormEditor = React.forwardRef((props, ref) => {
  const handleEditorChange = (val) => {
    props.onChange(val)
  }

  return <Editor
    apiKey='t2n9jf71r9b2l5ufml0eyinqlhb3ci161wcqsao3n6zkwgyy'
    initialValue={get(props['data-__meta'], 'initialValue') || ''}
    init={{
      height: 500,
      menubar: false,
      automatic_uploads: true,
      elementpath: false,
      plugins: [
        'advlist autolink lists link image charmap print preview anchor',
        'searchreplace visualblocks code fullscreen',
        'insertdatetime media table paste code help wordcount',
        'image'
      ],
      images_upload_handler: (blobInfo, success, failure, progress) => {
        console.log(blobInfo.blob())
        props.uploadHandle(blobInfo, success, failure, progress);

      },
      toolbar:
        'undo redo | formatselect | bold italic forecolor backcolor | \
      alignleft aligncenter alignright alignjustify | \
      bullist numlist outdent indent lineheight_formats | removeformat | image code'
    }}
    onEditorChange={handleEditorChange}
  />
})

@connect(({ book_info: { list, book_info } }) => ({ list, book_info }))
//@ts-ignore
@Form.create()
export default class EditTemplate extends PureComponent<any, any> {
  // handlePreview: (file: UploadFile<any>) => void;
  constructor(props) {
    super(props);
    this.state = {
      imgList: [],
      videoList: [],
    }
  }

  public handleOk = (e, status) => {
    const { form: { validateFields, getFieldsValue }, dispatch, record = {} } = this.props;
    const { imgList, videoList } = this.state;
    const { mid } = record;
    e.preventDefault();
    console.log(imgList)
    validateFields({ force: true }, (err, values) => { // 设置force为true
      if (!err) {
        console.log('Received values of form: ', values);
        const { type, title1: title, description, destination_link, merchant_id } = values;
        const llist = { img_url: "", video_url: "" };
        if (!!imgList.length) {
          llist.img_url = imgList.map(item => {
            return item.name
          }).join(',')
        }
        if (!!videoList.length) {
          llist.video_url = videoList.map(item => {
            return item.name
          }).join(',')
        }
        dispatch({
          type: mid ? 'material/patch' : 'material/create',
          payload: {
            mid, title, type, description, merchant_id, destination_link, status, ...llist
          }
        })
          .then((res) => {
            if (!res.code) {
              this.handleCancel();
            }
          })
      }
    });
  }

  public handleCancel = () => {
    this.props.close();
  }


  handleChange = (e, type) => {
    // tslint:disable-next-line:no-this-assignment
    const _this = this;
    const { imgList, videoList, img_url, video_url } = this.state;
    const multiMedia = new FormData();
    multiMedia.append("multiMedia", e.file)
    uploadMultiMedia(multiMedia)
      .then(res => {
        if (!res.code) {
          const len = (type === 'image' ? imgList : videoList).length;
          const list = [...(type === 'image' ? imgList : videoList), {
            uid: `${len}`,
            name: res.data.url,
            status: 'done',
            url: type === 'image' ? `${res.data.url}?x-oss-process=image/resize,w_80,h_80` : `${res.data.url}?x-oss-process=video/snapshot,t_1,f_jpg,w_80,h_80,m_fast,ar_auto`
          }]

          _this.setState({
            [type === 'image' ? "imgList" : "videoList"]: list,
          })
        }
      })
  }

  handleOnRemove = (e, type) => {
    const {dispatch,book_info} = this.props;
    dispatch({
      type: 'book_info/updateState',
      payload: {
        book_info: { book_info: { ...book_info, book_cover: '' } }
      }
    })
  }
  // public componentDidMount() {
  //   if (!this.props.record) {
  //     return
  //   }
  //   const { images = [], videos = [] } = this.props.record;
  //   // tslint:disable-next-line:one-variable-per-declaration
  //   const i = [], v = [];
  //   if (!!images.length) {
  //     images.map((item, index) => {
  //       i.push({
  //         uid: index,
  //         name: item,
  //         status: 'done',
  //         url: `${item}?x-oss-process=image/resize,w_80,h_80`
  //       })
  //     })
  //   }

  //   if (!!videos.length) {
  //     videos.map((item, index) => {
  //       v.push({
  //         uid: index,
  //         name: item,
  //         status: 'done',
  //         url: `${item}?x-oss-process=video/snapshot,t_1,f_jpg,w_80,h_80,m_fast,ar_auto`
  //       })
  //     })
  //   }

  //   this.setState({
  //     imgList: i,
  //     videoList: v
  //   })
  // }

  public setMine = () => {
    const { dispatch, record: { mid } } = this.props;
    dispatch({
      type: "market/receive",
      payload: {
        material_id: mid
      }
    })
  }



  public FromRender = () => {
    // tslint:disable-next-line:no-this-assignment
    // const { handleChange, handleOnRemove } = this;
    // const { handleOk, handleCancel, setMine } = this;
    const { imgList, videoList } = this.state;
    const { form: { getFieldDecorator }, book_info, dispatch, } = this.props;
    // const { type, title, description, destination_link, merchant_id, mid, aid } = record || {};
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
    const smallformItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 8 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 },
      },
    };


    //   const FormEditor = React.forwardRef((props, ref) => {
    //     return <Input />
    // })  
    const book_cover = get(book_info, 'book_cover');
    const file_list = isArray(book_cover) ? book_cover : !!book_cover? [book_cover]:[];

    return <>
      <style>
        {`
        .ant-form-item-label > label{
          font-size:12px;
          font-weight:bold;
        }
      `}
      </style>
      <FormItem
        {...formItemLayout}
        label={'Book Cover'}
      >
        {getFieldDecorator('book_cover', {
          rules: [
            { required: true, message: 'Book Cover' },
            // { validator: this.handleCheckImg },
          ],
          validateTrigger: 'onSubmit', // 设置进行表单验证的时机为onSubmit
          initialValue: file_list,
        })(
          <FormUploader 
          handleOnRemove = {
            ()=>{
              this.handleOnRemove();
            }
          }
          handleChange={(opt, type) => {
            if (opt.file) {
              dispatch({
                type: 'book_info/uploadMultiMediaHandle',
                payload: {
                  multiMedia: opt.file
                }
              })
                .then((res) => {
                  const { code, data } = res;
                  if (code == 0) {
                    dispatch({
                      type: 'book_info/updateState',
                      payload: {
                        book_info: { book_info: { ...book_info, book_cover: data.url } }
                      }
                    })
                  }
                })
            }

          }} />

        )
        }
      </FormItem>
      <Row>
        <Col span={12}>
          <FormItem
            {...smallformItemLayout}
            label={'Title Name'}
          >
            {getFieldDecorator('Title Name', {
              rules: [
                { required: true, message: 'Title Name' },
              ],
              initialValue: '',
            })(
              <Input type="text" placeholder={'Title Name'} />
            )}
          </FormItem>
        </Col>
        <Col span={12}>
          <FormItem
            {...smallformItemLayout}
            label={'External ID'}
          >
            {getFieldDecorator('External ID', {
              initialValue: '',
            })(
              <Input type="text" placeholder={'External ID'} />
            )}
          </FormItem>
        </Col>
        <Col span={12}>
          <FormItem
            {...smallformItemLayout}
            label={'Title Genre:'}
          >
            {getFieldDecorator('Title Genre', {
              initialValue: '',
            })(
              <Input type="text" placeholder={'Title Genre'} />
            )}
          </FormItem>
        </Col>
        <Col span={12}>
          <FormItem
            {...smallformItemLayout}
            label={'Author Name'}
          >
            {getFieldDecorator('Author Name', {
              rules: [
                { required: true, message: 'Title Name' },
              ],
              initialValue: '',
            })(
              <Input type="text" placeholder={'Author Name'} />
            )}
          </FormItem>
        </Col>
        <Col span={12}>
          <FormItem
            {...smallformItemLayout}
            label={'Author Pen Name'}
          >
            {getFieldDecorator('Author Pen Name', {
              initialValue: '',
            })(
              <Input type="text" placeholder={'Author Pen Name'} />
            )}
          </FormItem>
        </Col>
        <Col span={12}>
          <FormItem
            {...smallformItemLayout}
            label={'Multiple languages'}
          >
            {getFieldDecorator('Multiple languages', {
              initialValue: '',
            })(
              <Input type="text" placeholder={'Multiple languages'} />
            )}
          </FormItem>
        </Col>
        <Col span={12}>
          <FormItem
            {...smallformItemLayout}
            label={'Tags'}
          >
            {getFieldDecorator('Tags', {
              rules: [
                { required: true, message: 'Tags' },
              ],
              initialValue: '',
            })(
              <Input type="text" placeholder={'Tags'} />
            )}
          </FormItem>
        </Col>
        <Col span={12}>
          <FormItem
            {...smallformItemLayout}
            label={'Series Name'}
          >
            {getFieldDecorator('Series Name', {
              rules: [
                { required: true, message: 'Series Name' },
              ],
              initialValue: '',
            })(
              <Input type="text" placeholder={'Series Name'} />
            )}
          </FormItem>
        </Col>
        <Col span={12}>
          <FormItem
            {...smallformItemLayout}
            label={'Catchwords'}
          >
            {getFieldDecorator('Catchwords', {
              rules: [
                { required: true, message: 'Catchwords' },
              ],
              initialValue: '',
            })(
              <Input type="text" placeholder={'Catchwords'} />
            )}
          </FormItem>
        </Col>
        <Col span={12}>
          <FormItem
            {...smallformItemLayout}
            label={'Total Chapter Count'}
          >
            {getFieldDecorator('Total Chapter Count', {
              rules: [
                { required: true, message: 'Total Chapter Count' },
              ],
              initialValue: '',
            })(
              <Input type="text" placeholder={'Total Chapter Count'} />
            )}
          </FormItem>
        </Col>
        <Col span={12}>
          <FormItem
            {...smallformItemLayout}
            label={'Total Word Count'}
          >
            {getFieldDecorator('Total Word Count', {
              rules: [
                { required: true, message: 'Total Word Count' },
              ],
              initialValue: '',

            })(
              <Input type="text" placeholder={'Total Word Count'} />
            )}
          </FormItem>
        </Col>
      </Row>
      <FormItem
        {...formItemLayout}
        label={'Synopsis'}
      >
        {getFieldDecorator('synopsis', {
          rules: [
            { required: true, message: 'Synopsis' },
            // { validator: this.handleCheckImg },
          ],
          initialValue: '',
          trigger: 'onChange'
        })(
          <FormEditor
            uploadHandle={(blobInfo, success, failure, progress) => {
              dispatch({
                type: 'book_info/uploadMultiMediaHandle',
                payload: {
                  multiMedia: blobInfo.blob()
                }
              })
                .then((res) => {
                  console.log(res, 'res==')
                  const { code, data } = res;
                  if (code == 0) {
                    success(data.url)
                  }
                })
            }} />
        )
        }
      </FormItem>
      <div className="ant-modal-footer">
        <div>
          <button type="button" className="ant-btn ant-btn-danger"
            onClick={this.handleCancel}
          >
            <span>{formatMessage({ id: "app.material.cancel" })}</span>
          </button>
          <button type="button" className="ant-btn ant-btn-primary"
            onClick={(e) => { this.handleOk(e, 1) }}
          >
            <span>{'Save'}</span>
          </button>
        </div>
      </div>
    </>
  }

  public render() {
    const { book_info = {} } = this.props;
    // tslint:disable-next-line:no-this-assignment
    const { handleOk, handleCancel, FromRender } = this;
    return (
      <>
        <style>
          {`
         .___warp .ant-modal-body {
           padding: 24px 20px 0;
         }
         .ant-form-item{
           margin-bottom:0;
         }
        `}
        </style>
        <Modal
          className={'___warp'}
          title={Object.keys(book_info).length ? 'Add new book' : 'Edit book'}
          visible={true}
          onOk={handleOk}
          okText={formatMessage({ id: "app.material.publish" })}
          cancelText={formatMessage({ id: "app.material.saveasdraft" })}
          onCancel={handleCancel}
          width={1100}
          footer={null}
        >
          <Form autoComplete='off'>
            <FromRender />
          </Form>
        </Modal>
      </>
    );
  }
}

import CustomUpload from '@/components/CustomUpload/Index';
// tslint:disable-next-line:ordered-imports
import { Button, Col, DatePicker, Divider, Form, Icon, Input, Modal, Popconfirm, Row, Select, message, Upload } from 'antd';
import { uploadMultiMedia } from "./services/index"
import { connect } from 'dva';
import React, { PureComponent, useState } from 'react';
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
  // const { value = [] } = props;
  // tslint:disable-next-line:variable-name
  // const reg = /(http|ftp|https):\/\/[\w\-_]+(\.[\w\-_]+)+([\w\-\.,@?^=%&amp;:/~\+#]*[\w\-\@?^=%&amp;/~\+#])?/;

  const val = get(props['data-__meta'], 'initialValue') || [];
  // tslint:disable-next-line:variable-name
  let file_list: any = isArray(val) ? val : [];

  file_list = !!file_list.length && file_list.map((item, index) => {
    return {
      uid: item,
      name: item,
      status: 'done',
      url: `${item}?x-oss-process=image/resize,w_80,h_80`
    }
  })
  const [filList, setFileList] = useState(file_list);
  console.log(file_list, 'file_list')

  const handleEditorChange = (val) => {
    props.onChange(val)
  }
  return <Upload
    accept={"image/*"}
    listType="picture-card"
    fileList={filList}
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
      // console.log(options, 'options')
      props.handleChange(options, (url) => {
        const urlObj = {
          uid: url,
          name: url,
          status: 'done',
          url: `${url}?x-oss-process=image/resize,w_80,h_80`
        }
        setFileList([urlObj]);
        handleEditorChange(url);
      })
    }}
    onRemove={(file) => {
      // console.log(file, 'file')
      setFileList([]);
      handleEditorChange('');
      // props.handleOnRemove(file)
    }}
  >
    {filList.length >= 1 ? null : uploadButton}
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
    const { form: { validateFields, getFieldsValue }, dispatch, book_info = {} } = this.props;
    const { imgList, videoList } = this.state;
    e.preventDefault();
    console.log(imgList)
    validateFields({ force: true }, (err, values) => { // 设置force为true
      if (!err) {

        dispatch({
          type: 'book_info/patchBookInfo',
          payload: {
            ...book_info, ...values
          }
        })
          .then((res) => {
            if (!res.code) {
              this.handleCancel(1);
            }
          })
      }
    });
  }

  public handleCancel = (refresh) => {
    if (refresh === 1) {
      this.props.close(1);
      return
    }
    this.props.close();
  }

  // handleOnRemove = (e, type) => {
  //   const { dispatch, book_info } = this.props;
  //   dispatch({
  //     type: 'book_info/updateState',
  //     payload: {
  //       book_info: { book_info: { ...book_info, book_cover: '' } }
  //     }
  //   })
  // }
  // public setMine = () => {
  //   const { dispatch, record: { mid } } = this.props;
  //   dispatch({
  //     type: "market/receive",
  //     payload: {
  //       material_id: mid
  //     }
  //   })
  // }



  public FromRender = () => {
    // tslint:disable-next-line:no-this-assignment
    // const { handleChange, handleOnRemove } = this;
    const {  handleCancel } = this;
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
    // tslint:disable-next-line:variable-name
    const book_cover = get(book_info, 'book_cover');
    // tslint:disable-next-line:variable-name
    const file_list: any = isArray(book_cover) ? book_cover : !!book_cover ? [book_cover] : [];
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
          // validateTrigger: 'onSubmit', // 设置进行表单验证的时机为onSubmit
          initialValue: file_list,
          trigger: 'onChange'
        })(
          <FormUploader
            handleChange={(opt, cb) => {
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
                      cb(data.url)
                      // dispatch({
                      //   type: 'book_info/updateState',
                      //   payload: {
                      //     book_info: { book_info: { ...book_info, book_cover: data.url } }
                      //   }
                      // })
                      return
                    }
                    cb()
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
            {getFieldDecorator('title_name', {
              rules: [
                { required: true, message: 'Title Name' },
              ],
              initialValue: get(book_info, 'title_name'),
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
            {getFieldDecorator('title_id', {
              initialValue: get(book_info, 'title_id'),
            })(
              <Input type="text" placeholder={'External ID'} />
            )}
          </FormItem>
        </Col>
        <Col span={12}>
          <FormItem
            {...smallformItemLayout}
            label={'Book Status'}
          >
            {getFieldDecorator('title_status', {
              initialValue: `${get(book_info, 'title_status')}`,
            })(
              // tslint:disable-next-line:ban-comma-operator
              <Select  placeholder={'Book Status'}>
                <Option value={'1'}>Complete</Option>
                <Option value={'2'}>Processing</Option>
              </Select>
              // <Input type="text" placeholder={'Book Status'} />
            )}
          </FormItem>
        </Col>
        <Col span={12}>
          <FormItem
            {...smallformItemLayout}
            label={'Author Name'}
          >
            {getFieldDecorator('author_name', {
              rules: [
                { required: true, message: 'Title Name' },
              ],
              initialValue: get(book_info, 'author_name'),
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
            {getFieldDecorator('author_pen_name', {
              initialValue: get(book_info, 'author_pen_name'),
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
            {getFieldDecorator('multiple_languages', {
              initialValue: `${get(book_info, 'multiple_languages')}`,
            })(
              <Select  placeholder={'Multiple languages'}>
              <Option value={'0'}>No</Option>
              <Option value={'1'}>Yes</Option>
            </Select>
              // <Input type="text" placeholder={'Multiple languages'} />
            )}
          </FormItem>
        </Col>
        <Col span={12}>
          <FormItem
            {...smallformItemLayout}
            label={'Tags'}
          >
            {getFieldDecorator('tags', {
              rules: [
                { required: true, message: 'Tags' },
              ],
              initialValue: get(book_info, 'tags'),
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
            {getFieldDecorator('series', {
              rules: [
                { required: true, message: 'Series Name' },
              ],
              initialValue: get(book_info, 'series'),
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
            {getFieldDecorator('catchword', {
              rules: [
                { required: true, message: 'Catchwords' },
              ],
              initialValue: get(book_info, 'catchword'),
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
            {getFieldDecorator('total_chapter_count', {
              rules: [
                { required: true, message: 'Total Chapter Count' },
              ],
              initialValue: get(book_info, 'total_chapter_count'),
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
            {getFieldDecorator('total_word_count', {
              rules: [
                { required: true, message: 'Total Word Count' },
              ],
              initialValue: get(book_info, 'total_word_count'),

            })(
              <Input type="text" placeholder={'Total Word Count'} />
            )}
          </FormItem>
        </Col>
        <Col span={12}>
          <FormItem
            {...smallformItemLayout}
            label={'Full price'}
          >
            {getFieldDecorator('full_price', {
              rules: [
                { required: true, message: 'Total Word Count' },
              ],
              initialValue: get(book_info, 'full_price'),

            })(
              <Input type="text" placeholder={'Full price'} />
            )}
          </FormItem>
        </Col>
        <Col span={12}>
          <FormItem
            {...smallformItemLayout}
            label={'Price'}
          >
            {getFieldDecorator('price', {
              rules: [
                { required: true, message: 'Total Word Count' },
              ],
              initialValue: get(book_info, 'price'),

            })(
              <Input type="text" placeholder={'Price'} />
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
          initialValue: get(book_info, 'synopsis'),
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
          width={1100}
          onCancel={handleCancel}
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

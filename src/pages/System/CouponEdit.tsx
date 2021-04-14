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
import moment from 'moment';

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

// tslint:disable-next-line:variable-name
@connect(({ permission: { coupon: book_info } }) => ({ book_info }))
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
    e.preventDefault();
    validateFields({ force: true }, (err, values) => { // 设置force为true
      if (!err) {
        values.coins_expire_time = typeof (values.coins_expire_time) === 'string' ? values.coins_expire_time : values.coins_expire_time.format('YYYY-MM-DD HH:mm:ss')
        dispatch({
          type: 'permission/patchCoupon',
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
    const { handleCancel } = this;
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
      <Row>
        <Col span={12}>
          <FormItem
            {...smallformItemLayout}
            label={'Coupon state'}
          >
            {getFieldDecorator('coupon_title', {
              rules: [
                { required: true, message: 'Coupon title' },
              ],
              initialValue: get(book_info, 'coupon_title'),
            })(
              <Input type="text" placeholder={'Coupon title'} />
            )}
          </FormItem>
        </Col>
        <Col span={12}>
          <FormItem
            {...smallformItemLayout}
            label={'Coupon state'}
          >
            {getFieldDecorator('coupon_state', {
              initialValue: get(book_info, 'coupon_state'),
            })(
              <Input type="text" placeholder={'Coupon state'} />
            )}
          </FormItem>
        </Col>
        <Col span={12}>
          <FormItem
            {...smallformItemLayout}
            label={'Coupon code'}
          >
            {getFieldDecorator('coupon_code', {
              initialValue: get(book_info, 'coupon_code'),
            })(
              <Input type="text" placeholder={'Coupon code'} />
            )}
          </FormItem>
        </Col>
        <Col span={12}>
          <FormItem
            {...smallformItemLayout}
            label={'Coupon amount'}
          >
            {getFieldDecorator('coupon_amount', {
              initialValue: get(book_info, 'coupon_amount'),
            })(
              <Input type="text" placeholder={'Coupon amount'} />
            )}
          </FormItem>
        </Col>
        <Col span={12}>
          <FormItem
            {...smallformItemLayout}
            label={'Coupon coins'}
          >
            {getFieldDecorator('coupon_coins', {
              rules: [
                { required: true, message: 'Coupon coins' },
              ],
              initialValue: get(book_info, 'coupon_coins'),
            })(
              <Input type="text" placeholder={'Coupon coins'} />
            )}
          </FormItem>
        </Col>
        <Col span={12}>
          <FormItem
            {...smallformItemLayout}
            label={'Coupon amount'}
          >
            {getFieldDecorator('coins_expire_time', {
              rules: [
                { required: true, message: 'Coins expire time' },
              ],
              initialValue: get(book_info, 'coins_expire_time') ?  moment(get(book_info, 'coins_expire_time')):'' ,
            })(
              <DatePicker showTime={true} format="YYYY-MM-DD HH:mm:ss" />,
            )}
          </FormItem>
        </Col>
      </Row>

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
          title={!Object.keys(book_info).length ? 'Add Coupon' : 'Edit Coupon'}
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

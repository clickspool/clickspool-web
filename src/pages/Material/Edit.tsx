import CustomUpload from '@/components/CustomUpload/Index';
// tslint:disable-next-line:ordered-imports
import { Button, Col, DatePicker, Divider, Form, Icon, Input, Modal, Popconfirm, Row, Select, message, Upload } from 'antd';
import { uploadMultiMedia } from "./services/index"
import { connect } from 'dva';
import get from 'lodash/get';
import isEqual from 'lodash/isEqual';
// tslint:disable-next-line:ordered-imports
import memoize from 'memoize-one';
import moment from 'moment';
import React, { PureComponent } from 'react';
import { CopyToClipboard } from 'react-copy-to-clipboard';
//@ts-ignore
import { formatMessage } from 'umi/locale';
const FormItem = Form.Item;
const { Option } = Select;

@connect(({ material: { list, types, merchantMap }, market: { promotion_url } }) => ({ list, types, merchantMap, promotion_url }))
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
    const { imgList, videoList } = this.state;
    let tmp = type === 'image' ? imgList : videoList;
    tmp = tmp.reduce((total, currentValue, currentIndex, arr) => {
      if (e.uid != currentValue.uid) {
        total = [...total, currentValue]
      }
      return total;
    }, [])
    this.setState({
      [type === 'image' ? "imgList" : "videoList"]: tmp
    })
  }
  public componentDidMount() {
    if (!this.props.record) {
      return
    }
    const { images = [], videos = [] } = this.props.record;
    // tslint:disable-next-line:one-variable-per-declaration
    const i = [], v = [];
    if (!!images.length) {
      images.map((item, index) => {
        i.push({
          uid: index,
          name: item,
          status: 'done',
          url: `${item}?x-oss-process=image/resize,w_80,h_80`
        })
      })
    }

    if (!!videos.length) {
      videos.map((item, index) => {
        v.push({
          uid: index,
          name: item,
          status: 'done',
          url: `${item}?x-oss-process=video/snapshot,t_1,f_jpg,w_80,h_80,m_fast,ar_auto`
        })
      })
    }

    this.setState({
      imgList: i,
      videoList: v
    })
  }

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
    const { handleChange, handleOnRemove } = this;
    const { handleOk, handleCancel, setMine } = this;
    const { imgList, videoList } = this.state;
    const { form: { getFieldDecorator }, types, merchantMap, record, mine, mym, promotion_url } = this.props;
    const { type, title, description, destination_link, merchant_id, mid, aid } = record || {};
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 8 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 14 },
      },
    };
    const uploadButton = (
      <div>
        <Icon type='plus' />
      </div>
    );
    const disb = (mine) ? { disabled: true } : {};

    return <>
      {!!mine && <Row type="flex" justify={'end'} style={{ marginBottom: '24px' }}>
        <Col span={8} style={{
          textAlign: 'right',
          boxSizing: 'border-box',
          paddingRight: "7px"
        }}>
          <span style={{ color: " rgba(0, 0, 0, 0.85)", fontSize: '14' }}>Material ID:</span>
        </Col>
        <Col span={16}>
          {mid || record.material_id}
        </Col>
      </Row>}
      <FormItem
        {...formItemLayout}
        label={formatMessage({ id: "app.material.type" })}
      >
        {getFieldDecorator('type', {
          rules: [
            { required: true, message: formatMessage({ id: "app.material.type" }) },
          ],
          initialValue: type,
        })(
          <Select {...disb} placeholder={formatMessage({ id: "app.material.type" })}>
            {
              Object.keys(types).length &&
              Object.keys(types).map((item, index) => {
                return <Option value={item} key={index}>{types[item]}</Option>
              })
            }
          </Select>
        )}
      </FormItem>
      <FormItem
        {...formItemLayout}
        label={formatMessage({ id: "app.material.title" })}
      >
        {getFieldDecorator('title1', {
          rules: [
            { required: true, message: formatMessage({ id: "app.material.title" }) },
          ],
          initialValue: title,
        })(
          <Input {...disb} type="text" placeholder={formatMessage({ id: "app.material.title" })} />
        )}
      </FormItem>
      <FormItem
        {...formItemLayout}
        label={formatMessage({ id: "app.material.merchant" })}
      >
        {getFieldDecorator('merchant_id', {
          rules: [
            { required: true, message: formatMessage({ id: "app.material.merchant" }) },
          ],
          initialValue: merchant_id,
        })(
          <Select {...disb} placeholder={formatMessage({ id: "app.material.merchant" })}>
            {
              Object.keys(merchantMap).length &&
              Object.keys(merchantMap).map((item, index) => {
                return <Option value={item} key={index}>{merchantMap[item]}</Option>
              })
            }
          </Select>
        )}
      </FormItem>
      <FormItem
        {...formItemLayout}
        label={formatMessage({ id: "app.material.description" })}
      >
        {getFieldDecorator('description', {
          rules: [
            { required: true, message: formatMessage({ id: "app.material.description" }) },
          ],
          initialValue: description,
        })(
          <Input.TextArea {...disb} autoSize={{ minRows: 2, maxRows: 6 }} placeholder={formatMessage({ id: "app.material.description" })} />
        )}
      </FormItem>
      {!mine && <FormItem
        {...formItemLayout}
        label={formatMessage({ id: "app.material.destinationlink" })}
      >
        {getFieldDecorator('destination_link', {
          rules: [
            { required: true, message: formatMessage({ id: "app.material.destinationlink" }) },
          ],
          initialValue: destination_link,
        })(
          <Input type="text" placeholder={formatMessage({ id: "app.material.destinationlink" })} />
        )}
      </FormItem>}
      <FormItem
        {...formItemLayout}
        label={formatMessage({ id: "app.material.promotevideo" })}
      >
        {getFieldDecorator('videoList', {
          validateTrigger: 'onSubmit', // 设置进行表单验证的时机为onSubmit
          initialValue: videoList,
        })(
          <Upload
            // accept={"image/*"}
            accept={"video/*"}
            listType="picture-card"
            fileList={videoList}
            onPreview={(e) => {
              console.log(e);
              window.open(e.name);
              return
            }}
            onDownload={(e) => {
              console.log(e);
              window.open(e.name);
              return
            }}
            showUploadList={!!mine ? { showPreviewIcon: true, showDownloadIcon: true, showRemoveIcon: false } : true}
            // onChange={(e) => { }
            customRequest={(options) => {
              this.handleChange(options, 'video')
            }}
            onRemove={(file) => {
              this.handleOnRemove(file, 'video')
            }}
          >
            {videoList.length >= 8 ? null : !mine && uploadButton}
          </Upload>
        )
        }
      </FormItem>
      <FormItem
        {...formItemLayout}
        label={formatMessage({ id: "app.material.promotepic" })}
      >
        {getFieldDecorator('imgList', {
          rules: [
            { required: true, message: formatMessage({ id: "app.material.promotepic" }) },
            // { validator: this.handleCheckImg },
          ],
          validateTrigger: 'onSubmit', // 设置进行表单验证的时机为onSubmit
          initialValue: imgList,
        })(
          <Upload
            accept={"image/*"}
            listType="picture-card"
            fileList={imgList}
            showUploadList={!!mine ? { showPreviewIcon: true, showDownloadIcon: true, showRemoveIcon: false } : true}
            customRequest={(options) => {
              this.handleChange(options, 'image')
            }}
            onRemove={(file) => {
              this.handleOnRemove(file, 'image')
            }}
          >
            {imgList.length >= 8 ? null : !mine && uploadButton}
          </Upload>
        )
        }
      </FormItem>
      {(!!mine || !!mym) && <Row type="flex" justify={'end'} style={{ marginBottom: '24px' }}>
        <Col span={8} style={{
          textAlign: 'right',
          boxSizing: 'border-box',
          paddingRight: "7px"
        }}>
          <span style={{ position: 'relative', top: '4px', color: " rgba(0, 0, 0, 0.85)", fontSize: '14px' }}>{formatMessage({ id: "app.material.destinationlink" })}:</span>
        </Col>
        <Col span={14}>
          <Input type={'text'} value={record.promotion_url || promotion_url} placeholder={formatMessage({ id: "app.material.mineplaceholder" })} />
        </Col>
        <Col span={2}>
          {(record.promotion_url || promotion_url) &&
            <CopyToClipboard
              text={record.promotion_url || promotion_url}
              onCopy={() => message.success("Copy Success!!")}
            >
              <Button type="link" size={'small'} style={
                {
                  position: 'relative',
                  top: '4px',
                }
              }>Copy</Button>
            </CopyToClipboard>

          }
        </Col>
      </Row>}

      <div className="ant-modal-footer">
        {!!mine &&
          <div>
            <button type="button" className="ant-btn ant-btn-danger"
              onClick={handleCancel}
            >
              <span>{formatMessage({ id: "app.material.cancel" })}</span>
            </button>
            {!mym && <button type="button" className="ant-btn ant-btn-primary"
              onClick={(e) => { setMine() }}
            >
              <span>{formatMessage({ id: "app.material.Setasmine" })}</span>
            </button>}
          </div>
        }
        {!mine && <div>
          <button type="button" className="ant-btn ant-btn-danger"
            onClick={handleCancel}
          >
            <span>{formatMessage({ id: "app.material.cancel" })}</span>
          </button>
          <button type="button" className="ant-btn"
            onClick={(e) => { handleOk(e, 0) }}
          >
            <span>{formatMessage({ id: "app.material.saveasdraft" })}</span>
          </button>
          <button type="button" className="ant-btn ant-btn-primary"
            onClick={(e) => { handleOk(e, 1) }}
          >
            <span>{formatMessage({ id: "app.material.publish" })}</span>
          </button>
        </div>}
      </div>
    </>
  }

  public render() {
    const { caption, visible } = this.props;
    // tslint:disable-next-line:no-this-assignment
    const { handleOk, handleCancel, FromRender } = this;
    return (
      <>
        <style>
          {`
         .___warp .ant-modal-body {
           padding: 24px 0 0;
         }
        `}
        </style>
        <Modal
          className={'___warp'}
          title={caption}
          visible={visible}
          onOk={handleOk}
          okText={formatMessage({ id: "app.material.publish" })}
          cancelText={formatMessage({ id: "app.material.saveasdraft" })}
          onCancel={handleCancel}
          width={600}
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

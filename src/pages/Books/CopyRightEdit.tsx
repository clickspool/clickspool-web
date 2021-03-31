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
import moment from 'moment';

const FormItem = Form.Item;
const { Option } = Select;
const { RangePicker, MonthPicker } = DatePicker;

@connect(({ book_info: { list, copyright_info } }) => ({ list, copyright_info }))
//@ts-ignore
@Form.create()
export default class EditTemplate extends PureComponent<any, any> {
  // handlePreview: (file: UploadFile<any>) => void;
  constructor(props) {
    super(props);
    this.state = {

    }
  }

  public handleOk = (e, status) => {
    const { form: { validateFields, getFieldsValue }, dispatch, copyright_info = {} } = this.props;
    const { imgList, videoList } = this.state;
    e.preventDefault();
    console.log(imgList)
    validateFields({ force: true }, (err, values) => { // 设置force为true
      if (!err) {
        // tslint:disable-next-line:variable-name
        const contract_validity_period_start = moment(values['time'][0]).format( 'YYYY-MM-DD HH:mm:ss');
        // tslint:disable-next-line:variable-name
        const contract_validity_period_end = moment(values['time'][1]).format( 'YYYY-MM-DD HH:mm:ss');
        delete(values.time)
        dispatch({
          type: 'book_info/patchCopyrightInfo',
          payload: {
            ...copyright_info, ...values,contract_validity_period_start,contract_validity_period_end
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
  public rangePickerChange = (e) => {
    console.log(e)
  }

  public FromRender = () => {

    const { form: { getFieldDecorator }, copyright_info, dispatch, } = this.props;
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
            label={'Contract Validity Period'}
          >
            {getFieldDecorator('time', {
              rules: [
                { required: true, message: 'Contract Validity Period' },
              ],
              initialValue: [
                moment(get(copyright_info, 'contract_validity_period_start')),
                moment(get(copyright_info, 'contract_validity_period_end')),
              ],
            })(
              <RangePicker
                renderExtraFooter={() => 'extra footer'}
                showTime
                onChange={e => {
                  this.rangePickerChange(e);
                }}
              />
            )}
          </FormItem>
        </Col>
        <Col span={12}>
          <FormItem
            {...smallformItemLayout}
            label={'Contract Type'}
          >
            {getFieldDecorator('contract_type', {
              initialValue: get(copyright_info, 'contract_type'),
            })(
              <Input type="text" placeholder={'Contract Type'} />
            )}
          </FormItem>
        </Col>
        <Col span={12}>
          <FormItem
            {...smallformItemLayout}
            label={'Title Cost(USD)'}
          >
            {getFieldDecorator('rights_cost', {
              initialValue: get(copyright_info, 'rights_cost'),
            })(
              <Input type="text" placeholder={'Title Cost(USD)'} />
            )}
          </FormItem>
        </Col>
        <Col span={12}>
          <FormItem
            {...smallformItemLayout}
            label={'ISBN'}
          >
            {getFieldDecorator('isbn', {
              initialValue: get(copyright_info, 'isbn'),
            })(
              <Input type="text" placeholder={'ISBN'} />
            )}
          </FormItem>
        </Col>
        {/* <Col span={12}>
          <FormItem
            {...smallformItemLayout}
            label={'Title Price (in Coins)'}
          >
            {getFieldDecorator('rights_cost', {
              initialValue: get(copyright_info, 'rights_cost'),
            })(
              <Input type="text" placeholder={'Title Price (in Coins)'} />
            )}
          </FormItem>
        </Col> */}
        <Col span={12}>
          <FormItem
            {...smallformItemLayout}
            label={'Content provider'}
          >
            {getFieldDecorator('content_providcontent_provider', {
              initialValue: get(copyright_info, 'content_providcontent_provider'),
            })(
              <Input type="text" placeholder={'Content provider'} />
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
    const { copyright_info = {} } = this.props;
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
          title={'Edit Copyright'}
          visible={true}
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

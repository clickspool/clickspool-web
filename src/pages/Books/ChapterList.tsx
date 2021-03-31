// tslint:disable-next-line:ordered-imports
import { Button, Col, DatePicker, Divider, Form, Icon, Input, Modal, Popconfirm, Row, Select, message, Upload, Table } from 'antd';
// tslint:disable-next-line:ordered-imports
import CommonBreadCrumb from '@/components/CommonBreadCrumb';
import OperationBar from './components/OperationBar';
// tslint:disable-next-line:ordered-imports
import { connect } from 'dva';
import React, { PureComponent, useState } from 'react';
//@ts-ignore
import { formatMessage } from 'umi/locale';
import { Editor } from '@tinymce/tinymce-react';
import get from 'lodash/get';
import isArray from 'lodash/isArray';
const FormItem = Form.Item;
const { Option } = Select;
import classnames from 'classnames/bind';
// import OperationBar from './components/OperationBar';
import styles from './style.less';
const cx = classnames.bind(styles);

const uploadButton = (
  <div>
    <Icon type='plus' />
  </div>
);





@connect(({ book_info: { chapter_list, book_info } }) => ({ chapter_list, book_info }))
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


  handleOnRemove = (e, type) => {
    const {dispatch,book_info} = this.props;
    dispatch({
      type: 'book_info/updateState',
      payload: {
        book_info: { book_info: { ...book_info, book_cover: '' } }
      }
    })
  }

  public showAdd=()=>{
    
  }
  

  public render() {
    const { chapter_list } = this.props;
    // tslint:disable-next-line:no-this-assignment
    const { handleOk, handleCancel, showAdd } = this;
    const crumbs = [
      {
        icon: 'monitor',
        title: 'Chapter management',
      },

    ];

    const columns = [
      {
        title: 'id',
        dataIndex: 'id',
        align: 'center',
      },
      {
        title: 'Book Id',
        dataIndex: 'book_id',
        align: 'center',
      },
      {
        title: 'Chapter name',
        dataIndex: 'chapter_name',
        align: 'center',
      },
      {
        title: 'Word count',
        dataIndex: 'word_count',
        align: 'center',
      },
      {
        title: 'Price',
        dataIndex: 'price',
        align: 'center',
      },
    ]
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
          title={'Chapter List'}
          visible={true}
          onOk={handleOk}
          okText={formatMessage({ id: "app.material.publish" })}
          cancelText={formatMessage({ id: "app.material.saveasdraft" })}
          onCancel={handleCancel}
          width={800}
          zIndex={1000}
        >
          <CommonBreadCrumb items={crumbs} />
            <div className={cx('operate')}>
              <OperationBar addTitle={'New Chapter'} add={showAdd} />
            </div>
            <Table
              className={cx('list')}
              bordered
              rowKey='id'
              // @ts-ignore
              columns={columns}
              dataSource={chapter_list || []}
            ></Table>
        </Modal>
      </>
    );
  }
}

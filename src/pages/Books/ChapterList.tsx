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
import ChapterEdit from './ChapterEdit';
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
      showChapter: false
    }
  }



  public handleCancel = () => {
    this.props.close();
  }


  public showAdd = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'book_info/updateState',
      payload: { chapter_info: {} }
    })
    this.setState({
      showChapter: true
    })
  }


  public render() {
    const { chapter_list, dispatch } = this.props;
    // tslint:disable-next-line:no-this-assignment
    const {handleCancel, showAdd } = this;
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
      {
        title: 'Operation',
        dataIndex: '——',
        align: 'center',
        render: (text, recod) => {
          return <Button type="link" onClick={() => {
            dispatch({
              type: 'book_info/fetchChapterInfo',
              payload: { chapter_id: recod.id }
            }).then(() => {
              this.setState({
                showChapter: true
              })
            })
          }}>Edit</Button>
        }
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
          onOk={handleCancel}
          okText={'Ok'}
          cancelText={'Cancel'}
          onCancel={handleCancel}
          width={800}
          zIndex={1000}
        >
          <Button type="primary" onClick={this.showAdd}>{'New Chapter'}</Button>
          <Table
            className={cx('list')}
            style={{ marginBottom: '14px' }}
            bordered
            rowKey='id'
            // @ts-ignore
            columns={columns}
            scroll={{ x: 600, y: 300 }}
            dataSource={chapter_list || []}
            pagination={
              { position: 'none' }
            }
          ></Table>
        </Modal>
        {this.state.showChapter && <ChapterEdit close={(refresh) => {
          if (!!refresh) {
            dispatch({
              type: 'book_info/fetchBookInfo',
              payload: { book_id: chapter_list[0].book_id }
            })
          }
          this.setState({
            showChapter: false
          })
        }} />}
      </>
    );
  }
}

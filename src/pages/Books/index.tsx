import { connect } from 'dva';
import React, { PureComponent, Fragment } from 'react';
//@ts-ignore
import { formatMessage } from 'umi/locale';
import CommonBreadCrumb from '@/components/CommonBreadCrumb';
import OperationBar from './components/OperationBar';
import EditTemplate from './BookEdit';
import classnames from 'classnames/bind';
// import OperationBar from './components/OperationBar';
import styles from './style.less';
import {
  Breadcrumb,
  Icon,
  Input,
  Button,
  Table,
  Divider,
  Popconfirm,
  Tag,
  //  ,  Input, , Tag, Switch, Modal 
} from 'antd';

const cx = classnames.bind(styles);
@connect(({ book_info: { list, total, page, page_size, types, statuses = {}, merchantMap } }) => ({ list, total, page, page_size, types, statuses, merchantMap }))
class TemplateList extends PureComponent<any, any> {
  constructor(props) {
    super(props);
    this.state = {
      showBookInfo: false,
      showChapterInfo: false,
      showCopyRight: false
    };
  }

  search = (values) => {
    this.setState({ search: values });
    // const { page_size, page = 1 } = this.props;
    this.props.dispatch({
      payload: { ...values },
      type: 'book_info/fetch'
    });
  }
  onShowSizeChange = (current, size) => {
    // this.props.dispatch({
    //   type: 'material/changePage_size',
    //   payload: {
    //     page: current,
    //     page_size: size
    //   }
    // });
    this.fetchPage(current, size);
  }
  fetchPage = (page?, page_size?) => {
    const { search = {} } = this.state;
    this.props.dispatch({
      type: 'book_info/fetch',
      payload: {
        page,
        page_size,
        ...search
      }
    });
  }

  showAdd=()=>{
    const {dispatch} = this.props;
    dispatch({
      type:'book_info/updateState',
      payload:{
        book_info:{}
      }
    })
    setTimeout(()=>{
      this.setState({
        showBookInfo:true
      })
    })
  }

  hideAdd=(refresh)=>{
    if(!!refresh){
      this.fetchPage();
    }
    this.setState({
      showBookInfo:false
    })
  }

  render() {
    const crumbs = [
      {
        icon: 'monitor',
        title: formatMessage({ id: 'menu.afiliate' }),
      },

    ];
    const { list, total, page, page_size, statuses, dispatch } = this.props;
    const { showBookInfo } = this.state;
    const { showEdit, hideEdit, deleteRecord, hideAdd, showAdd, search, putOnline, putOffline } = this;
    const _this = this;

    const columns = [
      {
        title: 'Book Cover',
        dataIndex: 'book_cover',
        align: 'center',
        width: 140,
        render: (text) => {
          return <>
            <style>
              {`.cover_book{
                width:120px;
                height:300px;
                overflow:hidden;
                display: flex;
                align-items: center;
                justify-content: center;
              }
              .cover_book img{
                width:120px;
                height: auto;
              }
            `}

            </style>
            <div className={cx('cover_book')}>
              {!text ? null : <img src={text} />}
            </div>
          </>
        }
      },
      {
        title: 'Book Title',
        dataIndex: 'title_name',
        align: 'center',
        // width: 120
      },
      {
        title: 'Price',
        dataIndex: 'price',
        align: 'center',
        // width: 120
      },
      {
        title: 'Full Price',
        dataIndex: 'full_price',
        align: 'center',
        // width: 120
      },
      {
        title: 'Author Name',
        dataIndex: 'author_name',
        align: 'center',
        // width: 120
      },
      {
        title: 'Author Pen Name',
        dataIndex: 'author_pen_name',
        align: 'center',
        // width: 120
      },
      {
        title: 'Book Status',
        dataIndex: 'title_status',
        align: 'center',
        // width: 80,
        render: (text) => {
          const map = {
            "1": 'processing',
            "2": 'complete',
          }
          return <Tag color={(text == '1') ? '#2db7f5' : '#87d068'}>{map[`${text}`]}</Tag>
        }
      },
      {
        title: 'Book Num',
        dataIndex: 'title_id',
        align: 'center',
        // width: 200
      },
      {
        title: 'Total Chapters',
        dataIndex: 'total_chapter_count',
        align: 'center',
        // width: 200
      },
      {
        title: 'Word Count',
        dataIndex: 'total_word_count',
        align: 'center',
        // width: 200
      },

      {
        title: formatMessage({ id: 'app.material.operation' }),
        dataIndex: 'operation',
        align: 'center',
        fixed: 'right',
        width: 150,
        render: (value, record) => {
          return (
            <div className={styles.handle}>
              <style>
                {`
                  .blue{
                    color:#1890ff;
                    cursor: pointer;
                    margin-bottom:0;
                  }
                  .blue:hover{
                    color:#0458a5
                  }
                `}
              </style>
              <p className='blue'
                onClick={() => {
                  console.log(111)
                  // tslint:disable-next-line:variable-name
                  const { id: book_id } = record;
                  dispatch({
                    type: 'book_info/patchBookInfo',
                    payload: { book_id }
                  })
                  .then(()=>{
                    _this.setState({
                      showBookInfo:true
                    })
                  })
                }}
              >Manage Book</p>
              <Divider style={{ margin: '5px auto' }} />
              <p className='blue'>Manage Chapter</p>
              <Divider style={{ margin: '5px auto' }} />
              <p className='blue'>Manage Copyright</p>
            </div>
          );
        }
      },
    ];
    return (
      <Fragment>

        <CommonBreadCrumb items={crumbs} />
        <div className={cx('operate')}>
          <OperationBar statuses={statuses} search={search} addTitle={'New Book'} add={showAdd} />
        </div>
        <Table
          className={cx('list')}
          bordered
          rowKey='id'
          // @ts-ignore
          columns={columns}
          dataSource={list || []}
          scroll={{ x: 2000 }}
          pagination={
            {
              position: 'both',
              pageSize: page_size,
              showSizeChanger: true,
              page_sizeOptions: ['20', '30', '40'],
              onShowSizeChange: this.onShowSizeChange,
              total,
              current: page,
              showTotal: total => formatMessage({ id: 'app.glob.pagetotal' }, { total }),
              size: 'small',
              onChange: this.fetchPage
            }
          }></Table>
        {showBookInfo && <EditTemplate close={hideAdd} />}
      </Fragment>
    );
  }
}

export default TemplateList;



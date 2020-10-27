import { type,isEmptyObject } from '@/utils/utils';

import { delFaq,modifyFaq,batchStatusUpdate } from '@/services/faq';

import { connect } from 'dva';
import Link from 'umi/link';
import router from 'umi/router';
import QRCode from 'qrcode.react';
import apiConfig from '@/utils/apiConfig';

import {
  Layout,
  Menu,
  Input,
  Breadcrumb,
  Icon,
  Button,
  Pagination,
  Divider,
  DatePicker,
  Table,
  Popconfirm,
  Badge,
  Card,
  Form,
  Row,
  Col,
  Select,
  Tag,
  Modal
} from 'antd';

import React, { PureComponent } from 'react';

import { formatMessage } from 'umi/locale';

import _ from 'lodash';


import styles from './Group.less';

const { RangePicker } = DatePicker;
const moment = require('moment');

const { Sider, Content } = Layout;
const Search = Input.Search;
const { Option } = Select;
function toParseInt(str) {
  if (str) {
    return parseInt(str || 0);
  }
  return 0;
}

/**
 * 枚举
 * status  1 未回复
 * status  2 已回复
 * status  3 驳回
 */

const QcodeUrl = /test/.test(apiConfig)?`http://test-h5.xuansky.cn/faqdetail/index.html?type=help&id=`:`https://h5.feishiapp.com/faqdetail/index.html?type=help&id=`;

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
      statusList,
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
class Faq extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      pagination: { page_size: 20, page:1, total_count: props.total_count },
      selectedRowKeys: [],
      selectedRowKeys1:[],
      showPreview:false,
      previewurl:'',
    };
    _.bindAll(this, ['updataConfiList', 'handleTableChange']);
  }
  componentDidMount() {
    this.getEnumList().then(() => {
      this.updataConfiList();
    });
  }

  goResolve = () => {}

  delFaq = id => {
    delFaq({
      id: id + '',
    }).then(res => {
      if (res && !res.code) {
        this.updataConfiList();
      }
    });
  };

  batchRejectHandel = (index,id) => {
    const { selectedRowKeys1 } = this.state;
    if (!selectedRowKeys1.length&&typeof(id)=='undefined') {
      return;
    }
    batchStatusUpdate({
      ids: typeof(id)=='undefined'?selectedRowKeys1.join(','):id,
      status: index,
    }).then(res => {
      if (res && !res.code) {
        this.updataConfiList();
        this.setState({
          selectedRowKeys1:[],
          selectedRowKeys:[],
        })
      }
    });
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
      type: 'customer/getAllVersion',
    });

    dispatch({
      type: 'faq/getFaqCateStatusList',
    });
   
    
  }

  updataConfiList() {
    const { dispatch } = this.props;
    const { pagination } = this.state;
    dispatch({
      type: 'faq/getList',
      payload: pagination,
    });

  }

  handleTableChange(page) {
    const { pagination } = this.state;
    this.setState(
      {
        pagination: Object.assign({}, pagination, { page }),
      },
      () => {
        this.updataConfiList();
      }
    );
  }
  SearchResetBtnHandle = () => {
    const { pagination } = this.state;
    this.props.form.resetFields();
    this.setState(
      {
        pagination: {
          page: 1,
          page_size: 20,
          type: '',
          status: '',
          name: '',
          id: '',
          version: '',
          operater_id: '',
          telephone: '',
          category: '',
          create_date_start: '',
          create_date_end: '',
          update_date_start: '',
          update_date_end: '',
        },
      },
      () => {
        this.updataConfiList();
      }
    );
  };

  SearchBtnHandle = () => {
    this.props.form.validateFields((err, values) => {
      const { pagination } = this.state;
      let time = {};
      if (values.pushtime && type(values.pushtime) === 'array') {
        time = {
          create_date_start: moment(values.pushtime[0]).format('YYYY-MM-DD') + ' 00:00:00',
          create_date_end: moment(values.pushtime[1]).format('YYYY-MM-DD') + moment(values.pushtime[0]).format('YYYY-MM-DD')==moment(values.pushtime[1]).format('YYYY-MM-DD')?' 23:59:59':' 00:00:00',
        };
      }
      if (values.checktime && type(values.checktime) === 'array') {
        time = Object.assign({}, time, {
          update_date_start: moment(values.checktime[0]).format('YYYY-MM-DD') + ' 00:00:00',
          update_date_end: moment(values.checktime[0]).format('YYYY-MM-DD') + moment(values.pushtime[0]).format('YYYY-MM-DD')==moment(values.pushtime[1]).format('YYYY-MM-DD')?' 23:59:59':' 00:00:00',
        });
      }
      delete values['pushtime'];
      delete values['checktime'];
      this.setState(
        {
          pagination: Object.assign({}, pagination, values, { page: 1, ...time }),
        },
        () => {
          this.updataConfiList();
        }
      );
    });
  };

  onShowSizeChange = (current, pageSize) => {
    const { pagination } = this.state;
    this.setState(
      {
        pagination: Object.assign({}, pagination, { page: current, page_size: pageSize }),
      },
      () => {
        this.updataConfiList();
      }
    );
    console.log(current, pageSize);
  };

  handleQcode=(id)=>{
    this.setState({
      previewurl:QcodeUrl+id
    },()=>{
      this.setState({
        showPreview:true
      })
    })
  }


  handleAddFaq=()=>{
    router.push('/feedback/faq/add');
  }
  handleCancel=()=>{
      this.setState({
        showPreview:false
      })
  }
  render() {
    const {
      list,
      page,
      total_count,
      roleList,
      statusList,
      keys,
      pathname,
      category,
      version,
      form: { getFieldDecorator },
    } = this.props;
    const { addVisible, editVisible, editDataSource,selectedRowKeys } = this.state;
    const { onShowSizeChange } = this;

    const rowSelection = {
      selectedRowKeys,
      onChange: (selectedRowKeys, selectedRows) => {
        // this.setState({ selectedRowKeys });
        let itemm;
        itemm = selectedRows.map(item => {
          return item.id;
        });
        this.setState({
          selectedRowKeys1: itemm,
          selectedRowKeys
        });
        // console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
      },
    };

    const columns = [
      {
        title: 'ID',
        dataIndex: 'id',
        key: 'id',
        width: '30px',
      },
      {
        title: formatMessage({ id: 'app.faq.id' }),
        dataIndex: 'sort',
        key: 'sort',
        width: '80px',
      },
      {
        title: formatMessage({ id: 'app.faq.category' }),
        dataIndex: 'category',
        key: 'category',
        width: '100px',
        render: (text, record) => {
          const arr =  category.filter((item)=>{
             return text == item.id
         })[0]
           if(arr){
             return arr.name;
           }else{
             return ''
           }
         },
      },
      {
        title: formatMessage({ id: 'app.faq.title' }),
        dataIndex: 'title',
        key: 'title',
        width: '100px',
        render: (text, record) => {
          text = text || '';
          var name = text.length > 15 ? `${text.substring(0,15)}...` : text;
          return (
          <div style={{cursor: 'pointer'}} onClick={()=>{this.handleQcode(record.id)}}>
              <div title={text}>
               { record.is_hot=='1'&&<Tag color="green">{formatMessage({ id:'app.faq.hot' })}</Tag>}
               { record.is_recommend=='1'&& <Tag color="geekblue">{formatMessage({ id:'app.faq.recommend' })}</Tag>}
                {name}
              </div>
          </div>
          );
        }
      },
      {
        title: formatMessage({ id: 'app.faq.pv' }),
        dataIndex: 'pv',
        key: 'pv',
        width: '80px',
      },
      {
        title: formatMessage({ id:'app.faq.date' }),
        dataIndex: 'create_time',
        key: 'create_time',
        width: '120px',
        render: (text, record) => {
            return (
              <div>
                <p>{formatMessage({ id:'app.faq.update'})}{record.update_time}</p>
                <p>{formatMessage({ id:'app.faq.publish'})}{record.create_time}</p>
              </div>
            )
        }
      },
      {
        title: formatMessage({ id: 'app.faq.status' }),
        dataIndex: 'status',
        key: 'status',
        width: '100px',
        render: (text, record) => {
          return statusList[text]
        },
      },
      {
        title: formatMessage({ id: 'app.feedback.versions' }),
        dataIndex: 'version',
        key: 'version',
        width: '100px',
        
      },
      {
        title: formatMessage({ id: 'app.faq.helpfull' }),
        dataIndex: 'helpful',
        key: 'helpful',
      },
      {
        title: formatMessage({ id: 'app.faq.unhelpfull' }),
        dataIndex: 'unhelpfull',
        key: 'unhelpfull',
      },
      {
        title: formatMessage({ id: 'app.feedback.content' }),
        dataIndex: 'content',
        key: 'content',
        width: '130px',
        render: (text, record) => {
          text = text || '';
          var name = text.length > 40 ? `${text.substring(0, 40)}...` : text;
          return <p title={text}>{name}</p>;
        },
      },
     
      {
        title: formatMessage({ id: 'app.feedback.operation' }),
        dataIndex: 'action',
        key: 'action',
        width: '220px',
        render: (text, record) => {
          return (
            <span>
                <Link to={`/feedback/faq/edit/${record.id}`}>
                  {formatMessage({ id: 'app.faq.edit' })}
                </Link>
                {
                  record.status=='0'&&
                <span>
                  <Divider type="vertical" />
                  <Popconfirm
                    title={formatMessage({ id: 'app.faq.confirmup' })}
                    onConfirm={() => this.batchRejectHandel(1,record.id)}
                    key={record.id}
                  >
                    <a href="#" >
                      {formatMessage({ id: 'app.faq.up' })}
                    </a>
                  </Popconfirm>
                </span>
                }
                {
                  record.status=='1'&&
                  <span>
                  <Divider type="vertical" />
                  <Popconfirm
                    title={formatMessage({ id: 'app.faq.confirmdown' })}
                    onConfirm={() => this.batchRejectHandel(0,record.id)}
                    key={record.id}
                  >
                    <a href="#" className={styles.dengerColor}>
                      {formatMessage({ id: 'app.faq.down' })}
                    </a>
                  </Popconfirm>
                </span>
                }
              
                <span>
                  <Divider type="vertical" />
                  <Popconfirm
                    title={formatMessage({ id: 'app.faq.confirmdel'})}
                    onConfirm={() => this.delFaq(record.id)}
                    key={record.id+'del'}
                  >
                    <a href="#" className={styles.dengerColor}>
                      {formatMessage({ id: 'app.faq.del' })}
                    </a>
                  </Popconfirm>
                </span>
            </span>
          );
        },
      },
    ];
    return (
      <div>
        <style>
          {`
            .status-badge .ant-badge-status-dot{
                height:8px;
                width:8px
            }
            .regDate .ant-calendar-picker{
              width:100%;
            }
            .styles-card .ant-card-head-wrapper div:nth-child(1){
                width:160px;
                flex: 1 1;
            }
            .styles-card .ant-card-head-wrapper div:nth-child(2){
              width:160px;
              flex:16 1;
          }
          .l-menu-style li:after{
            content: '';
            position: absolute;
            right: 0;
            top: 0;
            height:40px;
            border-right: 3px solid #26A4FF;
            transform: scaleY(0.0001);
            opacity: 0;
            transition: transform 0.15s cubic-bezier(0.215, 0.61, 0.355, 1), opacity 0.15s cubic-bezier(0.215, 0.61, 0.355, 1);
          }
          .l-menu-style.ant-menu:not(.ant-menu-horizontal) .ant-menu-item-selected{
             background:#def6ff
          }
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
            `}
        </style>

        <div className={styles.breadcrumbBox}>
          <Breadcrumb>
            <Breadcrumb.Item>
              <Icon type="lock" />
              <span>{formatMessage({ id: 'menu.feedback' })}</span>
            </Breadcrumb.Item>
            <Breadcrumb.Item>{formatMessage({ id: 'menu.feedback.faq' })}</Breadcrumb.Item>
          </Breadcrumb>
        </div>
        <div className={styles.addBtn}>
          <Card
            title={formatMessage({ id: 'menu.feedback.faq' })}
            className={'styles-card'}
            bordered
          >
            <Form layout="vertical" hideRequiredMark>
              <Row gutter={16}>
                <Col lg={4} md={12} sm={24}>
                  <Form.Item label={formatMessage({ id: 'app.faq.title' })}>
                    {getFieldDecorator('title')(
                      <Input placeholder={formatMessage({ id: 'app.faq.pleasetitle' })} />
                    )}
                  </Form.Item>
                </Col>
                <Col lg={4} md={12} sm={24}>
                  <Form.Item label={formatMessage({ id: 'app.feedback.issueCategory' })}>
                    {getFieldDecorator('category', {
                      initialValue: '',
                    })(
                      <Select>
                        <Option value="">
                          {formatMessage({ id: 'app.feedback.allIssueCategory' })}
                        </Option>
                        {!isEmptyObject(category)&&category.map((item,index) => {
                          return (
                            <Option key={index} value={item.id}>
                              {item.name}
                            </Option>
                          );
                        })}
                      </Select>
                    )}
                  </Form.Item>
                </Col>
                <Col lg={4} md={12} sm={24}>
                  <Form.Item label={formatMessage({ id: 'app.feedback.issueStatus' })}>
                    {getFieldDecorator('status', {
                      initialValue: '',
                    })(
                      <Select>
                        <Option value="">
                          {formatMessage({ id: 'app.feedback.allIssueStatus' })}
                        </Option>
                        {Object.keys(statusList).map(item => {
                          return (
                            <Option key={item} value={item}>
                              {statusList[item]}
                            </Option>
                          );
                        })}
                      </Select>
                    )}
                  </Form.Item>
                </Col>
                <Col lg={4} md={12} sm={24}>
                  <Form.Item label={formatMessage({ id: 'app.feedback.versions' })}>
                    {getFieldDecorator('version', {
                      initialValue: '',
                    })(
                      <Select>
                        <Option value="">
                          {formatMessage({ id: 'app.feedback.allVersions' })}
                        </Option>
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
                </Col>
                  <Col lg={4} md={12} sm={24}>
                      <Button type="primary" className={styles.btnSmt} onClick={this.SearchBtnHandle}>
                        {formatMessage({ id: 'app.content.search' })}
                      </Button>
                      <Button
                        className={styles.btnSmt}
                        style={{ marginLeft: 8 }}
                        onClick={this.SearchResetBtnHandle}
                      >
                        {formatMessage({ id: 'app.content.reset' })}
                      </Button>
                      {/* <Button type="primary"  style={{ marginLeft: 8 }} className={styles.btnSmt} onClick={this.handleAddFaq}>
                        {formatMessage({ id: 'app.faq.add' })}
                      </Button> */}
                </Col>
                
              </Row>
              <Row gutter={16} className="regDate">
                <Col lg={6} md={12} sm={24}>
                      <Button
                        type="primary"
                        className={styles.btnSmt}
                        style={{ marginLeft: 8 }}
                        onClick={this.handleAddFaq}
                      >
                        {formatMessage({ id: 'app.faq.add' })}
                      </Button>
                      <Button
                        type="primary"
                        className={styles.btnSmt}
                        style={{ marginLeft: 8 }}
                        onClick={()=>{this.batchRejectHandel(1)}}
                      >
                        {formatMessage({ id:'app.faq.batchup' })}
                      </Button>
                      <Button
                        type="danger"
                        className={styles.btnSmt}
                        style={{ marginLeft: 8 }}
                        onClick={()=>{this.batchRejectHandel(0)}}
                      >
                        {formatMessage({ id: 'app.faq.batchdown' })}
                      </Button>
                </Col>
              </Row>
            </Form>
          </Card>
        </div>
        <Table
          rowSelection={rowSelection}
          columns={columns}
          dataSource={list}
          pagination={false}
          bordered
          scroll={{ x: 1300 }}
          rowKey={(record, index) => `${record.id}${index}`}
        />
        <div className={styles.rightPagination}>
          <Pagination
             showTotal={total => formatMessage({ id: 'app.glob.pagetotal' },{total:total})}
            pageSizeOptions={['20', '30', '40']}
            showSizeChanger
            onShowSizeChange={onShowSizeChange}
            current={toParseInt(this.state.pagination.page)}
            pageSize={this.state.pagination.page_size||20}
            onChange={this.handleTableChange}
            total={toParseInt(total_count)}
          />
        </div>
        <Modal
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
                </Modal>
      </div>
    );
  }
}
export default Faq;

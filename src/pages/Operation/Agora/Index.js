
import React, { Component } from 'react';
import { connect } from 'dva';
import { Breadcrumb, Button, Tag, Form, Row, Col, Input, Card, Popconfirm, Select, Table, message, Modal } from 'antd';
import CommonBreadCrumb from '@/components/CommonBreadCrumb';
import { formatMessage } from 'umi/locale';
import videojs from 'videojs';
import router from 'umi/router';
import Edit from './components/Edit';


const Search = Input.Search;
const FormItem = Form.Item;
const TextArea = Input.TextArea;
const Option = Select.Option;


@Form.create()
@connect(({
  agora: {
    filter,
    list,
  }
}) => ({
  filter,
  list
}))
class Index extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showModel: false,
      detail: {},
      m3u8url: '',
    }
  }

  videojs = null;

  changeFilter = (query) => {
    const { dispatch } = this.props;
    return new Promise((resole) => {
      dispatch({
        type: "agora/filter",
        payload: { filter: query }
      })
      resole()
    })
  }

  fetch = (query) => {
    const { dispatch } = this.props;
    this.changeFilter(query)
      .then(() => {
        dispatch({
          type: "agora/fetch",
        })
      })
  }

  onEdit = (detail) => {
    this.setState({
      detail: detail || {}
    }, () => {
      this.setState({
        showModel: true,
      })
    })
  }
  onClose = () => {
    this.setState({
      showModel: false,
    })
  }
  onDel = (id) => {
    const { dispatch } = this.props;
    dispatch({
      type: "agora/del",
      payload: { id }
    })
  }

  onReset = () => {
    const { form: { resetFields } } = this.props;
    resetFields();
    this.onSearch();
  }

  onSearch = () => {
    const { form: { validateFields }, } = this.props;
    validateFields((err, values) => {
      this.fetch(values);
    })
  }

  SearchBar = () => {
    const { props: { form: { getFieldDecorator }, commonStatusMap }, onSearch, onEdit, onReset } = this;
    const formItemLayout = {
      labelCol: { span: 8 },
      wrapperCol: { span: 16 },
    };
    return (
      <Card
        className={'styles-card'}
        bordered
      >
        <Form >
          <Row gutter={16} className="regDate">
            <Col lg={6} md={12} sm={24}>
              <Form.Item label={'达人UID'} {...formItemLayout}>
                {getFieldDecorator('mcn_user_id')(
                  <Input placeholder={'请输入达人UID'} />
                )}
              </Form.Item>
            </Col>
            <Col lg={6} md={12} sm={24}>
              <Button
                type="primary"
                onClick={onSearch}
              >
                {formatMessage({ id: 'app.content.search' })}
              </Button>
              <Button
                style={{ marginLeft: 8 }}
                onClick={() => { onReset() }}
              >
                重置
              </Button>
            </Col>
          </Row>
        </Form>
      </Card>
    )
  }
  player = null
  videoObj = null
  TableList = () => {
    const { list, filter, commonStatusMap, dispatch } = this.props;
    const { onDel, onEdit } = this;
    const _this = this;
    const columns = [
      {
        title: 'ID',
        dataIndex: 'id',
        key: 'id',
        align: 'center',
      },
      {
        title: '达人UID',
        dataIndex: 'mcn_user_id',
        key: 'mcn_user_id',
        align: 'center',
      },
      {
        title: '达人昵称',
        dataIndex: 'master_info',
        key: 'master_info',
        align: 'center',
        render(text) {
          return text.nickname
        }
      },
      {
        title: '达人头像',
        dataIndex: '__',
        key: '__',
        align: 'center',
        render(text,record) {
          return <img src={record.master_info.avatar}  style={{width:'40px',height:'40px',borderRadius:'100%'}}/>
        }
      },
      {
        title: '视频用户id',
        dataIndex: 'slave_info_',
        key: 'slave_info_',
        align: 'center',
        render(text,record) {
          return record.slave_info.id
        }
      },
      {
        title: '视频用户名',
        dataIndex: 'slave_info',
        key: 'slave_info',
        align: 'center',
        render(text) {
          return text.nickname
        }
      },
      {
        title: '视频用户头像',
        dataIndex: '___',
        key: '___',
        align: 'center',
        render(text,record) {
          return <img src={record.slave_info.avatar}  style={{width:'40px',height:'40px',borderRadius:'100%'}}/>
        }
      },
      {
        title: '创建时间',
        dataIndex: 'create_at',
        key: 'create_at',
        align: 'center',
      },
      {
        title: '操作',
        dataIndex: 'active',
        key: 'active',
        align: 'center',
        render(_, info) {
          return (<>
            <Button type='green' size="small" style={{ marginLeft: '8px' }}
              onClick={() => {
                console.log(info.m3u8,'info.m3u8')
                _this.setState({
                  showModel:true,
                  m3u8url:info.m3u8,
                }, () => {
                  setTimeout(()=>{
                    if(_this.videoObj){
                      _this.videoObj.src({src: info.m3u8, type: "application/x-mpegURL"});
                      _this.player.play();
                      return
                    }
                    var options = {};
                    _this.videoObj = videojs('my-player')
                    _this.player = videojs('my-player', options, function onPlayerReady() {
                      videojs.log('Your player is ready!');
                      this.src({src: info.m3u8, type: "application/x-mpegURL"});
                      this.play();
                      
                      this.on('ended', function () {
                        videojs.log('Awww...over so soon?!');
                      });
                    });
                  })
                })
              }}

            >查看录制视频</Button>
          </>
          )
        }
      },
    ];
   
    return (
      <Table
        columns={columns}
        dataSource={list}
        align="center"
        bordered
        scroll={{ x: true }}
        rowKey={(record, index) => `${record.id}${index}`}
        pagination={{
          position: 'both',
          pageSize: filter.page_size,
          showSizeChanger: true,
          pageSizeOptions: ['20', '30', '40'],
          onShowSizeChange: this.onShowSizeChange,
          total: filter.total,
          current: filter.page,
          showTotal: total => formatMessage({ id: 'app.glob.pagetotal' }, { total: filter.total }),
          size: 'small',
          onChange: this.onShowSizeChange
        }}
      />
    )
  }
  onShowSizeChange = (page, page_size) => {
    this.fetch({ page, page_size })
  }
  onUpload = (res) => {
    if (res.code != 0) {
      message.info(res.msg)
      return
    }
    console.log(res, 'onUpload opt')
  }


  componentDidMount() {


  }

  render() {
    const { TableList, SearchBar, onUpload, url, onClose } = this;
    const crumbs = [
      {
        icon: 'desktop',
        title: '运营管理',
      }, {
        icon: 'robot',
        title: '录像管理',
      }
    ];
    const { detail, showModel, m3u8url } = this.state;
    const _this = this;
    return (
      <>
      <style>

        {`
          .ant-modal-centered.video .ant-modal{
            width:auto !important
          }
          .ant-modal-centered.video .ant-modal .ant-modal-body{
            padding:0 !important
          }
        `}
      </style>
        <CommonBreadCrumb items={crumbs} />
        <SearchBar />
        <TableList />
        <Modal
          title={null}
          visible={showModel}
          onCancel={() => {
            if(_this.player){
              _this.player.paused();
            }
            onClose()
          }}

          footer={null}
          closable={false}
          centered={true}
          maskClosable={true}
          wrapClassName={'video'} //对话框外部的类名，主要是用来修改这个modal的样式的
        >
          <video id="my-player"
            className="video-js vjs-big-play-centered"
            controls
            // preload="auto"
            width="400"
            height="600"
            data-setup="{}"
          >
          </video>
        </Modal>
      </>
    );
  }
}

export default Index;
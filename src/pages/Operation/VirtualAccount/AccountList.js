import { connect } from 'dva';

import React, { PureComponent, Fragment } from 'react';

import { formatMessage } from 'umi/locale';

import classnames from 'classnames/bind';

import AccountEdit from './AccountEdit';
import styles from './AccountList.less';
import EditGiftModal from './EditGiftModal';
import {
  Breadcrumb,
  Icon,
  Input,
  Button,
  Table,
  Divider,
  Popconfirm,
  Tag,
  Card,
  Form,
  Row,
  Col, Modal
  //  ,  Input, , Tag, Switch, Modal 
} from 'antd';

const cx = classnames.bind(styles);
const { Search } = Input;
@Form.create()
@connect(({ accounts: { giftList, list, total, page, pageSize, genders = new Map(), nation = new Map(), user_interests = new Map(),userTypesMap, tagsMap  = new Map() } }) => ({giftList, userTypesMap, tagsMap, list, genders, nation, user_interests, total, page, pageSize, }))
class AccountList extends PureComponent {
  state = {
    editShowing: false,
    modalVisible:false,
    showGiftModal:false,
    giftInfo:{}
  }
  showEdit = (e, record) => {
    e.preventDefault();
    if (record) {
      this.setState({
        editRecord: record,
      });
    }
    this.setState({
      editShowing: true
    });
  }
  showAdd = () => {
    this.setState({
      addShowing: true
    });
  }
  hideAdd = () => {
    this.setState({
      addShowing: false
    });
  }
  hideEdit = () => {
    this.setState({
      editShowing: false,
      editRecord: null
    });
  }
  deleteRecord = (record) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'accounts/delete',
      payload: record
    });
  }
  search = (value) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'accounts/fetch',
      payload: { nickname: value }
    });
  }
  onShowSizeChange = (current, size) => {
    this.props.dispatch({
      type: 'accounts/changePageSize',
      payload: {
        page: current,
        pageSize: size
      }
    });
    this.fetchPage(current, size);
  }
  fetchPage = (page, pageSize) => {
    const { search = {} } = this.state;
    this.props.dispatch({
      type: 'accounts/fetch',
      payload: {
        page,
        page_size: pageSize,
        ...search
      }
    });
  }
  SearchBtnHandle = (e, isExport = 0) => {
    const { dispatch } = this.props;
    this.props.form.validateFields((err, values) => {
      dispatch({
        type: 'accounts/fetch',
        payload: { ...values }
      });
    })
  };
  SearchResetBtnHandle = () => {
    const { dispatch } = this.props;
    this.props.form.resetFields();
    dispatch({
      type: 'accounts/fetch'
    });
  }


  render() {
    const { list, genders, countries, tags, total, page, pageSize, nation, user_interests, userTypesMap, tagsMap} = this.props;
    const { editShowing, addShowing, editRecord } = this.state;
    const { showEdit, hideEdit, deleteRecord, hideAdd, showAdd, search } = this;
    const {form:{getFieldDecorator}} = this.props;
    const _this = this;
    const operateBar = (
      <div className={cx('operate')}>
        <Card
            className={styles.card}
            bordered={false}
          >
            <Form layout="vertical" hideRequiredMark>
              <Row gutter={16}>
                <Col lg={4} md={12} sm={24}>
                  <Form.Item label={formatMessage({ id: 'app.virtual.accounts.id' })}>
                    {getFieldDecorator('id')(
                      <Input placeholder={formatMessage({ id: 'app.virtual.accounts.id' })} />
                    )}
                  </Form.Item>
                </Col>
                <Col lg={5} md={12} sm={24}>
                  <Form.Item label={formatMessage({ id: 'app.settings.basic.nickname' })}>
                    {getFieldDecorator('nickname')(
                      <Input placeholder={formatMessage({ id: 'app.settings.basic.nickname' })} />
                    )}
                  </Form.Item>
                </Col>
                <Col lg={5} md={12} sm={24}>
                  <Form.Item label={formatMessage({ id: 'app.user_.username' })}>
                    {getFieldDecorator('login_account')(
                      <Input placeholder={formatMessage({ id: 'app.user_.username' })} />
                    )}
                  </Form.Item>
                </Col>
                <Col lg={10} md={12} sm={24}>
                  <Button type="primary" style={{marginTop: 29}} className={styles.btnSmt} onClick={this.SearchBtnHandle}>
                    {formatMessage({ id: 'app.content.search' })}
                  </Button>
                  <Button
                    className={styles.btnSmt}
                    style={{ marginLeft: 8, marginTop: 29 }}
                    onClick={this.SearchResetBtnHandle}
                  >
                    {formatMessage({ id: 'app.content.reset' })}
                  </Button>
                  <Button  className={styles.btnSmt}  style={{ marginLeft: 8 , marginTop: 29 }} onClick={showAdd} type="primary">{formatMessage({ id: 'app.virtual.accounts.add' })}</Button> 
                </Col>
              </Row>
            </Form>
          </Card>
        {/* <Button onClick={showAdd} type="primary">{formatMessage({ id: 'app.virtual.accounts.add' })}</Button> */}
      </div>
    );
    const columns = [
      {
        title: formatMessage({ id: 'app.virtual.accounts.id' }),
        dataIndex: 'id',
        align: 'center',
      },
      {
        title: formatMessage({ id: 'app.virtual.accounts.avatar' }),
        dataIndex: 'avatar',
        align: 'center',
        render: (value, record) => {
          return (
            <img className={styles.avatar} src={`${value}?x-oss-process=image/resize,l_60`} alt={record.name} />
          );
        }
      },
      {
        title: formatMessage({ id: 'app.settings.basic.nickname' }),
        dataIndex: 'nickname',
        align: 'center',
      },
      {
        title: formatMessage({ id: 'app.virtual.account.type' }),
        dataIndex: 'login_type',
        align: 'center',
        render:(text)=>{
          if(!userTypesMap){
            return '';
          }
          return userTypesMap[text]
        }
      },
      {
        title: formatMessage({ id: 'app.user_.username' }),
        dataIndex: 'login_account',
        align: 'center',
      },
      {
        title: formatMessage({ id: 'app.virtual.accounts.phone' }),
        dataIndex: 'telephone',
        align: 'center',
      },
      {
        title: formatMessage({ id: 'app.virtual.accounts.gender' }),
        dataIndex: 'sex',
        align: 'center',
        render: (key) => {
          return genders.get(key);
        }
      },
      {
        title: formatMessage({ id: 'app.virtual.accounts.birthday' }),
        dataIndex: 'birthday',
        align: 'center',
      },
      {
        title: formatMessage({ id: 'app.virtual.recommend.text_price' }),
        dataIndex: 'text_price',
        align: 'center',
      },
      {
        title: formatMessage({ id: 'app.virtual.recommend.video_price' }),
        dataIndex: 'video_price',
        align: 'center',
      },
      {
        title: formatMessage({ id: 'app.virtual.recommend.voice_price' }),
        dataIndex: 'voice_price',
        align: 'center',
      },
      {
        title: formatMessage({ id: 'app.virtual.accounts.country' }),
        dataIndex: 'nation',
        align: 'nation',
        render: (text) => {
         return  (nation.get(+text)||'')
        }
      },
      {
        title: formatMessage({ id: 'app.virtual.accounts.tag' }),
        dataIndex: 'user_interests',
        align: 'center',
        render: (value) => {
          if (!value) return ''
          return value.split(',').map((tag,key) => {
            const ui = user_interests.get(+tag) ||'';
           return (<Tag key={key}>{ui.length>12?ui.replace(/^(.{5}).*(.{3})$/,"$1..."):ui}</Tag>)
          });
        }
      },
      {
        title: formatMessage({ id: 'app.virtual.recommend.tags' }),
        dataIndex: 'user_tags',
        align: 'center',
        render: (value) => {
          if (!value && !tagsMap) return '';
          return value.split(',').map((tag,key) => {
            const ui = tagsMap.get(+tag) ||'';
           return (<Tag key={key}>{ui.length>12?ui.replace(/^(.{5}).*(.{3})$/,"$1..."):ui}</Tag>)
          });
        }
      },
      {
        title: formatMessage({ id: 'app.virtual.accounts.brief' }),
        dataIndex: 'profile',
        align: 'center',
      },
      {
        title: formatMessage({ id: 'app.virtual.accounts.time' }),
        dataIndex: 'time',
        align: 'center',
        render: (value, record) => {
          return (
            <Fragment>
              <div className={cx('time')}>更新时间: {record.update_at}</div>
              <div className={cx('time')}>添加时间: {record.create_at}</div>
            </Fragment>
          );
        }
      },
      {
        title: formatMessage({ id: 'app.virtual.accounts.operation' }),
        dataIndex: 'operation',
        align: 'center',
        width: `120px`,
        fixed: 'right',
        render: (value, record) => {
          const deleteEl = (<Popconfirm
            title={formatMessage({ id: 'app.scene.tools.delete_confirm' })}
            okText={formatMessage({ id: 'app.scene.category.offline_confirm' })}
            cancelText={formatMessage({ id: 'app.scene.category.offline_cancel' })}
            okType='danger'
            placement="topRight"
            onConfirm={() => { deleteRecord(record) }}
          >
            <div>
              <a href="#" className={styles.delete}>{formatMessage({ id: 'app.scene.tools.delete' })}</a>
            </div>

          </Popconfirm>);
          return (
            <div className={styles.handle}>
              <div><a href="#" className={styles.edit} onClick={(e) => {
                e.preventDefault();
                setTimeout(()=>{
                  _this.setState({showGiftModal:true,giftInfo:{user_id:record.id}});
                })
                _this.props.dispatch({
                  type: 'accounts/fetchGiftList',
                  payload:{
                    user_id:record.id
                  }
                })
                .then((res)=>{
                 
                  console.log(res,'res');
                })
               }}>{'查看礼物'}</a></div>
              <Divider className={cx('divide')} />
              <div><a href="#" className={styles.edit} onClick={(e) => { showEdit(e, record); }}>{formatMessage({ id: 'app.scene.tools.handle.edit' })}</a></div>
              <Divider className={cx('divide')} />
              {deleteEl}
            </div>
          );
        }
      },
    ];

    const giftCol = [
      {
        title: '礼物key值',
        dataIndex: 'stat_key',
        width: 150,
      },
      {
        title: '礼物数量',
        dataIndex: 'num',
        width: 150,
      },
      {
        title: '操作',
        dataIndex: 'opt',
        width: 150,
        render(text,record){
          return <a href="#" onClick={(e)=>{
            e.preventDefault();
            _this.setState({
              giftInfo:{...(_this.state.giftInfo),...record}
            },()=>{
              _this.setState({
                modalVisible:true
              })
            })
          }}>编辑</a>
        }
      },
    ];



    return (
      <Fragment>
        <Breadcrumb className='breadcrumb-box' separator='/'>
          <Breadcrumb.Item><Icon type="lock" /> {formatMessage({ id: 'menu.operation' })}</Breadcrumb.Item>
          <Breadcrumb.Item>{formatMessage({ id: 'menu.operation.user.virtualaccount' })}</Breadcrumb.Item>
        </Breadcrumb>
        {operateBar}
        <Table scroll={{ x: true }} className={cx('list')} bordered rowKey='id' columns={columns} dataSource={list} pagination={
          {
            position: 'both',
            pageSize,
            showSizeChanger: true,
            pageSizeOptions: ['20', '30', '40'],
            onShowSizeChange: this.onShowSizeChange,
            total,
            current: page,
            showTotal: total => formatMessage({ id: 'app.glob.pagetotal' }, { total: total }),
            size: 'small',
            onChange: this.fetchPage
          }
        }></Table>
        <Modal
          visible={this.state.showGiftModal}
          footer={null}
          title={'礼物列表'}
          onCancel={()=>{
            this.setState({
              showGiftModal:false
            });
          }}
        >
          <Button 
          onClick={()=>{
            this.setState({
              giftInfo:{user_id:this.state.giftInfo.user_id}
            },()=>{
              this.setState({
                modalVisible:true
              })
            })
          }}
          >新增礼物</Button>
          <Table 
            columns={giftCol} 
            dataSource={this.props.giftList} 
            scroll={{ y: 240 }} 
            rowKey={(record)=>{
              return record.stat_key
            }}
          />
        </Modal>
        {addShowing && <AccountEdit visible={addShowing} close={hideAdd} />}
        {editRecord && <AccountEdit record={editRecord} visible={!!this.state.editRecord} close={hideEdit} />}
        {this.state.modalVisible &&
        <EditGiftModal
          onCloseModel={()=>{
            this.setState({
              modalVisible:false
            })
          }}
          modalVisible={this.state.modalVisible}
          giftInfo={this.state.giftInfo}
        />}
      </Fragment>
    );
  }

}
export default AccountList;

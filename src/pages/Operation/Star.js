import { delSocialUser } from '@/services/users';
import { type } from '@/utils/utils';

import { connect } from 'dva';

import {
  Input,
  Breadcrumb,
  Icon,
  Button,
  Pagination,
  Divider,
  Tag,
  Table,
  Popconfirm,
  Popover,
  message,
  Upload,
  Modal
} from 'antd';

import React, { PureComponent, Fragment } from 'react';

import _ from 'lodash';

import { formatMessage } from 'umi/locale';

import { operationEnum, getKey } from '../../../config/role.enum';

import styles from './Seed.less';
import Info from './Info';

const Search = Input.Search;

function getGroupName(source, id) {
  if (type(source) === 'array') {
    return source.filter(item => {
      return item.id === id;
    });
  }
  return [{}];
}
function toParseInt(str) {
  if (str) {
    return parseInt(str || 0);
  }
  return 0;
}

@connect(
  ({
    seed: { regionMap,languageMap},
    star: { data, info },
    routing: {
      location: { pathname },
    },
    memberInfo: {
      data: { keys },
    },
  }) => ({
    data,
    info,
    keys,
    pathname,
    regionMap,languageMap
  })
)
class Seed extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      previewImage:'',
      previewVisible:false,
      pagination: {
        page: 1,
        page_size: 20,
      },
      infomation:{},
      isShowInfo:false,
      selectedRows:[]
    };
  }
  componentDidMount() {
    const { dispatch } = this.props;
    Promise.all([
      dispatch({
        type: 'seed/getRegionMap',
      }),
      dispatch({
        type: 'seed/getLanguageMap',
      })
    ])
    .then(()=>{
      this.updataConfiList();
    })
  }

  onSearch = (value, isExport = 0) => {
    const { pagination } = this.state;
    this.setState(
      {
        pagination: Object.assign({}, pagination, { export: typeof isExport === 'number'? isExport : 0, page: 1, telephone: value.trim() }),
      },
      () => {
        this.updataConfiList();
      }
    );
  }

  updataConfiList=()=> {
    const { dispatch } = this.props;
    const { pagination } = this.state;
    dispatch({
      type: 'star/getList',
      payload: pagination,
    });
  }

  handleTableChange=(page)=> {
    const { dispatch } = this.props;
    this.state(({pagination})=>{
      return {pagination:{...pagination,page}}
    })
    dispatch({
      type: 'star/getList',
      payload: { page },
    });
  }

  handlePreview=(file)=>{
    this.setState({
      previewImage: file.url || file.preview,
      previewVisible: true,
    });
  }

  handleCancel = () => this.setState({ previewVisible: false });
  handleinfoCancel = () => this.setState({ isShowInfo: false });
  showInfo=(infomatin)=>{
    this.setState({
      infomatin,
      isShowInfo: true,
    })
  }

  delUser=(record)=>{
    if(!record.length){
      message.warn(formatMessage({ id: 'app.seed.pselectUsers'}))
      return
    }
    let id = record.reduce((prev,curr)=>{
      prev = `${prev} ${curr.id}`
      return prev
    },'')
    .trim()
    .replace(/\s/g,',')
    delSocialUser({id})
    .then(()=>{
      this.setState({
        selectedRows:[]
      })
      this.updataConfiList();
    })
  }
  render() {
    const { data, source, editModel, addVisibleModel, keys, pathname , regionMap,languageMap,} = this.props;
    const { previewVisible, previewImage,breadcrumb ,selectedRows} = this.state;
    const rowSelection = {
      onChange: (selectedRowKeys, selectedRows) => {
        this.setState({
          selectedRows
        })
      },
    };
    const columns = [
      {
        title: 'ID',
        dataIndex: 'id',
        key: 'id',
        width: '80px',
      },
      {
        title: formatMessage({ id: 'app.seed.telephone' }),
        dataIndex: 'telephone',
        key: 'telephone',
        width: '80px',
      },
      {
        title: formatMessage({ id: 'app.seed.sex' }),
        dataIndex: 'sex',
        key: 'sex',
        width: '150px',
        render: (text, record) => {
          return text==1?formatMessage({ id: 'app.seed.male' }):formatMessage({ id: 'app.seed.female' })
        },
      },
      {
        title: formatMessage({ id: 'app.seed.age' }),
        dataIndex: 'age',
        key: 'age',
        width: '60px',
      },
      {
        title: 'Email',
        dataIndex: 'email',
        key: 'email',
        width: '150px',
      },
      {
        title: 'Facebook_id',
        dataIndex: 'facebook_id',
        key: 'facebook_id',
        width: '150px',
      },
      {
        title: formatMessage({ id: 'app.seed.state' }),
        dataIndex: 'region',
        key: 'region',
        width: '150px',
        render: text => {
          let region = {};
          if(regionMap.length){
            region = regionMap.find((item)=>{
              return item.value ==text
            })
          }
          return region['name'];
        },
      },
      {
        title: formatMessage({ id: 'app.seed.lanage' }),
        dataIndex: 'dialects',
        width: '150px',
        key: 'dialects',
        render: text => {
          let dialects = '';
          if(languageMap.length){
            dialects = languageMap.filter((item)=>{
              return (text.split(',')).indexOf(item.value+'')>-1
            }).reduce((prev,curr)=>{
              prev = `${prev},${curr.name}`
              return prev
          },'');
          }
          return dialects.substring(1,dialects.length-1)
        },
      },
      {
        title: formatMessage({ id: 'app.seed.create_at' }),
        dataIndex: 'create_at',
        width: '230px',
        key: 'create_at',
        render: text => {
          return text || '';
        },
      },
      {
        title: formatMessage({ id: 'app.seed.update_at' }),
        dataIndex: 'update_at',
        width: '150px',
        key: 'update_at',
      },
      {
        title: formatMessage({ id: 'app.seed.platform' }),
        dataIndex: 'platform',
        width: '150px',
        key: 'platform',
        render: text => {
        const  platform= {
            '1':'Android',
            '2':'Ios',
            '3':'Android',
            '4':'other',
          }
          return platform[text];
        },
      },
      {
        title: formatMessage({ id: 'app.seed.screens' }),
        dataIndex: 'screens',
        width: '250px',
        key: 'screens',
        render: text => {
          if(text&&text.length){
           let fileList= text.reduce((prev,curr,index)=>{
               prev.push({
                uid:index+'',
                url: curr,
                thumbUrl:curr,
              })
              return prev;
             },[])
            return <Upload
                      listType="picture-card"
                      fileList={fileList}
                      showUploadList={{
                        showPreviewIcon:true,
                        showRemoveIcon:false
                      }}
                      onPreview={this.handlePreview}>
                    </Upload>
          }
         
          return '';
        },
      },
      {
        title: formatMessage({ id: 'app.image.table.operation' }),
        key: 'operation',
        width: '200px',
        // fixed: 'right',
        render: (text, record) => (
          <Fragment>
            <Popconfirm title="Sure to del?" onConfirm={this.delUser.bind(this,[record])}>
            <span style={{cursor:'pointer',color:'#f5222d'}}>{formatMessage({ id: 'app.seed.del' })}</span>
            </Popconfirm>
              <Divider type="horizontal" />
              <a href="#" onClick={this.showInfo.bind(this,record)}> 
                {formatMessage({ id: 'app.seed.detail' })}
              </a>
          </Fragment>
        ),
      },
    ];
    return (
      <div>
        <div className={styles.breadcrumbBox}>
          <Breadcrumb>
            <Breadcrumb.Item>
              <Icon type="lock" />
              <span>{formatMessage({ id: 'menu.operation' })}</span>
            </Breadcrumb.Item>
            <Breadcrumb.Item>{formatMessage({ id: 'menu.operation.user' })}</Breadcrumb.Item>
            <Breadcrumb.Item>{formatMessage({ id: 'menu.operation.user.star' })}</Breadcrumb.Item>
          </Breadcrumb>
        </div>
        <div className={styles.addBtn}>
          <div>
              <Search
                placeholder={formatMessage({ id: 'app.seed.pphoto' })}
                enterButton={formatMessage({ id: 'app.pages.search' })}
                size="default"
                onSearch={this.onSearch}
              />
          </div>
          <Button
            type="primary"
            className={styles.btnSmt}
            onClick={() => this.onSearch('', 1)}
            style={{ marginLeft: 8 }}
          >  
            {formatMessage({ id: 'app.content.export' })}
          </Button>
          <div />
          <div />
        </div>
        <Popconfirm title="Sure to del?" onConfirm={this.delUser.bind(this,selectedRows)}>
            <Button style={{marginBottom:'8px'}} type="danger">{formatMessage({ id:'app.seed.batchdel'})}</Button>
        </Popconfirm>
          <Table
            rowSelection={rowSelection}
            columns={columns}
            dataSource={data.list}
            pagination={false}
            bordered
            rowKey={(record, index) => `${record.id}${index}`}
            scroll={{ x: 1300 }}
          />
          <div className={styles.rightPagination}>
            <Pagination
               showTotal={total => formatMessage({ id: 'app.glob.pagetotal' },{total:total})}
              current={toParseInt(this.state.pagination.page||1)}
              pageSize={this.state.pagination.page_size}
              onChange={this.handleTableChange}
              total={toParseInt(data.total_count)}
            />
          </div>
          <Modal visible={previewVisible}  zIndex="1000" footer={null} onCancel={this.handleCancel}>
              <img  style={{ width: '100%' }} src={previewImage} />
          </Modal>
        {this.state.isShowInfo && <Modal visible={true} zIndex="10" width="1000px" footer={null} onCancel={this.handleinfoCancel}>
              <Info infomatin={this.state.infomatin} handlePreview={this.handlePreview}/>
          </Modal>}
      </div>
    );
  }
}
export default Seed;

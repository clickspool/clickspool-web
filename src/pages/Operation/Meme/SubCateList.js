import { connect } from 'dva';
import { Breadcrumb, Button, Col, Icon, Input, Modal, Row, Select, Table, Tag, Switch, Popconfirm, Divider } from 'antd';
import React, { PureComponent, Fragment } from 'react';
import { formatMessage } from 'umi/locale';
import SubCateEdit from './SubCateEdit';
import styles from './CategoryList.less';

const Search = Input.Search;
const Option = Select.Option;

@connect(({ memeSubCategories: { list, total, page, pageSize }, memeCategories: { list: cates } }) => ({ list, total, page, pageSize, cates }))
class SceneCatefory extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      adding: false,
      editId: null
    };
  }

  fetchPage = (page, pageSize) => {
    this.props.dispatch({
      type: 'memeSubCategories/fetch',
      payload: {
        page,
        pageSize
      }
    });
  }
  showEdit = (e, { id: editId }) => {
    e.preventDefault();
    this.setState({
      editId
    });
  }
  hideEdit = () => {
    this.setState({
      editId: null
    });
  }
  showAdd = () => {
    this.setState({
      adding: true
    });
  }
  hideAdd = () => {
    this.setState({
      adding: false
    });
  }
  putOnline = id => {
    this.props.dispatch({
      type: 'memeSubCategories/patchStatus',
      payload: { id, status: 1 }
    });
  }
  putOffline = id => {
    this.props.dispatch({
      type: 'memeSubCategories/patchStatus',
      payload: { id, status: 0 }
    });
  }
  onShowSizeChange = (current, size) => {
    this.props.dispatch({
      type: 'memeSubCategories/changePageSize',
      payload: {
        page: current,
        pageSize: size
      }
    });
    this.fetchPage(current, size);
  }
  search = (value) => {
    const { dispatch, pageSize } = this.props;
    dispatch({
      type: 'memeSubCategories/fetch',
      payload: { pid: value, pageSize, page: 1 }
    });
  }

  render() {
    const { list, page, pageSize, total, cates } = this.props;
    // console.info('pageSize', pageSize);
    const _this = this;
    let columns = [{
      title: formatMessage({ id: 'app.scene.category.id' }),
      dataIndex: 'id',
    },
    {
      title: formatMessage({ id: 'app.scene.category.icon' }),
      dataIndex: 'icon',
      render(text, record) {
        return (
          <img className={styles.icon} src={text} alt={record.name} />
        );
      }
    },
    {
      title: formatMessage({ id: 'app.scene.category.name' }),
      dataIndex: 'name',
    },
    {
      title: formatMessage({ id: 'app.meme.category.name' }),
      dataIndex: 'pid',
      render: (value) => {
        const { cates } = this.props;
        return cates.find(item => {
          return item.id === value;
        }).name;
      }
    },
    {
      title: formatMessage({ id: 'app.scene.category.desc' }),
      dataIndex: 'desc',
    },
    {
      title: formatMessage({ id: 'app.scene.category.status' }),
      dataIndex: 'status_name',
      render: (text, record) => {
        const color = record.status == 0 ? 'gray' : 'blue';
        return <Tag color={color}>{text}</Tag>
      }
    },
    {
      title: formatMessage({ id: 'app.scene.category.sort' }),
      dataIndex: 'sort',
    },
    {
      title: formatMessage({ id: 'app.meme.subcategory.page_size' }),
      dataIndex: 'page_size',
    },
    {
      title: formatMessage({ id: 'app.scene.category.time' }),
      dataIndex: 'create_time',
      render: (text, record) => {
        return (
          <Fragment>
            <div><Icon type='folder-open' theme="twoTone" /> {formatMessage({ id: 'app.scene.category.update_time' })}: {record.update_time}</div>
            <div><Icon type='folder-add' theme="twoTone" /> {formatMessage({ id: 'app.scene.category.create_time' })}: {record.create_time}</div>
          </Fragment>
        );
      }
    },
    {
      title: formatMessage({ id: 'app.scene.category.tool_count' }),
      dataIndex: 'tool_count',
    },
    {
      title: formatMessage({ id: 'app.meme.subcategory.is_random' }),
      dataIndex: 'is_random',
      render: (value) => {
        return +value === 1 ? formatMessage({ id: 'app.meme.subcategory.is_random.yes' }) : formatMessage({ id: 'app.meme.subcategory.is_random.no' })
      }
    },
    {
      title: formatMessage({ id: 'app.scene.category.handle' }),
      key: 'handle',
      render(text, record) {
        let caption, icon_type = 'edit', checked, statusEl;
        if (record.status == 0) {
          checked = false;
          caption = formatMessage({ id: 'app.scene.category.online' });
          statusEl = (
            <Popconfirm
              title={formatMessage({ id: 'app.scene.category.online_hint' })}
              okText={formatMessage({ id: 'app.scene.category.offline_confirm' })}
              cancelText={formatMessage({ id: 'app.scene.category.offline_cancel' })}
              okType='danger'
              placement="topRight"
              // onCancel={_this.cancelSwitch}
              onConfirm={_this.putOnline.bind(_this, record.id)}
            >
              <a href="#" className={styles.edit}>{caption}</a>
            </Popconfirm>
          );
        } else {
          checked = true;
          caption = formatMessage({ id: 'app.scene.category.offline' });
          let confirm = formatMessage({ id: 'app.scene.category.offline_hint' });
          if (record.tool_count > 0) {
            confirm = formatMessage({ id: 'app.scene.category.has_tool_offline_hint' });
          }
          statusEl = (
            <Popconfirm
              title={confirm}
              okText={formatMessage({ id: 'app.scene.category.offline_confirm' })}
              cancelText={formatMessage({ id: 'app.scene.category.offline_cancel' })}
              okType='danger'
              placement="topRight"
              // onCancel={_this.cancelSwitch}
              onConfirm={_this.putOffline.bind(_this, record.id)}
            >
              <a href="#" className={`${styles.edit} ${styles.danger}`}>{caption}</a>
            </Popconfirm>
          );
        }
        return (
          <div className={styles.handle}>
            <a href="#" className={styles.edit} onClick={(e) => { _this.showEdit(e, record) }}>{formatMessage({ id: 'app.scene.category.handle.edit' })}</a>
            <Divider type='vertical' />
            {statusEl}
          </div>
        );
      }
    },];
    columns = columns.map(item => {
      item.align = 'center';
      return item;
    });
    const catesEl = cates.map(cate => {
      const statusEl = cate.status == 0 ? ` (${formatMessage({ id: 'app.scene.category.status_offline' })})` : '';
      let cateEl = cate.name;
      if (cate.status == 0) {
        cateEl = (<><span className={styles.offline}>{cate.name}{statusEl}</span></>);
      }
      return (
        <Option key={cate.id} value={cate.id}>{cateEl}</Option>
      );
    });

    return (
      <Fragment>
        <Breadcrumb className='breadcrumb-box' separator='/'>
          <Breadcrumb.Item><Icon type="lock" /> {formatMessage({ id: 'menu.operation' })}</Breadcrumb.Item>
          <Breadcrumb.Item>{formatMessage({ id: 'menu.operation.meme' })}</Breadcrumb.Item>
          <Breadcrumb.Item>{formatMessage({ id: 'menu.operation.meme.category' })}</Breadcrumb.Item>
          <Breadcrumb.Item>{formatMessage({ id: 'menu.operation.meme.subcate' })}</Breadcrumb.Item>
        </Breadcrumb>
        <Row className='operation-bar' gutter={16} type='flex'>
          <Col className='gutter-row' span={4}>
            <Select onChange={this.search} className={styles.select} placeholder={formatMessage({ id: 'app.scene.tools.search.cate_name' })}>
              <Option value='' className={styles.all}>{formatMessage({ id: 'app.scene.tools.search.allcates' })}</Option>
              {catesEl}
            </Select>
          </Col>
          <Col className='gutter-row' span={2}>
            <Button type="primary" icon='plus' onClick={this.showAdd}>{formatMessage({ id: 'app.meme.subcate.add' })}</Button>
          </Col>
        </Row>
        {this.state.adding && <SubCateEdit caption={formatMessage({ id: 'app.meme.subcate.add' })} visible={this.state.adding} close={this.hideAdd.bind(this)} />}
        <Table bordered rowKey='id' columns={columns} dataSource={list} pagination={
          {
            position: 'both',
            pageSize,
            showSizeChanger: true,
            pageSizeOptions: ['20', '30', '40'],
            onShowSizeChange: this.onShowSizeChange,
            total,
            showTotal: total => formatMessage({ id: 'app.glob.pagetotal' }, { total: total }),
            size: 'small',
            onChange: this.fetchPage
          }
        } ></Table>
        {!!this.state.editId && <SubCateEdit caption={formatMessage({ id: 'app.scene.category.edit' })} id={this.state.editId} visible={!!this.state.editId} close={this.hideEdit.bind(this)} />}
      </Fragment>
    );
  }
}
export default SceneCatefory;

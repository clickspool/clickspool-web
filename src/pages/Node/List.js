import { modifyNode } from '@/services/nodeList';
import { type } from '@/utils/utils';

import { connect } from 'dva';

import { Input, Breadcrumb, Icon, Layout, Card, Form, Button } from 'antd';

import React, { PureComponent } from 'react';

import _ from 'lodash';

import { formatMessage } from 'umi/locale';

import { operationEnum, getKey } from '../../../config/role.enum';

import styles from './List.less';

import SelectNodeTree from './_components/SelectNodeTree';

const Search = Input.Search;
const FormItem = Form.Item;

const { Content, Sider } = Layout;

@Form.create()
@connect(
  ({
    nodeList: { branch },
    routing: {
      location: { pathname },
    },
    memberInfo: {
      data: { keys },
    },
  }) => ({
    branch,
    keys,
    pathname,
  })
)
class List extends PureComponent {
  constructor(props) {
    super(props);
  }
  componentDidMount() {
    this.updataConfiList();
  }

  onSearch(value) {
    this.setState(
      {
        pagination: { page: 1, app_version: value.trim() },
      },
      () => {
        this.updataConfiList();
      }
    );
  }

  updataConfiList() {
    // modifyNode(
    //  { config:JSON.stringify(
    //   [{
    //     "title": "内容管理",
    //     "key": "0",
    //     "children": [{
    //       "title": "内容管理",
    //       "key": "0-1",
    //       "children": [
    //         { "title": "查询内容", "key": "0-1-1"},
    //         { "title": "新建内容", "key": "0-1-2"},
    //         { "title": "编辑内容", "key": "0-1-3"},
    //         { "title": "删除内容", "key": "0-1-4"},
    //         { "title": "上线", "key": "0-1-5"},
    //         { "title": "下线", "key": "0-1-6"},
    //         { "title": "分类", "key": "0-1-7"},
    //       ],
    //     }, {
    //       "title": "推送管理",
    //       "key": "0-2",
    //       "children": [
    //         { "title": "浏览推送", "key": "0-2-1"},
    //         { "title": "新建推送", "key": "0-2-2"},
    //         { "title": "编辑推送", "key": "0-2-3"},
    //         { "title": "取消推送", "key": "0-2-4"},
    //         { "title": "删除推送", "key": "0-2-5"},
    //         { "title": "确定推送", "key": "0-2-6"},
    //         { "title": "撤回推送", "key": "0-2-7"},
    //       ],
    //     }],
    //   }, {
    //     "title": "运营管理",
    //     "key": "1",
    //     "children": [{
    //       "title": "图片管理",
    //       "key": "1-1",
    //       "children": [
    //         { "title": "浏览", "key": "1-1-1"},
    //         { "title": "新建图片", "key": "1-1-2"},
    //         { "title": "编辑", "key": "1-1-3"},
    //         { "title": "删除", "key": "1-1-4"},
    //       ],
    //     },{
    //       "title": "分组管理",
    //       "key": "1-2",
    //       "children": [
    //         { "title": "查询分组", "key": "1-2-1"},
    //         { "title": "新建分组", "key": "1-2-2"},
    //         { "title": "编辑分组", "key": "1-2-3"},
    //         { "title": "删除分组", "key": "1-2-4"},
    //       ],
    //     }],
    //   }, {
    //     "title": "系统管理",
    //     "key": "2",
    //     "children": [{
    //       "title": "账号管理",
    //       "key": "2-1",
    //       "children": [
    //         { "title": "浏览", "key": "2-1-1", },
    //         { "title": "新建账号", "key": "2-1-2",},
    //         { "title": "编辑账号", "key": "2-1-3",},
    //         { "title": "删除账号", "key": "2-1-4",},
    //       ]
    //     },{
    //       "title": "角色管理",
    //       "key": "2-2",
    //       "children": [
    //         { "title": "查询角色", "key": "2-2-1"},
    //         { "title": "新建角色", "key": "2-2-2"},
    //         { "title": "编辑角色", "key": "2-2-3"},
    //         { "title": "删除角色", "key": "2-2-4"},
    //       ],
    //     },{
    //       "title": "版本管理",
    //       "key": "2-3",
    //       "children": [
    //         { "title": "浏览", "key": "2-3-1"},
    //         { "title": "新建版本", "key": "2-3-2"},
    //         { "title": "编辑版本", "key": "2-3-3"},
    //         { "title": "删除版本", "key": "2-3-4"},
    //       ],
    //     },{
    //       "title": "全局管理",
    //       "key": "2-4",
    //       "children": [
    //         { "title": "浏览", "key": "2-4-1"},
    //         { "title": "新建配置", "key": "2-4-2"},
    //         { "title": "编辑配置", "key": "2-4-3"},
    //         { "title": "删除配置", "key": "2-4-4"},
    //       ],
    //     }],
    //   },{
    //       "title": "节点管理",
    //       "key": "3-1",
    //       "children": [
    //         { "title": "节点浏览", "key": "3-1-1"},
    //         { "title": "新建节点", "key": "3-1-2"},
    //         { "title": "编辑节点", "key": "3-1-3"},
    //         { "title": "删除节点", "key": "3-1-4"},
    //       ],
    //     }
    // ]
    //  ),
    //   url_map:JSON.stringify(
    //     [
    //       { "title": "查询内容", "key": "0-1-1","url":""},
    //       { "title": "新建内容", "key": "0-1-2","url":""},
    //       { "title": "编辑内容", "key": "0-1-3","url":""},
    //       { "title": "删除内容", "key": "0-1-4","url":""},
    //       { "title": "内容上线", "key": "0-1-5","url":""},
    //       { "title": "内容下线", "key": "0-1-6","url":""},
    //       { "title": "内容分类", "key": "0-1-7","url":""},
    //       { "title": "浏览推送", "key": "0-2-1","url":""},
    //       { "title": "新建推送", "key": "0-2-2","url":""},
    //       { "title": "编辑推送", "key": "0-2-3","url":""},
    //       { "title": "取消推送", "key": "0-2-4","url":""},
    //       { "title": "删除推送", "key": "0-2-5","url":""},
    //       { "title": "确定推送", "key": "0-2-6","url":""},
    //       { "title": "撤回推送", "key": "0-2-7","url":""},
    //       { "title": "浏览图片", "key": "1-1-1","url":""},
    //       { "title": "新建图片", "key": "1-1-2","url":""},
    //       { "title": "编辑图片", "key": "1-1-3","url":""},
    //       { "title": "删除图片", "key": "1-1-4","url":""},
    //       { "title": "查询分组", "key": "1-2-1","url":""},
    //       { "title": "新建分组", "key": "1-2-2","url":""},
    //       { "title": "编辑分组", "key": "1-2-3","url":""},
    //       { "title": "删除分组", "key": "1-2-4","url":""},
    //       { "title": "浏览账号", "key": "2-1-1","url":""},
    //       { "title": "新建账号", "key": "2-1-2","url":""},
    //       { "title": "编辑账号", "key": "2-1-3","url":""},
    //       { "title": "删除账号", "key": "2-1-4","url":""},
    //       { "title": "查询角色", "key": "2-2-1","url":""},
    //       { "title": "新建角色", "key": "2-2-2","url":""},
    //       { "title": "编辑角色", "key": "2-2-3","url":""},
    //       { "title": "删除角色", "key": "2-2-4","url":""},
    //       { "title": "浏览版本", "key": "2-3-1","url":""},
    //       { "title": "新建版本", "key": "2-3-2","url":""},
    //       { "title": "编辑版本", "key": "2-3-3","url":""},
    //       { "title": "删除版本", "key": "2-3-4","url":""},
    //       { "title": "浏览配置", "key": "2-4-1","url":""},
    //       { "title": "新建配置", "key": "2-4-2","url":""},
    //       { "title": "编辑配置", "key": "2-4-3","url":""},
    //       { "title": "删除配置", "key": "2-4-4","url":""},
    //       { "title": "节点浏览", "key": "3-1-1","url":""},
    //       { "title": "新建节点", "key": "3-1-2","url":""},
    //       { "title": "编辑节点", "key": "3-1-3","url":""},
    //       { "title": "删除节点", "key": "3-1-4","url":""},
    //   ]
    //   )}
    // )
  }
  addGlob() {
    const { dispatch } = this.props;
  }
  handleTableChange(page) {
    const { dispatch } = this.props;
  }
  toParseInt(str) {}

  render() {
    const { getFieldDecorator } = this.props.form;
    const { branch } = this.props;
    console.log(branch, '---');
    return (
      <div>
        <div className={styles.breadcrumbBox}>
        <Breadcrumb style={{borderBottom:' 1px solid #ccc',paddingBottom:' 10px'}}>
            <Breadcrumb.Item>
              <Icon type="cluster" />
              <span>{formatMessage({ id: 'menu.node' })}</span>
            </Breadcrumb.Item>
          </Breadcrumb>
        </div>
        <div>
          <Layout>
            <Sider width={250} style={{ background: '#fff' }}>
              <SelectNodeTree />
            </Sider>
            <Content
              style={{ padding: '10px 24px', marginLeft: 10, minHeight: 540, background: '#fff' }}
            >
              <Card title={formatMessage({ id: 'app.nodes.nodedetail' })}>
                <Form onSubmit={this.handleSubmit}>
                  <FormItem label={formatMessage({ id: 'app.nodes.title' })}>
                    {getFieldDecorator('title', {
                      initialValue: (branch && branch.title) || '',
                      rules: [
                        { required: true, message: formatMessage({ id: 'app.nodes.title' }) },
                      ],
                    })(<Input placeholder={formatMessage({ id: 'app.nodes.title' })} />)}
                  </FormItem>
                  <FormItem label={formatMessage({ id: 'app.nodes.nodekey' })}>
                    {getFieldDecorator('key', {
                      initialValue: (branch && branch.key) || '',
                      rules: [
                        { required: true, message: formatMessage({ id: 'app.nodes.nodekey' }) },
                      ],
                    })(<Input disabled placeholder={formatMessage({ id: 'app.nodes.nodekey' })} />)}
                  </FormItem>
                  <FormItem label={formatMessage({ id: 'app.nodes.apiurl' })}>
                    {getFieldDecorator('url', {
                      initialValue: (branch && branch.url) || '',
                      rules: [
                        { required: true, message: formatMessage({ id: 'app.nodes.apiurl' }) },
                      ],
                    })(<Input placeholder={formatMessage({ id: 'app.nodes.apiurl' })} />)}
                  </FormItem>
                  <FormItem>
                    <Button type="primary" htmlType="submit">
                      {formatMessage({ id: 'app.nodes.save' })}
                    </Button>
                  </FormItem>
                </Form>
              </Card>
            </Content>
          </Layout>
        </div>
      </div>
    );
  }
}
export default List;

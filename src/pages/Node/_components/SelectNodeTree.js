import { type } from '@/utils/utils';

import { connect } from 'dva';

import { Tree, Icon, Tooltip } from 'antd';

import React from 'react';

import { formatMessage } from 'umi/locale';

const TreeNode = Tree.TreeNode;

const DirectoryTree = Tree.DirectoryTree;

const $ = require('jquery');

@connect(({ nodeList: { data } }) => ({
  data,
}))
export default class SelectNodeTree extends React.Component {
  state = {
    showOpIcon: true,
    treeData: this.props.data.admin_config,
    url_map: this.props.data.url_map,
  };
  componentDidMount() {}
  onSelect = item => {
    const { dispatch, data } = this.props;
    if (item[0].indexOf('parents') > -1) {
      return;
    }
    const iitem = item;
    // const config = JSON.parse(data.config||[]);
    const urlmap = data.url_map;
    const url = urlmap.filter(iiitem => {
      return iiitem.key === iitem.key;
    });
    const payload = {
      title: iitem.title,
      key: iitem.key,
      url: url[0].url,
    };
    dispatch({
      type: 'nodeList/getBranch',
      payload,
    });
  };
  onExpand = () => {};
  onMouseOver = (val, ev) => {
    $(ev.target)
      .find('.icon-box')
      .show();
  };
  onMouseOverIcon = (val, ev) => {
    this.setState({ showOpIcon: false });
  };
  onMouseOut = (val, ev) => {
    const target = $(ev.target);
    target.find('.icon-box').hide();
  };
  onMouseOutIcon = (val, ev) => {
    const target = $(ev.target).closest('.flag-list');
    this.setState({ showOpIcon: true }, () => {
      target.find('.icon-box').hide();
    });
    ev.stopPropagation();
    return false;
  };
  onClickDel = (val, ev) => {
    ev.stopPropagation();
    return false;
  };
  renderTreeNodes = data => {
    const { onMouseOver, onMouseOut, onClickDel, onMouseOutIcon, onMouseOverIcon } = this;
    return data.map((item, index) => {
      if (item.children) {
        return (
          <TreeNode
            title={
              <span
                className={
                  item.children.filter(item => {
                    return item.children;
                  }).length
                    ? 'node-list-style-p-p flag-list'
                    : 'node-list-style-p flag-list'
                }
                onMouseEnter={onMouseOver.bind(this, item)}
                onMouseLeave={onMouseOut.bind(this, item)}
              >
                {item.title}
                <div className="icon-box">
                  <Tooltip title={formatMessage({ id: 'app.image.del' })}>
                    <Icon type="delete" onClick={onClickDel.bind(this, item)} />
                  </Tooltip>
                </div>
              </span>
            }
            key={`${item.key}parents`}
          >
            {this.renderTreeNodes(item.children)}
          </TreeNode>
        );
      }
      return (
        <TreeNode
          title={
            <span
              className="node-list-style flag-list"
              onMouseEnter={onMouseOver.bind(this, item)}
              onMouseLeave={onMouseOut.bind(this, item)}
            >
              {item.title}
              <div className="icon-box">
                <Tooltip title={formatMessage({ id: 'app.image.del' })}>
                  <Icon type="delete" onClick={onClickDel.bind(this, item)} />
                </Tooltip>
              </div>
            </span>
          }
          key={JSON.stringify(item)}
          isLeaf
        />
      );
    });
  };
  render() {
    const { treeData } = this.state;
    return (
      <div className="select-node-tree-box">
        <style>
          {`
                        .node-list-style{
                            display:inline-block;
                            width:140px;
                        }
                        .node-list-style-p{
                            display:inline-block;
                            width:157px;
                        }
                        .node-list-style-p-p{
                            display:inline-block;
                            width:175px;
                        }
                        .icon-box{
                            position:absolute;
                            right:10px;
                            top:0;
                            display:none;
                            width:24px;
                            height:0px;
                        }
                    `}
        </style>
        <DirectoryTree multiple defaultExpandAll onSelect={this.onSelect} onExpand={this.onExpand}>
          {this.renderTreeNodes(treeData)}
        </DirectoryTree>
      </div>
    );
  }
}

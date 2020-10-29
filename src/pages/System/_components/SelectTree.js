import { getRoleRootIds } from '@/utils/utils';

import { connect } from 'dva';

import { Tree } from 'antd';

import React from 'react';

import styles from './index.less';

const $ = require('jquery');

const TreeNode = Tree.TreeNode;

@connect(({ nodeList: { data } }) => ({
  data,
}))
class SelectTree extends React.Component {
  constructor(props) {
    super(props);
    const treeData = props.data.admin_config;
    this.state = {
      checkedKeys: [],
      treeData,
    };
  this.tier = 0;
  }
  getValidKeys=(defkeys,admin_config)=>{
    let allKeys = [];
    function getAllKeys(arr){
      arr.forEach(element => {
        allKeys.push(element.key);
        if(element.children){
          getAllKeys(element.children);
        }
      });
    }
    getAllKeys(admin_config);
   return defkeys.filter((item)=>{
            return allKeys.indexOf(item)>-1
          })
  }
  componentDidMount() {
    const { defkeys,data:{admin_config} } = this.props;
    let validKeys = this.getValidKeys(defkeys,admin_config);
    this.setState(
      {
        checkedKeys: validKeys ? getRoleRootIds(validKeys) : [],
      },
      () => {
      }
    );
    this.getLie();
  }
  closestEl=(el, selector)=> {
    var matchesSelector = el.matches || el.webkitMatchesSelector || el.mozMatchesSelector || el.msMatchesSelector;
    while (el) {
        if (matchesSelector.call(el, selector)) {
            break;
        }
        el = el.parentElement;
    }
    return el;
}
  getLie = (expandedObj) => {
    const treeNodeClass = {
      // width: '200px',
      // display:'inline-block'
      // float: 'left',
    };
    if(expandedObj&&expandedObj.expanded===false){
      return
    }

    $('.ui-select-tree-box .ant-tree li').each((index, item) => {
      if (!$(item).has('ul').length&&!$(item).hasClass('role_')) {
        $(item).css(treeNodeClass);
        $(item)
          .parent('ul')
          .addClass(styles.uiClearfix);
      }
    });
  };
  onExpand = (expandedKeys,obj) => {
    // if not set autoExpandParent to false, if children expanded, parent can not collapse.
    // or, you can remove all expanded children keys.
    // console.log(obj.expanded,'obj.expanded')
    this.setState(
      {
        expandedKeys,
        autoExpandParent: true,
      },
      () => {
        setTimeout(()=>{
          this.getLie(obj);
        })
        
      }
    );
  };

  onCheck = checkedKeys => {
    const { onCallBack } = this.props;
    this.setState({ checkedKeys });
    // console.log(checkedKeys);
    onCallBack(checkedKeys);
    setTimeout(()=>{
      this.getLie();
    })
   
  };
  renderTreeNodes = (data) => {
    const {tier} = this;
    this.tier++;
    return data.map(item => {
      if (item.children) {
        return (
          <TreeNode title={item.title} key={item.key} className={`role_`}>
            {this.renderTreeNodes(item.children)}
          </TreeNode>
        );
       
      }
      return <TreeNode {...item} />;
    });
  };

  render() {
    const {treeData} =  this.state;
    return (
      <div className="ui-select-tree-box">
        <Tree
          checkable
          onExpand={this.onExpand}
          onCheck={this.onCheck}
          checkedKeys={this.state.checkedKeys || []}
          // onSelect={this.onSelect}
          // selectedKeys={this.state.selectedKeys}
          defaultExpandAll={true}
        >
          {this.renderTreeNodes(treeData)}
        </Tree>
        <style>
          {`
                    .ui-select-tree-box{
                        width:100%;
                        box-sizing: border-box;
                        padding:5px;
                        background:#fff;
                        border: 1px solid #eee;
                        border-radius: 4px;
                        overflow:auto;
                    }
                    `}
        </style>
      </div>
    );
  }
}
export default SelectTree;

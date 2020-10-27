import { connect } from 'dva';

import { Input, Breadcrumb, Icon, Button, Pagination } from 'antd';

import React, { PureComponent } from 'react';

import _ from 'lodash';

import { formatMessage } from 'umi/locale';

import styles from './Setting.less';
import SettingBox from './SettingBox';
import GlobAdd from './GlobAdd';
import GlobEdit from './GlobEdit';

const Search = Input.Search;

@connect(({ settingInfo }) => ({
  settingInfo,
}))
class Setting extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      pagination: { page: 1, total_page: 0 },
      breadcrumb: formatMessage({ id: 'menu.system.setting' }),
    };
    this.updataConfiList = this.updataConfiList.bind(this);
    this.onSearch = this.onSearch.bind(this);
    this.addGlob = this.addGlob.bind(this);
    this.handleTableChange = this.handleTableChange.bind(this);
    this.toParseInt = this.toParseInt.bind(this);
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
    const { dispatch } = this.props;
    const { pagination } = this.state;
    dispatch({
      type: 'settingInfo/getConfigList',
      payload: pagination,
    });
  }
  addGlob() {
    const { dispatch } = this.props;
    dispatch({
      type: 'settingInfo/addModelVisble',
      payload: { addVisibleModel: true },
    });
  }
  handleTableChange(page) {
    const { dispatch } = this.props;
    dispatch({
      type: 'settingInfo/getConfigList',
      payload: { page },
    });
  }
  toParseInt(str) {
    return parseInt(str);
  }

  render() {
    const {
      settingInfo: { data, editModel, addVisibleModel },
    } = this.props;
    const { breadcrumb } = this.state;
    const SettingBoxElements = [];
    if (data && data.data) {
      for (let item in data.data) {
        data.data[item]['1'].key = item.toString();
        SettingBoxElements.push(
          <div key={item.toString()}>
            <SettingBox {...data.data[item]['1']} />
          </div>
        );
      }
    }
    return (
      <div>
        <div className={styles.breadcrumbBox}>
          <Breadcrumb>
            <Breadcrumb.Item>
              <Icon type="lock" />
              <span>{formatMessage({ id: 'menu.system' })}</span>
            </Breadcrumb.Item>
            <Breadcrumb.Item>{breadcrumb}</Breadcrumb.Item>
          </Breadcrumb>
        </div>
        <div className={styles.addBtn}>
          <div>
            <Search
              placeholder={formatMessage({ id: 'app.global.input.defaultInput' })}
              enterButton={formatMessage({ id: 'app.pages.search' })}
              size="default"
              onSearch={this.onSearch}
            />
          </div>
          <div className={styles.btnBox}>
            <Button type="primary" onClick={this.addGlob}>
              {formatMessage({ id: 'app.versions.add' })}
            </Button>
          </div>
          <div />
          <div />
        </div>
        {SettingBoxElements}
        <div className={styles.rightPagination}>
          <Pagination
           showTotal={total => formatMessage({ id: 'app.glob.pagetotal' },{total:total})}
            current={this.toParseInt(data.page)}
            pageSize={20}
            onChange={this.handleTableChange}
            total={this.toParseInt(data.total_count)}
          />
        </div>
        <GlobEdit visible={editModel} />
        <GlobAdd visible={addVisibleModel} />
      </div>
    );
  }
}
export default Setting;

import { type } from '@/utils/utils';

import { connect } from 'dva';

import { Input, Breadcrumb, Icon, Button, Pagination } from 'antd';

import React, { PureComponent } from 'react';

import _ from 'lodash';

import { formatMessage } from 'umi/locale';

import { operationEnum, getKey } from '../../../config/role.enum';

import GlobAdd from './GlobAdd';
import GlobEdit from './GlobEdit';
import styles from './Setting.less';
import SettingBox from './SettingBox';

const Search = Input.Search;
const InputGroup = Input.Group;

@connect(
  ({
    settingInfo,
    routing: {
      location: { pathname },
    },
    memberInfo: {
      data: { keys },
    },
  }) => ({
    settingInfo,
    pathname,
    keys,
  })
)
class Setting extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      pagination: { page: 1, total_page: 0,page_size:1000, },
      breadcrumb: formatMessage({ id: 'menu.system.setting' }),
      group: '',
    };
    this.updataConfiList = this.updataConfiList.bind(this);
    this.onSearch = this.onSearch.bind(this);
    this.addGlob = this.addGlob.bind(this);
    this.handleTableChange = this.handleTableChange.bind(this);
    this.toParseInt = this.toParseInt.bind(this);
    this.onChangeGroup = this.onChangeGroup.bind(this);
  }
  componentDidMount() {
    this.updataConfiList();
  }

  onSearch(value) {
    this.setState(
      {
        pagination: { page: 1,pageSzie:1000, name: value.trim(), group_name: this.state.group },
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
    if (str) {
      return parseInt(str);
    }
    return 0;
  }
  onChangeGroup(ev) {
    this.setState({
      group: ev.target.value.trim(),
    });
  }

  render() {
    const {
      settingInfo: {
        data: { data },
        page,
        total_count,
        editModel,
        addVisibleModel,
      },
      keys,
      pathname,
    } = this.props;
    const { breadcrumb, group } = this.state;
    const SettingBoxElements = [];
    if (type(keys) == 'array' && keys.indexOf(getKey(pathname, operationEnum.select)) > -1) {
      if (data && data.data) {
        for (let item in data.data) {
          // data.data[item]['1'].key = item.toString();
          SettingBoxElements.push(
            <div key={item.toString()}>
              <SettingBox onCallBack={this.updataConfiList} vmdata={data.data[item]} />
            </div>
          );
        }
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
            <Input
              value={group}
              onChange={this.onChangeGroup}
              placeholder={formatMessage({ id: 'app.setting.groupname' })}
            />
          </div>
          <div>
            <Search
              placeholder={formatMessage({ id: 'app.global.input.defaultInput' })}
              enterButton={formatMessage({ id: 'app.pages.search' })}
              size="default"
              onSearch={this.onSearch}
            />
          </div>
          <div className={styles.btnBox}>
            {type(keys) == 'array' && keys.indexOf(getKey(pathname, operationEnum.add)) > -1 && (
              <Button type="primary" onClick={this.addGlob}>
                {formatMessage({ id: 'app.versions.add' })}
              </Button>
            )}
          </div>
          <div />
        </div>
        {SettingBoxElements}
        {type(keys) == 'array' && keys.indexOf(getKey(pathname, operationEnum.select)) > -1 && (
          <div className={styles.rightPagination}>
            <Pagination
               showTotal={total => formatMessage({ id: 'app.glob.pagetotal' },{total:total})}
              current={this.toParseInt(page)}
              pageSize={1000}
              onChange={this.handleTableChange}
              total={this.toParseInt(total_count)}
            />
          </div>
        )}
        {editModel && <GlobEdit visible={editModel} />}
        {addVisibleModel && <GlobAdd visible={addVisibleModel} />}
      </div>
    );
  }
}
export default Setting;

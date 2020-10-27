import FooterToolbar from '@/components/FooterToolbar';
import { splitRoleIds } from '@/utils/utils';
import { modify, getList } from '@/services/role';
import { connect } from 'dva';
import { Input, Breadcrumb, Icon, Row, Col, Button, message } from 'antd';

import React, { PureComponent } from 'react';

import Link from 'umi/link';
import { formatMessage } from 'umi/locale';
import router from 'umi/router';

import styles from './Role.less';

import SelectTree from './_components/SelectTree';

const Search = Input.Search;
@connect()
class RoleEdit extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      name: '',
      keys: [],
      id: '',
      isShowTree: false,
    };
    this.onClickCommit = this.onClickCommit.bind(this);
    this.onClickCancel = this.onClickCancel.bind(this);
  }
  componentDidMount() {
    const {
      match: {
        params: { id },
      },
    } = this.props;
    getList({ page: 1, id }).then(res => {
      if (res && !res.code) {
        this.setState({
          name: res.data.data[0].name,
          keys: JSON.parse(res.data.data[0].keys),
          id: res.data.data[0].id,
        });
      }
    });
  }

  onInputChange(e) {
    this.setState({
      name: e.target.value,
    });
  }
  onClickCommit() {
    const { name, keys, id } = this.state;
    const { dispatch } = this.props;
    if (!name || !keys.length) {
      message.warning(formatMessage({ id: 'app.role.full' }));
      return;
    }
    const kkeys = JSON.stringify(splitRoleIds(keys));
    modify({ keys: kkeys, role_id: id, name }).then(res => {
      if (res && !res.code) {
        this.onClickCancel();
        dispatch({
          type: 'memberInfo/getMemberInfo',
          payload: {},
        });
      }
    });
  }
  onClickCancel() {
    router.push('/system/role');
  }
  getRolekeys(val) {
    const keys = val || [];
    // this.isShowTree
    this.setState({ keys }, () => {
      if (this.state.keys.length == 0) {
        this.setState({ isShowTree: true });
      }
    });
  }

  render() {
    const { name, keys, isShowTree } = this.state;
    
    const stylecss = {
      textAlign: 'right',
      lineHeight: '29px',
    };
    return (
      <div>
        <div className={styles.breadcrumbBox}>
          <Breadcrumb>
            <Breadcrumb.Item>
              <Icon type="lock" />
              <span>{formatMessage({ id: 'menu.system' })}</span>
            </Breadcrumb.Item>
            <Breadcrumb.Item>
              <Link to="/system/role">{formatMessage({ id: 'app.role.manage-role' })}</Link>
            </Breadcrumb.Item>
            <Breadcrumb.Item>{formatMessage({ id: 'app.role.eidt-role' })}</Breadcrumb.Item>
          </Breadcrumb>
        </div>
        <div>
          <div className={styles.roleInputBox}>
            <Row>
              <Col span={6}>
                <Col span={6} style={stylecss}>
                  {formatMessage({ id: 'app.role.rolename' })}：
                </Col>
                <Col span={18}>
                  <Input value={name} onChange={this.onInputChange.bind(this)} />
                </Col>
              </Col>
            </Row>
          </div>
          {(keys.length > 0 || isShowTree) && (
            <SelectTree onCallBack={this.getRolekeys.bind(this)} defkeys={keys} />
          )}
          <FooterToolbar style={{ width: '100%' }}>
            <Button onClick={this.onClickCancel}>{formatMessage({ id: 'app.role.cancel' })}</Button>
            <Button type="primary" onClick={this.onClickCommit}>
              {formatMessage({ id: 'app.role.ok' })}
            </Button>
          </FooterToolbar>
        </div>
      </div>
    );
  }
}
export default RoleEdit;

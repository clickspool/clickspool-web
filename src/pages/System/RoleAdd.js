import FooterToolbar from '@/components/FooterToolbar';
import { splitRoleIds } from '@/utils/utils';
import { add } from '@/services/role';

import { Input, Breadcrumb, Icon, Row, Col, Button, message } from 'antd';

import React, { PureComponent,Fragment } from 'react';

import Link from 'umi/link';
import { formatMessage } from 'umi/locale';
import router from 'umi/router';

import styles from './Role.less';

import SelectTree from './_components/SelectTree';

const Search = Input.Search;

class RoleAdd extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      name: '',
      keys: [],
    };
    this.onClickCommit = this.onClickCommit.bind(this);
    this.onClickCancel = this.onClickCancel.bind(this);
  }
  componentDidMount() {}

  getRoleId(val) {
    const keys = val || [];
    this.setState({ keys });
  }

  onInputChange(e) {
    this.setState({
      name: e.target.value,
    });
  }
  onClickCommit() {
    const { name, keys } = this.state;
    if (!name || !keys.length) {
      message.warning(formatMessage({ id: 'app.role.full' }));
      return;
    }
    const kkeys = JSON.stringify(splitRoleIds(keys));
    add({ keys: kkeys, name }).then(res => {
      if (res && !res.code) {
        this.onClickCancel();
      }
    });
  }
  onClickCancel() {
    router.push('/system/role');
  }
  render() {
    const { name } = this.state;
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
              <span>{formatMessage({ id: 'menu.operation' })}</span>
            </Breadcrumb.Item>
            <Breadcrumb.Item>
              <Link to="/system/role">{formatMessage({ id: 'app.role.manage-role' })}</Link>
            </Breadcrumb.Item>
            <Breadcrumb.Item>{formatMessage({ id: 'app.role.add-role' })}</Breadcrumb.Item>
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
          <SelectTree onCallBack={this.getRoleId.bind(this)} defkeys={[]}/>
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
export default RoleAdd;

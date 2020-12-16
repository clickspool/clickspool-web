import { connect } from 'dva';
import React, { PureComponent, Fragment } from 'react';
//@ts-ignore
import { formatMessage } from 'umi/locale';
import CommonBreadCrumb from '@/components/CommonBreadCrumb';
import OperationBar from './components/OperationBar';
import EditTemplate from './Edit';
import classnames from 'classnames/bind';
// tslint:disable-next-line:ordered-imports
import TableList from '@/components/TableList';
import copy from 'copy-to-clipboard';
import styles from './style.less';
import { message } from 'antd';
import {
  Icon,
  Input,
  Button,
  Table,
  Divider,
  Popconfirm,
  Tag,
  Card,
  Col,
  Row,
  Message,
  Pagination
} from 'antd';

const cx = classnames.bind(styles);
@connect(({ market: { list, total, page, pages, page_size, promotion_url, statuses = {} }, material: { materialList, merchantMap, types } }) => ({ list, total, page, pages, page_size, types, statuses, merchantMap, promotion_url, materialList }))
class TemplateList extends PureComponent<any, any> {
  constructor(props) {
    super(props);
    this.state = {
      record: null
    };
  }

  public onChange = (page) => {
    const { dispatch } = this.props;
    dispatch({
      type: "market/fetch",
      payload: {
        page
      }
    })
  }

  public handleDetail = (record) => {
    this.setState({
      record
    })
  }

  public setMine = (material_id) => {
    const { dispatch } = this.props;
    dispatch({
      type: "market/receive",
      payload: {
        material_id
      }
    })
      .then((res) => {
        // tslint:disable-next-line:no-shadowed-variable
        const { code, data: { promotion_url }, message } = res
        if (code != 0) {
          return Message.warn(message);
        }
        if (copy(promotion_url)) {
          Message.success("copy success");
        } else {
          Message.error("copy fail");
        }
      })
  }

  public render() {
    const crumbs = [
      {
        icon: 'bank',
        title: formatMessage({ id: 'menu.afiliate' }),
      }, {
        title: formatMessage({ id: 'menu.afiliate.market' }),
      }
    ];
    const { record } = this.state;
    const { total, pages, page, page_size, list, merchantMap, promotion_url, types } = this.props;
    // tslint:disable-next-line:no-this-assignment
    const { onChange, setMine, handleDetail } = this;
    return (
      <>
        <style>
          {
            `
          .new-item-badge {
            position: absolute;
            background: #92b7bd;
            z-index: 999;
            border-radius: 3px;
            color: #fff;
            font-size: 70%;
            padding: 2px 4px 0;
            top: -10px;
            left: -10px;
            line-height: 1.4;
            -ms-transform: rotate(-20deg);
            -webkit-transform: rotate(-20deg);
            transform: rotate(-20deg);
            -webkit-transition: 0 0.1s ease-in;
            -moz-transition: 0 0.1s ease-in;
            -o-transition: 0 0.1s ease-in;
            transition: transform 0.1s ease-in;
            z-index:10
            /* Most of this code is necessary to style and position the badge. */
        }
          `
          }
        </style>
        <CommonBreadCrumb items={crumbs} />
        <Row style={{ marginTop: 10 }} justify={"end"}>
          <Col span={12} />
          <Col span={12}>
            <Pagination style={{ float: "right" }} showQuickJumper={true} current={page} total={total} pageSize={page_size} onChange={onChange} />
          </Col>
        </Row>
        <TableList list={list || []} {...{ merchantMap, promotion_url, types, setMine, handleDetail }} />
        <Row style={{ marginTop: 10 }} justify={"end"}>
          <Col span={12} />
          <Col span={12}>
            <Pagination style={{ float: "right" }} showQuickJumper={true} current={page} total={total} pageSize={page_size} onChange={onChange} />
          </Col>
        </Row>
        {!!record && <EditTemplate caption={record.title} mine={true} record={record} visible={true} close={() => {
          this.setState({
            record: null
          })
        }} />}
      </>
    );
  }
}

export default TemplateList;



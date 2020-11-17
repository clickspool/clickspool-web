import { connect } from 'dva';
import React, { PureComponent, Fragment } from 'react';
//@ts-ignore
import { formatMessage } from 'umi/locale';
import CommonBreadCrumb from '@/components/CommonBreadCrumb';
import OperationBar from './components/OperationBar';
import EditTemplate from './Edit';
import classnames from 'classnames/bind';
// import OperationBar from './components/OperationBar';
import styles from './style.less';
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
  Pagination
} from 'antd';

const cx = classnames.bind(styles);
@connect(({ market: { list, total, page, pages, page_size, types, statuses = {} } }) => ({ list, total, page, pages, page_size, types, statuses }))
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
      type:"market/fetch",
      payload:{
        page
      }
    })
  }

  public handleDetail = (record) => {
    this.setState({
      record
    })
  }

  public render() {
    const crumbs = [
      {
        icon: 'lock',
        title: formatMessage({ id: 'menu.operation' }),
      }, {
        title: formatMessage({ id: 'menu.afiliate.market' }),
      }
    ];
    const { record } = this.state;
    const { total, pages, page, page_size, list } = this.props;
    // tslint:disable-next-line:no-this-assignment
    const { onChange, handleDetail } = this;
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
        <Row gutter={16} style={{ marginTop: 10 }}>
          {
            !!list.length &&
            list.map((item, index) => {
              return <Fragment key={index}>
                <Col style={{ marginTop: 10 }} span={12}>
                  <Card title={item.title} bordered={false}>
                    <Card.Meta
                      avatar={<div style={{ height: 120, width: 100, display: "flex", alignItems: "center", position: "relative" }}>
                        {!!item.is_received && <div className="new-item-badge">{formatMessage({ id: 'app.material.mined' })}</div>}
                        <div style={{ height: 120, width: 100, overflow: 'hidden', display: "flex", alignItems: "center", position: "relative", border: "1px solid #ececec", borderRadius: '5px' }}>
                          <img width={100} src={item.images[0]} />
                        </div>
                      </div>}
                      // title="Card title"
                      description={(
                        <>
                          <p>{item.description}</p>
                          <div className="ant-modal-footer">
                            <div>
                              {/* <button type="button" className="ant-btn ant-btn-danger"
                                // onClick={handleCancel}
                              >
                                <span>{formatMessage({ id: "app.material.cancel" })}</span>
                              </button>
                              <button type="button" className="ant-btn"
                                // onClick={(e) => { handleOk(e, 0) }}
                              >
                                <span>{formatMessage({ id: "app.material.saveasdraft" })}</span>
                              </button> */}
                              <button type="button" className="ant-btn ant-btn-primary"
                                onClick={(e) => { handleDetail(item) }}
                              >
                                <span>{formatMessage({ id: "app.material.detail" })}</span>
                              </button>
                            </div>
                          </div>
                        </>
                      )}
                    />
                  </Card>
                </Col>
              </Fragment>
            })
          }
        </Row>

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



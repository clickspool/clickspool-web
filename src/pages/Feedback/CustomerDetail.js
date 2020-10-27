import { type } from '@/utils/utils';

import { reply } from '@/services/customer';

import { connect } from 'dva';
import Link from 'umi/link';

import {
  message,
  Modal,
  Comment,
  Layout,
  Menu,
  Input,
  Breadcrumb,
  Icon,
  Button,
  Pagination,
  Divider,
  DatePicker,
  Table,
  Popconfirm,
  Badge,
  Card,
  Form,
  Row,
  Col,
  Select,
} from 'antd';

import React, { PureComponent } from 'react';

import { formatMessage } from 'umi/locale';

import _ from 'lodash';

import { serviceFaqStatus } from '../../../config/role.enum';

import styles from './Group.less';

const { RangePicker } = DatePicker;
const moment = require('moment');

const { Sider, Content } = Layout;
const { TextArea } = Input;
const Search = Input.Search;
const { Option } = Select;
function toParseInt(str) {
  if (str) {
    return parseInt(str || 0);
  }
  return 0;
}

/**
 * 枚举
 * status  1 未回复
 * status  2 已回复
 * status  3 驳回
 */

@connect(
  ({
    customer: {
      feedbackData,
      category,
      statusList,
      customer: { customer_list },
    },
    routing: {
      location: { pathname },
    },
    memberInfo: {
      data: { keys },
    },
  }) => ({
    feedbackData,
    keys,
    pathname,
    category,
    statusList,
    customer_list,
  })
)
@Form.create()
class Customer extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      imgModel: false,
      currImg: '',
      isCommit: true,
      inputOnFocus: '',
      reply_content: '',
    };
    _.bindAll(this, ['updataConfiList']);
  }
  componentDidMount() {
    this.getEnumList().then(() => {
      this.updataConfiList();
    });
  }

  replySubmit = id => {
    const reply_content = this.state.reply_content;
    if (!reply_content.trim()) {
      this.clickReply();
      message.error(`${formatMessage({ id: 'app.feedback.pleaseReply' })}`);
      return;
    }
    reply({
      ids: this.props.feedbackData.id + '',
      status: 2,
      reply_content,
    }).then(res => {
      if (res && !res.code) {
        this.updataConfiList();
      }
    });
  };
  rejectHandel = () => {
    reply({
      ids: this.props.feedbackData.id + '',
      status: 3,
    }).then(res => {
      if (res && !res.code) {
        this.updataConfiList();
      }
    });
  };

  async getEnumList() {
    const { dispatch } = this.props;
    await (() => {
      dispatch({
        type: 'permission/getRoleList',
      });
    })();
    await (() => {
      dispatch({
        type: 'permission/getMemberStatusList',
      });
    })();

    dispatch({
      type: 'customer/getCategory',
    });
    dispatch({
      type: 'customer/getAllVersion',
    });
    dispatch({
      type: 'customer/getFeedbackStatusList',
    });
    dispatch({
      type: 'customer/getCustomer',
    });
  }

  updataConfiList() {
    const { dispatch } = this.props;
    const paramer = this.props.computedMatch.params;
    dispatch({
      type: 'customer/getOneFeedback',
      payload: paramer,
    });
  }

  handleCancel = () => {
    this.setState({
      imgModel: false,
    });
  };
  imgshow = i => {
    const { feedbackData } = this.props;
    this.setState({
      currImg: feedbackData.pic_url[i],
      imgModel: true,
    });
  };
  clickReply = () => {
    document.getElementsByTagName('textarea')[0].focus();
  };
  changeContent = evt => {
    const val = evt.target.value;
    this.setState(
      {
        reply_content: val,
      },
      () => {
        console.log(this.state.reply_content);
      }
    );
  };
  render() {
    const {
      feedbackData,
      roleList,
      statusList,
      keys,
      pathname,
      category,
      version,
      customer_list,
      form: { getFieldDecorator },
    } = this.props;
    const { isCommit } = this.state;
    const gridStyle = {
      width: '25%',
      textAlign: 'left',
    };
    const styleColore = {
      background: '#4fbcff',
      width: `60px`,
      height: '60px',
      color: '#fff',
      borderRadius: '50%',
      lineHeight: '60px',
      textAlign: 'center',
    };
    const Ava = () => {
      if (feedbackData.nickname) {
        return <div style={styleColore}>{feedbackData.nickname.slice(0, 1)}</div>;
      } else {
        return (
          <div style={styleColore}>
            <Icon style={{ fontSize: '24px', lineHeight: '60px', color: '#fff' }} type="user" />
          </div>
        );
      }
    };

    const KefuAva = () => {
      if (feedbackData.operater_nickname) {
        return <div style={styleColore}>{feedbackData.operater_nickname.slice(0, 1)}</div>;
      } else {
        return (
          <div style={styleColore}>
            <Icon style={{ fontSize: '24px', lineHeight: '60px', color: '#fff' }} type="user" />
          </div>
        );
      }
    };

    const ImgList = porps => {
     if( type(porps.listImage)!=='array'){
       return <span />;
     }
      const list = porps.listImage.map((el, i) => (
        <Col key={i} span={8}>
          <img
            onClick={e => {
              this.imgshow(i);
            }}
            style={{ width: '120px', cursor: 'pointer' }}
            key={i}
            src={el}
          />
        </Col>
      ));
      return (
        <Row gutter={16} style={{ width: '400px' }}>
          {list}
        </Row>
      );
    };

    let actionsList;
    if (feedbackData.status == 1) {
      actionsList = [
        <span>{formatMessage({ id: 'app.feedback.solve' })}</span>,
        <span onClick={this.clickReply} className={styles.greenHuifu}>
          {' '}
          <Divider type="vertical" />
          {formatMessage({ id: 'app.feedback.reply' })}
        </span>,
        <span>
          <Divider type="vertical" />
          <Popconfirm
            title={formatMessage({ id: 'app.feedback.makesureREJECT' })}
            onConfirm={() => this.rejectHandel()}
          >
            <a href="#" className={styles.dengerColor}>
              {formatMessage({ id: 'app.feedback.reject' })}
            </a>
          </Popconfirm>
        </span>,
      ];
    } else if (feedbackData.status == 2) {
      actionsList = [
        <span className={styles.greenHuifu}>{formatMessage({ id: 'app.feedback.solved' })}</span>,
      ];
    } else {
      actionsList = [
        <span className={styles.redBohui}>{formatMessage({ id: 'app.feedback.rejected' })}</span>,
      ];
    }

    const ExampleComment = ({ children }) => {
      return (
        <Comment
          actions={actionsList}
          author={<a>{feedbackData.nickname}</a>}
          avatar={<Ava />}
          content={
            <div>
              <p>{feedbackData.content}</p>
              <ImgList listImage={feedbackData.pic_url || []} />
            </div>
          }
        >
          {children}
        </Comment>
      );
    };

    return (
      <div>
        <style>
          {`
            .web .ant-modal-content {
                  position: relative;
                  background-color: #000 !important;
                  border: 0;
                  border-radius: 4px;
                  background-clip: padding-box;
                  box-shadow: 0 0 0 rgba(0, 0, 0, 0) !important;
                }
            .web .ant-modal-body {
              padding: 0 !important;
              font-size: 0 !important;
              line-height: 1 !important;
            }
            `}
        </style>
        <div className={styles.breadcrumbBox}>
          <Breadcrumb>
            <Breadcrumb.Item>
              <Icon type="lock" />
              <span>{formatMessage({ id: 'menu.feedback' })}</span>
            </Breadcrumb.Item>
            <Breadcrumb.Item>
              <Link to="/feedback/customer">{formatMessage({ id: 'menu.feedback.customer' })}</Link>
            </Breadcrumb.Item>
            <Breadcrumb.Item>{formatMessage({ id: 'app.feedback.feeddetail' })}</Breadcrumb.Item>
          </Breadcrumb>
        </div>
        <div className={styles.addBtn}>
          <Card
            title={formatMessage({ id: 'app.feedback.feeddetail' })}
            className={'styles-card'}
            bordered
          >
            <Card.Grid style={gridStyle}>
              {formatMessage({ id: 'app.feedback.nickname' })}:{feedbackData.nickname}
            </Card.Grid>
            <Card.Grid style={gridStyle}>
              {formatMessage({ id: 'app.feedback.feedbackID' })}:{feedbackData.user_id}
            </Card.Grid>
            <Card.Grid style={gridStyle}>
              {formatMessage({ id: 'app.feedback.phone' })}:{feedbackData.tell}
            </Card.Grid>
            <Card.Grid style={gridStyle}>
              {formatMessage({ id: 'app.feedback.phonetype' })}:{feedbackData.device_brand}{' '}
              {feedbackData.device_version}
            </Card.Grid>

            {feedbackData.lat && (
              <Card.Grid style={gridStyle}>
                {formatMessage({ id: 'app.feedback.zone' })}:{feedbackData.device_ip} lat:
                {feedbackData.lat} lon:{feedbackData.lon}
              </Card.Grid>
            )}
            {!feedbackData.lat && (
              <Card.Grid style={gridStyle}>
                {formatMessage({ id: 'app.feedback.zone' })}:{feedbackData.device_ip}
              </Card.Grid>
            )}
            <Card.Grid style={gridStyle}>
              {formatMessage({ id: 'app.feedback.networkstatus' })}:{feedbackData.network}
            </Card.Grid>
            <Card.Grid style={gridStyle}>
              {formatMessage({ id: 'app.feedback.os' })}:{feedbackData.OSVersion}
            </Card.Grid>
            <Card.Grid style={gridStyle}>
              {formatMessage({ id: 'app.feedback.appversions' })}:{feedbackData.version}
            </Card.Grid>
            <Card.Grid style={gridStyle}>
              {formatMessage({ id: 'app.feedback.issueCategory' })}:
              {(feedbackData.category_data && feedbackData.category_data.name) || ''}
            </Card.Grid>
            <Card.Grid style={gridStyle}>
              {formatMessage({ id: 'app.feedback.resolveDate' })}:{feedbackData.update_time}
            </Card.Grid>
          </Card>
        </div>
        <Card bordered>
          <ExampleComment>
            {feedbackData.status == 2 && (
              <Comment
                author={<a>{feedbackData.operater_nickname}</a>}
                avatar={<KefuAva />}
                content={
                  <div>
                    <p>{feedbackData.reply_content}</p>
                  </div>
                }
              />
            )}
          </ExampleComment>
        </Card>
        {!!(feedbackData.status == 1) && (
          <Card title={formatMessage({ id: 'app.feedback.reply' })} style={{ borderTop: 0 }}>
            <TextArea rows={4} onChange={this.changeContent} />
            <Button
              type="primary"
              style={{ marginTop: '10px', float: 'right' }}
              onClick={this.replySubmit}
            >
              {formatMessage({ id: 'app.feedback.reply' })}
            </Button>
          </Card>
        )}
        <Modal
          title={null}
          visible={this.state.imgModel}
          onCancel={this.handleCancel}
          footer={null}
          closable={false}
          centered={true}
          maskClosable={true}
          wrapClassName={'web'} //对话框外部的类名，主要是用来修改这个modal的样式的
        >
          <div className="outer-iframe">
            <div className="d-iframe">
              <img src={this.state.currImg} />
            </div>
          </div>
        </Modal>
      </div>
    );
  }
}
export default Customer;

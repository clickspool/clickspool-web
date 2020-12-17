import { modifyFaqCate, delFaqCate, modifyFaqCateStatus, modifyFaqCateRecommend } from '@/services/faq';
import { type, removeObjUndefined, isEmptyObject } from '@/utils/utils';
import { connect } from 'dva';
import { Link } from 'react-router';

import {
  message,
  Input,
  Breadcrumb,
  Icon,
  Button,
  Pagination,
  Table,
  Modal,
  Form,
  Row,
  Col,
  Card,
  Select,
  DatePicker,
  Tag, Collapse
} from 'antd';



import React, { useEffect } from 'react';

import _ from 'lodash';

import { formatMessage } from 'umi/locale';
import router from 'umi/router';

import { operationEnum, getKey } from '../../../config/role.enum';
import styles from './Feed.less';
const { Option } = Select;
const { RangePicker } = DatePicker;
const Search = Input.Search;
const moment = require('moment');
const { Panel } = Collapse;
function toParseInt(str) {
  if (str) {
    return parseInt(str || 0);
  }
  return 0;
}

// @Form.create()
// @connect(
//   ({
//     feedbackcate: {
//       data: {page, list,total_count},
//       faqCateStatusList,
//       posmap
//     },
//     routing: {
//       location: { pathname },
//     },
//     memberInfo: {
//       data: { keys },
//     },
//   }) => ({
//     list,
//     page,
//     total_count,
//     faqCateStatusList,
//     pathname,
//     keys,
//     posmap
//   })
// )

function Detail(props) {
  console.log(props.computedMatch.params, 'props.params.id');
  const { computedMatch: { params: { category, name } }, dispatch, list } = props;

  useEffect(() => {

    dispatch({
      type: 'feedbackcate/fetch',
      payload: {
        page: 1,
        page_size: 100,
        category
      }
    })

    return () => {
      dispatch({
        type: 'feedbackcate/fetch'
      })
     }
  }, [])

  return <>
    <div className={styles.breadcrumbBox}>
      <Breadcrumb separator={'/'} style={{ borderBottom: ' 1px solid #ccc', paddingBottom: ' 10px' }}>
        <Breadcrumb.Item style={{ cursor: 'pointer' }} onClick={() => {
          router.push('/knowledge_base');
        }}>
          <Icon type="profile" />
          <span>{formatMessage({ id: 'menu.knowledge' })}</span>
        </Breadcrumb.Item>
        <Breadcrumb.Item>{name}</Breadcrumb.Item>
      </Breadcrumb>
    </div>
    {
      !list.length && `No Data`
    }
    {
      !!list.length &&
      <Collapse accordion>
        {list.map((item, index) => {
          return <Panel header={item.title} key={index}>
            <div dangerouslySetInnerHTML={{ __html: item.content }} />
          </Panel>
        })}
      </Collapse>
    }
  </>
}

export default Form.create()(connect((state) => { return { list: state.feedbackcate.list } })(Detail));
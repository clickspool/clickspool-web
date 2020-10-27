import {
 commonStatusMap,
 conditionKeyMap, // 子规则KEY枚举
 fetch, // 规则KEY枚举
 getAutoSendToolInfo,  // 消息类型枚举
 getGiftMap, // 获取自动打赏道具信息
 messageTypeMap, // 打赏道具列表
 ruleTypeMap, // 规则类型枚举
 sendTypeMap,  // 编辑模板
 subConditionKeyMap, // 状态枚举
 templateAdd, // 新建自动回复模板
 templateDelete, // 发送方式枚举
 templateModify, // 删除模板
 templateStatusSet, // 上下架
 uploadMultiMedia,
 getNoRootRules,
} from '@/pages/Operation/ApplyNew/services/index';

export default {
 namespace: 'virtualApply',
 state: {
  filter: { page: 1, page_size: 20, total: 0 },
  list: [],
  sendTypeMap: {},
  commonStatusMap: {},
  ruleTypeMap: {},
  giftMap: [],
  messageTypeMap: {},
  conditionKeyMap: [],
  subConditionKeyMap: [],
  noRootRules: [],
  autoSendToolInfo: [],
 },
 reducers: {
  update(state, { payload }) {
   return {
    ...state,
    ...payload,
   };
  },
  filter(state, { payload }) {
   const { filter } = payload;
   return {
    ...state,
    filter: { ...state.filter, ...filter },
   };
  }
 },
 effects: {
  * fetch({ payload }, { call, put, select }) {
   const filter = yield select(state => state.virtualApply.filter);
   const res = yield call(fetch, filter);
   const { code, data } = res;
   yield put({
    type: 'update',
    payload: { list: !code ? data.list : [] }
   })
   yield put({
    type: 'filter',
    payload: { filter: { total: data.total_count } }
   })
  },
  * add({ payload }, { call, put }) {
   const res = yield call(templateAdd, { ...payload });
   const { code } = res;
   if (!code) {
    yield put({
     type: 'fetch'
    })
   }
   return new Promise((resolve) => {
    resolve(res);
   })
  },
  * del({ payload }, { call, put }) {
   const res = yield call(templateDelete, { ...payload });
   const { code } = res;
   if (!code) {
    yield put({
     type: 'fetch'
    })
   }
   return new Promise((resolve) => {
    resolve(res);
   })
  },
  * modify({ payload }, { call, put }) {
   const res = yield call(templateModify, { ...payload });
   const { code } = res;
   if (!code) {
    yield put({
     type: 'fetch'
    })
   }
   return new Promise((resolve) => {
    resolve(res);
   })
  },
  * SetStatus({ payload }, { call, put }) {
   const res = yield call(templateStatusSet, { ...payload });
   const { code } = res;
   if (!code) {
    yield put({
     type: 'fetch'
    })
   }
   return new Promise((resolve) => {
    resolve(res);
   })
  },
  * uploadMedia({ payload }, { call, put }) {
   let from = new FormData();
   from.append('multiMedia',payload.multiMedia)
   const res = yield call(uploadMultiMedia,from);
   return new Promise((resolve)=> {
     resolve(res);
   })
 },
  * getEnum(actions, { call, put }) {
   enum State {
    'subConditionKeyMap',
    'conditionKeyMap',
    'messageTypeMap',
    'giftMap',
    'ruleTypeMap',
    'commonStatusMap',
    'sendTypeMap',
    'autoSendToolInfo',
    'noRootRules'
   };
   const allEnum = yield Promise
    .all([subConditionKeyMap(), 
    conditionKeyMap(), 
    messageTypeMap(), 
    getGiftMap(), 
    ruleTypeMap(), 
    commonStatusMap(), 
    sendTypeMap(),
    getAutoSendToolInfo(),
    getNoRootRules()
    ])
    .then((reslut) => {
     let payload = {
      sendTypeMap: {},
      commonStatusMap: {},
      ruleTypeMap: {},
      giftMap: [],
      messageTypeMap: {},
      conditionKeyMap: [],
      subConditionKeyMap: [],
      autoSendToolInfo:[],
      noRootRules:[]
     }
     reslut.map((item, index) => {
      if (+item.code === 0) {
        if(State[index]==='messageTypeMap'){
          payload[State[index]] = {...item.data,...{7:`添加好友`}};
        }else{
          payload[State[index]] = item.data;
        }
      }
     })
     return new Promise((resolve, reject) => {
      resolve(payload)
     })
    });
   yield put({
    type: 'update',
    payload: allEnum,
   })
  },
 },
 subscriptions: {
  setup({ history, dispatch }) {
   history.listen(({ pathname }) => {
    if (pathname.indexOf('va_reply') > -1) {
     dispatch({
      type: 'fetch'
     })
     dispatch({
      type: 'getEnum'
     })
    }
   })
  },
 }
}
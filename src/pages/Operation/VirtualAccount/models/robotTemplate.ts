import queryString from 'query-string';

import { fetch, create, deleteItem, patch, patchStatus, fetchStatuses, fetchRuleTypes, fetchSendType, getAutoSendToolInfo, getGiftMap } from '../services/robotTemplate';
export default {
  state: {
    list: [],
    total: null,
    pages: null,
    page: null,
    pageSize: 20,
    loading: false,
    statuses: [],
    groupTypes: new Map(),
    tags: new Map(),
    gifts: new Map(),
    sendTypes: null,
    ruleTypes: new Map([['0', '普通消息'], ['1', '音视频通话']]),
    autoSendToolInfo:{}

  },
  reducers: {
    updateState: (state, { payload }) => {
      return { ...state, ...payload };
    },
    save(state, { payload: { list, total, pages } }) {
      return { ...state, list, total, pages };
    },
    saveSingle(state, { payload: { item } }) {
      let { list = [] } = { ...state };
      list = list.map(el => {
        if (el.id === item.id) {
          return item;
        }
        return el;
      });
      return { ...state, list }
    },
    deleteUpdate(state, { payload: { deletedId } }) {
      let { list } = state;
      list = list.filter(item => {
        return item.id != deletedId
      });
      return { ...state, list }
    },
    changePageSize(state, { payload: { page, pageSize } }) {
      return { ...state, page, pageSize };
    },
    saveGroupTypes(state, { payload: { types } }) {
      const typeMap = new Map();
      const arr = Object.keys(types);
      Array.isArray(arr) && arr.map(type => {
        typeMap.set(type, types[type]);
      });
      return { ...state, groupTypes: typeMap };
    },
    saveTags(state, { payload: { tags } }) {
      const tagMap = new Map();
      const arr = Object.keys(tags);
      Array.isArray(arr) && arr.map(tag => {
        tagMap.set(tag, tags[tag]);
      });
      return { ...state, tags: tagMap };
    },
    saveRuleTypes(state, { payload: { ruleTypes } }) {
      const ruleMap = new Map();
      Object.keys(ruleTypes).map(k => {
        ruleMap.set(k, ruleTypes[k]);
      })
      return { ...state, ruleTypes: ruleMap };
    },
    saveGiftMap(state, { payload: { gift } }) {
      const giftMap = new Map();
      Array.isArray(gift) &&gift.map(k => {
        giftMap.set(k.id,`(id:${k.id}) (道具名:${k.name}) (价格:$${k.price})`);
      })
      return { ...state, gifts: giftMap };
    },
    saveSendTypes(state, { payload: { sendTypes } }) {
      const sendMap = new Map();
      Object.keys(sendTypes).map(key => {
        if (+key === 1) {
          sendMap.set('text', key);
          sendMap.set('media', key);
        }
        if (+key === 2) {
          sendMap.set('makefriend', key);
        }
      });
      return { ...state, sendTypes: sendMap };
    },
    autoSendToolInfo(state, { payload }) {
      return { ...state, autoSendToolInfo: payload };
    }

  },
  effects: {
    * getAutoSendToolInfo({ payload: values }, { call, put }){
      const result = yield call(getAutoSendToolInfo, values);
      if (result && result.code === 0) {
        yield put({ type: 'autoSendToolInfo' ,payload:result.data})
      }
    },
    * create({ payload: values }, { call, put }) {
      const result = yield call(create, values);
      if (result && result.code === 0) {
        yield put({ type: 'reload' })
        return result;
      }
    },
    * delete({ payload: { id } }, { call, put }) {
      const result = yield call(deleteItem, { id, status: 1 });
      if (result && result.code === 0) {
        yield put({
          type: 'deleteUpdate',
          payload: { deletedId: id }
        });
      }
    },
    * patch({ payload: { params, id } }, { call, put }) {
      const result = yield call(patch, params);
      if (result && result.code === 0) {
        yield put({ type: 'fetchSingle', payload: { id } });
        return result;
      }
    },
    * fetch({ payload: { ...values } }, { call, put }) {
      const { page } = values;
      const { data: { list, total_count, total_page } } = yield call(fetch, values);

      page && (yield put({
        type: 'updateState',
        payload: {
          page
        }
      }));
      yield put({
        type: 'save',
        payload: {
          list,
          total: total_count,
          pages: total_page,
        },
      });
    },
    * fetchSingle({ payload: { id } }, { call, put }) {
      const data = yield call(fetch, { id });
      if (data && data.code === 0) {
        const item = data.data.list.filter(item => item.id == id)[0];
        yield put({
          type: 'saveSingle',
          payload: { item }
        });
      }
    },
    *patchStatus({ payload: { id, status } }, { call, put }) {
      const result = yield call(patchStatus, { status, id });
      if (result && result.code === 0) {
        yield put({ type: 'fetchSingle', payload: { id } })
        return result;
      }
    },
    * fetchStatuses(payload, { call, put }) {
      const { data } = yield call(fetchStatuses);
      yield put({
        type: 'updateState',
        payload: {
          statuses: data
        }
      });
    },
    * fetchRuleTypes(payload, { call, put }) {
      const { data } = yield call(fetchRuleTypes);
      yield put({
        type: 'saveRuleTypes',
        payload: {
          ruleTypes: data
        }
      });
    },
    * fetchSendType(payload, { call, put }) {
      const { data } = yield call(fetchSendType);
      yield put({
        type: 'saveSendTypes',
        payload: {
          sendTypes: data
        }
      });
    },
    * fetchGiftMap(payload, { call, put }) {
      const { data } = yield call(getGiftMap);
      yield put({
        type: 'saveGiftMap',
        payload: {
          gift: data
        }
      });
    },
    
    * reload(action, { put, select }) {
      yield put({ type: 'fetch' });
    },
  },
  subscriptions: {
    setup({ dispatch, history }) {
      return history.listen(({ pathname, search }) => {
        // const query = queryString.parse(search);
        if (pathname === '/operation/user/va_reply') {
          dispatch({ type: 'getAutoSendToolInfo' });
          dispatch({ type: 'fetch' });
          dispatch({ type: 'fetchStatuses' });
          dispatch({ type: 'fetchSendType' });
          dispatch({ type: 'fetchRuleTypes' });
          dispatch({ type: 'fetchGiftMap' });
        }
      });
    },
  },
}
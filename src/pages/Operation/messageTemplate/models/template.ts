import queryString from 'query-string';

import { fetch, create, deleteItem, patch, patchStatus, fetchStatuses } from '../services/template';
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
  },
  effects: {
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
    * reload(action, { put, select }) {
      yield put({ type: 'fetch' });
    },
  },
  subscriptions: {
    setup({ dispatch, history }) {
      return history.listen(({ pathname, search }) => {
        // const query = queryString.parse(search);
        if (pathname === '/operation/assistant/messagetemplate') {
          dispatch({ type: 'fetch' });
          dispatch({ type: 'fetchStatuses' });
        }
      });
    },
  },
}
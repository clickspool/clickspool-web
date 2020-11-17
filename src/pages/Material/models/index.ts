import queryString from 'query-string';

import { create, deleteItem, fetch, fetchMerchantMap, fetchStatuses, fetchTypeMap, patch, patchStatus } from '../services';
export default {
  namespace: "material",
  state: {
    list: [],
    total: null,
    pages: null,
    page: 1,
    page_size: 20,
    loading: false,
    statuses: {},
    groupTypes: new Map(),
    tags: new Map(),
    types: {},
    merchantMap: {},
  },
  reducers: {
    updateState: (state, { payload }) => {
      return { ...state, ...payload };
    },
    save(state, { payload: { list, total, pages } }) {
      return { ...state, list, total, pages };
    },
  },
  effects: {
    * create({ payload: values }, { call, put }) {
      const result = yield call(create, values);
      if (result && result.code === 0) {
        yield put({ type: 'reload' })
      }
      return result;
    },
    * delete({ payload: { id } }, { call, put }) {
      const result = yield call(deleteItem, { id, status: 1 });
      if (result && result.code === 0) {
        yield put({
          type: 'deleteUpdate',
          payload: { deletedId: id }
        });

      }
      return result;
    },
    * patch({ payload: values }, { call, put }) {
      const result = yield call(patch, values);
      if (result && result.code === 0) {
        yield put({ type: 'reload' });
      }
      return result;
    },
    * fetch({ payload: values }, { call, put, select }) {
      // tslint:disable-next-line:variable-name
      const page_size = yield select(state => state.material.page_size);
      const page = yield select(state => state.material.page);
      const { data: { list, total_count, total_page } } = yield call(fetch, { page_size, page, ...values });

      // tslint:disable-next-line:no-unused-expression
      ((values || {}).page || page) && (yield put({
        type: 'updateState',
        payload: {
          page: ((values || {}).page || page)
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
    * patchStatus({ payload: { mid, status } }, { call, put }) {
      const result = yield call(patchStatus, { mid, status });
      if (result && result.code === 0) {
        yield put({ type: 'reload' });
      }
      return result;
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
    * fetchTypeMap(payload, { call, put }) {
      const { data } = yield call(fetchTypeMap);
      yield put({
        type: 'updateState',
        payload: {
          types: data
        }
      });
    },
    * fetchMerchantMap(payload, { call, put }) {
      const { data } = yield call(fetchMerchantMap);
      yield put({
        type: 'updateState',
        payload: {
          merchantMap: data
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
        if (pathname === '/promotional') {
          dispatch({ type: 'fetch' });
          dispatch({ type: 'fetchStatuses' });
          dispatch({ type: 'fetchTypeMap' });
          dispatch({ type: 'fetchMerchantMap' });
        }
        if (pathname.indexOf("material") > -1) {
          dispatch({ type: 'fetchStatuses' });
          dispatch({ type: 'fetchTypeMap' });
          dispatch({ type: 'fetchMerchantMap' });
        }
      });
    },
  },
}
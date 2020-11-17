import queryString from 'query-string';

import { fetch, create, deleteItem, patch, patchStatus, fetchStatuses, fetchTypeMap, fetchMerchantMap } from '../services/mymaterial';
export default {
  namespace: "myMaterial",
  state: {
    list: [],
    total: null,
    pages: null,
    page: 1,
    page_size: 20,
  },
  reducers: {
    updateState: (state, { payload }) => {
      return { ...state, ...payload };
    },
  },
  effects: {

    * fetch({ payload: values }, { call, put, select }) {
      // tslint:disable-next-line:variable-name
      const page_size = yield select(state => {
        return state.myMaterial.page_size
      });
      const page = yield select(state => state.myMaterial.page);


      const { data: { list, total_count, total_page } } = yield call(fetch, { page_size, page, ...values });

      // tslint:disable-next-line:no-unused-expression
      ((values || {}).page || page) && (yield put({
        type: 'updateState',
        payload: {
          page: ((values || {}).page || page)
        }
      }));
      yield put({
        type: 'updateState',
        payload: {
          list,
          total: total_count,
          pages: total_page,
        },
      });
    },
    * reload(action, { put, select }) {
      yield put({ type: 'fetch' });
    },
  },
  subscriptions: {
    setup({ dispatch, history }) {
      return history.listen(({ pathname, search }) => {
        if (pathname.indexOf("material/my") > -1) {
          dispatch({ type: 'fetch' });
        }
      });
    },
  },
}
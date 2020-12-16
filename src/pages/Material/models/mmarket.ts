import queryString from 'query-string';

import { fetch, materialDetail, receive } from '../services/mmarket';

export default {
  namespace: "market",
  state: {
    list: [],
    total: null,
    pages: null,
    page: 1,
    page_size: 6,
    loading: false,
    statuses: {},
    groupTypes: new Map(),
    tags: new Map(),
    types: {},
    merchantMap: {},
    promotion_url: '',
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
    * receive({ payload: values }, { call, put, select }) {
      const res= yield call(receive, values);
      // tslint:disable-next-line:no-unused-expression
      res.data.promotion_url && (yield put({
        type: 'updateState',
        payload: {
          promotion_url:res.data.promotion_url
        }
      }));
      if(!res.code){
        yield put({ type: 'fetch' });
      }
      return res;
    },
    * fetch({ payload: values }, { call, put, select }) {
      // const { page } = values;
      // tslint:disable-next-line:variable-name
      const page_size = yield select(state => {
        return state.market.page_size
      });
      const page = yield select(state => state.market.page);


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

  },
  subscriptions: {
    setup({ dispatch, history }) {
      return history.listen(({ pathname, search }) => {
        if (pathname.indexOf("market") > -1) {
          dispatch({ type: 'fetch' });
        }
      });
    },
  },
}
import {
  fetch, 
  importCsv,
  getImportTemplate,
} from '@/pages/Operation/Host/services/mcnpay';

export default {
  namespace: 'mcnpay',
  state: {
    filter: { page: 1, page_size: 20, total: 0 },
    list: [],
    sex: {}
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
    },
  },
  effects: {
    * fetch({ payload }, { call, put, select }) {
      const filter = yield select(state => state.mcnpay.filter);
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
    * getImportTemplate({ payload }, { call, put, select }){
      const res = yield call(getImportTemplate);
      return res;
    },
    * importCsv({ payload }, { call, put, select }){
      const res = yield call(importCsv,payload);
      return res;
    }
  },
  subscriptions: {
    setup({ history, dispatch }) {
      // history.listen(({ pathname }) => {
      //   if (pathname.indexOf('/operation/host/') > -1) {
          
      //   }
      // })
    },
  }
}
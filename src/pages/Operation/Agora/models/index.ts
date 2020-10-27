import {
 fetch, 
} from '@/pages/Operation/Agora/services/index';

export default {
 namespace: 'agora',
 state: {
  filter: { page: 1, page_size: 20, total: 0 },
  list: [],
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
   const filter = yield select(state => state.agora.filter);
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
 },
 subscriptions: {
  setup({ history, dispatch }) {
   history.listen(({ pathname }) => {
    if (pathname.indexOf('agora') > -1) {
     dispatch({
      type: 'fetch'
     })
    }
   })
  },
 }
}
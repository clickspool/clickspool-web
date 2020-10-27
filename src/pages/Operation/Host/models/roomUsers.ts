import {
  getRoomMemberList, // 列表
  leaveRoom, //踢出
} from '@/pages/Operation/Host/Upper/services/index';

export default {
 namespace: 'roomUsers',
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
   const filter = yield select(state => state.roomUsers.filter);
   const res = yield call(getRoomMemberList, filter);
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
  
  * leaveRoom({ payload }, { call, put }) {
   const res = yield call(leaveRoom, { ...payload });
   const { code } = res;
   if (!code) {
    yield put({
     type: 'fetch'
    })
   }
   return new Promise((resolve) => {
    resolve(res);
   })
  }

 },
}
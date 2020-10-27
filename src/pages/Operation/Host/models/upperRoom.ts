import {
  closeRoom, // 列表
  getUserRoomList,// 置顶
  setRoomTop// 关闭语音房

} from '@/pages/Operation/Host/Upper/services/index';

export default {
 namespace: 'upperRooms',
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
   const filter = yield select(state => state.upperRooms.filter);
   const res = yield call(getUserRoomList, filter);
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
  
  * closeRoom({ payload }, { call, put }) {
   const res = yield call(closeRoom, { ...payload });
   const { code } = res;
  //  if (!code) {
  //   yield put({
  //    type: 'fetch'
  //   })
  //  }
   return;
  },
  * setRoomTop({ payload }, { call, put }) {
    const res = yield call(setRoomTop, { ...payload });
    const { code } = res;
    // if (!code) {
    //  yield put({
    //   type: 'fetch'
    //  })
    // }
    // return new Promise((resolve) => {
    //  resolve(res);
    // })
    return;
   },
 
 },
}
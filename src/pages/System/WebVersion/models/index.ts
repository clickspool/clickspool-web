import { fetch, statusMap, statusSet, uploadMultiMedia, zipAdd, zipDelete, zipModify, getGlobalCountryMap} from '@/pages/System/WebVersion/services/index';

export default {
 namespace:'webVersion',
 state:{
  filter:{page:1,page_size:20,total:0},
  list:[],
  statusMap:{},
 },
 reducers: {
  update(state, { payload }){
    return {
      ...state,
      ...payload,
    };
   },
   filter(state, { payload }){
    const { filter } = payload;
    return {
      ...state,
      filter:{...state.filter,...filter},
    };
   }
 },
 effects: {
   * fetch({ payload }, { call, put, select }) {
      const filter = yield select(state => state.webVersion.filter);
      const res = yield call(fetch, filter);
      const { code, data} = res;
      yield put({
        type:'update',
        payload:{list:!code?data.list:[]}
      })
      yield put({
        type:'filter',
        payload:{filter:{total:data.total_count}}
      })
   },
   * save({ payload }, { call, put }) {
    const res = yield call(zipAdd,{...payload});
    const { code } = res;
    if(!code){
      yield put({
        type:'fetch'
      })
    }
    return new Promise((resolve)=> {
      resolve(res);
    })
   },
   * del({ payload }, { call, put }) {
    const res = yield call(zipDelete,{...payload});
    const { code } = res;
    if(!code){
      yield put({
        type:'fetch'
      })
    }
    return new Promise((resolve)=> {
      resolve(res);
    })
  },
   * modify({ payload }, { call, put }) {
    const res = yield call(zipModify,{...payload});
    const { code } = res;
    if(!code){
      yield put({
        type:'fetch'
      })
    }
    return new Promise((resolve)=> {
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
  * SetStatus({ payload }, { call, put }) {
    const res = yield call(statusSet,{payload});
    const { code } = res;
    if(!code){
      yield put({
        type:'fetch'
      })
    }
    return new Promise((resolve)=> {
      resolve(res);
    })
  
  },
  * getStatus({ payload }, { call, put }) {
    const res = yield call(statusMap);
    const { code, data } = res;
    yield put({
      type:'update',
      payload:{statusMap:!code?data:{}}
    })
  },
  * getGlobalCountryMap({ payload }, { call, put }) {
    const res = yield call(getGlobalCountryMap);
    const { code, data } = res;
    yield put({
      type:'update',
      payload:{countryMap:!code?data:[]}
    })
  },

 },
 subscriptions: {
  setup( {history, dispatch}) {
    history.listen(({pathname})=>{
      if(pathname.indexOf('webversion')>-1) {
          dispatch({
            type:'fetch'
          })
          dispatch({
            type:'getStatus'
          })
          dispatch({
            type:'getGlobalCountryMap'
          })
      }
    })
 },
}
}
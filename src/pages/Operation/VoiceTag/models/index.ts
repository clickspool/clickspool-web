import { 
        fetch, 
        // tslint:disable-next-line:ordered-imports
        modify,
        add,
        del,
        statusSet,
        statusMap,
        uploadMultiMedia,
      } from '../services/index';

export default {
  namespace: 'voiceTag',

  state: {
    list: [],
    filter:{page: 1,page_size:20,total:0},
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
      const filter = yield select(state => state.voiceTag.filter);
      const res = yield call(fetch, {...filter,...payload});
      if (payload && payload.export) { return }
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
     * add({ payload }, { call, put }) {
      const res = yield call(add, { ...payload });
      const { code } = res;
      if (!code) {
       yield put({
        type: 'fetch'
       })
      }
      return new Promise((resolve) => {
       resolve(res);
      })
     },
     * del({ payload }, { call, put }) {
      const res = yield call(del, { ...payload });
      const { code } = res;
      if (!code) {
       yield put({
        type: 'fetch'
       })
      }
      return new Promise((resolve) => {
       resolve(res);
      })
     },
     * modify({ payload }, { call, put }) {
      const res = yield call(modify, { ...payload });
      const { code } = res;
      if (!code) {
       yield put({
        type: 'fetch'
       })
      }
      return new Promise((resolve) => {
       resolve(res);
      })
     },
     * SetStatus({ payload }, { call, put }) {
      const res = yield call(statusSet, { ...payload });
      const { code } = res;
      if (!code) {
       yield put({
        type: 'fetch'
       })
      }
      return new Promise((resolve) => {
       resolve(res);
      })
     },
     * uploadMedia({ payload }, { call, put }) {
      const from = new FormData();
      from.append('multiMedia',payload.multiMedia)
      const res = yield call(uploadMultiMedia,from);
      return new Promise((resolve)=> {
        resolve(res);
      })
    },
     * getEnum(actions, { call, put }) {
      enum State {
       'statusMap'
      };
      const allEnum = yield Promise
       .all([
        statusMap(),
       ])
       .then((reslut) => {
        const payload = {
          turnoverFromTypes: {},
        }
        reslut.map((item, index) => {
         if (+item.code === 0) {
            payload[State[index]] = item.data;
         }
        })
        return new Promise((resolve, reject) => {
         resolve(payload)
        })
       });
      yield put({
       type: 'update',
       payload: allEnum,
      })
     }
  },
  subscriptions: {
    setup({ history, dispatch }) {
      return history.listen((event) => {
        if(event.pathname.indexOf('/voiceTag')>-1){
          dispatch({type:'fetch'});
          dispatch({
            type: 'getEnum'
           })
        }
      });
    },
  }
};

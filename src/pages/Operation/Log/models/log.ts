import { 
        fetch, 
        // tslint:disable-next-line:ordered-imports
        turnoverFromTypes
      } from '../services/log';

export default {
  namespace: 'log',

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
      const filter = yield select(state => state.log.filter);
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
    
     * getEnum(actions, { call, put }) {
      enum State {
       'turnoverFromTypes'
      };
      const allEnum = yield Promise
       .all([
        turnoverFromTypes(),
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
        if(event.pathname.indexOf('/order/log')>-1){
          dispatch({type:'fetch'});
          dispatch({
            type: 'getEnum'
           })
        }
      });
    },
  }
};

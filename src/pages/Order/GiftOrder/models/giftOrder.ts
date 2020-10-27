import { 
        fetch, 
        // tslint:disable-next-line:ordered-imports
        payTypes,
        statusMap,
        productMap,
        getGlobalCountryMap,
      } from '../services/index';

export default {
  namespace: 'giftOrder',

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
      const filter = yield select(state => state.giftOrder.filter);
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
       'payTypes',
       'statusMap',
       'productMap',
       'GlobalCountryMap',
      };
      const allEnum = yield Promise
       .all([
        payTypes(),
        statusMap(),
        productMap(),
        getGlobalCountryMap()
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
        if(event.pathname.indexOf('/order/giftOrder')>-1){
          dispatch({type:'fetch'});
          
          dispatch({
            type: 'getEnum'
           })
        }
      });
    },
  }
};

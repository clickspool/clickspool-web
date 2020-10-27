import {
  fetch,
  // tslint:disable-next-line:ordered-imports
  getDiamondShardsList,
  batchAddDiamondShard,
  diamondShardFromTypes
} from '../services';

export default {
  namespace: 'shardLog',

  state: {
    list: [],
    filter: { page: 1, page_size: 20, total: 0 },
    shardFromTypes: {}
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
      const filter = yield select(state => state.shardLog.filter);
      const res = yield call(getDiamondShardsList, { ...filter, ...payload });
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
      const res = yield call(batchAddDiamondShard, { ...payload });
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

    * getEnum(actions, { call, put }) {
      enum State {
        'shardFromTypes'
      };
      const allEnum = yield Promise
        .all([
          diamondShardFromTypes(),
        ])
        .then((reslut) => {
          const payload = {
            shardFromTypes: {},
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
        if (event.pathname.indexOf('/order/log') > -1) {
          dispatch({
            type: 'getEnum'
          })
        }
      });
    },
  }
};

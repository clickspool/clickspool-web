import {
  fetch, // 规则KEY枚举
  getUserSexList, // 性别枚举
  setCreateRoomAuth, //设置主播开播权限
  setUserOrganization, //设置主播机构
  setUserOfficialRec, //设置主播是否加入官方推荐计划
  batchSetIdentity,
} from '@/pages/Operation/Host/Upper/services/index';

export default {
  namespace: 'upper',
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
    saveSingle(state, { payload: { item } }) {
      let { list = [] } = { ...state };
      list = list.map(el => {
        if (el.id === item.id) {
          return item;
        }
        return el;
      });
      return { ...state, list }
    },
  },
  effects: {
    * fetch({ payload }, { call, put, select }) {
      const filter = yield select(state => state.upper.filter);
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

    * batchSetIdentity({ payload }, { call, put }) {
      const res = yield call(batchSetIdentity, { ...payload });
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
      const res = yield call(setCreateRoomAuth, { ...payload });
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

    * setUserOrganization({ payload }, { call, put }) {
      console.info('payload__setUserOrganization', payload);
      const res = yield call(setUserOrganization, { ...payload });
      const { user_id } = payload;
      const { code } = res;

      if (!code) {
        yield put({ type: 'fetchSingle', payload: { creator_id: user_id } })
      }
      return res;
    },

    * getEnum(actions, { call, put }) {
      enum State {
        'sex',
      };
      const allEnum = yield Promise
        .all([getUserSexList()])
        .then((reslut) => {
          const payload = {
            sex: {}
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
    },
    * fetchSingle({ payload: { creator_id } }, { call, put }) {
      const data = yield call(fetch, { creator_id });
      if (data && data.code === 0) {
        const item = data.data.list.filter(item => item.creator_id == creator_id)[0];
        yield put({
          type: 'saveSingle',
          payload: { item }
        });
      }
    },
    * setUserOfficialRec({ payload: { user_id, is_recommend } }, { call, put }) {
      const result = yield call(setUserOfficialRec, { user_id, is_recommend });
      if (result && result.code === 0) {
        yield put({ type: 'fetchSingle', payload: { creator_id: user_id } })
        return result;
      }
    },
  },
  subscriptions: {
    setup({ history, dispatch }) {
      history.listen(({ pathname }) => {
        if (pathname.indexOf('/operation/host/manage') > -1) {
          dispatch({
            type: 'getEnum'
          })
        }
      })
    },
  }
}
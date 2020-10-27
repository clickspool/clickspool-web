import { getSocialUserInfo, getSocialUserList } from '@/services/users';


export default {
  namespace: 'star',

  state: {
    data: { page: 1, total_count: 1, list: [] },
    info:{}
  },

  effects: {
    *getSocialUserInfo({ payload }, { call, put }) {
      const response = yield call(getSocialUserInfo, payload);
      yield put({
        type: 'getSeedUserInfoRedux',
        payload: response,
      });
    },
    *getList({ payload }, { call, put }) {
      const response = yield call(getSocialUserList, payload);
      if (payload.export) { return }
      yield put({
        type: 'getListStatus',
        payload: response,
      });
    },
  },

  reducers: {
    getSeedUserInfoRedux(state, { payload }) {
      if (!payload) {
        return {
          ...state,
        };
      }
      return {
        ...state,
        info: payload.data,
      };
    },
    getListStatus(state, { payload }) {
      if (!payload) {
        return {
          ...state,
        };
      }
      return {
        ...state,
        data: payload.data,
      };
    },
  },
};

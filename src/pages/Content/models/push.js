import { getList, getContentPushStatusList } from '@/services/push';

export default {
  namespace: 'contentpush',

  state: {
    data: { page: 1, total_count: 1, data: [] },
    listStatus: [],
  },

  effects: {
    *getList({ payload }, { call, put }) {
      const response = yield call(getList, payload);
      yield put({
        type: 'getListStatus',
        payload: response,
      });
    },
    *getContentPushStatusList({ payload }, { call, put }) {
      const response = yield call(getContentPushStatusList, payload);
      yield put({
        type: 'pushListEnum',
        payload: response,
      });
    },
  },

  reducers: {
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
    pushListEnum(state, { payload }) {
      if (!payload) {
        return {
          ...state,
        };
      }
      return {
        ...state,
        listStatus: payload.data,
      };
    },
  },
};

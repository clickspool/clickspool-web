import { getList, getTagStatusList } from '@/services/tag';

export default {
  namespace: 'tags',

  state: {
    data: { data: [], page: 1, total_count: 0 },
    statusList: {},
  },

  effects: {
    *getList({ payload }, { call, put }) {
      const response = yield call(getList, payload);
      yield put({
        type: 'getGroupStatus',
        payload: response,
      });
    },
    *getTagStatusList({ payload }, { call, put }) {
      const response = yield call(getTagStatusList, payload);
      yield put({
        type: 'getTagStatusListStatus',
        payload: response,
      });
    },
  },

  reducers: {
    getGroupStatus(state, { payload }) {
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
    getTagStatusListStatus(state, { payload }) {
      if (!payload) {
        return {
          ...state,
        };
      }
      return {
        ...state,
        statusList: payload.data,
      };
    },
  },
};

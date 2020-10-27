import { getList } from '@/services/imagegroup';

export default {
  namespace: 'group',

  state: {
    data: { list: [], page: 1, total_count: 0 },
  },

  effects: {
    *getList({ payload }, { call, put }) {
      const response = yield call(getList, payload);
      yield put({
        type: 'getGroupStatus',
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
  },
};

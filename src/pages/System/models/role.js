import { getList } from '@/services/role';

export default {
  namespace: 'role',

  state: {
    data: { data: [], page: 1, total_page: 0 },
  },

  effects: {
    *getList({ payload }, { call, put }) {
      const response = yield call(getList, payload);
      yield put({
        type: 'getRoleStatus',
        payload: response,
      });
    },
  },

  reducers: {
    getRoleStatus(state, { payload }) {
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

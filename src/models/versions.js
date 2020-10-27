import { getList } from '@/services/versions';
import { type } from '@/utils/utils';

export default {
  namespace: 'versions',

  state: {
    data: [],
  },

  effects: {
    *getConfigList({ payload }, { call, put }) {
      const response = yield call(getList, payload);
      yield put({
        type: 'getVersionsStatus',
        payload: response,
      });
    },
  },

  reducers: {
    getVersionsStatus(state, { payload }) {
      if (!payload) {
        return {
          ...state,
        };
      }
      const item = payload;
      if (type(item.data) === 'object') {
        item.data = [];
      }
      return {
        ...state,
        data: item.data,
      };
    },
  },
};

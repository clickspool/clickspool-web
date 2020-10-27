import { getMemberInfo } from '@/services/api';

import { stringify } from 'qs';

import { routerRedux } from 'dva/router';

export default {
  namespace: 'memberInfo',

  state: {
    data: { data: { keys: [] } },
  },

  effects: {
    *getMemberInfo({ payload }, { call, put }) {
      const response = yield call(getMemberInfo, payload);
      yield put({
        type: 'getMemberInfoStatus',
        payload: response,
      });
    },
  },

  reducers: {
    getMemberInfoStatus(state, { payload }) {
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

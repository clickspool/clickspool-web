import { login, getFakeCaptcha } from '@/services/api';
import { setAuthority } from '@/utils/authority';
// import { getPageQuery } from '@/utils/utils';

import { stringify } from 'qs';

import { routerRedux } from 'dva/router';

export default {
  namespace: 'login',

  state: {
    data: {},
  },

  effects: {
    *login({ payload }, { call, put }) {
      const response = yield call(login, payload);

      yield put({
        type: 'changeLoginStatus',
        payload: response,
      });
    },

    *getCaptcha({ payload }, { call }) {
      yield call(getFakeCaptcha, payload);
    },

    *logout(_, { put }) {
      yield put({
        type: 'changeLoginStatus',
        payload: {
          code: false,
          currentAuthority: 'guest',
        },
      });
      yield put(
        routerRedux.push({
          pathname: '/user/login',
          search: stringify({
            redirect: window.location.href,
          }),
        })
      );
    },
  },

  reducers: {
    changeLoginStatus(state, { payload }) {
      if (!payload) {
        return {
          ...state,
        };
      }
      setAuthority(payload.data.token);
      return {
        ...state,
        token: payload.data.token,
      };
    },
  },
};

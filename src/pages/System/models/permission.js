import { getList, getRoleList, getMemberStatusList, getPublisherList, getPublisherInfo } from '@/services/permission';
import { type } from '@/utils/utils';

export default {
  namespace: 'permission',

  state: {
    data: { data: [] },
    pData: { data: [] },
    roleList: [],
    statusList: [],
    publisherInfo: {}
  },

  effects: {
    *getPublisherInfo({ payload }, { call, put }) {
      const response = yield call(getPublisherInfo, payload);
      if (!response.code) {
        yield put({
          type: 'pubFetch',
          payload: { publisherInfo: response.data },
        });
      }

    },
    *getPublisherList({ payload }, { call, put }) {
      const response = yield call(getPublisherList, payload);
      if (!response.code) {
        yield put({
          type: 'pubFetch',
          payload: { pData: response.data },
        });
      }

    },
    *getList({ payload }, { call, put }) {
      const response = yield call(getList, payload);
      yield put({
        type: 'getPermissionStatus',
        payload: response,
      });
    },
    *getRoleList({ payload }, { call, put }) {
      const response = yield call(getRoleList, payload);
      yield put({
        type: 'getRoleListStatus',
        payload: response,
      });
    },
    *getMemberStatusList({ payload }, { call, put }) {
      const response = yield call(getMemberStatusList, payload);
      yield put({
        type: 'memberStatusList',
        payload: response,
      });
    },
  },

  reducers: {
    pubFetch(state, { payload }) {
      if (!payload) {
        return {
          ...state,
        };
      }
      return {
        ...state,
        ...payload,
      };
    },
    getPermissionStatus(state, { payload }) {
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
    getRoleListStatus(state, { payload }) {
      if (!payload) {
        return {
          ...state,
        };
      }
      return {
        ...state,
        roleList: payload.data.data,
      };
    },
    memberStatusList(state, { payload }) {
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
  subscriptions: {
    setup({ dispatch, history }) {
      // Subscribe history(url) change, trigger `load` action if pathname is `/`
      return history.listen(({ pathname, search }) => {
        if(['/profile','/payment_setting'].indexOf(pathname)>-1){
          dispatch({
            type: 'permission/getPublisherInfo',
          });
        }
      });
    },
  },
};

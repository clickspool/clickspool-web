import { getList, getRoleList, getMemberStatusList, getPublisherList } from '@/services/permission';
import { type } from '@/utils/utils';

export default {
  namespace: 'permission',

  state: {
    data: { data: [] },
    pData:{ data: [] },
    roleList: [],
    statusList: [],
  },

  effects: {
    *getPublisherList({ payload }, { call, put }) {
      const response = yield call(getPublisherList, payload);
      yield put({
        type: 'pubFetch',
        payload: response,
      });
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
        pData: payload.data,
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
};

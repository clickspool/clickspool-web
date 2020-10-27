import { getList, getRoleList, getMemberStatusList } from '@/services/permission';
import { type } from '@/utils/utils';

export default {
  namespace: 'permission',

  state: {
    data: { data: [] },
    roleList: [],
    statusList: [],
  },

  effects: {
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

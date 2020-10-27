import {
  getList,
  getContentSourceList,
  getContentStatusList,
  getContentCates,
  getContentTags,
  getAdminContentCates,
} from '@/services/content';

export default {
  namespace: 'content',

  state: {
    data: { page: 1, total_count: 1, data: [] },
    statusList: {},
    sourceList: {},
    catesList: {},
    contentTags: {},
    adminContentCates: {},
  },

  effects: {
    *getList({ payload }, { call, put }) {
      const response = yield call(getList, payload);
      yield put({
        type: 'getListStatus',
        payload: response,
      });
    },
    *getContentSourceList({}, { call, put }) {
      const response = yield call(getContentSourceList);
      yield put({
        type: 'getContentSourceListStatus',
        payload: response,
      });
    },
    *getContentStatusList({}, { call, put }) {
      const response = yield call(getContentStatusList);
      yield put({
        type: 'getContentStatusListStatus',
        payload: response,
      });
    },
    *getContentCates({ payload }, { call, put }) {
      const response = yield call(getContentCates, payload);
      yield put({
        type: 'getContentCatesStatus',
        payload: response,
      });
    },
    *getContentTags({ payload }, { call, put }) {
      const response = yield call(getContentTags, payload);
      yield put({
        type: 'getContentTagsStatus',
        payload: response,
      });
    },
    *getAdminContentCates({ payload }, { call, put }) {
      const response = yield call(getAdminContentCates, payload);
      yield put({
        type: 'getAdminContentCatesStatus',
        payload: response,
      });
    },
  },

  reducers: {
    getContentTagsStatus(state, { payload }) {
      if (!payload) {
        return {
          ...state,
        };
      }
      return {
        ...state,
        contentTags: payload.data,
      };
    },
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
    getContentSourceListStatus(state, { payload }) {
      if (!payload) {
        return {
          ...state,
        };
      }
      return {
        ...state,
        sourceList: payload.data,
      };
    },
    getContentStatusListStatus(state, { payload }) {
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
    getContentCatesStatus(state, { payload }) {
      if (!payload) {
        return {
          ...state,
        };
      }
      return {
        ...state,
        catesList: payload.data,
      };
    },
    getAdminContentCatesStatus(state, { payload }) {
      if (!payload) {
        return {
          ...state,
        };
      }
      return {
        ...state,
        adminContentCates: payload.data,
      };
    },
  },
};

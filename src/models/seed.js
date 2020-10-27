import { getSeedUserInfo, getSeedUserList,getUserLanguageMap,getUserRegionMap } from '@/services/users';


export default {
  namespace: 'seed',
  state: {
    data: { page: 1, total_count: 1, list: [] },
    info:{},
    regionMap:[],
    languageMap:[],
  },

  effects: {
    *getLanguageMap({ payload }, { call, put }) {
      const response = yield call(getUserLanguageMap, payload);
      yield put({
        type: 'getLanguageMapRedux',
        payload: response,
      });
    },
    *getRegionMap({ payload }, { call, put }) {
      const response = yield call(getUserRegionMap, payload);
      yield put({
        type: 'getRegionMapRedux',
        payload: response,
      });
    },
    *getSeedUserInfo({ payload }, { call, put }) {
      const response = yield call(getSeedUserInfo, payload);
      yield put({
        type: 'getSeedUserInfoRedux',
        payload: response,
      });
    },
    *getList({ payload }, { call, put }) {
      const response = yield call(getSeedUserList, payload);
      if (payload.export) { return; }
      yield put({
        type: 'getListStatus',
        payload: response,
      });
    },
  },

  reducers: {
    getRegionMapRedux(state, { payload }) {
      if (!payload) {
        return {
          ...state,
        };
      }
      return {
        ...state,
        regionMap: payload.data,
      };
    },
    getLanguageMapRedux(state, { payload }) {
      if (!payload) {
        return {
          ...state,
        };
      }
      return {
        ...state,
        languageMap: payload.data,
      };
    },
    getSeedUserInfoRedux(state, { payload }) {
      if (!payload) {
        return {
          ...state,
        };
      }
      return {
        ...state,
        info: payload.data,
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
  },
};

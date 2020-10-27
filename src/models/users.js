import {
  getList,
  getCountryList,
  getUserSexList,
  getUserStatusList,
  getFriendList,
  getUserInfo,
  getFriendSourceList,
  getRelationList,
  getRecordList,
  getCallingTypeList,
  getChannelTypeList,
  getCallingStatusList,
  getUserStars

} from '@/services/users';

export default {
  namespace: 'users',

  state: {
    data: { page: 1, total_count: 1, list: [] },
    friend: { page: 1, total_count: 1, list: [] },
    recordList:{page: 1, total_count: 1, list: [] },
    callingTypeList:{},
    channelTypeList:{},
    callingStatusList:{},
    info: {},
    status: {},
    sex: {},
    country: {},
    friendSource: {},
    relationList: {},
    user_star:{}
  },

  effects: {
    *getList({ payload }, { call, put }) {
      const response = yield call(getList, payload);
      if (payload.export) { return }
      yield put({
        type: 'getListStatus',
        payload: response,
      });
    },
    *getFriendList({ payload }, { call, put }) {
      const response = yield call(getFriendList, payload);
      yield put({
        type: 'getFriendListStatus',
        payload: response,
      });
    },
    *getUserStatusList({ payload }, { call, put }) {
      const response = yield call(getUserStatusList, payload);
      yield put({
        type: 'getStatus',
        payload: response,
      });
    },
    *getUserSexList({ payload }, { call, put }) {
      const response = yield call(getUserSexList, payload);
      yield put({
        type: 'getSexStatus',
        payload: response,
      });
    },
    *getCountryList({ payload }, { call, put }) {
      const response = yield call(getCountryList, payload);
      yield put({
        type: 'getCountryStatus',
        payload: response,
      });
    },
    *getUserInfo({ payload }, { call, put }) {
      const response = yield call(getUserInfo, payload);
      yield put({
        type: 'getUserInfoStatus',
        payload: response,
      });
    },
    *getFriendSourceList({ payload }, { call, put }) {
      const response = yield call(getFriendSourceList, payload);
      yield put({
        type: 'getFriendSourceListStatus',
        payload: response,
      });
    },
    *getRelationList({ payload }, { call, put }) {
      const response = yield call(getRelationList, payload);
      yield put({
        type: 'getRelationListStatus',
        payload: response,
      });
    },
    *getRecordList({ payload }, { call, put }) {
      const response = yield call(getRecordList, payload);
      yield put({
        type: 'getRecordListStatus',
        payload: response,
      });
    },
    *getCallingTypeList({ payload }, { call, put }) {
      const response = yield call(getCallingTypeList, payload);
      yield put({
        type: 'getCallingTypeListStatus',
        payload: response,
      });
    },
    *getChannelTypeList({ payload }, { call, put }) {
      const response = yield call(getChannelTypeList, payload);
      yield put({
        type: 'getChannelTypeListStatus',
        payload: response,
      });
    },
    *getCallingStatusList({ payload }, { call, put }) {
      const response = yield call(getCallingStatusList, payload);
      yield put({
        type: 'getCallingStatusListStatus',
        payload: response,
      });
    },
    *getUserStars({ payload }, { call, put }) {
      const response = yield call(getUserStars, payload);
      yield put({
        type: 'getUserStarsRedux',
        payload: response,
      });
    },
  },

  reducers: {
    getUserStarsRedux(state, { payload }){
      if(!payload) {
        return {
          ...state,
        };
      }
      return {
        ...state,
        user_star: payload.data,
      };
    },
    getCallingStatusListStatus(state, { payload }) {
      if (!payload) {
        return {
          ...state,
        };
      }
      return {
        ...state,
        callingStatusList: payload.data,
      };
    },
    getChannelTypeListStatus(state, { payload }) {
      if (!payload) {
        return {
          ...state,
        };
      }
      return {
        ...state,
        channelTypeList: payload.data,
      };
    },
    getCallingTypeListStatus(state, { payload }) {
      if (!payload) {
        return {
          ...state,
        };
      }
      return {
        ...state,
        callingTypeList: payload.data,
      };
    },
    getRecordListStatus(state, { payload }) {
      if (!payload) {
        return {
          ...state,
        };
      }
      return {
        ...state,
        recordList: payload.data,
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
    getStatus(state, { payload }) {
      if (!payload) {
        return {
          ...state,
        };
      }
      return {
        ...state,
        status: payload.data,
      };
    },
    getSexStatus(state, { payload }) {
      if (!payload) {
        return {
          ...state,
        };
      }
      return {
        ...state,
        sex: payload.data,
      };
    },
    getCountryStatus(state, { payload }) {
      if (!payload) {
        return {
          ...state,
        };
      }
      return {
        ...state,
        country: payload.data,
      };
    },
    getFriendListStatus(state, { payload }) {
      if (!payload) {
        return {
          ...state,
        };
      }
      return {
        ...state,
        friend: payload.data,
      };
    },
    getUserInfoStatus(state, { payload }) {
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
    getFriendSourceListStatus(state, { payload }) {
      if (!payload) {
        return {
          ...state,
        };
      }
      return {
        ...state,
        friendSource: payload.data,
      };
    },
    getFriendSourceListStatus(state, { payload }) {
      if (!payload) {
        return {
          ...state,
        };
      }
      return {
        ...state,
        friendSource: payload.data,
      };
    },
    getRelationListStatus(state, { payload }) {
      if (!payload) {
        return {
          ...state,
        };
      }
      return {
        ...state,
        relationList: payload.data,
      };
    },
  },
};

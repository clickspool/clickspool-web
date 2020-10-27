import { getConfigList } from '@/services/setting';

function editModelVisble(payload) {
  return payload;
}
function editInfo(payload) {
  return payload;
}
function addModelVisible(payload) {
  return payload;
}

export default {
  namespace: 'settingInfo',

  state: {
    data: { data: {} },
    total_count: 0,
    page: 1,
    editModel: false,
    addVisibleModel: false,
    editInfo: {},
  },

  effects: {
    *getConfigList({ payload }, { call, put }) {
      const response = yield call(getConfigList, payload);
      yield put({
        type: 'getSettingStatus',
        payload: response,
      });
    },
  },

  reducers: {
    getSettingStatus(state, { payload }) {
      if (!payload) {
        return {
          ...state,
        };
      }
      return {
        ...state,
        data: payload,
        total_count: payload.data.total_count || 0,
        page: payload.data.page || 1,
      };
    },
    editModelVisble(state, { payload }) {
      if (!payload) {
        return {
          ...state,
        };
      }
      return {
        ...state,
        editModel: payload.editModel,
      };
    },
    editInfo(state, { payload }) {
      if (!payload) {
        return {
          ...state,
        };
      }
      return {
        ...state,
        editInfo: payload,
      };
    },
    addModelVisble(state, { payload }) {
      if (!payload) {
        return {
          ...state,
        };
      }
      return {
        ...state,
        addVisibleModel: payload.addVisibleModel,
      };
    },
  },
};

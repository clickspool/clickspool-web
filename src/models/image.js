import { source, getList } from '@/services/image';

function editModelVisble(payload) {
  return payload;
}
function editInfoFun(payload) {
  return payload;
}
function addModelVisible(payload) {
  return payload;
}

export default {
  namespace: 'image',

  state: {
    data: { page: 1, total_count: 1, list: [] },
    source: [],
    addVisibleModel: false,
    editModel: false,
    editInfo: {},
  },

  effects: {
    *getSource({ payload }, { call, put }) {
      const response = yield call(source, payload);
      yield put({
        type: 'getSourceStatus',
        payload: response,
      });
    },
    *getList({ payload }, { call, put }) {
      const response = yield call(getList, payload);
      yield put({
        type: 'getListStatus',
        payload: response,
      });
    },
    *editModelVisble({ payload }, { call, put }) {
      const response = yield call(editModelVisble, payload);
      yield put({
        type: 'editModelVisbleStatus',
        payload: response,
      });
    },
    *addModelVisble({ payload }, { call, put }) {
      const response = yield call(addModelVisible, payload);
      yield put({
        type: 'addModelVisbleStatus',
        payload: response,
      });
    },
    *editInfo({ payload }, { call, put }) {
      const response = yield call(editInfoFun, payload);
      yield put({
        type: 'editInfoStatus',
        payload: response,
      });
    },
  },

  reducers: {
    getSourceStatus(state, { payload }) {
      if (!payload) {
        return {
          ...state,
        };
      }
      return {
        ...state,
        source: payload.data.list,
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
    editModelVisbleStatus(state, { payload }) {
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
    editInfoStatus(state, { payload }) {
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
    addModelVisbleStatus(state, { payload }) {
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

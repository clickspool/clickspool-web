import {
  getFaqCateList,
  getFaqCateStatusList,
  getFaqCateDisplayPosMap
} from '@/services/faq';

export default {
  namespace: 'feedbackcate',

  state: {
    data: { page: 1, total_count: 1, list: [] },
    faqCateStatusList:{},
    posmap:[],
  },

  effects: {
    *getList({ payload }, { call, put }) {
      const response = yield call(getFaqCateList, payload);
      yield put({
        type: 'getListStatus',
        payload: response,
      });
    },
    *getFaqCateStatusList({ payload }, { call, put }) {
      const response = yield call(getFaqCateStatusList, payload);
      yield put({
        type: 'getFaqCateStatus',
        payload: response,
      });
    },
    *faqCateDisplayPosMap({ payload }, { call, put }) {
      const response = yield call(getFaqCateDisplayPosMap, payload);
      yield put({
        type: 'faqCateDisplayPosMapReducer',
        payload:response,
      });
    },
  },

  reducers: {
    faqCateDisplayPosMapReducer(state, { payload }){
      if (!payload) {
        return {
          ...state,
        };
      }
      return {
        ...state,
        posmap: payload.data,
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
    getFaqCateStatus(state, { payload }) {
      if (!payload) {
        return {
          ...state,
        };
      }
      return {
        ...state,
        faqCateStatusList: payload.data,
      };
    },
  }
};

import { getFaqList,getFaqStatusList, } from '@/services/faq';

export default {
  namespace: 'faq',

  state: {
    data: { list: [], page: 1, total_count: 0 },
    statusList:{},
    
  },

  effects: {
    *getList({ payload }, { call, put }) {
      const response = yield call(getFaqList, payload);
      yield put({
        type: 'getFaqListStatus',
        payload: response,
      });
    },
    *getFaqCateStatusList({ payload }, { call, put }) {
      const response = yield call(getFaqStatusList, payload);
      yield put({
        type: 'getFaqCateStatusListStatus',
        payload: response,
      });
    },
   
    
  },

  reducers: {
    
    getFaqListStatus(state, { payload }) {
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
    getFaqCateStatusListStatus(state, { payload }) {
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

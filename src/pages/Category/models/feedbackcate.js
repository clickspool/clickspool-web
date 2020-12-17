import {
  getFaqList,
  getFaqCateList,
  getFaqCateStatusList,
  getFaqCateDisplayPosMap
} from '@/services/faq';
import get from 'lodash/get';

export default {
  namespace: 'feedbackcate',

  state: {
    data: { page: 1, total_count: 1, list: [] },
    faqCateStatusList:{},
    posmap:[],
    list:[]
  },

  effects: {
    *fetch({ payload }, { call, put }) {
      if(!payload){
        return yield put({
          type: 'update',
          payload: {list:[]},
        });
      }
      const response = yield call(getFaqList, payload);
      const list =  get(response,'data.list');
      console.log(response,list,'list')
      if(list){
        yield put({
          type: 'update',
          payload: {list},
        });
      }
    },
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
    update(state, { payload }) {
      return {
        ...state,
        ...payload
      };
    },
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

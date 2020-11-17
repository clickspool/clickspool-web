import {
  getList,
  getCategory,
  getCustomer,
  getAllVersion,
  getOneFeedback,
  getFeedbackStatusList,
} from '@/services/customer';

export default {
  namespace: 'customer',

  state: {
    data: { list: [], page: 1, total_count: 0 },
    category: [{}],
    customer: { customer_list: [{}] },
    version: { list: [] },
    feedbackData: {
      category_data: { name: '' },
      pic_url: [],
    },
    statusList: {},
  },

  effects: {
    *getList({ payload }, { call, put }) {
      const response = yield call(getList, { page_size: 20, ...payload });
      if (payload.export) { return }
      yield put({
        type: 'getListStatus',
        payload: response,
      });
    },
    *getCategory({ payload }, { call, put }) {
      const response = yield call(getCategory, payload);
      yield put({
        type: 'getCategoryStatus',
        payload: response,
      });
    },
    *getAllVersion({ payload }, { call, put }) {
      const response = yield call(getAllVersion, payload);
      yield put({
        type: 'getAllVersionStatus',
        payload: response,
      });
    },
    *getCustomer({ payload }, { call, put }) {
      const response = yield call(getCustomer, payload);
      yield put({
        type: 'getCustomerStatus',
        payload: response,
      });
    },
    *getOneFeedback({ payload }, { call, put }) {
      const response = yield call(getOneFeedback, payload);
      yield put({
        type: 'getOneFeedbackStatus',
        payload: response,
      });
    },
    *getFeedbackStatusList({ payload }, { call, put }) {
      const response = yield call(getFeedbackStatusList, payload);
      yield put({
        type: 'getFeedbackStatusListStatus',
        payload: response,
      });
    },
  },

  reducers: {
    getFeedbackStatusListStatus(state, { payload }) {
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
    getOneFeedbackStatus(state, { payload }) {
      if (!payload) {
        return {
          ...state,
        };
      }
      return {
        ...state,
        feedbackData: payload.data.data,
      };
    },
    getCustomerStatus(state, { payload }) {
      if (!payload) {
        return {
          ...state,
        };
      }
      return {
        ...state,
        customer: payload.data,
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
    getCategoryStatus(state, { payload }) {
      if (!payload) {
        return {
          ...state,
        };
      }
      return {
        ...state,
        category: payload.data,
      };
    },
    getAllVersionStatus(state, { payload }) {
      if (!payload) {
        return {
          ...state,
        };
      }
      return {
        ...state,
        version: payload.data,
      };
    },
  },
};

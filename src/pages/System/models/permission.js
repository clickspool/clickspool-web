import { getList, getRoleList, getMemberStatusList, getPublisherList, getPublisherInfo, userMemberList, orderList, getPurchaseList, getCouponList, modifyCoupon } from '@/services/permission';
import { type } from '@/utils/utils';

export default {
  namespace: 'permission',

  state: {
    data: { data: [] },
    pData: { data: [] },
    roleList: [],
    statusList: [],
    publisherInfo: {},
    memberList:{data:[]},
    orderList:{data:[]},
    purchaseList:{data:[]},
    couponList:{data:[]},
    coupon:{},
  },

  effects: {
    * patchCoupon({ payload }, { call, put }) {
      const res= yield call(modifyCoupon, { ...payload });
      return res
    },
    *fetchCouponList({ payload }, { call, put }) {
      const {data:couponList, code} = yield call(getCouponList, { ...payload, page_size: 20 });
      yield put({
        type: 'update',
        payload: {couponList},
      });
    },
    *fetchPurchaseList({ payload }, { call, put }) {
      const {data:purchaseList, code} = yield call(getPurchaseList, { ...payload, page_size: 20 });
      yield put({
        type: 'update',
        payload: {purchaseList},
      });
    },
    *fetchOrderList({ payload }, { call, put }) {
      const {data, code} = yield call(orderList, { ...payload, page_size: 20 });
      yield put({
        type: 'update',
        payload: {orderList:data},
      });
    },
    *fetchUserMemberList({ payload }, { call, put }) {
      const {data:memberList, code} = yield call(userMemberList, { ...payload, page_size: 20 });
      yield put({
        type: 'update',
        payload: {memberList},
      });
    },
    
    *getPublisherInfo({ payload }, { call, put }) {
      const response = yield call(getPublisherInfo, payload);
      if (!response.code) {
        yield put({
          type: 'pubFetch',
          payload: { publisherInfo: response.data },
        });
      }

    },
    *getPublisherList({ payload }, { call, put }) {
      const response = yield call(getPublisherList, payload);
      if (!response.code) {
        yield put({
          type: 'pubFetch',
          payload: { pData: response.data },
        });
      }

    },
    *getList({ payload }, { call, put }) {
      const response = yield call(getList, { ...payload, page_size: 20 });
      yield put({
        type: 'getPermissionStatus',
        payload: response,
      });
    },
    *getRoleList({ payload }, { call, put }) {
      if(!payload){
        payload = {page:1}
      }
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
    update(state, { payload }){
      return {...state,...payload}
    },
    pubFetch(state, { payload }) {
      if (!payload) {
        return {
          ...state,
        };
      }
      return {
        ...state,
        ...payload,
      };
    },
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
  subscriptions: {
    setup({ dispatch, history }) {
      // Subscribe history(url) change, trigger `load` action if pathname is `/`
      return history.listen(({ pathname, search }) => {
        if (['/profile', '/payment_setting'].indexOf(pathname) > -1) {
          dispatch({
            type: 'getPublisherInfo',
          });
        }
      });
    },
  },
};

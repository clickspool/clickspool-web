import { queryNotices, getGlobalCountryMap } from '@/services/api';
import { getLanguageList } from '@/services/content';

export default {
  namespace: 'global',

  state: {
    collapsed: false,
    notices: [],
    languageList:[],
    spinning:false,
    GlobalCountryMap:[]
  },

  effects: {
    *fetchNotices(_, { call, put, select }) {
      const data = yield call(queryNotices);
      yield put({
        type: 'saveNotices',
        payload: data,
      });
      const unreadCount = yield select(
        state => state.global.notices.filter(item => !item.read).length
      );
      yield put({
        type: 'user/changeNotifyCount',
        payload: {
          totalCount: data.length,
          unreadCount,
        },
      });
    },
    *clearNotices({ payload }, { put, select }) {
      yield put({
        type: 'saveClearedNotices',
        payload,
      });
      const count = yield select(state => state.global.notices.length);
      const unreadCount = yield select(
        state => state.global.notices.filter(item => !item.read).length
      );
      yield put({
        type: 'user/changeNotifyCount',
        payload: {
          totalCount: count,
          unreadCount,
        },
      });
    },
    *changeNoticeReadState({ payload }, { put, select }) {
      const notices = yield select(state =>
        state.global.notices.map(item => {
          const notice = { ...item };
          if (notice.id === payload) {
            notice.read = true;
          }
          return notice;
        })
      );
      yield put({
        type: 'saveNotices',
        payload: notices,
      });
      yield put({
        type: 'user/changeNotifyCount',
        payload: {
          totalCount: notices.length,
          unreadCount: notices.filter(item => !item.read).length,
        },
      });
    },
    *getGlobalCountryMap({ payload }, { call, put }) {
      let response = yield call(getGlobalCountryMap);
      if(!response.code){
        response=response.data
      }else{
        response=[]
      }
      yield put({
        type: 'globalCountryMapStatus',
        payload: response,
      });
    },

    *getLanguageList({ payload }, { call, put }) {
      let response = yield call(getLanguageList);
      if(!response.code){
        response=response.data
      }else{
        response=[]
      }
      yield put({
        type: 'getLanguageListStatus',
        payload: response,
      });
    }
  },

  reducers: {
    globalCountryMapStatus(state, { payload }){
      return {
        ...state,
        GlobalCountryMap: payload,
      };
    },
    getLanguageListStatus(state, { payload }){
      return {
        ...state,
        languageList: payload,
      };
    },
    changeLayoutCollapsed(state, { payload }) {
      return {
        ...state,
        collapsed: payload,
      };
    },
    saveNotices(state, { payload }) {
      return {
        ...state,
        notices: payload,
      };
    },
    saveClearedNotices(state, { payload }) {
      return {
        ...state,
        notices: state.notices.filter(item => item.type !== payload),
      };
    },
    changeSpinning(state, { payload:{spinning} }){
      return {
        ...state,
        spinning,
      };
    }
  },

  subscriptions: {
    setup({ history }) {
      // Subscribe history(url) change, trigger `load` action if pathname is `/`
      return history.listen(({ pathname, search }) => {
        if (typeof window.ga !== 'undefined') {
          window.ga('send', 'pageview', pathname + search);
        }
      });
    },
  },
};

import { messList, messTypes,messStatuses,messInfo,feedTypes,feedList,feedRecentList,getMembers,getVersions,feedStatuses,searchUsers,sendTypes } from '@/services/message';
import { stringToMoment,isEmptyObject } from '@/utils/utils';
import { getGlobalCountryMap } from '@/services/api';
import memoizeOne from 'memoize-one';

import cloneDeep from 'lodash/cloneDeep';

export default {
  namespace: 'mess',

  state: {
    data:{list:[]},
    type:{},
    status:{},
    detail:{},
    messInfo:{},
    feedList:{list:[]},
    feedRecentList:[],
    feedTypes:{},
    replyFeedParams:[],
    serviceMember:[],
    versions:[],
    feedStatuses:{},
    searchUsers:[],
    searchUsersTel:[],
    sendTypes:{},
  },

  effects: {
    *sendTypes({ payload }, { call, put }) {
      const response = yield call(sendTypes, payload);
      yield put({
        type: 'sendTypes/reducer',
        payload: response,
      });
    },
    *getSearchUsers({ payload }, { call, put }) {
      const response = yield call(searchUsers, payload);
      yield put({
        type: 'searchUsers/reducer',
        payload: response,
      });
    },
    *getSearchUsersTel({ payload }, { call, put }) {
      const response = yield call(searchUsers, payload);
      yield put({
        type: 'searchUsersTel/reducer',
        payload: response,
      });
    },
    *getFeedStatuses({ payload }, { call, put }) {
      const response = yield call(feedStatuses, payload);
      yield put({
        type: 'feedStatuses/reducer',
        payload: response,
      });
    },
    *getVersions({ payload }, { call, put }) {
      const response = yield call(getVersions, payload);
      yield put({
        type: 'getVersions/reducer',
        payload: response,
      });
    },
    *getServiceMember({ payload }, { call, put }) {
      const response = yield call(getMembers, payload);
      yield put({
        type: 'getMembers/reducer',
        payload: response,
      });
    },
    *getList({ payload }, { call, put }) {
      const response = yield call(messList, payload);
      yield put({
        type: 'getList/reducer',
        payload: response,
      });
    },
    *messTypes({ payload }, { call, put }) {
      const response = yield call(messTypes, payload);
      yield put({
        type: 'messTypes/reducer',
        payload: response,
      });
    },
    *messStatuses({ payload }, { call, put }) {
      const response = yield call(messStatuses, payload);
      yield put({
        type: 'messStatuses/reducer',
        payload: response,
      });
    },
    *messInfo({ payload }, { call, put }) {
      const response = yield call(messInfo, payload);
      yield put({
        type: 'messInfo/reducer',
        payload: response,
      });
      return Promise.resolve(response);
    },
    *feedTypes({ payload }, { call, put }) {
      const response = yield call(feedTypes, payload);
      yield put({
        type: 'feedTypes/reducer',
        payload: response,
      });
    },
    *feedList({ payload }, { call, put }) {
      const response = yield call(feedList, payload);
      yield put({
        type: 'feedList/reducer',
        payload: response,
      });
    },
    *feedRecentList({ payload }, { call, put }) {
      const response = yield call(feedRecentList, payload);
      yield put({
        type: 'feedRecentList/reducer',
        payload: response,
      });
    },
    *feedGlobalCountryMap({ payload }, { call, put }) {
      const response = yield call(feedRecentList, payload);
      yield put({
        type: 'feedRecentList/reducer',
        payload: response,
      });
    },
  },

  reducers: {
    
    ['sendTypes/reducer'](state, { payload }) {
      if (!payload||payload.code!=0) {
        return {
          ...state,
        };
      }
      return {
        ...state,
        sendTypes: payload.data,
      }
    },
    ['searchUsersTel/reducer'](state, { payload }) {
      if (!payload||payload.code!=0) {
        return {
          ...state,
        };
      }
      return {
        ...state,
        searchUsersTel: isEmptyObject(payload.data)?[]:payload.data,
      };
    },
    ['searchUsers/reducer'](state, { payload }) {
      if (!payload||payload.code!=0) {
        return {
          ...state,
        };
      }
      return {
        ...state,
        searchUsers: isEmptyObject(payload.data)?[]:payload.data,
      };
    },
    ['feedStatuses/reducer'](state, { payload }) {
      if (!payload||payload.code!=0) {
        return {
          ...state,
        };
      }
      return {
        ...state,
        feedStatuses: payload.data,
      };
    },
    ['getVersions/reducer'](state, { payload }) {
      if (!payload||payload.code!=0) {
        return {
          ...state,
        };
      }
      return {
        ...state,
        versions: payload.data,
      };
    },
    ['getMembers/reducer'](state, { payload }) {
      if (!payload||payload.code!=0) {
        return {
          ...state,
        };
      }
      return {
        ...state,
        serviceMember: payload.data,
      };
    },

    addReplyParamsReducer(state, { payload }){
      // message_type 0,1,2,3
        const {replyFeedParams}= state;
        let params = cloneDeep(replyFeedParams);
        const refer = replyFeedParams.findIndex((val)=>{
                     return payload.message_type==val.message_type
                })
        const referNoText = replyFeedParams.findIndex((val)=>{
                  return 0!=val.message_type
             })
          if(refer>-1){
            params[refer]=payload;
          }else{
            if(payload.message_type!=0&&referNoText>-1){
              replyFeedParams[referNoText]=payload
            }else{
              params = [...params,payload];
            }
          }
        return {
          ...state,
          replyFeedParams: params
        };
    },
    rmReplyParamsReducer(state, { payload }){
      const {replyFeedParams}= state;
      if(Object.prototype.toString.call(payload)==="[object Array]"){
        return {...state,
                replyFeedParams:[]
              }
      }
      return {
        ...state,
        replyFeedParams: replyFeedParams.filter((item)=>{
                    return payload.message_type!==item.message_type
        })
      };
    },
    ['feedList/reducer'](state, { payload }) {
      if (!payload||payload.code!=0) {
        return {
          ...state,
        };
      }
      return {
        ...state,
        feedList: payload.data,
      };
    },
    ['feedTypes/reducer'](state, { payload }) {
      if (!payload||payload.code!=0) {
        return {
          ...state,
        };
      }
      return {
        ...state,
        feedTypes: payload.data,
      };
    },
    ['feedRecentList/reducer'](state, { payload }) {
      if (!payload||payload.code!=0) {
        return {
          ...state,
        };
      }
      return {
        ...state,
        feedRecentList: payload.data,
      };
    },
    ['getList/reducer'](state, { payload }) {
      if (!payload||payload.code!=0) {
        return {
          ...state,
        };
      }
      return {
        ...state,
        data: payload.data,
      };
    },
  ['messTypes/reducer'](state, { payload }) {
    if (!payload||payload.code!=0) {
      return {
        ...state,
      };
    }
    return {
      ...state,
      type:payload.data,
    };
  },
  ['messStatuses/reducer'](state, { payload }) {
    if (!payload||payload.code!=0) {
      return {
        ...state,
      };
    }
    return {
      ...state,
      status: payload.data,
    };
  },
  ['messInfo/reducer'](state, { payload }) {
    if (!payload||payload.code!=0) {
      return {
        ...state,
      };
    }
    return {
      ...state,
      messInfo: stringToMoment(payload.data),
    };
  },
  rmMessInfo(state, { payload }){
    return {
      ...state,
      messInfo: [],
    }
  },
  messageEdit(state, { payload }){
    return {
      ...state,
      messInfo: payload,
    }
  }
  }
};

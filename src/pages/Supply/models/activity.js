import * as sactivity from '@/services/activity';
import _ from 'lodash'

export default {
  namespace: 'activity',

  state: {
    data: { page: 1, total_page: 1, list: [],total_count:0 },
    lineList:{},
    statusList:{},
    xList:[],
    pv:[],uv:[],rate:[],
    materialCateList:{}
  },

  effects: {
    *getList({ payload }, { call, put }) {
      const response = yield call(sactivity.getList, payload);
      yield put({
        type: 'getActivityList',
        payload: response,
      });
    },
    *getLineList({ payload }, { call, put }) {
      const response = yield call(sactivity.getLineList, payload);
      yield put({
        type: 'getLineListStatus',
        payload: response,
      });
    },
    *getStatusList({ payload }, { call, put }) {
      const response = yield call(sactivity.getStatusList, payload);
      yield put({
        type: 'getStatus',
        payload: response,
      });
    },
    *getMaterialStat({ payload }, { call, put }) {
      const response = yield call(sactivity.getMaterialStat, payload);
      yield put({
        type: 'getMaterialStatus',
        payload: response,
      });
    },
    *getMaterialCateList({ payload }, { call, put }) {
      const response = yield call(sactivity.getMaterialCateList, payload);
      yield put({
        type: 'materialStatus',
        payload: response,
      });
    },
  },

  reducers: {
    materialStatus(state, { payload }){
      if (!payload) {
        return {
          ...state,
        };
      }
      return {
        ...state,
        materialCateList:payload.data,
      }
    },
    getActivityList(state, { payload }) {
      if (!payload) {
        return {
          ...state,
        };
      }
      return {
        ...state,
        data:payload.data,
      };
    },
    getLineListStatus(state, { payload }) {
      if (!payload) {
        return {
          ...state,
        };
      }
      return {
        ...state,
        lineList:payload.data,
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
        statusList:payload.data,
      };
    },
    getMaterialStatus(state,{payload}) {
      // let payload ={
      //   data:{
      //     xList:[1,2],
      //     yList:{
      //       pv:[parseInt(Math.random(10)*100),3],
      //       uv:[10,22],
      //       rate:[11,34]
      //     }
      //   }}

      if (!payload) {
        return {
          ...state,
        };
      }
      let xList=[];let pv=[];let uv=[];let rate=[];
      const xListLen = payload.data.xList.length;
      if(xListLen>0&&xListLen<7){
          xList=['','','','','','',''];
          pv=['','','','','','',''];
          uv=['','','','','','',''];
          rate=['','','','','','',''];
          if(xListLen%2){
            xList.splice((7-xListLen)/2,xListLen,...payload.data.xList);
            pv.splice((7-xListLen)/2,xListLen,...payload.data.yList.pv)
            uv.splice((7-xListLen)/2,xListLen,...payload.data.yList.uv)
            rate.splice((7-xListLen)/2,xListLen,...payload.data.yList.rate)
          }else{
            xList=['','','','','','','',''];
            pv=['','','','','','','',''];
            uv=['','','','','','','',''];
            rate=['','','','','','','',''];
            xList.splice((8-xListLen)/2,xListLen,...payload.data.xList);
            pv.splice((8-xListLen)/2,xListLen,...payload.data.yList.pv)
            uv.splice((8-xListLen)/2,xListLen,...payload.data.yList.uv)
            rate.splice((8-xListLen)/2,xListLen,...payload.data.yList.rate)
          }
      }else{
        xList=payload.data.xList;
        pv=payload.data.yList.pv;
        uv=payload.data.yList.uv;
        rate=payload.data.yList.rate;
      }
      return {
        ...state,
        xList,
        pv,
        uv,
        rate
      };
    },
  },
};

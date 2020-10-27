
import {templateList,
        templateStatusMap,
        templateModify,
        templateAdd,
        templateStatusSet,
        templateDelete
      } from '../service';

export default {
  namespace:'keyword',
  state: {
    data: { total_page: 1, list: [],total_count:0 },
    detail:{},
    status:{},
    filters:{page: 1,page_size:20},
    model:true,
  },
  reducers:{
    getList:(state, { payload }) => {
      return {...state,...payload};
    },
    getFilters:(state, {payload:{filters}})=>{
      return {...state,filters};
    },
    getStatus:(state,{ payload:{status} }) => {
      return {...state,status};
    },
    changeShowModel:(state,{ payload:{model} }) => {
      return {...state,model};
    },
    detailModify:(state,{ payload:{detail} }) => {
      return {...state,detail};
    },
  },
  effects:{
   * detailEffect({ payload: detail }, { call, put }){
      yield put({ type: 'detailModify' ,payload:{detail}})
      return true
    },
   * listEffect({ payload: values }, { call, put }){
      const res = yield call(templateList, values);
      if (res && res.code === 0) {
        const {data}= res;
        yield put({ type: 'getList',payload:{data} })
      }
    },
    * statusEffect({ payload }, { call, put }){
      const res = yield call(templateStatusMap);
      if (res && res.code === 0) {
         const {data}= res;
          yield put({ type: 'getStatus',payload:{status:data} })
      }
    },
    * Filters({ payload: filters }, { call, put }){
      yield put({ type: 'getFilters' ,payload:{filters}})
      return filters
    },
    * ShowModel({ payload: model }, { call, put }){
      yield put({ type: 'changeShowModel' ,payload:{model}})
      return model
    },

    * addElement({ payload: value }, { call, put }){
      const res = yield call(templateAdd, value);
      if (res && res.code === 0) {
        return true
      }
      return false
    },
    * EditElement({ payload: value }, { call, put }){
      const res = yield call(templateModify, value);
      if (res && res.code === 0) {
        return true
      }
      return false
    },
    * statusElement({ payload: value }, { call, put }){
      const res = yield call(templateStatusSet, value);
      if (res && res.code === 0) {
        return true
      }
      return false
    },
    * delElement({ payload: value }, { call, put }){
      const res = yield call(templateDelete, value);
      if (res && res.code === 0) {
        return true
      }
      return false
    }

    // * createEffect({ payload: values }, { call, put }){
    //     const result = yield call(templateAdd, values);
    //     if (result && result.code === 0) {
    //       yield put({ type: 'getList' })
    //     }
    // }
  }
}
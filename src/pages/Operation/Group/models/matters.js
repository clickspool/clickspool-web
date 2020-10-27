import { 
    groupMaterialStatusMap, //群组素材：状态枚举
    groupMaterialList,//群组素材列表
    groupTagMap, //群组标签：标签枚举
    groupMaterialInfo, //群组素材：详情
    groupMaterialAdd, //群组素材添加
    groupMaterialModify,//群组素材编辑
    groupMaterialStatusSet, //群组素材：上下架
    groupMaterialTypes, //群组素材：类型枚举
    groupMaterialDelete,
    groupMaterialIsSendMap,
    groupWaitingMaterialList
} from '../services/group';

const groupMaterialfn = {
    groupMaterialList,
    groupMaterialAdd,
    groupMaterialModify,
    groupMaterialStatusSet,
    groupMaterialDelete
};

function bindFn(name,params){
    return groupMaterialfn[name](params);
}

export default {
    namespace: 'matters',
    state: {
        data: {},
        materialStatusMap:{},
        groupTagMap:{},
        materialTypes:{},
        is_send:{}
    },
    reducers: {
        spin(state, { payload:spinShow}) {
            return { ...state, spinShow };
        },
        data(state, { payload:{data} }){
            return { ...state,data};
        },
        status(state, { payload:materialStatusMap}){
            return { ...state, materialStatusMap };
        },
        tag(state, { payload:groupTagMap }){
            return { ...state, groupTagMap };
        },
        type(state, {payload:materialTypes }){
            return { ...state, materialTypes };
        },
        is_send(state, {payload:is_send }){
            return { ...state, is_send };
        },
    },
    effects: {
        *updateEffects({ payload }, { call, put,select }) {
            const {params,fn} = payload;
            const res = yield bindFn(fn,{ ...params });
            return Promise.resolve(res);
        },
        *listEffects({ payload }, { call, put,select }) {
            let res = {};
            if(payload.selectType==1){
                res = yield bindFn('groupMaterialList',{ ...payload });
            }else{
                res = yield call(groupWaitingMaterialList,{...payload});
            }
            if(!res.code){
                yield put({
                    type: 'data',
                    payload: {...res}
                });
            }
        },
        *statusEffects({ payload }, { call, put }) {
            const res = yield call(groupMaterialStatusMap);
            if(res.code==0){
                yield put({
                    type: 'status',
                    payload: res.data
                });
            }
        },
        *tagEffects({ payload }, { call, put }) {
            const res = yield call(groupTagMap);
            if(res.code==0){
                yield put({
                    type: 'tag',
                    payload: res.data
                });
            }
        },
        *typesEffects({ payload }, { call, put }) {
            const res = yield call(groupMaterialTypes);
            if(res.code==0){
                yield put({
                    type: 'type',
                    payload: res.data
                });
            }
        },
        *isSendEffects({ payload }, { call, put }) {
            const res = yield call(groupMaterialIsSendMap);
            if(res.code==0){
                yield put({
                    type: 'is_send',
                    payload: res.data
                });
            }
        },
    }
}
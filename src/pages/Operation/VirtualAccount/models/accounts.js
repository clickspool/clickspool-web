import { fetch, create, deleteAccount, patch, getUserSexList, getChargeSetting, getTagsMap,getUsercountryMap, getUserRegionMap, getUserTypesMap, getUserTagInterestMap,

  updateUserGiftStat, //新增或更新礼物
  getUserGiftStat, //查询礼物
} from '../services/accounts';
import { getGlobalCountryMap } from '@/services/api';
import { fetchTagMap } from '../../Apply/services/apply';
export default {
  state: {
    list: [],
    total: null,
    pages: null,
    page: null,
    pageSize: 20,
    loading: false,
    giftList:[],

  },
  reducers: {
    // fetchGift(state, { payload }){
    //   return { ...state, ...payload };
    // },
    updateState: (state, { payload }) => {
      return { ...state, ...payload };
    },
    save(state, { payload: { list, total, pages } }) {
      return { ...state, list, total, pages };
    },
    saveSingle(state, { payload: { item } }) {
      let { list } = { ...state };
      list = list.map(el => {
        if (el.id === item.id) {
          return item;
        }
        return el;
      });
      return { ...state, list }
    },
    deleteUpdate(state, { payload: { deletedId } }) {
      let { list } = state;
      list = list.filter(item => {
        return item.id != deletedId
      });
      return { ...state, list }
    },
    changePageSize(state, { payload: { page, pageSize } }) {
      return { ...state, page, pageSize };
    },
  },
  effects: {
    * fetchGiftList({ payload: values }, { call, put }) {
      const result = yield call(getUserGiftStat, values);
      if (result && result.code === 0) {
        let giftList = Object.keys(result.data).reduce(
        (pre,curr)=>{
          pre.push({stat_key:curr,num:result.data[curr]['num']})
          return pre;
        },[])
        yield put({ 
          type: 'updateState',
          payload: { giftList }
        })
      }
      return new Promise((resolve,reject)=>{
        resolve(result);
      })
    },

    * uploadGift({ payload: values }, { call, put }) {
      const result = yield call(updateUserGiftStat, values);
      if (result && result.code === 0) {
        yield put({ type: 'fetchGiftList' , payload:values})
        // return result;
      }
      return new Promise((resolve,reject)=>{
        resolve(result);
      })
    },

    * create({ payload: values }, { call, put }) {
      const result = yield call(create, values);
      if (result && result.code === 0) {
        yield put({ type: 'reload' })
        return result;
      }
    },
    * delete({ payload: { id } }, { call, put }) {
      const result = yield call(deleteAccount, { user_id: id });
      if (result && result.code === 0) {
        yield put({
          type: 'deleteUpdate',
          payload: { deletedId: id }
        });
      }
    },
    * patch({ payload: { params, id } }, { call, put }) {
      console.info('patch==', params);
      const result = yield call(patch, params);
      if (result && result.code === 0) {
        yield put({ type: 'fetchSingle', payload: { id } });
        return result;
      }
    },
    * fetch({ payload: { ...values } }, { call, put }) {
      const { page } = values;
      // console.info('fetch_values', values, page);
      const { data: { list, total_count, total_page } } = yield call(fetch, values);

      page && (yield put({
        type: 'updateState',
        payload: {
          page
        }
      }));
      yield put({
        type: 'save',
        payload: {
          list,
          total: total_count,
          pages: total_page,
        },
      });
    },
    * fetchSingle({ payload: { id } }, { call, put }) {
      const data = yield call(fetch, { id });
      // return console.info('fetchSingle', data);
      if (data && data.code === 0) {
        const item = data.data.list.filter(item => item.id == id)[0];
        yield put({
          type: 'saveSingle',
          payload: { item }
        });
      }
    },
    * reload(action, { put, select }) {
      yield put({ type: 'fetch' });
    },
    * fetchChargeSetting(action, { call, put }) {
      const res = yield call(getChargeSetting);
      if(res.code == 0){
        const {charge_list_message, charge_list_video, charge_list_voice} = res.data;
        let messageMap = new Map();
        let videoMap = new Map();
        let voiceMap = new Map();
        charge_list_message.map((item)=>{
          messageMap.set(item,item)
        })
        charge_list_video.map((item)=>{
          videoMap.set(item,item)
        })
        charge_list_voice.map((item)=>{
          voiceMap.set(item,item)
        })

        yield put({
          type: 'updateState',
          payload: {
            videoMap,
            messageMap,
            voiceMap
          }
        });
      }

    },
    * fetchGenders(action, { call, put }) {
      const data = yield call(getUserSexList);
     
      const genderList = data.data;
      let genders = new Map();
      if (typeof genders === 'object') {
        Object.keys(genderList).map(key => {
          genders.set(key, genderList[key]);
        })
      }

      yield put({
        type: 'updateState',
        payload: {
          genders
        }
      });
    },
    * fetchCountryList(action, { put, call }) {
      const data = yield call(getGlobalCountryMap);
      const countryList = data.data;
      const nation = new Map();
      if (Array.isArray(countryList)) {
        countryList.map(country => {
          nation.set(country.id, country.name);
        });
      }
      yield put({
        type: 'updateState',
        payload: {
          nation
        }
      });
    },
    * getUserTagInterestMap(action, { put, call }) {
      const data = yield call(getUserTagInterestMap);
      const tagList = data.data;
      const user_interests = new Map();
      if (Array.isArray(tagList)) {
        tagList.map(tag => {
          user_interests.set(tag.id, tag.name);
        });
      }
      yield put({
        type: 'updateState',
        payload: {
          user_interests
        }
      });
  },
  * fetchTagsMap(action, { put, call }) {
    const data = yield call(getTagsMap);
    const tagList = data.data;
    const tagsMap = new Map();
    if (Array.isArray(tagList)) {
      tagList.map(tag => {
        tagsMap.set(tag.id, tag.name);
      });
    }
    yield put({
      type: 'updateState',
      payload: {
        tagsMap
      }
    });
},
  * fetchTserTypesMap(action, { put, call }) {
    const result = yield call(getUserTypesMap);
    const userTypesMap = result.data||{};
    yield put({
      type: 'updateState',
      payload: {
        userTypesMap
      }
    });
  }
},
  subscriptions: {
    setup({ dispatch, history }) {
      return history.listen(({ pathname, search }) => {
        // const query = queryString.parse(search);
        if (pathname === '/operation/user/virtualaccount') {
          // dispatch({ type: 'fetch', payload: query });
          dispatch({ type: 'fetch' });
          dispatch({ type: 'fetchGenders' });
          dispatch({ type: 'fetchCountryList' });
          dispatch({ type: 'getUserTagInterestMap' });
          dispatch({ type: 'fetchTserTypesMap' });
          dispatch({ type: 'fetchChargeSetting' });
          dispatch({ type: 'fetchTagsMap' });
        }
      });
    },
  },
}
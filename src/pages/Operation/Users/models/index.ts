import { getList, setMoney, setUserType, typeMap, getUserTypesMap, batchSetIdentity,updateUser,updateBackgroundTime, updateLastActiveAt } from '../services';
import { getUserSexList, getChargeSetting, getTagsMap, getUsercountryMap, getUserRegionMap, getUserTypesMap, getUserTagInterestMap } from '@/pages/Operation/VirtualAccount/services/accounts.js';

import { getGlobalCountryMap } from '@/services/api';
/*
 * @Author: senla.liu
 * @Date: 2020-01-17 14:07:04
 * @LastEditors  : senla.liu
 * @LastEditTime : 2020-01-17 15:34:04
 * @FilePath: \\xchat-web/src/pages/Operation/Users/models/index.ts
 */

export default {
	namespace: 'users_info',
	state: {
		data: { page: 1, total_count: 1, list: [] },
		userTypesMap: {},
		globalCountryMap: []
	},
	reducers: {
		globalCountryMapReducer(state, { payload }) {
			if (!payload) {
				return {
					...state,
				};
			}
			return {
				...state,
				globalCountryMap: payload.data,
			}
		},
		userListReducer(state, { payload }) {
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
		typeMapReducer(state, { payload }) {
			return {
				...state,
				typeMap: payload.data,
			};
		},
		userTypesMapReducer(state, { payload }) {
			console.log(payload, 'payload')
			return {
				...state,
				userTypesMap: payload.data,
			};
		},
		updateState: (state, { payload }) => {
			return { ...state, ...payload };
		},
	},
	effects: {
		*getUserList({ payload }, { call, put }) {
			const response = yield call(getList, payload);
			yield put({
				type: 'userListReducer',
				payload: response,
			});
		},
		*getTypeMap({ payload }, { call, put }) {
			const response = yield call(typeMap, payload);
			yield put({
				type: 'typeMapReducer',
				payload: response,
			});
		},
		*setUserType({ payload }, { call, put }) {
			const response = yield call(setUserType, payload);

			// const response = yield call( getList, payload);
			yield put({
				type: 'userListReducer',
				payload: response,
			});
		},
		*setMoney({ payload }, { call, put }) {
			const response = yield call(setMoney, payload);
			// const response = yield call( getList, payload);
			yield put({
				type: 'userListReducer',
				payload: response,
			});
		},
		*getUserTypesMap({ payload }, { call, put }) {
			const response = yield call(getUserTypesMap, payload);
			// const response = yield call( getList, payload);
			yield put({
				type: 'userTypesMapReducer',
				payload: response,
			});
		},
		*getGlobalCountryMap({ payload }, { call, put }) {
			const response = yield call(getGlobalCountryMap, payload);
			// const response = yield call( getList, payload);
			yield put({
				type: 'globalCountryMapReducer',
				payload: response,
			});
		},
		* batchSetIdentity({ payload }, { call, put }) {
			const res = yield call(batchSetIdentity, { ...payload });
			return new Promise((resolve) => {
				resolve(res);
			})
		},
		* updateLastActiveAt({ payload }, { call, put }) {
			const res = yield call(updateLastActiveAt, { ...payload });
			return new Promise((resolve) => {
				resolve(res);
			})
		},
		
		
		* updateUser({ payload }, { call, put }) {
			console.log(payload,'payload------');
			const res = yield call(updateUser, payload.params);
			// const { code } = res;
			// if (!code) {
			//   yield put({
			//     type: 'fetch'
			//   })
			// }
			return new Promise((resolve) => {
				resolve(res);
			})
		},
		* updateBackgroundTime({ payload }, { call, put }) {
			console.log(payload,'payload------');
			const res = yield call(updateBackgroundTime, payload);
			// const { code } = res;
			// if (!code) {
			//   yield put({
			//     type: 'fetch'
			//   })
			// }
			return new Promise((resolve) => {
				resolve(res);
			})
		},
		
		* fetchChargeSetting(action, { call, put }) {
			const res = yield call(getChargeSetting);
			if (res.code == 0) {
				const { charge_list_message, charge_list_video, charge_list_voice } = res.data;
				let messageMap = new Map();
				let videoMap = new Map();
				let voiceMap = new Map();
				charge_list_message.map((item) => {
					messageMap.set(item, item)
				})
				charge_list_video.map((item) => {
					videoMap.set(item, item)
				})
				charge_list_voice.map((item) => {
					voiceMap.set(item, item)
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
			const userTypesMap = result.data || {};
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
        if (pathname === '/operation/user/list') {
          // dispatch({ type: 'fetch', payload: query });
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
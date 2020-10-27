import { getList,productMap, statusMap, refund, modify,payTypes } from '../services';

/*
 * @Author: senla.liu
 * @Date: 2020-01-17 14:07:04
 * @LastEditors  : senla.liu
 * @LastEditTime : 2020-01-19 20:38:18
 * @FilePath: \\xchat-web/src/pages/Operation/Users/models/index.ts
 */

export default {
	namespace: 'member',
 	state: {
		data:	{ page: 1, total_count: 1, list: [] },
		productMap:	[],
		statusMap:{}
 	},
 	reducers: {
		userListReducer(state, { payload }) {
			if (!payload) {
				return {
					...state,
				};
			}
			const list = payload.data.list.map((item,index)=>{
				return {...item,
					original:(item.feed_info.content||'').length>30?`${item.feed_info.content}~~收起`:item.feed_info.content,
					oimt:(item.feed_info.content||'').length>30?`${item.feed_info.content.substring(0,30)}...展开`:item.feed_info.content}
			});
			return {
				...state,
				data: {...payload.data,list},
			};
		},
		productMapReducer(state, { payload }) {
			return {
				...state,
				productMap: payload.data,
			};
		},
		statusMapReducer(state, { payload }) {
			return {
				...state,
				statusMap: payload.data,
			};
		},
		payTypesReducer(state, { payload }) {
			return {
				...state,
				payTypes: payload.data,
			};
		},
		
 	},
 	effects: {
		*fetch({ payload }, { call, put }) {
			const response = yield call( getList, payload);
			if (response && response.data) {
				yield put({
					type: 'userListReducer',
					payload: response,
				});
			}
		},
		*productMap({ payload }, { call, put }) {
			const response = yield call( productMap, payload);
			yield put({
					type: 'productMapReducer',
					payload: response,
			})
		},
		*statusMap({ payload }, { call, put }) {
				const response = yield call( statusMap, payload);
				yield put({
						type: 'statusMapReducer',
						payload: response,
				});
			},
			*payTypes({ payload }, { call, put }) {
				const response = yield call( payTypes, payload);
				yield put({
						type: 'payTypesReducer',
						payload: response,
				});
			}
	 }
	}

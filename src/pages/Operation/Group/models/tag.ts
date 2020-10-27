import queryString from 'query-string';

//@ts-ignore
import { create, fetch, patch, patchStatus, deleteTag, groupTagRecommendMap } from '../services/tag.ts';
export default {
  state: {
    list: [],
    total: null,
    pages: null,
    page: null,
    pageSize: 20
  },
  reducers: {
    save(state, { payload: { list, total, pages, page } }) {
      return { ...state, list, total, pages, page };
    },
    saveSingle(state, { payload: { item } }) {
      let { list = [] } = { ...state };
      list = list.map(el => {
        if (el.id === item.id) {
          return item;
        }
        return el;
      });
      return { ...state, list }
    },
    changePageSize(state, { payload: { page, pageSize } }) {
      return { ...state, page, pageSize };
    },
    deleteUpdate(state, { payload: { deletedId } }) {
      let { list } = state;
      list = list.filter(item => {
        return item.id != deletedId
      });
      return { ...state, list }
    },
  },
  effects: {
    *create({ payload: values }, { call, put }) {
      const result = yield call(create, values);
      console.info('debug-tag-create', { result, code: result.code, codeType: typeof result.code });
      if (result && result.code === 0) {
        yield put({ type: 'reload' })
        return result;
      }
    },
    * delete({ payload: { id } }, { call, put }) {
      const result = yield call(deleteTag, { id, status: 1 });
      if (result && result.code === 0) {
        yield put({
          type: 'deleteUpdate',
          payload: { deletedId: id }
        });
      }
    },
    * patch({ payload: { params, id } }, { call, put }) {
      // return console.info('patch_params__!', { params, id });
      const result = yield call(patch, params);
      if (result && result.code === 0) {
        yield put({ type: 'fetchSingle', payload: { id } });
        return result;
      }
    },
    *patchStatus({ payload: { id, status } }, { call, put }) {
      const result = yield call(patchStatus, { status, id });
      if (result && result.code === 0) {
        yield put({ type: 'fetchSingle', payload: { id } })
        return result;
      }
    },
    * fetch({ payload: { ...values } }, { call, put }) {
      const { page } = values;
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
    *fetchSingle({ payload: { id } }, { call, put }) {
      // return console.info('fetchSingle__', payload);
      const data = yield call(fetch, { id });
      if (data.code !== 0) { return }
      const item = data.data.list.filter(item => item.id == id)[0];
      yield put({
        type: 'saveSingle',
        payload: {
          item
        }
      });
    },
    * reload(action, { put, select }) {
      yield put({ type: 'fetch' });
    },
    // *fetchRecommand(payload, { call, put }) {
    //   const { data } = yield call(groupTagRecommendMap);
    //   // yield put({
    //   //   type: 'saveTagRecommand',
    //   //   payload: {
    //   //     tags: data
    //   //   }
    //   // });
    // },
  },
  subscriptions: {
    setup({ dispatch, history }) {
      return history.listen(({ pathname, search }) => {
        const query = queryString.parse(search);
        console.info('tag_model_', { pathname, search });
        if (pathname === '/operation/group/tag') {
          dispatch({ type: 'fetch', payload: query });
        }
      });
    },
  },
}
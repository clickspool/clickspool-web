import queryString from 'query-string';
import { create, fetch, patch, patchStatus } from '../services/categories';
export default {
  state: {
    list: [],
    total: null,
    pages: null,
    page: null,
    pageSize: 20
  },
  reducers: {
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
    changePageSize(state, { payload: { page, pageSize } }) {
      return { ...state, page, pageSize };
    },
  },
  effects: {
    *create({ payload: values }, { call, put }) {
      const result = yield call(create, values);
      if (result && result.code === 0) {
        yield put({ type: 'reload' })
        return result;
      }
    },
    *patch({ payload: { id, values } }, { call, put }) {
      const result = yield call(patch, { ...values, id });
      if (result && result.code === 0) {
        yield put({ type: 'reload' })
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
    *fetch({ payload: { page = 1, pageSize = 20 } }, { call, put }) {
      // console.info('*fetch_catories', page, pageSize);
      const { data: { list, total_count, total_page } } = yield call(fetch, { page, pageSize });
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
      const data = yield call(fetch, { id });
      // return console.info('fetchSingle_', data);
      if (data.code !== 0) { return }
      const item = data.data.list.filter(item => item.id == id)[0];
      yield put({
        type: 'saveSingle',
        payload: {
          item
        }
      });
    },
    *reload(action, { put, select }) {
      const { page, pageSize: page_size } = yield select(state => {
        return {
          page: state.categories.page,
          pageSize: state.categories.pageSize
        }
      });
      yield put({ type: 'fetch', payload: { page, page_size } });
    },
  },
  subscriptions: {
    setup({ dispatch, history }) {
      return history.listen(({ pathname, search }) => {
        const query = queryString.parse(search);
        if (pathname === '/operation/videoscene/category' || pathname === '/operation/videoscene/tools') {
          dispatch({ type: 'fetch', payload: query });
        }
      });
    },
  },
}
import queryString from 'query-string';
import { create, fetch, patch, patchStatus, deleteCate, fetchStatusEnum, batchStatusSet } from '../services/audit';
export default {
  state: {
    list: [],
    total: null,
    pages: null,
    page: null,
    pageSize: 20
  },
  reducers: {
    updateState: (state, { payload }) => {
      return { ...state, ...payload };
    },
    save(state, { payload: { list, total, pages } }) {
      return { ...state, list, total, pages };
    },
    saveStatusEnum(state, { payload: { data } }) {
      const statusMap = new Map(Object.keys(data).map((key) => {
        return [key, data[key]];
      }));
      // return { ...state, list, total, pages };
      return { ...state, statusMap };
    },
    saveSingle(state, { payload: { item } }) {
      let { list }: any = { ...state };
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
    batchSaveStatus(state, { payload: { ids, status } }) {
      let { list = [] } = { ...state };
      console.info('status__', status);
      list = list.map(item => {
        if (ids.indexOf(item.id) > -1) {
          item.status = status;
        }
        return item;
      });
      return { ...state, list };
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
    *patch({ payload: values }, { call, put }) {
      console.info('patch_call_params', values);
      const result = yield call(patch, values);
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
    *batchModify({ payload: { id, status } }, { call, put }) {
      const result = yield call(batchStatusSet, { status, ids: id });
      if (result && result.code === 0) {
        yield put({ type: 'batchSaveStatus', payload: { ids: id, status } })
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
    *fetchStatusEnum(action, { call, put }) {
      const { data } = yield call(fetchStatusEnum);
      yield put({
        type: 'saveStatusEnum',
        payload: { data }
      });
    },
    *fetchSingle({ payload: { id } }, { call, put }) {
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
    * delete({ payload: { id } }, { call, put }) {
      yield call(deleteCate, { id });
      yield put({
        type: 'deleteUpdate',
        payload: { deletedId: id }
      });
    },
    *reload(action, { put, select }) {
      const { page, pageSize: page_size } = yield select(state => {
        return {
          page: state.giftCategories.page,
          pageSize: state.giftCategories.pageSize
        }
      });
      yield put({ type: 'fetch', payload: { page, page_size } });
    },
  },
  subscriptions: {
    setup({ dispatch, history }) {
      return history.listen(({ pathname, search }) => {
        const query = queryString.parse(search);
        if (pathname === '/operation/user/audit') {
          dispatch({ type: 'fetch', payload: query });
          dispatch({ type: 'fetchStatusEnum' });
        }
      });
    },
  },
}
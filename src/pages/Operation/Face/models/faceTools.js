import queryString from 'query-string';
import { create, fetch, patch, fetchCates, fetchStatuses, patchStatus, batchModify, deleteTool, fetchClients } from '../services/tools';
export default {
  state: {
    list: [],
    total: null,
    pages: null,
    page: null,
    pageSize: 20,
    cates: [],
    statuses: ["0", "1"],
    positions: new Map(),
    clients: new Map(),
    loading: false,
    filter: {}, // 搜索条件
  },
  reducers: {
    updateState: (state, { payload: { ...params } }) => {
      return { ...state, ...params };
    },
    save(state, { payload: { list, total, pages } }) {
      return { ...state, list, total, pages };
    },
    saveCates(state, { payload: { cates } }) {
      return { ...state, cates };
    },
    saveStatuses(state, { payload: { statuses } }) {
      return { ...state, statuses };
    },
    savePositions(state, { payload: { positions } }) {
      const postionMap = new Map();
      Array.isArray(positions) && positions.map(position => {
        postionMap.set(position.value, position.key);
      });
      return { ...state, positions: postionMap };
    },
    saveClients(state, { payload: { clients } }) {
      const clientMap = new Map();
      Object.keys(clients).map(key => {
        clientMap.set(key, clients[key]);
      });
      return { ...state, clients: clientMap };
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
    batchSaveStatus(state, { payload: { ids, status, failCates } }) {
      let { list } = { ...state };
      list = list.map(item => {
        if (ids.indexOf(item.id) > -1 && failCates.indexOf(item.cate_id) === -1) {
          item.status = status;
        }
        return item;
      });
      return { ...state, list };
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
    * create({ payload: values }, { call, put }) {
      const result = yield call(create, values);
      if (result && result.code === 0) {
        yield put({ type: 'reload' })
        return result;
      }
    },
    * patch({ payload: { params, id } }, { call, put }) {
      // console.info('patch==', values);
      const result = yield call(patch, params);
      if (result && result.code === 0) {
        yield put({ type: 'fetchSingle', payload: { id } });
        return result;
      }
    },
    * patchStatus({ payload: { status, id } }, { call, put }) {
      const result = yield call(patchStatus, { status, id });
      if (result && result.code === 0) {
        yield put({ type: 'fetchSingle', payload: { id } });
        return result;
      }
    },
    * fetchCates(payload, { call, put }) {
      const { data } = yield call(fetchCates);
      // console.info('data.list', data.list);
      yield put({
        type: 'saveCates',
        payload: {
          cates: data.list
        }
      });
    },
    *fetchClients(payload, { call, put }) {
      const { data } = yield call(fetchClients);
      // console.info('fetchPositions', data);
      yield put({
        type: 'saveClients',
        payload: {
          clients: data
        }
      });
    },
    * fetchStatuses(payload, { call, put }) {
      const { data } = yield call(fetchStatuses);
      yield put({
        type: 'saveStatuses',
        payload: {
          statuses: data
        }
      });
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
    * batchModify({ payload: { id, status } }, { call, put }) {
      const { data } = yield call(batchModify, { id, status });
      console.info('data_batchmodify', data);
      yield put({
        type: 'batchSaveStatus',
        payload: {
          ids: id,
          status,
          failCates: Array.isArray(data) && data || []
        }
      });
    },
    * delete({ payload: { id } }, { call, put }) {
      yield call(deleteTool, { id });
      yield put({
        type: 'deleteUpdate',
        payload: { deletedId: id }
      });
    },
    * reload(action, { put, select }) {
      // const { page, pageSize: page_size, filter = {} } = yield select(state => {
      //   const { page, pageSize, filter } = state.tools;
      //   return {
      //     page,
      //     pageSize,
      //     filter
      //   }
      // });
      // // console.info('page__', { page, page_size });
      // yield put({ type: 'fetch', payload: { page, page_size, ...filter } });
      yield put({ type: 'fetch' });
    },
  },
  subscriptions: {
    setup({ dispatch, history }) {
      return history.listen(({ pathname, search }) => {
        const query = queryString.parse(search);
        if (pathname === '/operation/face/tools') {
          dispatch({ type: 'fetch', payload: query });
          dispatch({ type: 'fetchClients' });
          // dispatch({ type: 'fetchCates' });
          // dispatch({ type: 'fetchStatuses' });
        }
      });
    },
  },
}
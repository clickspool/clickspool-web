import queryString from 'query-string';

import { uploadMultiMedia, bookList, bookInfo, chapterInfo, modifyBookInfo, modifyChapterInfo, modifyCopyrightInfo } from '../services';
export default {
  namespace: "book_info",
  state: {
    list: [],
    total: null,
    pages: null,
    page: 1,
    page_size: 20,
    loading: false,
    book_info: {},
    copyright_info: {},
    chapter_info: [],
  },
  reducers: {
    updateState: (state, { payload }) => {
      return { ...state, ...payload };
    },
    save(state, { payload: { list, total, pages } }) {
      return { ...state, list, total, pages };
    },
  },
  effects: {
    // * create({ payload: values }, { call, put }) {
    //   const result = yield call(create, values);
    //   if (result && result.code === 0) {
    //     yield put({ type: 'reload' })
    //   }
    //   return result;
    // },
    // * delete({ payload: { id } }, { call, put }) {
    //   const result = yield call(deleteItem, { id, status: 1 });
    //   if (result && result.code === 0) {
    //     yield put({
    //       type: 'deleteUpdate',
    //       payload: { deletedId: id }
    //     });

    //   }
    //   return result;
    // },
    // * patch({ payload: values }, { call, put }) {
    //   const result = yield call(patch, values);
    //   if (result && result.code === 0) {
    //     yield put({ type: 'reload' });
    //   }
    //   return result;
    // },
    * patchBookInfo({ payload: values }, { call, put, select }) {
      const { code, data } = yield call(bookInfo, values)
      if (code == 0) {
        const { data: { chapter_info, copyright_info, book_info } } = data;
        yield put({
          type: 'updateState',
          payload: {
            chapter_info,
            copyright_info,
            book_info
          }
        })
      }
      return { code, data }
    },
    * uploadMultiMediaHandle({ payload: { multiMedia } }, { call, put, select }) {
      const formData = new FormData();
      formData.append('multiMedia', multiMedia)
      return yield call(uploadMultiMedia, formData)
    },
    * fetch({ payload: values }, { call, put, select }) {
      // tslint:disable-next-line:variable-name
      const page_size = yield select(state => state.book_info.page_size);
      const page = yield select(state => state.book_info.page);
      const { data: { data: list, total_count, total_page } } = yield call(bookList, { page_size, page, ...values });

      // tslint:disable-next-line:no-unused-expression
      ((values || {}).page || page) && (yield put({
        type: 'updateState',
        payload: {
          page: ((values || {}).page || page)
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
    // * patchStatus({ payload: { mid, status } }, { call, put }) {
    //   const result = yield call(patchStatus, { mid, status });
    //   if (result && result.code === 0) {
    //     yield put({ type: 'reload' });
    //   }
    //   return result;
    // },
    // * fetchStatuses(payload, { call, put }) {
    //   const { data } = yield call(fetchStatuses);
    //   yield put({
    //     type: 'updateState',
    //     payload: {
    //       statuses: data
    //     }
    //   });
    // },
    // * fetchTypeMap(payload, { call, put }) {
    //   const { data } = yield call(fetchTypeMap);
    //   yield put({
    //     type: 'updateState',
    //     payload: {
    //       types: data
    //     }
    //   });
    // },
    // * fetchMerchantMap(payload, { call, put }) {
    //   const { data } = yield call(fetchMerchantMap);
    //   yield put({
    //     type: 'updateState',
    //     payload: {
    //       merchantMap: data
    //     }
    //   });
    // },

    * reload(action, { put, select }) {
      yield put({ type: 'fetch' });
    },
  },
  subscriptions: {
    setup({ dispatch, history }) {
      return history.listen(({ pathname, search }) => {
        if (pathname === '/book_management') {
          dispatch({ type: 'fetch' });
        }
      });
    },
  },
}
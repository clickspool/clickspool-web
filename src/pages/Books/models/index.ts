import queryString from 'query-string';

import { bookInfo, bookList, chapterInfo, modifyBookInfo, modifyChapterInfo, modifyCopyrightInfo, uploadMultiMedia } from '../services';
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
    chapter_info: {},
    chapter_list: [],
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
    * patchBookInfo({ payload: values }, { call, put, select }) {
      const { code, data } = yield call(modifyBookInfo, values)
      return { code, data }
    },
    * patchChapterInfo({ payload: values }, { call, put, select }) {
      const { code, data } = yield call(modifyChapterInfo, values)
      return { code, data }
    },
    * patchCopyrightInfo({ payload: values }, { call, put, select }) {
      const { code, data } = yield call(modifyCopyrightInfo, values)
      return { code, data }
    },
    * fetchChapterInfo({ payload: values }, { call, put, select }) {
      // tslint:disable-next-line:variable-name
      const { code, data: chapter_info } = yield call(chapterInfo, values)
      if (code == 0) {
        yield put({
          type: 'updateState',
          payload: {
            chapter_info
          }
        })
      }
      return { code, data: chapter_info }
    },

    * fetchBookInfo({ payload: values }, { call, put, select }) {
      const { code, data } = yield call(bookInfo, values)
      if (code == 0) {
        const { data: { chapter_info: chapter_list, copyright_info, book_info } } = data;
        yield put({
          type: 'updateState',
          payload: {
            chapter_list,
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
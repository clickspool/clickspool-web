
import request from '@/utils/request';

/**
 * 上传
 * @param {*} params 
 */
export async function uploadMultiMedia(params) {
  return request('/admin/upload/uploadMultiMedia', {
    method: 'POST',
    headers: { 'Content-Type': '' },
    body: params
  });
}

/**
 * 书籍列表
 * @param {*} params 
 */
export async function bookList(params) {
  return request('/novel/index/bookList', {
    method: 'get',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: params
  });
}

/**
 * 书籍信息
 * @param {*} params 
 */
 export async function bookInfo(params) {
  return request('/novel/index/bookInfo', {
    method: 'get',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: params
  });
}

/**
 * 章节信息
 * @param {*} params 
 */
 export async function chapterInfo(params) {
  return request('/novel/index/chapterInfo', {
    method: 'get',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: params
  });
}

/**
 * 新增或修改书籍信息
 * @param {*} params 
 */
 export async function modifyBookInfo(params) {
  return request('/novel/index/modifyBookInfo', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: params
  });
}

/**
 * 新增或修改章节信息
 * @param {*} params 
 */
 export async function modifyChapterInfo(params) {
  return request('/novel/index/modifyChapterInfo', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: params
  });
}

/**
 * 新增或修改版权信息
 * @param {*} params 
 */
 export async function modifyCopyrightInfo(params) {
  return request('/novel/index/modifyCopyrightInfo', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: params
  });
}
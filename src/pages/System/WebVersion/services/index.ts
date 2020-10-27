
import request from '@/utils/request';

/**
 * 获取列表
 */
export async function fetch(query) {
  return request('/h5/zip/getList', {
    method: 'GET',
    body: query
  });
}

/**
 * 编辑zip包
 * @param {*} params 
 */
export async function zipModify(params) {
  return request('/h5/zip/zipModify', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: params
  });
}

/**
 * 新增zip包
 * @param {*} params 
 */
export async function zipAdd(params) {
  return request('/h5/zip/zipAdd', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: params
  });
}


/**
 * 上传zip文件
 * @param {*} params 
 */
export async function uploadMultiMedia(params) {
  return request('/admin/upload/uploadMultiMedia', {
    method: 'POST',
    body: params
  });
}


/**
 * 上下架
 * @param {*} params 
 */
export async function statusSet(params) {
  return request('/h5/zip/statusSet', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: params
  });
}

/**
 * 删除
 * @param {*} params 
 */
export async function zipDelete(params) {
  return request('/h5/zip/zipDelete', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: params
  });
}

/**
 * 状态枚举
 * @param {*} params 
 */
export async function statusMap(QUERY) {
  return request('/h5/zip/statusMap', {
    method: 'GET',
    body: QUERY
  });
}

 /**
  * 
  * @param {*} params 
  * 国家枚举
  */
export async function getGlobalCountryMap(params) {
  return request('/admin/config/getGlobalCountryMap', {
    method: 'GET',
  });
}
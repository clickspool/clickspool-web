import request from '@/utils/request';

//活动素材sever

/**
 *
 * @name 列表
 * @param {page:1} param page从1开始
 *
 */
export async function fetch(QUERY) {
  return request('/room/tags/getList', {
    method: 'GET',
    body: QUERY,
  });
}

/**
 * 编辑
 * @param {*} params 
 */
export async function modify(params) {
  return request('/room/tags/modify', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: params
  });
}

/**
 * 新增
 * @param {*} params 
 */
export async function add(params) {
  return request('/room/tags/add', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: params
  });
}

/**
 * 删除
 * @param {*} params 
 */
export async function del(params) {
  return request('/room/tags/delete', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: params
  });
}

/**
 * 上下架
 * @param {*} params 
 */
export async function statusSet(params) {
  return request('/room/tags/statusSet', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: params
  });
}

/**
 * 上下架状态枚举
 * @param {*} params 
 */
export async function statusMap(QUERY) {
  return request('/room/tags/statusMap', {
    method: 'GET',
    body: QUERY,
  });
}

/**
 * 上传文件
 * @param {*} params 
 */
export async function uploadMultiMedia(params) {
  return request('/admin/upload/uploadMultiMedia', {
    method: 'POST',
    body: params
  });
}

/**
 * 设置房间标签
 * @param {*} params 
 */
export async function setRoomTag(params) {
  return request('/room/tags/setRoomTag', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: params
  });
}

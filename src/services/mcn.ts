
import request from '@/utils/request';

/**
 * 新增
 * @param {*} params 
 */
export async function create(params) {
  return request('/user/organization/add', {
    method: 'POST',
    headers: { 'Content-Type': '' },
    body: params
  });
}
/**
 * 编辑
 * @param {*} params 
 */
export async function patch(params) {
  return request('/user/organization/modify', {
    method: 'POST',
    headers: { 'Content-Type': '' },
    body: params
  });
}
/**
 * 获取列表
 */
export async function fetch(query) {
  return request('/user/organization/getList', {
    method: 'GET',
    body: query
  });
}
/**
 * 删除模板
 */
export async function deleteItem(params) {
  return request('/user/organization/delete', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: params
  });
}
/**
 * 编辑状态
 * @param {*} params 
 */
export async function patchStatus(params) {
  return request('/user/organization/statusSet', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: params
  });
}

/**
 * 获取状态枚举
 */
export async function fetchStatuses() {
  return request('/user/organization/statusMap', {
    method: 'GET'
  });
}


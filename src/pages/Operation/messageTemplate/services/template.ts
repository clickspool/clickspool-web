
import request from '@/utils/request';

/**
 * 创建模板
 * @param {*} params 
 */
export async function create(params) {
  return request('/admin/assistant/autoMessAdd', {
    method: 'POST',
    headers: { 'Content-Type': '' },
    body: params
  });
}
/**
 * 编辑模板
 * @param {*} params 
 */
export async function patch(params) {
  return request('/admin/assistant/autoMessModify', {
    method: 'POST',
    headers: { 'Content-Type': '' },
    body: params
  });
}
/**
 * 获取模板列表
 */
export async function fetch(query) {
  return request('/admin/assistant/autoMessList', {
    method: 'GET',
    body: query
  });
}
/**
 * 删除模板
 */
export async function deleteItem(params) {
  return request('/admin/assistant/autoMessDelete', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: params
  });
}
/**
 * 编辑模板状态
 * @param {*} params 
 */
export async function patchStatus(params) {
  return request('/admin/assistant/autoMessStatusSet', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: params
  });
}

/**
 * 获取模板状态枚举
 */
export async function fetchStatuses() {
  return request('/admin/assistant/autoMessStatusMap', {
    method: 'GET'
  });
}
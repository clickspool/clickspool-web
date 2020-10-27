
import request from '@/utils/request';

/**
 * 创建道具
 * @param {*} params 
 */
export async function create(params) {
  return request('/admin/face/add', {
    method: 'POST',
    headers: { 'Content-Type': '' },
    body: params
  });
}
/**
 * 编辑道具
 * @param {*} params 
 */
export async function patch(params) {
  return request('/admin/face/modify', {
    method: 'POST',
    headers: { 'Content-Type': '' },
    body: params
  });
}
/**
 * 编辑道具状态
 * @param {*} params 
 */
export async function patchStatus(params) {
  return request('/admin/face/statusSet', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: params
  });
}
/**
 * 获取道具列表
 */
export async function fetch(query) {
  return request(`/admin/face/getList`, {
    method: 'GET',
    body: query
  });
}
/**
 * 获取道具分类列表
 */
export async function fetchCates() {
  return request('/admin/face/getList', {
    method: 'GET'
  });
}

/**
 * 获取道具状态列表
 */
export async function fetchStatuses() {
  return request('/admin/metools/getToolStatusList', {
    method: 'GET'
  });
}
/**
 * 道具批量操作
 */
export async function batchModify(params) {
  return request('/admin/face/statusSet', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: params
  });
}
/**
 * 删除
 */
export async function deleteTool(params) {
  return request('/admin/face/delete', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: params
  });
}

/**
 * 获取道具平台列表
 */
export async function fetchClients() {
  return request('/admin/metools/getToolClientList', {
    method: 'GET'
  });
}

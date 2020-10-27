
import request from '@/utils/request';

/**
 * 创建道具
 * @param {*} params 
 */
export async function create(params) {
  return request('/admin/metools/addTool', {
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
  return request('/admin/metools/modifyTool', {
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
  return request('/admin/metools/modifyStatus', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: params
  });
}
/**
 * 获取道具列表
 */
export async function fetch(query) {
  return request(`/admin/metools/getToolList`, {
    method: 'GET',
    body: query
  });
}
/**
 * 获取道具分类列表
 */
export async function fetchCates() {
  return request('/admin/metools/getToolCateList', {
    method: 'GET'
  });
}
/**
 * 获取道具位置列表
 */
export async function fetchPositions() {
  return request('/admin/metools/getToolPositions', {
    method: 'GET'
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
  return request('/admin/metools/batchModifyStatus', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: params
  });
}
/**
 * 道具批量操作
 */
export async function deleteTool(params) {
  return request('/admin/metools/deleteTool', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: params
  });
}

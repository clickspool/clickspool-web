
import request from '@/utils/request';

/**
 * 创建道具
 * @param {*} params 
 */
export async function create(params) {
  return request('/admin/gift/addTool', {
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
  return request('/admin/gift/modifyTool', {
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
  return request('/admin/gift/modifyStatus', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: params
  });
}
/**
 * 获取道具列表
 */
export async function fetch(query) {
  return request('/admin/gift/getToolList', {
    method: 'GET',
    body: query
  });
}
/**
 * 获取道具分类列表
 */
export async function fetchCates() {
  return request('/admin/gift/getList', {
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
  return request('/admin/gift/batchModifyStatus', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: params
  });
}
/**
 * 删除
 */
export async function deleteTool(params) {
  return request('/admin/gift/deleteTool', {
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
/**
 * 获取语音房礼物列表
 */
export async function getRoomGifts() {
  return request('/admin/gift/getRoomGifts', {
    method: 'GET'
  });
}

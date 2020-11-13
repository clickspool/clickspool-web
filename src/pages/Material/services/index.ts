
import request from '@/utils/request';

/**
 * 上传
 * @param {*} params 
 */
export async function uploadMultiMedia(params) {
  return request('/admin/material/addMaterial', {
    method: 'POST',
    headers: { 'Content-Type': 'amultipart/form-data' },
    body: params
  });
}

/**
 * 创建
 * @param {*} params 
 */
export async function create(params) {
  return request('/admin/material/addMaterial', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: params
  });
}
/**
 * 编辑
 * @param {*} params 
 */
export async function patch(params) {
  return request('/admin/material/modifyMaterial', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: params
  });
}
/**
 * 获取列表
 */
export async function fetch(query) {
  return request('/admin/material/getList', {
    method: 'GET',
    body: query
  });
}
/**
 * 删除
 */
export async function deleteItem(params) {
  return request('/discover/daily/dailyDelete', {
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
  return request('/admin/material/modifyStatus', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: params
  });
}

/**
 * 获取商户枚举
 */
export async function fetchMerchantMap() {
  return request('/admin/material/getMerchantMap', {
    method: 'GET'
  });
}

/**
 * 获取状态枚举
 */
export async function fetchStatuses() {
  return request('/admin/material/statusMap', {
    method: 'GET'
  });
}

/**
 * 获取类型枚举
 */
export async function fetchTypeMap() {
  return request('/admin/material/typeMap', {
    method: 'GET'
  });
}
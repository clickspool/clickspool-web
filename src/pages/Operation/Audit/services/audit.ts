
import request from '@/utils/request';

/**
 * 创建分类
 * @param {*} params 
 */
export async function create(params) {
  return request('/admin/gift/addToolCate', {
    method: 'POST',
    headers: { 'Content-Type': '' },
    body: params
  });
}
/**
 * 编辑分类
 * @param {*} params
 */
export async function patch(params) {
  return request('/admin/gift/modifyToolCate', {
    method: 'POST',
    headers: { 'Content-Type': '' },
    body: params
  });
}
/**
 * 编辑状态
 * @param {*} params 
 */
export async function patchStatus(params) {
  return request('/user/background/statusSet', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: params
  });
}
/**
 * 批量编辑状态
 * @param {*} params 
 */
export async function batchStatusSet(params) {
  return request('/user/background/batchStatusSet', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: params
  });
}
/**
 * 获取列表
 */
export async function fetch(params) {
  return request('/user/background/getList', {
    method: 'GET',
    body: params
  });
}

/**
 * 获取状态列表
 */
export async function fetchStatusEnum(params) {
  return request('/user/background/statusMap', {
    method: 'GET',
    body: params
  });
}

/**
 * 删除分类
 * @param {*} params 
 */
export async function deleteCate(params) {
  return request('/admin/gift/cateDelete', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: params
  });
}
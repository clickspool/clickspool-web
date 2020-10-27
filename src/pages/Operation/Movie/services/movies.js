
import request from '@/utils/request';

/**
 * 创建模板
 * @param {*} params 
 */
export async function create(params) {
  return request('/admin/movie/templateAdd', {
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
  return request('/admin/movie/templateModify', {
    method: 'POST',
    headers: { 'Content-Type': '' },
    body: params
  });
}
/**
 * 编辑模板状态
 * @param {*} params 
 */
export async function patchStatus(params) {
  return request('/admin/movie/templateStatusSet', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: params
  });
}
/**
 * 获取模板列表
 */
export async function fetch(query) {
  return request(`/admin/movie/templateList`, {
    method: 'GET',
    body: query
  });
}

/**
 * 获取终端枚举
 */
export async function fetchClients() {
  return request('/admin/movie/templatePlatformMap', {
    method: 'GET'
  });
}
/**
 * 获取SDK枚举
 */
export async function fetchSdks() {
  return request('/admin/movie/templateSdkMap', {
    method: 'GET'
  });
}
/**
 * 获取版本区间枚举
 */
export async function fetchVersionRange() {
  return request('/admin/movie/templateVersionMap', {
    method: 'GET'
  });
}
/**
 * 模板批量操作
 */
export async function batchModify(params) {
  return request('/admin/movie/batchModifyStatus', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: params
  });
}
/**
 * 模板删除
 */
export async function deleteTool(params) {
  return request('/admin/movie/templateDelete', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: params
  });
}


import request from '@/utils/request';

/**
 * 创建分类
 * @param {*} params 
 */
export async function create(params) {
  return request('/admin/metools/addToolCate', {
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
  return request('/admin/metools/modifyToolCate', {
    method: 'POST',
    headers: { 'Content-Type': '' },
    body: params
  });
}
/**
 * 编辑分类状态
 * @param {*} params 
 */
export async function patchStatus(params) {
  return request('/admin/metools/modifyCateStatus', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: params
  });
}
/**
 * 获取分类列表
 */
export async function fetch(params) {
  // console.info('fetch_params', params);
  return request('/admin/metools/getToolCateList', {
    method: 'GET',
    body: params
  });
}
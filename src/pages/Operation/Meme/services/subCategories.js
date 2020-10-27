
import request from '@/utils/request';

/**
 * 创建分类
 * @param {*} params 
 */
export async function create(params) {
  return request('/admin/metools/addToolSubCate', {
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
  return request('/admin/metools/modifyToolSubCate', {
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
  return request('/admin/metools/modifySubCateStatus', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: params
  });
}
/**
 * 获取分类列表
 */
export async function fetch(params) {
  return request('/admin/metools/getToolSubCateList', {
    method: 'GET',
    body: params
  });
}
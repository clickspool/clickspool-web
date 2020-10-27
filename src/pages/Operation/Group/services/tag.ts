
import request from '@/utils/request';

/**
 * 创建标签
 * @param {*} params 
 */
export async function create(params) {
  return request('/admin/group/groupTagAdd', {
    method: 'POST',
    headers: { 'Content-Type': '' },
    body: params
  });
}
/**
 * 编辑标签
 * @param {*} params
 */
export async function patch(params) {
  return request('/admin/group/groupTagModify', {
    method: 'POST',
    headers: { 'Content-Type': '' },
    body: params
  });
}
/**
 * 编辑标签状态
 * @param {*} params 
 */
export async function patchStatus(params) {
  return request('/admin/group/groupTagStatusSet', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: params
  });
}
/**
 * 获取标签列表
 */
export async function fetch(params) {
  return request('/admin/group/groupTagList', {
    method: 'GET',
    body: params
  });
}

/**
 * 删除标签
 * @param {*} params
 */
export async function deleteTag(params) {
  return request('/admin/group/groupTagDelete', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: params
  });
}
/**
 * 标签推荐词
 * @param {*} params
 */
export async function groupTagRecommendMap(params) {
  return request('/admin/group/groupTagRecommendMap', {
    method: 'GET',
    body: params
  });
}

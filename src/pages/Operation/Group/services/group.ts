
import request from '@/utils/request';

/**
 * 创建群组
 * @param {*} params 
 */
export async function create(params) {
  return request('/admin/group/groupAdd', {
    method: 'POST',
    headers: { 'Content-Type': '' },
    body: params
  });
}
/**
 * 编辑群组
 * @param {*} params 
 */
export async function patch(params) {
  return request('/admin/group/groupModify', {
    method: 'POST',
    headers: { 'Content-Type': '' },
    body: params
  });
}
/**
 * 获取群组列表
 */
export async function fetch(query) {
  return request('/admin/group/groupList', {
    method: 'GET',
    body: query
  });
}
/**
 * 删除群组
 */
export async function deleteGroup(params) {
  return request('/admin/group/groupStatusSet', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: params
  });
}
/**
 * 编辑群组状态
 * @param {*} params 
 */
export async function patchStatus(params) {
  return request('/admin/group/groupStatusSet', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: params
  });
}
/**
 * 获取群组类型枚举
 * @param {*} params 
 */
export async function fetchGroupTypes(params) {
  return request('/admin/group/groupTypeMap', {
    method: 'GET',
    body: params
  });
}
/**
 * 获取群组标签枚举
 * @param {*} params 
 */
export async function fetchTags(params) {
  return request('/admin/group/groupTagMap', {
    method: 'GET',
    body: params
  });
}

/**
 * 群组素材标签枚举
 */
export async function groupTagMap() {
  return request('/admin/group/groupTagMap', {
    method: 'GET',
  });
}

/**
 * 群组素材：列表
 */
export async function groupMaterialList(params) {
  return request('/admin/group/groupMaterialList', {
    method: 'GET',
    body: params
  });
}

/**
 * 群组素材：详情
 */
export async function groupMaterialInfo(params) {
  return request('/admin/group/groupMaterialInfo', {
    method: 'GET',
    body: params
  });
}

/**
 * 群组素材：状态枚举
 */
export async function groupMaterialStatusMap(params) {
  return request('/admin/group/groupMaterialStatusMap', {
    method: 'GET',
    body: params
  });
}

/**
 * 群组素材：创建
 * @param {*} params 
 * 
 */
export async function groupMaterialAdd(params) {
  return request('/admin/group/groupMaterialAdd', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: params
  });
}

/**
 * 群组素材：编辑
 * @param {*} params 
 * 
 */
export async function groupMaterialModify(params) {
  return request('/admin/group/groupMaterialModify', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: params
  });
}

/**
 * 群组素材：上下架
 * @param {*} params 
 * 
 */
export async function groupMaterialStatusSet(params) {
  return request('/admin/group/groupMaterialStatusSet', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: params
  });
}

/**
 * 群组素材：删除
 * @param {*} params 
 * 
 */
export async function groupMaterialDelete(params) {
  return request('/admin/group/groupMaterialDelete', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: params
  });
}

/**
 * 群组素材：类型枚举
 * @param {*} params 
 * 
 */
export async function groupMaterialTypes(params) {
  return request('/admin/group/groupMaterialTypes', {
    method: 'get',
    body: params
  });
}

/**
 * 群组素材：类型枚举
 * @param {*} params 
 * 
 */
export async function groupMaterialIsSendMap(params) {
  return request('/admin/group/groupMaterialIsSendMap', {
    method: 'get',
    body: params
  });
}

/**
 * 群组素材：待发送列表
 * @param {*} params 
 * 
 */
export async function groupWaitingMaterialList(params) {
  return request('/admin/group/groupWaitingMaterialList', {
    method: 'get',
    body: params
  });
}

import request from '@/utils/request';

/**
 * 创建模板
 * @param {*} params 
 */
export async function create(params) {
  return request('/admin/robot/templateAdd', {
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
  return request('/admin/robot/templateModify', {
    method: 'POST',
    headers: { 'Content-Type': '' },
    body: params
  });
}
/**
 * 获取模板列表
 */
export async function fetch(query) {
  return request('/admin/robot/templateList', {
    method: 'GET',
    body: query
  });
}
/**
 * 删除模板
 */
export async function deleteItem(params) {
  return request('/admin/robot/templateDelete', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: params
  });
}
/**
 * 编辑模板状态
 * @param {*} params 
 */
export async function patchStatus(params) {
  return request('/admin/robot/templateStatusSet', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: params
  });
}

/**
 * 获取模板状态枚举
 */
export async function fetchStatuses() {
  return request('/admin/robot/commonStatusMap', {
    method: 'GET'
  });
}

/**
 * 获取发送方式枚举
 */
export async function fetchSendType() {
  return request('/admin/robot/sendTypeMap', {
    method: 'GET'
  });
}
/**
 * 获取发送方式枚举
 */
export async function fetchRuleTypes() {
  return request('/admin/robot/ruleTypeMap', {
    method: 'GET'
  });
}

/**
 * 获取发送方式枚举
 */
export async function getAutoSendToolInfo() {
  return request('/admin/robot/getAutoSendToolInfo', {
    method: 'GET'
  });
}

/**
 * 回复模板：打赏道具列表
 */
export async function getGiftMap() {
  return request('/admin/robot/getGiftMap', {
    method: 'GET'
  });
}
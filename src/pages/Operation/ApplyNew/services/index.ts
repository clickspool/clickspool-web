
import request from '@/utils/request';

/**
 * 自动回复列表
 */
export async function fetch(query) {
  return request('/admin/robot/templateList', {
    method: 'GET',
    body: query
  });
}

/**
 * 上下架
 * @param {*} params 
 */
export async function templateStatusSet(params) {
  return request('/admin/robot/templateStatusSet', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: params
  });
}

/**
 * 删除
 * @param {*} params 
 */
export async function templateDelete(params) {
  return request('/admin/robot/templateDelete', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: params
  });
}

/**
 * 新建
 * @param {*} params 
 */
export async function templateAdd(params) {
  return request('/admin/robot/templateAdd', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: params
  });
}

/**
 * 编辑
 * @param {*} params 
 */
export async function templateModify(params) {
  return request('/admin/robot/templateModify', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: params
  });
}

/**
 * 规则类型枚举
 * @param {*params 
 */
export async function ruleTypeMap(query) {
  return request('/admin/robot/ruleTypeMap', {
    method: 'GET',
    body: query
  });
}

/**
 * 打赏道具列表
 * @param {*} params 
 */
export async function getGiftMap(query) {
  return request('/admin/robot/getGiftMap', {
    method: 'GET',
    body: query
  });
}

/**
 * 自动打赏道具信息
 * @param {*} params 
 */
export async function getAutoSendToolInfo(query) {
  return request('/admin/robot/getAutoSendToolInfo', {
    method: 'GET',
    body: query
  });
}

/**
 * 上传文件
 * @param {*} params 
 */
export async function uploadMultiMedia(params) {
  return request('/admin/upload/uploadMultiMedia', {
    method: 'POST',
    body: params
  });
}

/**
 * 消息类型枚举
 * @param {*} params 
 */
export async function messageTypeMap(query) {
  return request('/admin/robot/messageTypeMap', {
    method: 'GET',
    body: query
  });
}

/**
 * 规则key枚举
 * @param {*} params 
 */
export async function conditionKeyMap(query) {
  return request('/admin/robot/conditionKeyMap', {
    method: 'GET',
    body: query
  });
}

/**
 * 规则key枚举
 * @param {*} params 
 */
export async function subConditionKeyMap(query) {
  return request('/admin/robot/subConditionKeyMap', {
    method: 'GET',
    body: query
  });
}

/**
 * 规则key枚举
 * @param {*} params 
 */
export async function getNoRootRules(query) {
  return request('/admin/robot/getNoRootRules', {
    method: 'GET',
    body: query
  });
}


/**
 * 发送方式枚举
 */
export async function sendTypeMap(query) {
  return request('/admin/robot/sendTypeMap', {
    method: 'GET',
    body: query
  });
}

/**
 * 状态枚举
 */
export async function commonStatusMap(query) {
  return request('/admin/robot/commonStatusMap', {
    method: 'GET',
    body: query
  });
}

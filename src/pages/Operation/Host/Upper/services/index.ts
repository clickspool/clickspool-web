
import request from '@/utils/request';

/**
 * 主播列表
 * 
 */
export async function fetch(query) {
  return request('/room/owner/getList', {
    method: 'GET',
    body: query
  });
}
/**
 * 主播语音房列表
 * 
 */
export async function getUserRoomList(query) {
  return request('/room/owner/getUserRoomList', {
    method: 'GET',
    body: query
  });
}
/**
 * 用户性别枚举
 */
export async function getUserSexList(query) {
  return request('/admin/user/getUserSexList', {
    method: 'GET',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: query
  });
}

/**
 * 房间成员列表
 */
export async function getRoomMemberList(query) {
  return request('/room/owner/getRoomMemberList', {
    method: 'GET',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: query
  });
}

/**
 * 设置用户语音房权限
 */
export async function setCreateRoomAuth(params) {
  return request('/room/owner/setCreateRoomAuth', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: params
  });
}

/**
 * 踢出语音房
 */
export async function leaveRoom(params) {
  return request('/room/owner/leaveRoom', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: params
  });
}

/**
 * 关闭语音房
 */
export async function closeRoom(params) {
  return request('/room/owner/closeRoom', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: params
  });
}

/**
 * 设置语音房置顶
 */
export async function setRoomTop(params) {
  return request('/room/owner/setRoomTop', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: params
  });
}
/**
 * 设置用户机构
 */
export async function setUserOrganization(params) {
  return request('/user/organization/setUserOrganization', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: params
  });
}
/**
 * 设置主播是否加入官方推荐计划
 */
export async function setUserOfficialRec(params) {
  return request('/room/owner/setUserOfficialRec', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: params
  });
}

/**
 * 批量设置identity（设置夜场主播）
 */
export async function batchSetIdentity(params) {
  return request('/admin/user/batchSetIdentity', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: params
  });
}

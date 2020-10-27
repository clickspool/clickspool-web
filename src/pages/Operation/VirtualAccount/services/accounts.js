
import request from '@/utils/request';

/**
 * 创建虚拟账号
 * @param {*} params 
 */
export async function create(params) {
  return request('/admin/user/addVirtualUser', {
    method: 'POST',
    headers: { 'Content-Type': '' },
    body: params
  });
}
/**
 * 编辑虚拟账号
 * @param {*} params 
 */
export async function patch(params) {
  return request('/admin/user/updateVirtualUser', {
    method: 'POST',
    headers: { 'Content-Type': '' },
    body: params
  });
}
/**
 * 获取虚拟账号列表
 */
export async function fetch(query) {
  return request('/admin/user/getVirtualUserList', {
    method: 'GET',
    body: query
  });
}
/**
 * 删除虚拟账号
 */
export async function deleteAccount(params) {
  return request('/admin/user/delVirtualUser', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: params
  });
}
/**
 * 用户性别列表
 */
export async function getUserSexList(params) {
  return request('/admin/user/getUserSexList', {
    method: 'GET',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: params
  });
}
/**
 * 虚拟用户语言标签列表
 */
export async function getUserLanguageMap(params) {
  return request('/admin/user/getUserLanguageMap', {
    method: 'GET',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: params
  });
}
/**
 * 虚拟用户区域列表
 */
export async function getUserRegionMap(params) {
  return request('/admin/user/getUserRegionMap', {
    method: 'GET',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: params
  });
}

/**
 * @name 账号类型
 * @param params
 */
export async function getUserTypesMap(query ) {
  return request('/admin/user/getUserTypesMap', {
    method: 'GET',
    body: query,
  });
 }

 /**
 * @name 推荐用户审核：推荐标签
 * @param params
 */
export async function getTagsMap( query ) {
  return request('/user/recommend/tagsMap', {
    method: 'GET',
    body: query,
  });
 }
 

  /**
 * @name x兴趣标签
 * @param params
 */
export async function getUserTagInterestMap( query ) {
  return request('/admin/user/getUserTagInterestMap', {
    method: 'GET',
    body: query,
  });
 }
/**
 * @name 用户定价设置配置
 * @param params
 */
export async function getChargeSetting( query ) {
  return request('/admin/user/getChargeSetting', {
    method: 'GET',
    body: query,
  });
 }


 /**
 * @name 设置用户礼物统计
 * @param params
 */
export async function updateUserGiftStat(params ){
  return request('/admin/gift/updateUserGiftStat', {
    method: 'GET',
    body: params,
  });
 }

/**
 * @name 查询用户礼物统计
 * @param params
 */
export async function getUserGiftStat(params ) {
  return request('/admin/gift/getUserGiftStat', {
    method: 'GET',
    body: params,
  });
 }

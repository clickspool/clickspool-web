import request from '@/utils/request';

/**
 *
 * @param
 * 获取用户信息
 * user_id
 */

export async function getUserInfo(params) {
  return request('/admin/user/getUserInfo', {
    method: 'GET',
    body: params,
  });
}

/**
 *
 * @param
 * 获取用户列表
 *
 */
export async function getList(params) {
  return request('/admin/user/getUserList', {
    method: 'GET',
    body: params,
  });
}
/**
 *
 * @param
 * 获取用户状态
 *
 */
export async function getUserStatusList(params) {
  return request('/admin/user/getUserStatusList', {
    method: 'GET',
    body: params,
  });
}

/**
 *
 * @param
 * 获取用户状态
 *
 */
export async function getUserSexList(params) {
  return request('/admin/user/getUserSexList', {
    method: 'GET',
    body: params,
  });
}

/**
 *
 * @param
 * 用户国家列表
 *
 */
export async function getCountryList(params) {
  return request('/admin/user/getCountryList', {
    method: 'GET',
    body: params,
  });
}

/**
 *
 * @param
 * 获取用户好友列表
 *
 */
export async function getFriendList(params) {
  return request('/admin/user/getFriendList', {
    method: 'GET',
    body: params,
  });
}

/**
 *
 * @param
 * 好友状态枚举
 *
 */
export async function getRelationList(params) {
  return request('/admin/user/getRelationList', {
    method: 'GET',
    body: params,
  });
}

/**
 *
 * @param
 * 用户好友来源枚举
 *
 */
export async function getFriendSourceList(params) {
  return request('/admin/user/getFriendSourceList', {
    method: 'GET',
    body: params,
  });
}


/**
 *
 * @param
 * 通话记录列表
 *
 */
export async function getRecordList(params) {
  return request('/admin/call/recordList', {
    method: 'GET',
    body: params,
  });
}

/**
 *
 * @param
 * 呼叫类型枚举
 *
 */
export async function getCallingTypeList(params) {
  return request('/admin/call/callingTypeList', {
    method: 'GET',
    body: params,
  });
}

/**
 *
 * @param
 * 通话类型枚举
 *
 */
export async function getChannelTypeList(params) {
  return request('/admin/call/channelTypeList', {
    method: 'GET',
    body: params,
  });
}

/**
 *
 * @param
 * 通话状态枚举
 *
 */
export async function getCallingStatusList(params) {
  return request('/admin/call/callingStatusList', {
    method: 'GET',
    body: params,
  });
}
/**
 *
 * @param
 * 设置用户是否网红
 *
 */
export async function setUserStar(params) {
  return request('/admin/user/setUserStar', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' },
    body: params,
  });
}
/**
 * 网红枚举
 */
export async function getUserStars(params) {
  return request('/admin/user/getUserStars', {
    method: 'GET',
    body: params,
  });
}

/**
 * 活动-种子用户列表
 */
export async function getSeedUserList(params) {
  return request('/admin/act/getSeedUserList', {
    method: 'GET',
    body: params,
  });
}
/**
 * 活动-活动-种子用户详情
 */
export async function getSeedUserInfo(params) {
  return request('/admin/act/getSeedUserInfo', {
    method: 'GET',
    body: params,
  });
}

/**
 * 活动-社交用户列表
 */
export async function getSocialUserList(params) {
  return request('/admin/act/getSocialUserList', {
    method: 'GET',
    body: params,
  });
}
/**
 * 活动-社交用户详情
 */
export async function getSocialUserInfo(params) {
  return request('/admin/act/getSocialUserInfo', {
    method: 'GET',
    body: params,
  });
}
/**
 * 活动-社交用户详情
 */
export async function getUserLanguageMap(params) {
  return request('/admin/act/getUserLanguageMap', {
    method: 'GET',
    body: params,
  });
}

/**
 * 活动-用户区域map
 */
export async function getUserRegionMap(params) {
  return request('/admin/act/getUserRegionMap', {
    method: 'GET',
    body: params,
  });
}

/**
 * 活动-社交用户删除
 */
export async function delSocialUser(params) {
  return request('/admin/act/delSocialUser', {
    method: 'GET',
    body: params,
  });
}
/**
 * 活动-种子用户删除
 */
export async function delSeedUser(params) {
  return request('/admin/act/delSeedUser', {
    method: 'GET',
    body: params,
  });
}
/**
 * 设置用户黑名单
 */
export async function setUserRecBlackList(params) {
  return request('/admin/user/setUserRecBlackList', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' },
    body: params,
  });
}

/**
 * 设置用户vip
 */
export async function batchAddVipDay(params) {
  return request('/admin/user/batchAddVipDay', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' },
    body: params,
  });
}

/**
 * 批量添加钻石
 */
export async function batchAddDiamond(params) {
  return request('/admin/user/batchAddDiamond', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' },
    body: params,
  });
}

 /**
 // tslint:disable-next-line:jsdoc-format
 * @name 批量设置MCN/机器人
 // tslint:disable-next-line:jsdoc-format
 * @param params
 */
export async function batchSetMcnOrRobot(params){
  return request('/admin/user/batchSetMcnOrRobot', {
    method: 'POST',
    body: params,
    headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' },
  });
 }

 /**
 * 批量添加碎钻石
 * @param {*} params 
 */
export async function batchAddDiamondShard(params) {
  return request('/admin/user/batchAddDiamondShard', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: params
  });
}
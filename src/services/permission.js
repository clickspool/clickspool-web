import request from '@/utils/request';

/**
 *
 * @name 查询所有用户列表
 * @param {page:1} param page从1开始
 *
 */
export async function getList(params) {
  return request('/admin/member/getAdminMemberList', {
    method: 'GET',
    body: params,
  });
}

/**
 *
 * @name 新增后台用户
 * @param
 ** member_id telephone	password	 role_ids
 */
export async function add(params) {
  return request('/admin/member/addAdminMember', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' },
    body: params,
  });
}

/**
 *
 * @name 编辑后台用户
 * @param
 * member_id telephone	password	 role_ids
 */
export async function modify(params) {
  return request('/admin/member/modifyAdminMember', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' },
    body: params,
  });
}

/**
 *
 * @name 编辑后台用户密码
 * @param
 * member_id telephone	password	 role_ids
 */
export async function modifyPassword(params) {
  return request('/admin/member/modifyPassword', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' },
    body: params,
  });
}
/**
 *
 * @name 获取所有角色枚举
 *
 */
export async function getRoleList(params) {
  return request('/admin/role/getRoleList', {
    method: 'GET',
    body: params,
  });
}

/**
 * @name 获取用户状态枚举
 *
 */
export async function getMemberStatusList(params) {
  return request('/admin/member/getMemberStatusList', {
    method: 'GET',
    body: params,
  });
}

/**
 *
 * @name 删除用户
 * @param
 */
export async function del(params) {
  return request('/admin/member/deleteAdminMember', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' },
    body: params,
  });
}

/**
 *
 * @name 锁定用户
 * @param
 */
export async function lockMember(params) {
  return request('/admin/member/lockMember', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' },
    body: params,
  });
}

/**
 *
 * @name 解锁用户
 * @param
 */
export async function unlockMember(params) {
  return request('/admin/member/unlockMember', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' },
    body: params,
  });
}


/**
 *
 * @name 查询所有用户列表
 * @param {page:1} param page从1开始
 *
 */
export async function getPublisherList(params) {
  return request('/admin/member/getAdminPublisherList', {
    method: 'GET',
    body: params,
  });
}

export async function modifyPublisher(params) {
  return request('/admin/member/modifyPublisher', {
    method: 'POST',
    body: params,
    headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' },
  });
}

export async function pModifyPublisher(params) {
  return request('/user/publisher/modifyPublisher', {
    method: 'POST',
    body: params,
    headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' },
  });
}

export async function getPublisherInfo(query) {
  return request('/user/publisher/getPublisherInfo', {
    method: 'GET',
    body: query,
  });
}


export async function feedbackAdd(params) {
  return request('/admin/faq/addFeedback', {
    method: 'POST',
    body: params,
    headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' },
  });
}

export async function userMemberList(params) {
  return request('/user/member/memberList', {
    method: 'POST',
    body: params,
    headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' },
  });
}
export async function orderList(params) {
  return request('/user/member/orderList', {
    method: 'POST',
    body: params,
    headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' },
  });
}

export async function getPurchaseList(params) {
  return request('/user/member/purchaseList', {
    method: 'POST',
    body: params,
    headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' },
  });
}
export async function getCouponList(params) {
  return request('/user/coupon/couponList', {
    method: 'POST',
    body: params,
    headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' },
  });
}
export async function modifyCoupon(params) {
  return request('/user/coupon/modifyCoupon', {
    method: 'POST',
    body: params,
    headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' },
  });
}


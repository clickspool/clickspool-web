import request from '@/utils/request';
/**
 *
 * @name 
 * @param {page:1} param page从1开始
 *
 */
export async function messList(params) {
  return request('/admin/assistant/messList', {
    method: 'GET',
    body: params,
  });
}

/**
 *
 * @name 小秘书新增消息
 * 
 */
export async function messAdd(params) {
  return request('/admin/assistant/messAdd', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' },
    body: params,
  });
}

/**
 *
 * @name 小秘书编辑消息
 * 
 */
export async function messModify(params) {
  return request('/admin/assistant/messModify', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' },
    body: params,
  });
}

/**
 *
 * @name 消息类型枚举
 * 
 */
export async function messTypes(params) {
  return request('/admin/assistant/messTypes', {
    method: 'GET',
    body: params,
  });
}
/**
 *
 * @name 消息状态枚举
 * 
 */
export async function messStatuses(params) {
  return request('/admin/assistant/messStatuses', {
    method: 'GET',
    body: params,
  });
}


/**
 *
 * @name 消息状态枚举
 * 
 */
export async function messInfo(params) {
  return request('/admin/assistant/messInfo', {
    method: 'GET',
    body: params,
  });
}

/**
 *
 * @name 上传媒体
 * 
 */
export async function uploadMultiMedia(params) {
  return request('/admin/upload/uploadMultiMedia', {
    method: 'POST',
    body: params,
    headers: { 'Content-Type': '' },
  });
}

/**
 *
 * @name 删除
 * 
 */
export async function messDel(params) {
  return request('/admin/assistant/messDel', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' },
    body: params,
  });
}


/**
 *
 * @name `获取最近反馈消息`
 * 
 */
export async function feedRecentList(params) {
  return request('/admin/assistant/feedRecentList', {
    method: 'GET',
    body: params,
  });
}

/**
 *
 * @name `反馈列表`
 * 
 */
export async function feedList(params) {
  return request('/admin/assistant/feedList', {
    method: 'GET',
    body: params,
  });
}

/**
 *
 * @name `反馈类型枚举`
 * 
 */
export async function feedTypes(params) {
  return request('/admin/assistant/feedTypes', {
    method: 'GET',
    body: params,
  });
}

/**
 *
 * @name 回复
 * 
 */
export async function replyFeed(params) {
  return request('/admin/assistant/replyFeed', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' },
    body: params,
  });
}

/**
 *
 * @name `反馈状态枚举`
 * 
 */
export async function feedStatuses(params) {
  return request('/admin/assistant/feedStatuses', {
    method: 'GET',
    body: params,
  });
}

/**
 *
 * @name `客服列表`
 * 
 */
export async function getMembers(params) {
  return request('/admin/assistant/getMembers', {
    method: 'GET',
    body: params,
  });
}

/**
 *
 * @name `版本列表`
 * 
 */
export async function getVersions(params) {
  return request('/admin/assistant/getVersions', {
    method: 'GET',
    body: params,
  });
}

/**
 *
 * 
 */
export async function searchUsers(params) {
  return request('/admin/assistant/searchUsers', {
    method: 'GET',
    body: params,
  });
}


/**
 *
 * @name `发送方式枚举`
 * 
 */
export async function sendTypes(params) {
  return request('/admin/assistant/sendTypes', {
    method: 'GET',
    body: params,
  });
}
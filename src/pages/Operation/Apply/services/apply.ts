
import request from '@/utils/request';

/**
 * 获取列表
 */
export async function fetch(query) {
  return request('/user/recommend/getList', {
    method: 'GET',
    body: query
  });
}

/**
 * 编辑状态
 * @param {*} params 
 */
export async function patchStatus(params) {
  return request('/user/recommend/statusSet', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: params
  });
}
/**
 * 推荐用户审核：设置是否显示来电提醒弹窗
 * @param {*} params 
 */
export async function setUserCallAlert(params) {
  return request('/user/recommend/setUserCallAlert', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: params
  });
}

/**
 * 获取标签枚举
 */
export async function fetchTagMap() {
  return request('/user/recommend/tagsMap', {
    method: 'GET'
  });
}

/**
 * 推荐用户审核：撤销推荐
 * @param {*} params 
 */
export async function cancelRecommend(params) {
  return request('/user/recommend/cancelRecommend', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: params
  });
}


/**
 * 聊天标签
 */
export async function chatTagsMap() {
  return request('/user/recommend/chatTagsMap', {
    method: 'GET'
  });
}

/**
 * @name 编辑推荐用户
 * @param params
 */
export async function recommendModify(params) {
  return request('/user/recommend/modify', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: params
  });
}

/**
 * 用户类型
 */
export async function userTypeMap() {
  return request('/user/recommend/userTypeMap', {
    method: 'GET'
  });
}

/**
 * @name 压缩视频
 * @param params
 */
export async function compressVideo(params) {
  return request('/user/recommend/compressVideo', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: params
  });
}
/**
 * @name 视频去水印
 */
export async function deWatermarkVideo(params) {
  return request('/user/recommend/deWatermarkVideo', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: params
  });
}
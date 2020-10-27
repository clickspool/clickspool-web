import request from '@/utils/request';

/**
 *
 * @name 查询所有内容推送列表
 * @param {page:1} param page从1开始
 *
 */
export async function getList(params) {
  return request('/admin/contentpush/getContentPushList', {
    method: 'GET',
    body: params,
  });
}

/**
 * 
 * @name 添加推送 
 * @param
 **content_id	T文本	是	
    内容ID
    token	T文本	是	
    push_title	T文本	是	
    推送标题
    push_message	T文本	是	
    推送描述
 */
export async function add(params) {
  return request('/admin/contentpush/contentPushAdd', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' },
    body: params,
  });
}

/**
 *
 * @name 撤回推送
 * @param
 * member_id telephone	password	 role_ids
 */
export async function cancel(params) {
  return request('/admin/contentpush/cancel', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' },
    body: params,
  });
}

/**
 *
 * @name 删除推送
 * @param
 */
export async function del(params) {
  return request('/admin/contentpush/contentPushDelete', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' },
    body: params,
  });
}

/**
 * 
 * @name 推送发布
 * @param 
 * id	T文本	是	
    推送ID
  status	T文本	是	
  推送状态
 */
export async function contentPushConfirm(params) {
  return request('/admin/contentpush/contentPushConfirm', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' },
    body: params,
  });
}

/**
 *
 * @name 推送状态列表
 * @param
 *
 */
export async function getContentPushStatusList(params) {
  return request('/admin/contentpush/getContentPushStatusList', {
    method: 'GET',
    body: params,
  });
}

/**
 *
 * @name 推送状态列表
 * @param
 *
 */
export async function contentPushModify(params) {
  return request('/admin/contentpush/contentPushModify', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' },
    body: params,
  });
}

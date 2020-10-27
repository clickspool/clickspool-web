import request from '@/utils/request';

/**
 *
 * @param
 * 分类列表
 * 
 */

export async function getFaqCateList(params) {
  return request('/admin/faq/getFaqCateList', {
    method: 'GET',
    body: params,
  });
}

/**
 *
 * @param
 * faq列表
 *
 */
export async function getFaqList(params) {
  return request('/admin/faq/getFaqList', {
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
 * 删除FAQ
 *id
 */
export async function delFaq(params) {
  return request('/admin/faq/delFaq', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' },
    body: params,
  });
}

/**
 *
 * @param
 * 编辑FAQ
 *id
 */
export async function modifyFaq(params) {
  return request('/admin/faq/modifyFaq', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' },
    body: params,
  });
}

/**
 *
 * @param
 * 删除FAQ分类
 *id
 */
export async function delFaqCate(params) {
  return request('/admin/faq/delFaqCate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' },
    body: params,
  });
}

/**
 *
 * @param
 * 新增FAQ分类
 *id
 */
export async function addFaqCate(params) {
  return request('/admin/faq/addFaqCate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' },
    body: params,
  });
}

/**
 *
 * @param
 * 新增FAQ
 *id
 */
export async function addFaq(params) {
  return request('/admin/faq/addFaq', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' },
    body: params,
  });
}

/**
 *
 * @param
 *编辑FAQ分类
 *id
 */
export async function modifyFaqCate(params) {
  return request('/admin/faq/modifyFaqCate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' },
    body: params,
  });
}

/**
 *
 * @param
 *faq分类状态枚举
 *id
 */
export async function getFaqCateStatusList(params) {
  return request('/admin/faq/getFaqCateStatusList', {
    method: 'GET',
    body: params,
  });
}

/**
 *
 * @param
 *faq状态枚举
 *id
 */
export async function getFaqStatusList(params) {
  return request('/admin/faq/getFaqStatusList', {
    method: 'GET',
    body: params,
  });
}

/**
 *
 * @param
 *批量更新FAQ状态
 *id
 */
export async function batchStatusUpdate(params) {
  return request('/admin/faq/batchStatusUpdate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' },
    body: params,
  });
}

/**
 *
 * @param
 *批量更新FAQ状态
 *id
 */
export async function getFaqInfo(params) {
  return request('/admin/faq/getFaqInfo', {
    method: 'GET',
    body: params,
  });
}

/**
 *
 * @param
 *分类上下架
 *id
 */
export async function modifyFaqCateStatus(params) {
  return request('/admin/faq/modifyFaqCateStatus', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' },
    body: params,
  });
}

/**
 *
 * @param
 *提交分类推荐
 *id
 */
export async function modifyFaqCateRecommend(params) {
  return request('/admin/faq/modifyFaqCateRecommend', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' },
    body: params,
  });
}

/**
 *
 * @param
 *faq分类显示位置枚举
 */
export async function getFaqCateDisplayPosMap(params) {
  return request('/admin/faq/getFaqCateDisplayPosMap', {
    method: 'GET',
    body: params,
  });
}
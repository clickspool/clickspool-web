import request from '@/utils/request';

/**
 *
 * @name 查询所有用户反馈列表
 * @param {page:1} param page从1开始
 *
 */
export async function getList(params) {
  return request('/admin/faq/getFeedback', {
    method: 'GET',
    body: params,
  });
}

/**
 * 获取问题类型
 * @param {*} params
 */
export async function getCategory(params) {
  return request('/admin/faq/getCategory', {
    method: 'GET',
    // headers:{'Content-Type':'application/x-www-form-urlencoded; charset=UTF-8'},
    body: params,
  });
}

/**
 *
 * @name 获取所有客服列表
 *
 */
export async function getCustomer(params) {
  return request('/admin/faq/getCustomer', {
    method: 'GET',
    body: params,
  });
}

/**
 *
 * @name 获取所有版本信息
 *
 */
export async function getAllVersion(params) {
  return request('/admin/faq/getAllVersion', {
    method: 'GET',
    // headers:{'Content-Type':'application/x-www-form-urlencoded; charset=UTF-8'},
    body: params,
  });
}
/**
 *
 * @name 反馈状态列表
 *
 */
export async function getFeedbackStatusList(params) {
  return request('/admin/feedback/getFeedbackStatusList', {
    method: 'GET',
    body: params,
  });
}

/**
 * 
 * @name 获取用户问题详情
 * id: 161
token: 9594te0Ijy2uFGRazB6To6pJOTjUrCKi4sYNljseUegRwNWeCi6Mvt22OiS1SuU-O0gt-kQV9TOSPw
dtu: 200
 */
export async function getOneFeedback(params) {
  return request('/admin/faq/getOneFeedback', {
    method: 'GET',
    body: params,
  });
}

/**
 * 客服回复
 * 
  ids: 209,2,12
  reply_content: 1111
  status: 2 //回复 , 1 //未回复,3 //驳回
  token: 9594te0Ijy2uFGRazB6To6pJOTjUrCKi4sYNljseUegRwNWeCi6Mvt22OiS1SuU-O0gt-kQV9TOSPw
  dtu: 200
 */
export async function reply(params) {
  return request('/admin/faq/reply', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' },
    body: params,
  });
}

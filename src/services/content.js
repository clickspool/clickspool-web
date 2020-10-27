import request from '@/utils/request';

/**
 *
 * @name 查询所有内容列表
 * @param {page:1} param page从1开始
 *
 */
export async function getList(params) {
  return request('/admin/content/getAdminContentList', {
    method: 'GET',
    body: params,
  });
}

/**
 *
 * @name 编辑内容
 * @param
 * platform:1 安卓| 2 IOS
 */
export async function modify(params) {
  return request('/admin/content/contentModify', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' },
    body: params,
  });
}

/**
 * 视频上线
 * @param {*} params
 */
export async function contentOnline(params) {
  return request('/admin/content/contentOnline', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' },
    body: params,
  });
}

/**
 * 视频下线
 * @param {*} params
 */
export async function contentOffline(params) {
  return request('/admin/content/contentOffline', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' },
    body: params,
  });
}
/**
 * 内容删除
 * @param {*} params
 */
export async function del(params) {
  return request('/admin/content/contentDelete', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' },
    body: params,
  });
}

/**
 * 修改分类
 * @param {name} params
 */
export async function changeCate(params) {
  return request('/admin/content/changeCate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' },
    body: params,
  });
}

/**
 * 获取分类列表
 * @param {name} params
 */
export async function getContentCates(params) {
  return request('/admin/content/getContentTypeList', {
    method: 'GET',
    body: params,
  });
}

/**
 * 获取标签列表
 * @param {name} params
 */
export async function getContentTags(params) {
  return request('/admin/content/getContentTags', {
    method: 'GET',
    body: params,
  });
}

/**
 * 获取标签列表
 * @param {id} params
 */
export async function contentDetail(params) {
  return request('/admin/content/contentDetail', {
    method: 'GET',
    body: params,
  });
}

/**
 * 修改分类
 * @param {*} params
 * content_id
 * cate_id
 */
export async function contentCateChange(params) {
  return request('/admin/content/contentCateChange', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' },
    body: params,
  });
}
/**
 * 获取内容来源列表
 * admin/content/getContentSourceList
 */
export async function getContentSourceList() {
  return request('/admin/content/getContentSourceList', {
    method: 'GET',
  });
}

/**
 * 获取内容状态列表
 * /admin/content/getContentStatusList
 */
export async function getContentStatusList() {
  return request('/admin/content/getContentStatusList', {
    method: 'GET',
  });
}

/**
 * 获取内容分类列表
 * /admin/content/getContentCates
 */
export async function getAdminContentCates() {
  return request('/admin/content/getContentCates', {
    method: 'GET',
  });
}

/**
 * 置顶
 * /admin/content/getContentCates
 */
export async function getcontentTop(params) {
  return request('/admin/content/contentTop', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' },
    body: params,
  });
}

/**
 * 取消置顶
 * /admin/content/cancelContentTop
 */
export async function cancelContentTop(params) {
  return request('/admin/content/cancelContentTop', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' },
    body: params,
  });
}

/**
 * 
 */
export async function getLanguageList(params) {
  return request('/admin/faq/getLanguageList', {
    method: 'GET',
    body: params,
  });
}
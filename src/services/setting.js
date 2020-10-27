import request from '@/utils/request';

// 全局配置页面
/**
 *
 * @name 查询用户基本配置信息列表接口
 * @param {page:1} param page从1开始
 *
 */
export async function getConfigList(params) {
  return request('/admin/config/getConfigList', {
    method: 'GET',
    body: params,
  });
}

/**
 * 编辑全局配置参数
 *  @param {name,title,value,type,platform}
 */
export async function modify(params) {
  return request('/admin/config/modify', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' },
    body: params,
  });
}

/**
 * 删除配置
 *  @param {del}
 */
export async function del(params) {
  return request('/admin/config/del', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' },
    body: params,
  });
}

/**
 * 添加全局配置参数
 */
export async function add(params) {
  return request('/admin/config/add', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' },
    body: params,
  });
}

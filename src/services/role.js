import request from '@/utils/request';
import tree_data from '@/tree_data.js';
/**
 *
 * @name 查询所有权限列表
 * @param {page:1} param page从1开始
 *
 */
export async function getList(params) {
  return request('/admin/role/getRoleList', {
    method: 'GET',
    body: params,
  });
}

/**
 *
 * @name 角色删除
 * @param {id: 1, version: v15000 ,info: sdfsdfd ,url: sassdsd ,platform: 1 }
 * platform:1 安卓| 2 IOS
 */
export async function del(params) {
  return request('/admin/role/deleteAdminRole', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' },
    body: params,
  });
}

/**
 *
 * @name 新增角色
 * @param
 * platform:1 安卓| 2 IOS
 */
export async function add(params) {
  return request('/admin/role/addAdminRole', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' },
    body: params,
  });
}

/**
 *
 * @name 编辑角色
 * @param
 * platform:1 安卓| 2 IOS
 */
export async function modify(params) {
  return request('/admin/role/modifyAdminRole', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' },
    body: params,
  });
}

/**
 * 权限节点查询
 *
 */
export async function getNodeConfig(params) {
  
  // return Promise.resolve({...tree_data})
  return request('/admin/role/getNodeConfig', {
    method: 'GET',
    body: params,
  });
}

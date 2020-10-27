import request from '@/utils/request';

import { stringify } from 'qs';

/**
 *
 * @param {手机号,密码} params
 * @name 登陆接口
 */
export async function login(params) {
  return request('/admin/member/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' },
    body: params,
  });
}
/**
 *
 * @name 获取用户基本信息接口
 */
export async function getMemberInfo() {
  return request('/admin/member/getMemberInfo', {
    method: 'GET',
  });
}

/**
 * 权限节点
 */
export async function getRoleNodeList() {
  return request('/admin/rolenode/list', {
    method: 'GET',
  });
}
/**
 * 权限编辑
 * /admin/rolenode/edit
 */
export async function roleNodeEdit(params) {
  return request('/admin/rolenode/edit', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' },
    body: params,
  });
}

/**
 * 
 * @param {*} params 
 * 国家枚举
 */

export async function getGlobalCountryMap(params) {
  return request('/admin/config/getGlobalCountryMap', {
    method: 'GET',
  });
}

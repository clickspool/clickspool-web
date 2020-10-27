/*
 * @Author: senla.liu
 * @Date: 2020-01-17 14:06:44
 * @LastEditors  : senla.liu
 * @LastEditTime : 2020-01-17 15:01:24
 * @FilePath: \\xchat-web/src/pages/Operation/Users/services/index.ts
 */
import request from '@/utils/request';

import { Money, UserList, UserType } from './interface';

/**
 * @name 用户类型枚举
 * @param params
 */
export async function typeMap(params: any): Promise<any> {
 return request('/xchat/user/typeMap', {
   method: 'GET',
   body: params,
   headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' },
 });
}

/**
 * @name 设置用户类型
 * @param params
 */
export async function setUserType(params: UserType ): Promise<any> {
 return request('/xchat/user/setUserType', {
   method: 'POST',
   body: params,
   headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' },
 });
}

/**
 * @name 设置金额
 * @param params
 */
export async function setMoney(params: Money ): Promise<any> {
 return request('/xchat/user/setMoney', {
   method: 'POST',
   body: params,
   headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' },
 });
}

/**
 * @name 用户列表
 * @param params
 */
export async function getList(params: UserList ): Promise<any> {
 return request('/xchat/user/getList', {
   method: 'GET',
   body: params,
 });
}

/**
 * @name 账号类型
 * @param params
 */
export async function getUserTypesMap(query): Promise<any> {
  return request('/admin/user/getUserTypesMap', {
    method: 'GET',
    body: query,
  });
 }

/**
 * 
 * 批量设置identity（设置夜场主播）
 */
export async function batchSetIdentity(params) {
  return request('/admin/user/batchSetIdentity', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: params
  });
}

/**
 * /admin/user/updateUser
 * 编辑用户信息
 */

export async function updateUser(params) {
  return request('/admin/user/updateUser', {
    method: 'POST',
    headers: { 'Content-Type': '' },
    body: params
  });
}

/**
 * @name 刷新照片墙
 * @param params
 */
export async function updateBackgroundTime(params): Promise<any> {
  return request('/admin/user/updateBackgroundTime', {
    method: 'POST',
    body: params,
    headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' },
  });
 }

/**
 * @name 刷新活跃时间
 * @param params
 */
export async function updateLastActiveAt(params ): Promise<any> {
  return request('/admin/user/updateLastActiveAt', {
    method: 'POST',
    body: params,
    headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' },
  });
 }


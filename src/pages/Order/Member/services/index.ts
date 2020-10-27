/*
 * @Author: senla.liu
 * @Date: 2020-01-17 14:06:44
 * @LastEditors  : senla.liu
 * @LastEditTime : 2020-01-19 20:49:58
 * @FilePath: \\xchat-web/src/pages/Operation/Users/services/index.ts
 */
import request from '@/utils/request';

// import { Money, UserList, UserType } from './interface';

/**
 * @name 退款
 * @param params
 */
export async function refund(params: any): Promise<any> {
 return request('/xchat/order/refund', {
   method: 'POST',
   body: params,
   headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' },
 });
}

/**
 * @name 编辑
 * @param params
 */
export async function modify(params: any): Promise<any> {
  return request('/xchat/order/modify', {
    method: 'POST',
    body: params,
    headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' },
  });
 }

 /**
 * @name 设置状态
 * @param params
 */
export async function statusSet(params: any): Promise<any> {
  return request('/xchat/order/statusSet', {
    method: 'POST',
    body: params,
    headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' },
  });
 }
 
 /**
 * @name 列表
 * @param params
 */
export async function getList(params: any): Promise<any> {
  return request('/order/vip/getList', {
    method: 'GET',
    body: params,
  });
 }

  /**
   * @name 商品列表
   * @param params
   */
export async function productMap(params: any): Promise<any> {
  return request('/order/vip/productMap', {
    method: 'GET',
    body: params,
  });
 }

 /**
  * @name 状态枚举
  * @param params
  */
  export async function statusMap(query: any): Promise<any> {
    return request('/order/vip/statusMap', {
      method: 'GET',
      body: query,
    });
   }
/**
 * @name 支付类型枚举
 * @param params
 */
export async function payTypes(query: any): Promise<any> {
 return request('/order/diamond/payTypes', {
   method: 'GET',
   body: query,
 });
}
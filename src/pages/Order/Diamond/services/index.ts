/*
 * @Author: senla.liu
 * @Date: 2020-01-17 14:06:44
 * @LastEditors  : senla.liu
 * @LastEditTime : 2020-01-20 10:36:59
 * @FilePath: \\xchat-web/src/pages/Operation/Users/services/index.ts
 */
import request from '@/utils/request';

// import { Money, UserList, UserType } from './interface';

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

/**
 * @name 钻石商品列表
 * @param params
 */
export async function productMap(query: any): Promise<any> {
 return request('/order/diamond/productMap', {
   method: 'GET',
   body: query,
 });
}

/**
 * @name 状态枚举
 * @param params
 */
export async function statusMap(query: any): Promise<any> {
 return request('/order/diamond/statusMap', {
   method: 'GET',
   body: query,
 });
}

/**
 * @name 编辑
 * @param params
 */
export async function modify(params: any): Promise<any> {
  return request('/xchat/orderDiamond/modify', {
    method: 'POST',
    body: params,
    headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' },
  });
 }
 
 /**
  * @name 钻石充值列表
  * @param params
  */
export async function getList(params: any): Promise<any> {
  console.info('getList__',params);
  return request('/order/diamond/getList', {
    method: 'GET',
    body: params,
  });
 }


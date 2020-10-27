import request from '@/utils/request';

//活动素材sever

/**
 *
 * @name 列表
 * @param {page:1} param page从1开始
 *
 */
export async function fetch(QUERY) {
  return request('/order/package/getList', {
    method: 'GET',
    body: QUERY,
  });
}

/**
 *
 * @name 礼包商品列表
 * @param {page:1} param page从1开始
 *
 */
export async function productMap(QUERY) {
  return request('/order/package/productMap', {
    method: 'GET',
    body: QUERY,
  })
}


/**
 * @name 状态枚举
 * @param params
 */
export async function statusMap(query){
  return request('/order/diamond/statusMap', {
    method: 'GET',
    body: query,
  })
 }

 /**
 * @name 支付类型枚举
 * @param params
 */
export async function payTypes(query){
  return request('/order/diamond/payTypes', {
    method: 'GET',
    body: query,
  })
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

import request from '@/utils/request';

//活动素材sever

/**
 *
 * @name 列表
 * @param {page:1} param page从1开始
 *
 */
export async function fetch(QUERY) {
  return request('/admin/user/getUserTurnover', {
    method: 'GET',
    body: QUERY,
  });
}

/**
 * 钻石碎片查询
 * @param {*} QUERY 
 */
export async function getDiamondShardsList(QUERY) {
  return request('/order/diamond/getDiamondShardsList', {
    method: 'GET',
    body: QUERY,
  });
}



/**
 * 钻石碎片类型枚举
 * @param {*} QUERY 
 */
export async function diamondShardFromTypes(QUERY) {
  return request('/order/diamond/diamondShardFromTypes', {
    method: 'GET',
    body: QUERY,
  });
}

export async function turnoverFromTypes(QUERY) {
  return request('/admin/user/getTurnoverFromTypes', {
    method: 'GET',
    body: QUERY,
  });
}

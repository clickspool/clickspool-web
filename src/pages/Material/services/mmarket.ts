
import request from '@/utils/request';
/**
 * 获取列表
 */
export async function fetch(query) {
  return request('/admin/affiliate/promotionMaterialList', {
    method: 'GET',
    body: query
  });
}

/**
 * 领取任务
 * @param {*} params 
 */
export async function receive(params) {
  return request('/admin/affiliate/receive', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: params
  });
}

/**
 * 编辑状态
 * @param {*} 物料详情 
 */
export async function materialDetail(query) {
  return request('/admin/affiliate/materialInfo', {
    method: 'GET',
    body: query
  });
}
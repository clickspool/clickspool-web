
import request from '@/utils/request';

/**
 * 获取列表
 */
export async function fetch(query) {
  return request('/order/withdraw/getList', {
    method: 'GET',
    body: query
  });
}

/**
 * 编辑状态
 * @param {*} params 
 */
export async function patchStatus(params) {
  return request('/order/withdraw/statusSet', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: params
  });
}

/**
 * 获取状态枚举
 */
export async function fetchStatuses() {
  return request('/order/withdraw/statusMap', {
    method: 'GET'
  });
}

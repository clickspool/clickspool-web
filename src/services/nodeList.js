import request from '@/utils/request';

/**
 *
 * @param {member_id password} params
 */

export async function modifyNode(params) {
  return request('/admin/role/modifyNode', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' },
    body: params,
  });
}

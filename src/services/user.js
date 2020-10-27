import request from '@/utils/request';

/**
 *
 * @param {member_id password} params
 */

export async function modifyPassword(params) {
  return request('/admin/member/modifyPassword', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' },
    body: params,
  });
}

export async function getAdminMemberList(params) {
  return request('/admin/member/getAdminMemberList', {
    method: 'GET',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' },
    body: params,
  });
}

export async function modifySelfPassword(params) {
  return request('/admin/member/modifySelfPassword', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' },
    body: params,
  });
}

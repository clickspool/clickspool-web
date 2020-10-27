import request from '@/utils/request';

/**
 *
 * @name 查询图片组列表
 */
export async function source() {
  return request('/admin/resourcegroup/source');
}

/**
 *
 * @name 查询所有图片列表
 * @param {page:1} param page从1开始
 *
 */
export async function getList(params) {
  return request('/admin/picture/index', {
    method: 'GET',
    body: params,
  });
}

/**
 *
 * @name 新图片类型
 * @param
 * {group: 50,name: 1111,
 * note: 222,link_url: 2222,
 * status: 1,start_time: 2018-11-20 17:16:34,
 * end_time: 2018-11-30 17:16:36,
 * sort: 111,data: 222,file: (binary),picture_url: (binary)}
 *
 */
export async function add(params) {
  return request('/admin/picture/add', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' },
    body: params,
  });
}

export async function edit(id, params) {
  return request(`/admin/picture/edit?id=${id}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' },
    body: params,
  });
}

export async function del(params) {
  return request('/admin/picture/delete', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' },
    body: params,
  });
}

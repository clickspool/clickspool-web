import request from '@/utils/request';

/**
 *
 * @name 查询所有分组列表
 * @param {page:1} param page从1开始
 *
 */
export async function getList(params) {
  return request('/admin/resourcegroup/index', {
    method: 'GET',
    body: params,
  });
}

/**
 * 
 * @name 添加
 * @param 
 *   name: 阿萨德
    note: 1111
    sort: 111
    token: 4645xEBNiJWHMvz_iRM2dHxYyUIOWYZWZ8KbPCgjo6gtmQVeipYnJb3mZ5EsuvzHQIvsxW8
    dtu: 200
  *
 */
export async function add(params) {
  return request('/admin/resourcegroup/add', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' },
    body: params,
  });
}

/**
 *
 * @name 编辑
 * @param
 *   name: eventLoopPic111
 *   note: 活动轮播图
 *   sort: 1
 *   id: 55
 *   token: 4645xEBNiJWHMvz_iRM2dHxYyUIOWYZWZ8KbPCgjo6gtmQVeipYnJb3mZ5EsuvzHQIvsxW8
 *   dtu: 200
 *
 */
export async function edit(params) {
  return request(`/admin/resourcegroup/edit`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' },
    body: params,
  });
}

export async function del(params) {
  return request('/admin/resourcegroup/delete', {
    method: 'GET',
    body: params,
  });
}

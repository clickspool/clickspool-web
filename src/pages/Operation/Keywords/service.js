import request from '@/utils/request';
/**
 *
 * @name 删除
 * @param 
 *
 */
export async function templateDelete(params) {
  return request('/admin/magic/templateDelete', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' },
    body: params,
  });
}
/**
 *
 * @name 上下架
 * @param 
 *
 */
export async function templateStatusSet(params) {
  return request('/admin/magic/templateStatusSet', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' },
    body: params,
  });
}



/**
 *
 * @name 列表
 * 
 */
export async function templateList(params) {
  return request('/admin/magic/templateList', {
    method: 'GET',
    body: params,
  });
}

/**
 *
 * @name 上下架枚举
 * 
 */
export async function templateStatusMap(params) {
  return request('/admin/magic/templateStatusMap', {
    method: 'GET',
    body: params,
  });
}

/**
 *
 * @name 新增
 * 
 */
export async function templateAdd(params) {
  return request('/admin/magic/templateAdd', {
    method: 'POST',
    headers: { 'Content-Type': '' },
    body: params,
  });
}

/**
 *
 * @name 编辑
 * 
 */
export async function templateModify(params) {
  return request('/admin/magic/templateModify', {
    method: 'POST',
    headers: { 'Content-Type': '' },
    body: params,
  });
}
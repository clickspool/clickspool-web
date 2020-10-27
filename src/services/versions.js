import request from '@/utils/request';

/**
 *
 * @name 查询所有版本列表
 * @param {page:1} param page从1开始
 *
 */
export async function getList(params) {
  return request('/admin/appversion/getList', {
    method: 'GET',
    body: params,
  });
}

/**
 *
 * @name 新增强更版本
 * @param {id: 1, version: v15000 ,info: sdfsdfd ,url: sassdsd ,platform: 1 }
 * platform:1 安卓| 2 IOS
 */
export async function add(params) {
  return request('/admin/appversion/add', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' },
    body: params,
  });
}

/**
 *
 * @name 编辑强更版本
 * @param {id: 1, version: v15000 ,info: sdfsdfd ,url: sassdsd ,platform: 1 }
 * platform:1 安卓| 2 IOS
 */
export async function modify(params) {
  return request('/admin/appversion/modify', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' },
    body: params,
  });
}

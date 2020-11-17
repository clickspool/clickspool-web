
import request from '@/utils/request';


/**
 * 获取列表
 */
export async function fetch(query) {
  return request('/admin/affiliate/myMaterialList', {
    method: 'GET',
    body: query
  });
}
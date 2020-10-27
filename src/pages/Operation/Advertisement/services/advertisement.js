
import request from '@/utils/request';

/**
 * 创建道具
 * @param {*} params 
 */
export async function create(params) {
  return request('/admin/gift/addTool', {
    method: 'POST',
    headers: { 'Content-Type': '' },
    body: params
  });
}
/**
 * 投放数据导入
 * @param {*} params 
 */
export async function upload(params) {
  return request('/ad/advertising/importCsv', {
    method: 'POST',
    headers: { 'Content-Type': '' },
    body: params
  });
}

/**
 * 获取投放数据
 */
export async function fetch(query) {
  return request('/ad/advertising/getList', {
    method: 'GET',
    body: query
  });
}
/**
 * 模板下载
 */
export async function getImportTemplate(query) {
  return request('/ad/advertising/getImportTemplate', {
    method: 'GET',
    body: query
  });
}
/**
 * 删除数据
 */
export async function deleteData(query) {
  return request('/ad/advertising/deleteData', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: query
  });
}
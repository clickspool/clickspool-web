
import request from '@/utils/request';


/**
 * 获取列表
 */
export async function fetch(query) {
  return request('/money/mcn/getList', {
    method: 'GET',
    body: query
  });
}
/**
 * MCN底薪成本数据导入
 * @param {*} params 
 */
export async function importCsv(params) {
  return request('/money/mcn/importCsv', {
    method: 'POST',
    body: params
  });
}

/**
 * MCN底薪模板下载
 */
export async function getImportTemplate() {
  return request('/money/mcn/getImportTemplate', {
    method: 'GET',
    headers: { 'Content-Type': '' },
  });
}


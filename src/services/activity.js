import request from '@/utils/request';

//活动素材sever

/**
 *
 * @name 查询活动素材列表
 * @param {page:1} param page从1开始
 *
 */
export async function getList(params) {
  return request('/admin/material/getList', {
    method: 'GET',
    body: params,
  });
}

/**
 *
 * @name 素材链路列表
 *
 */
export async function getLineList(params) {
  return request('/admin/material/getLineList', {
    method: 'GET',
    body: params,
  });
}

/**
 *
 * @name 素材状态列表
 *
 */
export async function getStatusList(params) {
  return request('/admin/material/getStatusList', {
    method: 'GET',
    body: params,
  });
}

/**
 * 添加素材
 * @param {*} params 
 */
export async function addMaterial(params) {
  return request('/admin/material/addMaterial', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' },
    body: params,
  });
}

/**
 * 编辑素材
 * @param {*} params 
 */
export async function modifyMaterial(params) {
  return request('/admin/material/modifyMaterial', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' },
    body: params,
  });
}

/**
 * 素材上下架接口
 * @param {*} params 
 */
export async function modifyStatus(params) {
  return request('/admin/material/modifyStatus', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' },
    body: params,
  });
}

/**
 * 删除素材接口
 * @param {*} params 
 */
export async function deleteMaterial(params) {
  return request('/admin/material/deleteMaterial', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' },
    body: params,
  });
}

/**
 *
 * @name 素材统计数据导出
 *
 */
export async function exportMaterialStat(params) {
  return request('/admin/material/exportMaterialStat', {
    method: 'GET',
    body: params,
  });
}

/**
 *
 * @name 素材统计数据
 *
 */
export async function getMaterialStat(params) {
  return request('/admin/material/getMaterialStat', {
    method: 'GET',
    body: params,
  });
}
/**
 * 图片上传
 */

export async function uploadImage(params) {
  return request('/admin/upload/uploadImage', {
    method: 'POST',
    headers: {},
    body: params,
  });
}

/**
 * 图片上传
 */

export async function getMaterialCateList() {
  return request('/admin/material/getMaterialCateList', {
    method: 'GET',
  });
}


/**
 * 添加素材
 */
// export async function addMaterial(params) {
//   return request('/admin/material/addMaterial', {
//     method: 'POST',
//     headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' },
//     body: params,
//   });
// }
/**
 * 编辑素材
 */
// export async function modifyMaterial(params) {
//   return request('/admin/material/modifyMaterial', {
//     method: 'POST',
//     headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' },
//     body: params,
//   });
// }
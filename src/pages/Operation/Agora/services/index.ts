
import request from '@/utils/request';

/**
 * 用户视频匹配录制列表
 */
export async function fetch(query) {
  return request('/user/agora/getList', {
    method: 'GET',
    body: query
  });
}

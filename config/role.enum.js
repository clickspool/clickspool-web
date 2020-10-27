import McMenuData from './router.config.menu';
import memoizeOne from 'memoize-one';

export const goLinkMenuKeys = ['1-4-1','1-4-2','1-4-3','1-4-4','1-11-1','1-11-2','1-12-1','1-12-2','1-12-3','1-13-1','1-13-2','1-13-3','1-1-1','1-1-2','1-1-3','1-18-1','1-18-2','1-18-3','4-6','4-1',
'4-3', '2-1','2-2','2-4','2-3'];

/**
 * 枚举
 * status  1 未回复
 * status  2 已回复
 * status  3 驳回
 */
export const serviceFaqStatus = [
  { label: '未回复', status: 1 },
  { label: '已回复', status: 2 },
  { label: '驳回', status: 3 },
];

/**
 *
 * @param {*} key
 * @return linkpath
 */
export function goLinkRouter(key) {
 return findPath(key,McMenuData[1]['routes']);
}
// const tree = McMenuData[1];
function findPath(key,arr){
  let path = '';
  for(var i=0;i<arr.length-1;i++){
    if(arr[i].key===key){
      path= arr[i]['path']
    }
    if(arr.routes){
      findPath(key,arr.routes);
    }
  }
  return path;
 
}

export const operationEnum = {
  select: 'select',
  add: 'add',
  edit: 'edit',
  cancel: 'cancel',
  del: 'del',
  online: 'online',
  offline: 'offline',
  comfrim: 'comfrim',
  recall: 'recall',
  category: 'category',
};

const roleEmu = {
  '/operation/material/image': [
    { type: operationEnum.select, title: '浏览图片', key: '1-1-1-1', url: '' },
    { type: operationEnum.add, title: '新建图片', key: '1-1-1-2', url: '' },
    { type: operationEnum.edit, title: '编辑图片', key: '1-1-1-3', url: '' },
    { type: operationEnum.del, title: '删除图片', key: '1-1-1-4', url: '' },
  ],
  '/operation/material/imagegroup': [
    { type: operationEnum.select, title: '查询分组', key: '1-1-2-1', url: '' },
    { type: operationEnum.add, title: '新建分组', key: '1-1-2-2', url: '' },
    { type: operationEnum.edit, title: '编辑分组', key: '1-1-2-3', url: '' },
    { type: operationEnum.del, title: '删除分组', key: '1-1-2-4', url: '' },
  ],
  '/system/permission': [
    { type: operationEnum.select, title: '浏览账号', key: '2-1-1', url: '' },
    { type: operationEnum.add, title: '新建账号', key: '2-1-2', url: '' },
    { type: operationEnum.edit, title: '编辑账号', key: '2-1-3', url: '' },
    { type: operationEnum.del, title: '删除账号', key: '2-1-4', url: '' },
  ],
  '/system/role': [
    { type: operationEnum.select, title: '查询角色', key: '2-2-1', url: '' },
    { type: operationEnum.add, title: '新建角色', key: '2-2-2', url: '' },
    { type: operationEnum.edit, title: '编辑角色', key: '2-2-3', url: '' },
    { type: operationEnum.del, title: '删除角色', key: '2-2-4', url: '' },
  ],
  '/system/versions': [
    { type: operationEnum.select, title: '浏览版本', key: '2-3-1', url: '' },
    { type: operationEnum.add, title: '新建版本', key: '2-3-2', url: '' },
    { type: operationEnum.edit, title: '编辑版本', key: '2-3-3', url: '' },
    { type: operationEnum.del, title: '删除版本', key: '2-3-4', url: '' },
  ],
  '/system/setting': [
    { type: operationEnum.select, title: '浏览配置', key: '2-4-1', url: '' },
    { type: operationEnum.add, title: '新建配置', key: '2-4-2', url: '' },
    { type: operationEnum.edit, title: '编辑配置', key: '2-4-3', url: '' },
    { type: operationEnum.del, title: '删除配置', key: '2-4-4', url: '' },
  ],
  '/node': [
    { type: operationEnum.select, title: '节点浏览', key: '3-1-1', url: '' },
    { type: operationEnum.add, title: '新建节点', key: '3-1-2', url: '' },
    { type: operationEnum.edit, title: '编辑节点', key: '3-1-3', url: '' },
    { type: operationEnum.del, title: '删除节点', key: '3-1-4', url: '' },
  ],
  '/feedback/feedbackcategory': [
    { type: operationEnum.select, title: '反馈分类浏览', key: '4-6-1', url: '' },
    { type: operationEnum.add, title: '新建反馈分类', key: '4-6-2', url: '' },
    { type: operationEnum.edit, title: '编辑反馈分类', key: '4-6-3', url: '' },
    { type: operationEnum.del, title: '删除反馈分类', key: '4-6-4', url: '' },
  ],
  '/feedback/faq':[
    { type: operationEnum.select, title: '反馈帮助浏览', key: '4-3-1', url: '' },
    { type: operationEnum.add, title: '新建反馈帮助', key: '4-3-2', url: '' },
    { type: operationEnum.edit, title: '编辑反馈帮助', key: '4-3-3', url: '' },
    { type: operationEnum.del, title: '删除反馈帮助', key: '4-3-4', url: '' },
  ],
  '/feedback/customer':[
    { type: operationEnum.select, title: '反馈浏览', key: '4-1-1', url: '' },
    { type: operationEnum.add, title: '新建反馈', key: '4-1-2', url: '' },
    { type: operationEnum.edit, title: '编辑反馈', key: '4-1-3', url: '' },
    { type: operationEnum.del, title: '删除反馈', key: '4-1-4', url: '' },
  ],
  '/operation/scenecategory': [
    { type: operationEnum.select, title: '道具分类浏览', key: '1-10-1', url: '' },
    { type: operationEnum.add, title: '新建道具分类', key: '1-10-2', url: '' },
    { type: operationEnum.edit, title: '编辑道具分类', key: '1-10-3', url: '' },
    { type: operationEnum.del, title: '删除道具分类', key: '1-10-4', url: '' },
  ],
  '/operation/material/activity': [
    { type: operationEnum.select, title: '活动素材浏览', key: '1-7-1', url: '' },
    { type: operationEnum.add, title: '新建活动素材', key: '1-7-2', url: '' },
    { type: operationEnum.edit, title: '编辑活动素材', key: '1-7-3', url: '' },
    { type: operationEnum.del, title: '删除活动素材', key: '1-7-4', url: '' },
  ],
  '/operation/suppliesdata': [
    { type: operationEnum.select, title: '活动数据浏览', key: '1-8-1', url: '' },
  ],
  '/operation/scene': [
    { type: operationEnum.select, title: '道具浏览', key: '1-9-1', url: '' },
    { type: operationEnum.add, title: '新建道具', key: '1-9-2', url: '' },
    { type: operationEnum.edit, title: '编辑道具', key: '1-9-3', url: '' },
    { type: operationEnum.del, title: '删除道具', key: '1-9-4', url: '' },
  ],
};

export function getKey(path, type) {
  const roleEmuFilter = roleEmu[path]
                          .find(item => {
                              return item.type === type;
                          });
  if (!roleEmu[path]||!roleEmuFilter) {
    return '';
  }
  return roleEmuFilter['key'];
}

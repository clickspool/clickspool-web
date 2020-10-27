import { parse, stringify } from 'qs';

import React from 'react';

import moment from 'moment';

import nzh from 'nzh/cn';

import _ from 'lodash';

import { formatMessage } from 'umi/locale';


function _isConstructorMoment(fun){

  return moment.isMoment(fun);
}

export function centerEllipsis(str){
  return str.replace(/(.{5})(.*)(.{2}\..*)$/,"$1...$3"); 
}

export function delHtmlTag(str){
  return str.replace(/<[^>]+>/g,"");  //正则去掉所有的html标记
}
export function base64RmHeader(base64){
  return base64.replace(/^data:image\/\w+;base64,/, "")
}
export function base64AddHeader(str){
  return `data:image/png;base64,${str}`
}

export function momentToString(obj,format='YYYY-MM-DD HH:mm:ss'){
  let ow = delNillObject(obj);
  for(var i in ow){
    if(!_.isArray(ow[i])&&_.isObject(ow[i])&&_isConstructorMoment(ow[i])){
      ow[i] = ow[i].format(format)
    }
  }
  return ow
}
export function stringToMoment(obj,format='YYYY-MM-DD HH:mm:ss'){
  const reg = /^(\d{4})-(\d{2})-(\d{2})(\s(\d{2}):(\d{2}):(\d{2}))?$/;
  let ow = delNillObject(obj);
  for(var i in ow){
    if(!_.isObject(ow[i])&&reg.test(ow[i])){
      ow[i] = moment(ow[i],format);
    }
  }
  return ow
}

export function delNillObject(obj){
    const o = {};
    for(let i in obj){
      if(!_.isNil(obj[i])&&obj[i]!==''){
        o[i]=obj[i]
      }
    }
    // if(!isEmptyObj(o)){
    //   return false
    // }
    return o;
}

export function toParseInt(str) {
  if (str) {
    return parseInt(str || 0);
  }
  return 0;
}

export function fixedZero(val) {
  return val * 1 < 10 ? `0${val}` : val;
}

export function getTimeDistance(type) {
  const now = new Date();
  const oneDay = 1000 * 60 * 60 * 24;

  if (type === 'today') {
    now.setHours(0);
    now.setMinutes(0);
    now.setSeconds(0);
    return [moment(now), moment(now.getTime() + (oneDay - 1000))];
  }

  if (type === 'week') {
    let day = now.getDay();
    now.setHours(0);
    now.setMinutes(0);
    now.setSeconds(0);

    if (day === 0) {
      day = 6;
    } else {
      day -= 1;
    }

    const beginTime = now.getTime() - day * oneDay;

    return [moment(beginTime), moment(beginTime + (7 * oneDay - 1000))];
  }

  if (type === 'month') {
    const year = now.getFullYear();
    const month = now.getMonth();
    const nextDate = moment(now).add(1, 'months');
    const nextYear = nextDate.year();
    const nextMonth = nextDate.month();

    return [
      moment(`${year}-${fixedZero(month + 1)}-01 00:00:00`),
      moment(moment(`${nextYear}-${fixedZero(nextMonth + 1)}-01 00:00:00`).valueOf() - 1000),
    ];
  }

  const year = now.getFullYear();
  return [moment(`${year}-01-01 00:00:00`), moment(`${year}-12-31 23:59:59`)];
}

export function getPlainNode(nodeList, parentPath = '') {
  const arr = [];
  nodeList.forEach(node => {
    const item = node;
    item.path = `${parentPath}/${item.path || ''}`.replace(/\/+/g, '/');
    item.exact = true;
    if (item.children && !item.component) {
      arr.push(...getPlainNode(item.children, item.path));
    } else {
      if (item.children && item.component) {
        item.exact = false;
      }
      arr.push(item);
    }
  });
  return arr;
}

export function digitUppercase(n) {
  return nzh.toMoney(n);
}

function getRelation(str1, str2) {
  if (str1 === str2) {
    console.warn('Two path are equal!'); // eslint-disable-line
  }
  const arr1 = str1.split('/');
  const arr2 = str2.split('/');
  if (arr2.every((item, index) => item === arr1[index])) {
    return 1;
  }
  if (arr1.every((item, index) => item === arr2[index])) {
    return 2;
  }
  return 3;
}

function getRenderArr(routes) {
  let renderArr = [];
  renderArr.push(routes[0]);
  for (let i = 1; i < routes.length; i += 1) {
    // 去重
    renderArr = renderArr.filter(item => getRelation(item, routes[i]) !== 1);
    // 是否包含
    const isAdd = renderArr.every(item => getRelation(item, routes[i]) === 3);
    if (isAdd) {
      renderArr.push(routes[i]);
    }
  }
  return renderArr;
}

/**
 * Get router routing configuration
 * { path:{name,...param}}=>Array<{name,path ...param}>
 * @param {string} path
 * @param {routerData} routerData
 */
export function getRoutes(path, routerData) {
  let routes = Object.keys(routerData).filter(
    routePath => routePath.indexOf(path) === 0 && routePath !== path
  );
  // Replace path to '' eg. path='user' /user/name => name
  routes = routes.map(item => item.replace(path, ''));
  // Get the route to be rendered to remove the deep rendering
  const renderArr = getRenderArr(routes);
  // Conversion and stitching parameters
  const renderRoutes = renderArr.map(item => {
    const exact = !routes.some(route => route !== item && getRelation(route, item) === 1);
    return {
      exact,
      ...routerData[`${path}${item}`],
      key: `${path}${item}`,
      path: `${path}${item}`,
    };
  });
  return renderRoutes;
}

export function getPageQuery() {
  return parse(window.location.href.split('?')[1]);
}

export function getQueryPath(path = '', query = {}) {
  const search = stringify(query);
  if (search.length) {
    return `${path}?${search}`;
  }
  return path;
}

/* eslint no-useless-escape:0 */
const reg = /(((^https?:(?:\/\/)?)(?:[-;:&=\+\$,\w]+@)?[A-Za-z0-9.-]+(?::\d+)?|(?:www.|[-;:&=\+\$,\w]+@)[A-Za-z0-9.-]+)((?:\/[\+~%\/.\w-_]*)?\??(?:[-\+=&;%@.\w_]*)#?(?:[\w]*))?)$/;

export function isUrl(path) {
  return reg.test(path);
}

export function formatWan(val) {
  const v = val * 1;
  if (!v || Number.isNaN(v)) return '';

  let result = val;
  if (val > 10000) {
    result = Math.floor(val / 10000);
    result = (
      <span>
        {result}
        <span
          styles={{
            position: 'relative',
            top: -2,
            fontSize: 14,
            fontStyle: 'normal',
            lineHeight: 20,
            marginLeft: 2,
          }}
        >
          万
        </span>
      </span>
    );
  }
  return result;
}

/**
 *
 * @param {平台枚举} key
 */
export function getPlatform(key) {
  switch (key) {
    case '1':
      return formatMessage({ id: 'app.platform' });
    //  break;

    default:
      return 'IOS';
  }
}

/**
 *
 * @param {对象参数} o
 */
export function type(o) {
  return Object.prototype.toString
    .apply(o)
    .slice(8, -1)
    .toLowerCase();
}

/**
 * 判断是否空对象
 * @param {*} {} 
 */
export function isEmptyObject(obj){
  for(var key in obj){
       return false
  };
  return true
}
/**
 * 拆分roleid  获取所有id
 * @param {} array
 * ['0-0-0'] return ['0','0-0','0-0-0']
 * 数组去重
 */

export function splitRoleIds(array) {
  let newArr = array;
  array.forEach(item => {
    if (item.length > 1) {
      let na = [];
      let itemSplit = item.split('-');
      itemSplit.forEach((ii, index) => {
        if (index == 0) {
          na.push(ii);
        }
        if (index == 1) {
          na.push(`${na[0]}-${ii}`);
        }
        if (index == 2) {
          na.push(`${na[1]}-${ii}`);
        }
        newArr.push(na);
      });
    }
  });

  return uniq(_.flattenDeep(newArr));
}

/**
 * 数组去重
 * @param {*} array
 */

function uniq(array) {
  var temp = {},
    r = [],
    len = array.length,
    val,
    type;
  for (var i = 0; i < len; i++) {
    val = array[i];
    type = typeof val;
    if (!temp[val]) {
      temp[val] = [type];
      r.push(val);
    } else if (temp[val].indexOf(type) < 0) {
      temp[val].push(type);
      r.push(val);
    }
  }
  return r;
}

/**
 * 取节点最底层
 */
export function getRoleRootIds(array) {
  const rootlen=array.reduce((curr,prev)=>{
        return curr = curr.length>prev.length?curr:prev
    },'')
    .split('-')
    .length;
  let combination = {};
  let wTemp = rootlen-1;
  while (wTemp>-1) {
    combination={[wTemp]:getIds(wTemp),...combination}
    wTemp--
  }
  return function(combination){
      let root = [];
      for(let i in combination){
        root = [...getUltimatelyIds(i),...root];
      }
      function getUltimatelyIds(i){
          const curr = combination[i];
          const prev = combination[+i-1]||[];

          var filterArr= prev.filter((item)=>{
           return !curr.some((oitem)=>{
              return oitem.replace(/(.*)(\-.*)$/g,'$1') === item ;
            })
         });
         
         if(rootlen-1==i){
            return [...curr,...filterArr];
         }
         return filterArr;
      }
      
    return root;
  }(combination);

  function getIds(len){
    return array.filter(item => {
      return getPlaceholderCount(item, '-') === len;
    });
  }
}

function getPlaceholderCount(strSource, char) {
  const regex = new RegExp(char, 'g'); 
  const result = strSource.match(regex);
  return !result ? 0 : result.length;
}

/**
 * 去除对象内属性undefined
 */
export function removeObjUndefined(obj) {
  let newObj = {};

  for (let i in obj) {
    if (type(obj[i]) !== 'undefined') {
      newObj[i] = obj[i];
    }
  }
  return newObj;
}

export function checkRate(input) {
  var re = /^[0-9]+.?[0-9]*/; //判断字符串是否为数字//判断正整数/[1−9]+[0−9]∗]∗/
  if (!re.test(input)) {
    return false;
  }
  return true;
}

function isEmptyObj(o) {
  for (let attr in o) return !1;
  return !0;
}
function processArray(arr) {
  for (let i = arr.length - 1; i >= 0; i--) {
    if (arr[i] === null || arr[i] === undefined) arr.splice(i, 1);
    else if (typeof arr[i] == 'object') removeNullItem(arr[i], arr, i);
  }
  return arr.length == 0;
}
function proccessObject(o) {
  for (let attr in o) {
    if (o[attr] === null || o[attr] === '' || o[attr] === undefined) delete o[attr];
    else if (typeof o[attr] == 'object') {
      removeNullItem(o[attr]);
      if (isEmptyObj(o[attr])) delete o[attr];
    }
  }
}
/**
 * 去除对象内属性undefined
 */
export function removeNullItem(o, arr, i) {
  let s = {}.toString.call(o);
  if (s == '[object Array]') {
    if (processArray(o) === true) {
      //o也是数组，并且删除完子项，从所属数组中删除
      if (arr) arr.splice(i, 1);
    }
  } else if (s == '[object Object]') {
    proccessObject(o);
    if (arr && isEmptyObj(o)) arr.splice(i, 1);
  }
}


export const PAYERROR = [
    {code:3 ,error:"Billing API version is not supported for the type requested"},
    {code:5, error:"Invalid arguments provided to the API. This error can also indicate that the application was not correctly signed or properly set up for In-app Billing in Google Play, or does not have the necessary permissions in its manifest"},
    {code:1 ,error:"User pressed back or canceled a dialog"},
    {code:2 ,error:"Network connection is down"},
    {code:-1 ,error:"Play Store service is not connected now - potentially transient state"},
    {code:4 ,error:"Requested product is not available for purchase"},
    {code:8 ,error:"Failure to consume since item is not owned"},
    {code:7 ,error:"Failure to purchase since item is already owned"},
    {code:6,error:"Fatal error during the API action"},
    {code:-2 ,error:"Requested feature is not supported by Play Store on the current device."},
    {code:-100	 ,error:"Product doesn't exist"},
    {code:-101	 ,error:"Billing service unavailable on device"},
  ]
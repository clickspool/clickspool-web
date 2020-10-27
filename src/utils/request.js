import { removeNullItem } from '@/utils/utils';

import { notification, message } from 'antd';

import _ from 'lodash';

import hash from 'hash.js';

import fetch from 'dva/fetch';

import router from 'umi/router';

import { instanceOf } from 'prop-types';

import { getLocale } from 'umi/locale';

import apiConfig from './apiConfig';
import { getAuthority } from './authority';
import spinninganchor from './spinninganchor';

import qs from 'qs';

const Url = require('./url.js');

message.config({
  duration: 2,
  maxCount: 1,
});
const codeMessage = {
  200: '服务器成功返回请求的数据。',
  201: '新建或修改数据成功。',
  202: '一个请求已经进入后台排队（异步任务）。',
  204: '删除数据成功。',
  400: '发出的请求有错误，服务器没有进行新建或修改数据的操作。',
  401: '用户没有权限（令牌、用户名、密码错误）。',
  403: '用户得到授权，但是访问是被禁止的。',
  404: '发出的请求针对的是不存在的记录，服务器没有进行操作。',
  406: '请求的格式不可得。',
  410: '请求的资源被永久删除，且不会再得到的。',
  422: '当创建一个对象时，发生一个验证错误。',
  500: '服务器发生错误，请检查服务器。',
  502: '网关错误。',
  503: '服务不可用，服务器暂时过载或维护。',
  504: '网关超时。',
};

const checkStatus = response => {
  if (response.status >= 200 && response.status < 300) {
    return response;
  }
  const errortext = codeMessage[response.status] || response.statusText;
  notification.error({
    message: `请求错误 ${response.status}: ${response.url}`,
    description: errortext,
  });
  const error = new Error(errortext);
  error.name = response.status;
  error.response = response;
  throw error;
};

const cachedSave = (response, hashcode) => {
  /**
   * Clone a response data and store it in sessionStorage
   * Does not support data other than json, Cache only json
   */
  const contentType = response.headers.get('Content-Type');
  if (contentType && contentType.match(/application\/json/i)) {
    // All data is saved as text
    response
      .clone()
      .text()
      .then(content => {
        // sessionStorage.setItem(hashcode, content);
        // sessionStorage.setItem(`${hashcode}:timestamp`, Date.now());
      });
  }
  return response;
};

/**
 * Requests a URL, returning a promise.
 *
 * @param  {string} url       The URL we want to request
 * @param  {object} [option] The options we want to pass to "fetch"
 * @return {object}           An object containing either "data" or "err"
 */
export default function request(url, option = {}) {
  const query =qs.parse(window.location.search.substr(1))
  const options = {
    ...option
  };
  if(!!option.method&&(option.method).toLocaleUpperCase()=='POST'&&spinninganchor.indexOf(url)){
    window.g_app._store.dispatch({
      type: 'global/changeSpinning',
      payload:{
        spinning:true
      }
    });
  }

  /**
   * Produce fingerprints based on url and parameters
   * Maybe url has the same parameters
   */

  const fingerprint = url + (options.body ? JSON.stringify(options.body) : '');
  const hashcode = hash
    .sha256()
    .update(fingerprint)
    .digest('hex');

  const defaultOptions = {
    // mode: 'cors',
    body: {
      dtu: 200,
      token: getAuthority(),
      'global_system_lan':getLocale()=='en-US'?1:0
      // token:'e635k2Szx8cHCcy35G2O5A7sGSUTvSUNCQ5MqMfdPATCiaoUfilqWP4sc1adQLjiqygiQHg'
    },
  };
  if(query.global_system_state){
    defaultOptions.body.global_system_state = +query.global_system_state;
  }
  
  let newOptions;
  // console.info('newOptions_0');
  if (options.body instanceof FormData) {
    newOptions = options;
    newOptions.body = options.body;
    Object.keys(defaultOptions.body).forEach(key => {
      newOptions.body.append(key, defaultOptions.body[key]);
    });
  } else {
    newOptions = _.merge(options, defaultOptions);
  }

  removeNullItem(newOptions);
  if (
    newOptions.method === 'POST' ||
    newOptions.method === 'PUT' ||
    newOptions.method === 'DELETE'
  ) {
    if (!(newOptions.body instanceof FormData)) {
      newOptions.headers = {
        Accept: 'application/json',
        'Content-Type': 'application/json; charset=utf-8',
        ...options.headers,
      };

      if (/form/.test(newOptions.headers['Content-Type'])) {
        newOptions.headers = {
          ...options.headers,
          Accept: 'application/x-www-form-urlencoded; charset=UTF-8',
        };
        newOptions.body = Url.stringify(newOptions.body);
      } else {
        newOptions.body = JSON.stringify(newOptions.body);
      }
    } else {
      // newOptions.body is FormData
      newOptions.headers = {
        Accept: 'application/x-www-form-urlencoded; charset=UTF-8',
        ...newOptions.headers,
      };
    }
  } else {
    newOptions.body._t = +new Date();
    url = `${url}?${Url.stringify(newOptions.body)}`;
    newOptions = {};
  }

  const expirys = options.expirys && 60;
  // options.expirys !== false, return the cache,
  if (options.expirys !== false) {
    const cached = sessionStorage.getItem(hashcode);
    const whenCached = sessionStorage.getItem(`${hashcode}:timestamp`);
    if (cached !== null && whenCached !== null) {
      const age = (Date.now() - whenCached) / 1000;
      if (age < expirys) {
        const response = new Response(new Blob([cached]));
        return response.json();
      }
      sessionStorage.removeItem(hashcode);
      sessionStorage.removeItem(`${hashcode}:timestamp`);
    }
  }
  if (_.get(option, 'body.export') === 1) {
    return window.open(`${apiConfig}${url}`);
  }
  return fetch(`${apiConfig}${url}`, newOptions)
    .then(checkStatus)
    .then(response => cachedSave(response, hashcode))
    .then(response => {
      // DELETE and 204 do not return data by default
      // using .json will report an error.
      if (newOptions.method === 'DELETE' || response.status === 204) {
        return response.text();
      }
      return response.json();
    })
    .then(res => {
      window.g_app._store.dispatch({
        type: 'global/changeSpinning',
        payload:{
          spinning:false
        }
      });
      if (res.code) {
        // return res;
        if (res.code == '-126') {
          if (!/login/.test(window.location.href)) {
            setTimeout(() => {
              window.location.href = '/user/login';
            }, 3000);
          }
        }
        if (Array.isArray(res.data) && res.data.length > 0 || typeof res.data === 'object' && Object.keys(res.data).length > 0) {
          message.warn(res.message, 5);
          return res;
        }
        message.warn(res.message, 2);
        return res;
        throw new Error(`${res.message}`, res.data);
      }
      if (newOptions.method === 'POST') {
        if (!/login/.test(window.location.href)) {
          message.success(res.message, 2);
        }
      }
      return res;
    })
    .catch(e => {
      const status = e.name;
      // if(e=='code'){
      message.error(e.message, 2);
      window.g_app._store.dispatch({
        type: 'global/changeSpinning',
        payload:{
          spinning:false
        }
      });
      // }
      if (status === 401) {
        // @HACK
        /* eslint-disable no-underscore-dangle */
        window.g_app._store.dispatch({
          type: 'login/logout',
        });
        return;
      }
      // environment should not be used
      if (status === 403) {
        router.push('/exception/403');
        return;
      }
      if (status <= 504 && status >= 500) {
        router.push('/exception/500');
        return;
      }
      if (status >= 404 && status < 422) {
        router.push('/exception/404');
      }
      return e;
    })
}

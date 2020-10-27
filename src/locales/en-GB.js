import analysis from './bahasa/analysis';
import exception from './bahasa/exception';
import form from './bahasa/form';
import globalHeader from './bahasa/globalHeader';
import login from './bahasa/login';
import menu from './bahasa/menu';
import monitor from './bahasa/monitor';
import result from './bahasa/result';
import settingDrawer from './bahasa/settingDrawer';
import settings from './bahasa/settings';
import pwa from './bahasa/pwa';
import push from './bahasa/push';

export default {
  'navBar.lang': 'yuyan',
  'layout.user.link.help': 'bangzu',
  'layout.user.link.privacy': '隐私',
  'layout.user.link.terms': '条款',
  'app.home.introduce': '介绍',
  'app.forms.basic.title': '基础表单',
  'app.forms.basic.description':
    '表单页用于向用户收集或验证信息，基础表单常见于数据项较少的表单场景。',
  ...analysis,
  ...exception,
  ...form,
  ...globalHeader,
  ...login,
  ...menu,
  ...monitor,
  ...result,
  ...settingDrawer,
  ...settings,
  ...pwa,
  ...push,
};

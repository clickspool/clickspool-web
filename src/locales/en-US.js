import analysis from './en-US/analysis';
import exception from './en-US/exception';
import form from './en-US/form';
import globalHeader from './en-US/globalHeader';
import login from './en-US/login';
import menu from './en-US/menu';
import monitor from './en-US/monitor';
import result from './en-US/result';
import settingDrawer from './en-US/settingDrawer';
import settings from './en-US/settings';
import pwa from './en-US/pwa';
import matters from './en-US/matters';
import global from './zh-CN/global';

export default {
  'navBar.lang': 'Language',
  'layout.user.link.help': 'Help',
  'layout.user.link.privacy': 'Privacy',
  'layout.user.des': 'Operations Management System',
  'layout.user.link.terms': 'Terms',
  'app.home.introduce': 'Intro',
  'app.forms.basic.title': 'Basic form',
  'app.forms.basic.description':
    'Form page is used to collect or verify information to users. Basic form is commonly used for less data item.',
  'app.platform': 'Android',
  'app.model.cancel': 'Cancel',
  'app.model.okText': 'Ok',
  'app.pages.search': 'Search',
  'app.table.filterTitle': 'Filter',
  'app.table.filterConfirm': 'Ok',
  'app.table.filterReset': 'Reset',
  'app.table.emptyText': 'No Data',
  'app.config.edit': 'Edit',
  'app.config.start': 'Enable',
  'app.config.forbid': 'Disable',
  'app.config.password': 'Modify Password',
  'app.config.passwordagain': 'Confirm Password',
  'app.config.message': 'Message',
  'app.config.comfirmLogout': 'Confirm Logout',
  //  新加
  'app.setting.groupname': 'Group Name',
  'app.glob.errorJSONMSG': 'Wrong json format',
  'app.glob.copysucc': 'Copied',
  'app.glob.copyOnclick': 'Click to copy url',
  'app.glob.minute': 'minute',
  'app.glob.pleaseInputNum': 'Input number',
  'app.glob.mustOne': 'At least add 1 name',
  'app.glob.selectPos': 'Select Location',
  'app.glob.pleaseInputcontentID': 'Input Content ID',
  'app.glob.pleaseInputcontentTitle': 'Input Title',
  'app.glob.pleaseInputcontentDes': 'Input Description',
  'app.glob.pleaseInputTime': 'Select Time',
  'app.glob.pleaseInputName': 'Input Name',
  'app.glob.pleaseInputGroupName': 'Input Group Name',
  'app.glob.pleaseInputStatus': 'Input Status',
  'app.glob.pleaseInputZindex': 'Input positive integer',
  'app.glob.pleaseInputRole': 'Add Role',
  'app.glob.pleaseInputPWD': 'Input Password',
  'app.glob.pleaseInputPWDA': 'Confirm Password',
  'app.glob.noSetting': 'Not Set',
  'app.glob.onlyOne': 'Only can select one category',
  'app.model.settingTop': 'Stick Up',
  'app.model.cancelTop': 'Cancel',
  'app.glob.pagetotal': 'Total{total} items',
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
  ...matters,
  ...global
};

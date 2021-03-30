import SettingDrawer from '@/components/SettingDrawer';
import SiderMenu from '@/components/SiderMenu';
import Authorized from '@/utils/Authorized';
import Ispin from '@/components/Ispin.js';

import React from 'react';

import { Layout, BackTop, Spin } from 'antd';

import { connect } from 'dva';

import classNames from 'classnames';

import { enquireScreen, unenquireScreen } from 'enquire-js';

import { formatMessage } from 'umi/locale';

import memoizeOne from 'memoize-one';

import pathToRegexp from 'path-to-regexp';

import isEqual from 'lodash/isEqual';

import DocumentTitle from 'react-document-title';

import { ContainerQuery } from 'react-container-query';

import logo from '../assets/logo.png';
import McMenuData from '../../config/router.config.menu';
import Exception403 from '../pages/Exception/403';

import styles from './BasicLayout.less';
import Footer from './Footer';
import Header from './Header';
import Context from './MenuContext';

const { Content } = Layout;

function mapRoutesToMenu(routes, parentAuthority, parentName) {
  return routes
    .map(item => {
      if (!item.name || !item.path) {
        return null;
      }

      let locale = 'menu';
      if (parentName) {
        locale = `${parentName}.${item.name}`;
      } else {
        locale = `menu.${item.name}`;
      }

      const result = {
        ...item,
        name: formatMessage({ id: locale, defaultMessage: item.name }),
        locale,
        authority: item.authority || parentAuthority,
      };
      if (item.routes) {
        const children = mapRoutesToMenu(item.routes, item.authority, locale);
        // Reduce memory usage
        result.children = children;
      }
      delete result.routes;
      return result;
    })
    .filter(item => item);
}

const memoizedMapRoutesToMenu = memoizeOne(mapRoutesToMenu, isEqual);

const query = {
  'screen-xs': {
    maxWidth: 575,
  },
  'screen-sm': {
    minWidth: 576,
    maxWidth: 767,
  },
  'screen-md': {
    minWidth: 768,
    maxWidth: 991,
  },
  'screen-lg': {
    minWidth: 992,
    maxWidth: 1199,
  },
  'screen-xl': {
    minWidth: 1200,
    maxWidth: 1599,
  },
  'screen-xxl': {
    minWidth: 1600,
  },
};

class BasicLayout extends React.PureComponent {
  constructor(props) {
    super(props);
    this.getPageTitle = memoizeOne(this.getPageTitle);
    this.getBreadcrumbNameMap = memoizeOne(this.getBreadcrumbNameMap, isEqual);
    this.breadcrumbNameMap = this.getBreadcrumbNameMap();
    this.matchParamsPath = memoizeOne(this.matchParamsPath, isEqual);
  }

  state = {
    rendering: true,
    isMobile: false,
    menuData: this.getMenuData(),
    queryMyState:{},
    showChildren: true
  };

  getUpdateList = () => {
    const { dispatch, history:{location :{ query } }} = this.props;
    this.setState({
      queryMyState: query
    })
    dispatch({
      type: 'user/fetchCurrent',
    });
    dispatch({
      type: 'setting/getSetting',
    });
    dispatch({
      type: 'nodeList/getList',
    });
    dispatch({
      type: 'global/getLanguageList',
    });
    dispatch({
      type: 'global/getGlobalCountryMap',
    });
    this.renderRef = requestAnimationFrame(() => {
      this.setState({
        rendering: false,
      });
    });
    this.enquireHandler = enquireScreen(mobile => {
      const { isMobile } = this.state;
      if (isMobile !== mobile) {
        this.setState({
          isMobile: mobile,
        });
      }
    });
  }

  componentDidMount() {
    
    this.getUpdateList();
  }

  componentDidUpdate(preProps) {
    // After changing to phone mode,
    // if collapsed is true, you need to click twice to display
    const { queryMyState } = this.state;
    const { query } = preProps.history.location;
    if(query.global_system_state !== queryMyState.global_system_state){
      this.setState({
        queryMyState:query,
        showChildren:false
      },()=>{
        this.setState({
          showChildren:true
        })
      })
      // setTimeout(()=>{
      //   this.forceUpdate();
      // });
    }
    this.breadcrumbNameMap = this.getBreadcrumbNameMap();
    const { isMobile } = this.state;
    const { collapsed } = this.props;
    if (isMobile && !preProps.isMobile && !collapsed) {
      this.handleMenuCollapse(false);
    }
  }

  componentWillUnmount() {
    cancelAnimationFrame(this.renderRef);
    unenquireScreen(this.enquireHandler);
  }

  getContext() {
    const { location } = this.props;
    return {
      location,
      breadcrumbNameMap: this.breadcrumbNameMap,
    };
  }

  getMenuData() {
    const {
      route: { routes },
      dispatch,
    } = this.props;

    dispatch({
      type: 'memberInfo/getMemberInfo',
    }).then(() => {
      // this.setState({
      //   menuData:memoizedMapRoutesToMenu(McMenuData[1].routes)
      // })
    });
    return memoizedMapRoutesToMenu(McMenuData[1].routes);
  }

  /**
   * 获取面包屑映射
   * @param {Object} menuData 菜单配置
   */
  getBreadcrumbNameMap() {
    const routerMap = {};
    const flattenMenuData = data => {
      data.forEach(menuItem => {
        if (menuItem.children) {
          flattenMenuData(menuItem.children);
        }
        // Reduce memory usage
        routerMap[menuItem.path] = menuItem;
      });
    };
    flattenMenuData(this.getMenuData());
    return routerMap;
  }

  matchParamsPath = pathname => {
    const pathKey = Object.keys(this.breadcrumbNameMap).find(key =>
      pathToRegexp(key).test(pathname)
    );
    return this.breadcrumbNameMap[pathKey];
  };

  getPageTitle = pathname => {
    const currRouterData = this.matchParamsPath(pathname);

    if (!currRouterData) {
      return 'Chestnutreads';
    }
    const pageName = formatMessage({
      id: currRouterData.locale || currRouterData.name,
      defaultMessage: currRouterData.name,
    });
    return `${pageName} - Chestnutreads`;
  };

  getLayoutStyle = () => {
    const { isMobile } = this.state;
    const { fixSiderbar, collapsed, layout } = this.props;
    if (fixSiderbar && layout !== 'topmenu' && !isMobile) {
      return {
        paddingLeft: collapsed ? '80px' : '256px',
      };
    }
    return {
      marginLeft: collapsed ? '80px' : '256px',
    };
  };

  getContentStyle = () => {
    const { fixedHeader } = this.props;
    return {
      margin: '16px 10px 0',
      paddingTop: fixedHeader ? 64 : 0,
    };
  };

  handleMenuCollapse = collapsed => {
    const { dispatch } = this.props;
    console.log(collapsed,'collapsed__')
    dispatch({
      type: 'global/changeLayoutCollapsed',
      payload: collapsed,
    });
  };

  renderSettingDrawer() {
    // Do not render SettingDrawer in production
    // unless it is deployed in preview.pro.ant.design as demo
    const { rendering } = this.state;
    if ((rendering || process.env.NODE_ENV === 'production') && APP_TYPE !== 'site') {
      return null;
    }
    return <SettingDrawer />;
  }

  render() {
  
    const {
      navTheme,
      layout: PropsLayout,
      children,
      location: { pathname },
    } = this.props;
    const { isMobile, menuData, showChildren } = this.state;
    const isTop = PropsLayout === 'topmenu';
    const routerConfig = this.matchParamsPath(pathname);
    const layout = (
      <Layout>
        {isTop && !isMobile ? null : (
          <SiderMenu
            logo={logo}
            Authorized={Authorized}
            theme={navTheme}
            onCollapse={this.handleMenuCollapse}
            menuData={menuData}
            isMobile={isMobile}
            {...this.props}
            style={{
              height: '100vh',
              overflowY: 'auto',
              position: 'fixed'
            }}
          />
        )}
        <Layout
          style={{
            ...this.getLayoutStyle(),
            minHeight: '100vh',
          }}
        >
          <Header
            menuData={menuData}
            handleMenuCollapse={this.handleMenuCollapse}
            logo={logo}
            isMobile={isMobile}
            {...this.props}
          />
          <Content style={this.getContentStyle()}>
            <Authorized
              authority={routerConfig && routerConfig.authority}
              noMatch={<Exception403 />}
            >
              {children}
            </Authorized>
          </Content>
          <Footer />
        </Layout>
        <Ispin />
      </Layout>
    );
    return (
      <React.Fragment>
        {showChildren&&<DocumentTitle title={this.getPageTitle(pathname)}>
          <ContainerQuery query={query}>
            {params => (
              <Context.Provider value={this.getContext()}>
                <div className={classNames(params)}>{layout}</div>
                <BackTop />

              </Context.Provider>
            )}
          </ContainerQuery>
        </DocumentTitle>}
        {/* {this.renderSettingDrawer()} */}
      </React.Fragment>
    );
  }
}

export default connect(({ global, setting }) => ({
  collapsed: global.collapsed,
  layout: setting.layout,
  ...setting,
}))(BasicLayout);

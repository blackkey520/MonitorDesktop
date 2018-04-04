
import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';
import { Layout, Menu, Icon } from 'antd';

import {config, menus} from '../config';
import classes from './MainLayout.css';
import SplashScreen from './SplashScreen';

const { Header, Content, Footer } = Layout;
const { SubMenu } = Menu;

@inject(stores => ({
    isGlobalLoaded: () => stores.global.pollutanttype.length === 0,
    loadPollutantType: stores.global.loadPollutantType,
}))
@observer
export default class MainLayout extends Component {
    componentDidMount() {
        this.props.loadPollutantType();
        this.props.history.push('main');
    }
    /**
   * get SubMenu or Item
   */
  getSubMenuOrItem=(item) => {
      const _this = this;
      if (item.children && item.children.some(child => child.name)) {
          return (
              <SubMenu
                  title={
                      item.icon ? (
                          <span>
                              <Icon type={item.icon} />
                              <span>{item.name}</span>
                          </span>
                      ) : item.name
                  }
                  key={item.path}
              >
                  {this.getNavMenuItems(item.children)}
              </SubMenu>
          );
      } else {
          return (
              <Menu.Item key={item.path}>
                  <a onClick={() => {
                      _this.props.history.push(item.path);
                  }}>{item.name}</a>
              </Menu.Item>
          );
      }
  }
    /**
  * 获得菜单子节点
  * @memberof SiderMenu
  */
  getNavMenuItems = (menusData) => {
      if (!menusData) {
          return [];
      }
      return menusData
          .filter(item => item.name && !item.hideInMenu)
          .map((item) => {
              return this.getSubMenuOrItem(item);
          })
          .filter(item => !!item);
  }
  render() {
      let { isGlobalLoaded } = this.props;
      let isgl = isGlobalLoaded();
      if (isgl) {
          return <SplashScreen />;
      }
      return (
          <Layout className="layout">
              <Header className={classes.header}>
                  <div className={classes.logo}>
                      <img src={config.logo} alt="logo" />
                      <h1>{config.name}</h1>
                  </div>
                  <div className={classes.menu} >
                      <div><Icon type="notification" style={{ fontSize: 16, color: '#fff' }} /></div>
                      <div><Icon type="bars" style={{ fontSize: 16, color: '#fff' }} /></div>
                  </div>
                  <Menu
                      mode="horizontal"
                      theme="dark"
                      onOpenChange={this.handleOpenChange}
                      style={{ padding: '12px 0', height: '64px' }}
                  >
                      {this.getNavMenuItems(menus)}
                  </Menu>
              </Header>
              <Content style={{ margin: ' 10px 10px 0 10px ', height: '100%' }}>
                  <div style={{ minHeight: 'calc(100vh - 260px)' }}>
                      {this.props.children}
                  </div>
              </Content>
              <Footer className={classes.footer}>
                  {config.footerText}
              </Footer>
          </Layout>

      );
  }
}

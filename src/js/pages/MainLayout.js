
import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';
import { Layout, Menu, Icon, Modal } from 'antd';

import { menus } from '../config';
import classes from './MainLayout.css';
import SplashScreen from './SplashScreen';
import { ipcRenderer } from 'electron';
const confirm = Modal.confirm;
const { Header, Content, Footer } = Layout;
const { SubMenu, Item } = Menu;

@inject(stores => ({
    isGlobalLoaded: () => stores.global.pollutanttype.length === 0,
    initDatabase: stores.global.initDatabase,
    loadPollutantType: stores.global.loadPollutantType,
    globalsetting: stores.setting.globalsetting,
    init: stores.setting.init,
    addConsoleLog: stores.global.addConsoleLog
}))
@observer
export default class MainLayout extends Component {
    async componentWillMount() {
        ipcRenderer.on('main-msg', (event, args) => {
            this.props.addConsoleLog(args);
        });
        await this.props.initDatabase();
        await this.props.init();
    }
    async componentDidMount() {
        await this.props.loadPollutantType();
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
              <Item key={item.path}>
                  <a onClick={() => {
                      _this.props.history.push(item.path);
                  }}>{item.name}</a>
              </Item>
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
      let { isGlobalLoaded, globalsetting } = this.props;
      let isgl = isGlobalLoaded();
      if (isgl || !globalsetting) {
          return <SplashScreen />;
      }
      return (
          <Layout className="layout">
              <Header className={classes.header}>
                  <div className={classes.logo}>
                      <img src={globalsetting.logo} alt="logo" />
                      <h1>{globalsetting.bannertext}</h1>
                  </div>
                  <div className={classes.menu} >
                      <div
                          style={{ cursor: 'pointer' }}
                          onClick={() => {
                              ipcRenderer.send('window-min');
                          }}
                      ><Icon type="minus" style={{ fontSize: 16, color: '#fff' }} />
                      </div>
                      <div
                          style={{ cursor: 'pointer' }}
                          onClick={() => {
                              ipcRenderer.send('window-max');
                          }}
                      ><Icon type="laptop" style={{ fontSize: 16, color: '#fff' }} />
                      </div>
                      <div
                          style={{ cursor: 'pointer' }}
                          onClick={() => {
                              confirm({
                                  title: '您确定要退出程序吗？',
                                  content: '选择否程序将隐藏到托盘中',
                                  okText: '是',
                                  cancelText: '否',
                                  onOk() {
                                      ipcRenderer.send('window-close');
                                  },
                                  onCancel() {
                                      ipcRenderer.send('window-hide');
                                  },
                              });
                          }}><Icon type="close" style={{ fontSize: 16, color: '#fff' }} />
                      </div>
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
                  {globalsetting.footertext}
              </Footer>
          </Layout>

      );
  }
}

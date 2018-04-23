import DashBoard from './pages/DashBoard';
import SocketTest from './pages/SocketTest';
import DataBase from './pages/DataBase';
import Terminal from './pages/Terminal';
export const menus = [
    {
        name: '监控面版',
        icon: 'dashboard',
        path: '/main',
    }, {
        name: '控制台',
        icon: 'code',
        path: '/console/terminal',
    }, {
        name: '测试',
        icon: 'form',
        path: 'test',
        children: [{
            name: '通讯测试',
            path: '/test/sockettest',
        }, {
            name: '数据库测试',
            path: '/test/database',
        }],
    },
    {
        name: '设置',
        icon: 'table',
        path: 'setting',
        children: [{
            name: '设定1',
            path: '/setting/setting1',
        }, {
            name: '设定2',
            path: '/setting/setting2',
        }],
    }
];

export const routerconfig = [
    {
        key: '/main',
        name: '面板',
        path: '/main',
        component: DashBoard
    },
    {
        key: '/test/sockettest',
        name: '网络通讯',
        path: '/test/sockettest',
        component: SocketTest
    },
    {
        key: '/test/database',
        name: '数据库',
        path: '/test/database',
        component: DataBase
    },
    {
        key: '/console/terminal',
        name: '控制台',
        path: '/console/terminal',
        component: Terminal
    },
    {
        key: '/setting/setting1',
        name: '设置1',
        path: '/setting/setting1',
        component: DataBase
    },
    {
        key: '/setting/setting2',
        name: '设置2',
        path: '/setting/setting2',
        component: DataBase
    },
    {
        key: '/module1',
        name: '模块1',
        path: '/module1',
        component: DataBase
    }
];

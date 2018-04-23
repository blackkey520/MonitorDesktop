/*
  main 端入口文件
*/
import { app, ipcMain } from 'electron';
import services from './services';
import config from './userConfig';

const {
    menu,
    mainWin,
    log,
    tray,
    datafileread,
    timer,
    client
} = services;

process.on('unhandledRejection', (reason, p) => {
    log.error(`Unhandled Rejection at:, ${p}, 'reason:', ${reason}`);
})
    .on('uncaughtException', function(err) {
        log.error(`uncaughtException$-${err}`);
    });
/*
  初始化任务：判断源，发送打点日志
  必须在有网的判断下进行
*/
const netChange = async function(event, online) {
    console.log('network', online);
    config.setItem('ONLINE', online);

    if (online) {
        log.error('网络正常');
    } else {
        log.error('网络断开');
    }
};

ipcMain
    .on('network-change-status', netChange)
    .on('tray-change-status', (event, { project, status, fromRenderer }) => {
        tray.updateTrayMenu(project, status, fromRenderer);
    }).on('readfile-test', (event, args) => {
        var filepath = args.filepath;
        datafileread.readDataFile(filepath);
    }).on('window-min', () => {
        mainWin.minimize();
    })
    .on('window-max', () => {
        mainWin.toggleMaximize();
    })
    .on('window-close', () => {
        app.quit();
    })
    .on('window-hide', () => {
        // 确定编码
        mainWin.getWin().hide();
    });
app
    .on('ready', () => {
    // 生产窗口
        mainWin.create();
        mainWin.getWin().once('ready-to-show', () => {
            // 初始化菜单， win端不可见
            menu.init();
            // 初始化任务托盘
            tray.init();
            // 初始化socketclient
            client.init();
            // 启动定时器
            timer.start();
        });
    })
    .on('activate', () => {
        if (mainWin.getWin() === null) {
            mainWin.create();
        }
        if (!mainWin.isVisible()) {
            mainWin.show();
        }
    })
    .on('window-all-closed', () => {
        console.log('window-all-closed');
    })
    .on('before-quit', () => {
        console.log('before quit');
        // 清理任务
        // mainPlugin.stop();停止Socket
        tray.destroy();
    });

// 暴露main端服务给renderer
global.services = services;
global.config = config;

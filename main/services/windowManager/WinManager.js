/*
  主窗口服务
*/
import { BrowserWindow, globalShortcut } from 'electron';
import { isMac, isDev } from 'shared-md';
import { browserOptions } from './defaultWinOptions';
import mainWin from '../windowManager';
import moment from 'moment';
import log from '../applog';
const msgConsole = (arg) => {
    mainWin.send(`main-msg`, { msg: `系统信息-${arg.datetime}=>${arg.title}--${arg.data}--`, arg });
    log.info(`${arg.datetime}=>${arg.title}--${arg.data}--`);
};
class WinManager {
    constructor() {
        this.win = null;
        this.ismax = false;
    }
    // 创建窗口
    create(opt) {
        console.log('create window');
        this.options = Object.assign(browserOptions, opt);

        this.win = new BrowserWindow(this.options);
        this.win.webContents.toggleDevTools();
        this.win.loadURL(
            isDev ? `file://${__dirname}/src/dev.html` : `file://${__dirname}/src/index.html`
        );

        // 启动调试工具
        globalShortcut.register('CmdOrCtrl+Shift+8', () => {
            this.win.webContents.toggleDevTools();
        });

        this.win.once('ready-to-show', () => {
            this.win.show();
            msgConsole({
                datetime: moment().format('YYYY-MM-DD HH:mm:ss'),
                type: 'info',
                title: '系统初始化完成',
                data: '',
            });
        });

        this.win.on('closed', () => {
            console.log('closed window');
            this.win = null;
        });

        this.win.webContents.on('crashed', () => this.win.reload());
    }

    send(symbol, content) {
        this.win.webContents.send(symbol, content);
    }

    getWin() {
        return this.win;
    }

    isVisible() {
        this.win.isVisible();
    }

    close() {
        msgConsole({
            datetime: moment().format('YYYY-MM-DD HH:mm:ss'),
            type: 'info',
            title: '窗口关闭',
            data: '',
        });
        if (isMac) {
            this.win.hide();
        } else {
            this.win.close();
        }
    }

    show() {
        msgConsole({
            datetime: moment().format('YYYY-MM-DD HH:mm:ss'),
            type: 'info',
            title: '窗体显示',
            data: '',
        });
        this.win.show();
    }

    minimize() {
        this.win.minimize();
    }

    toggleMaximize() {
        if (this.ismax) {
            this.ismax = false;
            this.win.unmaximize();
        } else {
            this.ismax = true;
            this.win.maximize();
        }
    }

    getSize() {
        return this.win.getSize();
    }
}

export default WinManager;

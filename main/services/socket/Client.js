/*
  主窗口服务
*/
import { ipcMain } from 'electron';
import NetcatClient from 'netcat/client';
import mainWin from '../windowManager';
import moment from 'moment';
import log from '../applog';
const msgConsole = (arg) => {
    mainWin.send(`main-msg`, { msg: `客户端通讯-${arg.datetime}=>${arg.title}--${arg.data}--`, arg });
    log.info(`${arg.datetime}=>${arg.title}--${arg.data}--`);
};
class Client {
    constructor() {
        this.client = null;
        this.job = null;
        this.isconnect = false;
    }
    // 创建窗口
    init() {
        this.client = new NetcatClient();
        msgConsole({
            datetime: moment().format('YYYY-MM-DD HH:mm:ss'),
            type: 'info',
            title: '客户端对象初始化完毕',
            data: '',
        });
        ipcMain.on('settings-apply', (event, args) => {
            const settings = args.settings;
            if (this.isconnect) {
                this.client.end();
            }
            try {
                this.client.addr(settings.serverip).port(settings.serverport).connect().retry(settings.serverretryspan * 1000)
                    .on('connect', () => {
                        this.isconnect = true;
                        msgConsole({
                            datetime: moment().format('YYYY-MM-DD HH:mm:ss'),
                            type: 'info',
                            title: '服务器连接成功',
                            data: '',
                        });
                        // this.client.write('I am Chuck Norris!');
                    }).on('data', (data) => {
                        // mainWin.send(`socket-client-receive`, {data});
                        msgConsole({
                            datetime: moment().format('YYYY-MM-DD HH:mm:ss'),
                            type: 'info',
                            title: '收到数据包',
                            data: data.toString(),
                        });
                    }).on('close', () => {
                        this.isconnect = false;
                        msgConsole({
                            datetime: moment().format('YYYY-MM-DD HH:mm:ss'),
                            type: 'info',
                            title: '服务器断开连接',
                            data: '',
                        });
                    }).on('error', function(err) {
                        this.isconnect = false;
                        msgConsole({
                            datetime: moment().format('YYYY-MM-DD HH:mm:ss'),
                            type: 'info',
                            title: '出现错误',
                            data: err,
                        });
                        log.error(`${moment().format('YYYY-MM-DD HH:mm:ss')}=>${err}`);
                    });
            } catch (error) {
            }
        });
    }
    sendmsg(text) {
        try {
            if (this.isconnect) {
                this.client.send(text, () => {
                    // mainWin.send(`socket-client-send`, {text});
                    msgConsole({
                        datetime: moment().format('YYYY-MM-DD HH:mm:ss'),
                        type: 'info',
                        title: '发送数据成功',
                        data: text,
                    });
                });
            }
        } catch (error) {
            log.error(`${moment().format('YYYY-MM-DD HH:mm:ss')}=>${error}`);
        }
    }

    disconnect() {
        try {
            this.client.end();
            this.isconnect = false;
            msgConsole({
                datetime: moment().format('YYYY-MM-DD HH:mm:ss'),
                type: 'info',
                title: '客户端连接断开',
                data: '',
            });
        } catch (error) {
            log.error(`${moment().format('YYYY-MM-DD HH:mm:ss')}=>${error}`);
        }
    }
}

export default Client;

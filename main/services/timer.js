/*
  任务托盘
*/
import { ipcMain } from 'electron';
import moment from 'moment';
import mainWin from './windowManager';
import schedule from 'node-schedule';
import log from './applog';
import client from './socket';
let datareadjob = null;
let datasendjob = null;
const msgConsole = (arg) => {
    mainWin.send(`main-msg`, { msg: `定时任务-${arg.datetime}=>${arg.title}--${arg.data}--`, arg });
    log.info(`${arg.datetime}=>${arg.title}--${arg.data}--`);
};
const start = () => {
    ipcMain.on('settings-apply', (event, args) => {
        const settings = args.settings;
        if (datareadjob !== null) {
            datareadjob.cancel();
        }
        try {
            datareadjob = schedule.scheduleJob(`*/${settings.scanspan} * * * * *`, function() {
                msgConsole({
                    datetime: moment().format('YYYY-MM-DD HH:mm:ss'),
                    type: 'info',
                    title: '任务开始执行',
                    data: '',
                });
            });
        } catch (ex) {
            console.error(ex);
        }
        if (datasendjob !== null) {
            datasendjob.cancel();
        }
        try {
            datasendjob = schedule.scheduleJob(`*/${settings.datasendspan} * * * * *`, function() {
                client.sendmsg('this is test message!!!');
            });
        } catch (ex) {
            console.error(ex);
        }
    });
};

export default {
    start,
};

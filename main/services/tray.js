/*
  任务托盘
*/
import { app, Tray, Menu } from 'electron';
import moment from 'moment';
import { isWin } from 'shared-md';
import mainWin from './windowManager';
import log from './applog';
let tray;

let trayMenu = [
    {
        type: 'separator'
    },
    {
        label: '显示窗口',
        accelerator: 'Alt+Command+I',
        click() {
            mainWin.show();
        }
    },
    {
        type: 'separator'
    },
    {
        label: '退出',
        accelerator: 'Command+Q',
        selector: 'terminate:',
        click() {
            app.quit();
        }
    }
];
const msgConsole = (arg) => {
    mainWin.send(`main-msg`, { msg: `定时任务-${arg.datetime}=>${arg.title}--${arg.data}--`, arg });
    log.info(`${arg.datetime}=>${arg.title}--${arg.data}--`);
};
const init = () => {
    let contextmenu = Menu.buildFromTemplate(trayMenu);
    let icon = isWin
        ? `${__dirname}/src/assets/images/trayicon_win.png`
        : `${__dirname}/src/assets/images/tray.Template.png`
        ;
    setTimeout(() => {
        if (!tray) {
            // Init tray icon
            tray = new Tray(icon);

            tray.on('right-click', () => {
                tray.popUpContextMenu();
            });

            let clicked = false;
            tray.on('click', () => {
                if (clicked) {
                    mainWin.show();
                } else {
                    clicked = true;
                    setTimeout(() => {
                        clicked = false;
                    }, 400);
                }
            });
        }

        tray.setImage(icon);
        tray.setContextMenu(contextmenu);
    });
    msgConsole({
        datetime: moment().format('YYYY-MM-DD HH:mm:ss'),
        type: 'info',
        title: '托盘加载完成',
        data: '',
    });
};

export default {
    init,
    destroy() {
        tray.destroy();
    }
};


import { Menu } from 'electron';
import mainWin from '../windowManager';
import moment from 'moment';
import log from '../applog';
import menuItem from './menuItem';
const msgConsole = (arg) => {
    mainWin.send(`main-msg`, { msg: `系统信息-${arg.datetime}=>${arg.title}--${arg.data}--`, arg });
    log.info(`${arg.datetime}=>${arg.title}--${arg.data}--`);
};
const init = () => {
    const menu = Menu.buildFromTemplate(menuItem());
    Menu.setApplicationMenu(menu);
    msgConsole({
        datetime: moment().format('YYYY-MM-DD HH:mm:ss'),
        type: 'info',
        title: '菜单加载完成',
        data: '',
    });
};

const reload = () => init();

export default { init, reload };

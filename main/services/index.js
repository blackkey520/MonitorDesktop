import { render } from 'ejs';

import menu from './menu';
import tray from './tray';
import log from './applog';
import * as datafileread from './datafileread';
import * as paths from './paths';
import timer from './timer';
import mainWin from './windowManager';
import client from './socket';

// console.log(plugin.port);

export default {
    menu,
    log,
    tray,
    paths,
    mainWin,
    timer,
    datafileread,
    client,
    ejsRender(tpl, data) {
        return render(tpl, data);
    },
};

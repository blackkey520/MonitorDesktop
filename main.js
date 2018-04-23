
// import fs from 'fs';
import { app, BrowserWindow, Tray, Menu, ipcMain } from 'electron';
import windowStateKeeper from 'electron-window-state';
import pkg from './package.json';
import schedule from 'node-schedule';

let forceQuit = false;
let mainWindow;
let tray;
let settings = {};
let isWin = process.platform === 'win32';
let isOsx = process.platform === 'darwin';

let trayMenu = [
    {
        type: 'separator'
    },
    {
        label: '显示窗口',
        accelerator: 'Alt+Command+I',
        click() {
            mainWindow.show();
            mainWindow.toggleDevTools();
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
            forceQuit = true;
            mainWindow = null;
            app.quit();
        }
    }
];
const icon = 'd:/';

async function readDataFile(filePath) {

}
function updateTray(unread = 0) {
    if (!isOsx) {
        // Always show the tray icon on windows
        settings.showOnTray = true;
    }

    // Update unread mesage count
    trayMenu[0].label = `You have ${unread} messages`;

    if (settings.showOnTray) {
        if (tray
            && updateTray.lastUnread === unread) {
            return;
        }

        let contextmenu = Menu.buildFromTemplate(trayMenu);
        let icon = unread
            ? `${__dirname}/src/assets/images/icon-new-message.png`
            : `${__dirname}/src/assets/images/icon.png`
            ;

        // Make sure the last tray has been destroyed
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
                        mainWindow.show();
                        clicked = false;
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
    } else {
        tray.destroy();
        tray = null;
    }

    // Avoid tray icon been recreate
    updateTray.lastUnread = unread;
}

const createMainWindow = () => {
    var mainWindowState = windowStateKeeper({
        defaultWidth: 1000,
        defaultHeight: 700,
    });

    mainWindow = new BrowserWindow({
        x: mainWindowState.x,
        y: mainWindowState.y,
        minWidth: 1000,
        minHeight: 700,
        vibrancy: 'medium-light',
        transparent: true,
        titleBarStyle: 'hidden-inset',
        backgroundColor: 'none',
        resizable: false,
        webPreferences: {
            scrollBounce: true
        },
        frame: !isWin,
        icon
    });

    mainWindow.loadURL(
        `file://${__dirname}/src/index.html`
    );
    mainWindow.toggleDevTools();
    ipcMain.on('readfile-test', (event, args) => {
        var filepath = args.filepath;
        readDataFile(filepath);
    });
    mainWindow.on('close', e => {
        if (forceQuit) {
            mainWindow = null;
            app.quit();
        } else {
            e.preventDefault();
            mainWindow.hide();
        }
    });
    ipcMain.on('settings-apply', (event, args) => {
        updateTray();
        settings = args.settings;
        try {
            schedule.scheduleJob('*/' + settings.scanspan + ' * * * *', function() {
                console.log('test');
            });
        } catch (ex) {
            console.error(ex);
        }
    });
    ipcMain.on('show-window', event => {
        if (!mainWindow.isVisible()) {
            mainWindow.show();
            mainWindow.focus();
        }
    });

    mainWindow.webContents.setUserAgent('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_6) AppleWebKit/603.3.8 (KHTML, like Gecko) Version/10.1.2 Safari/603.3.8');
};

app.setName(pkg.name);
app.dock && app.dock.setIcon(icon);

app.on('ready', createMainWindow);
app.on('before-quit', () => {
    // Fix issues #14
    forceQuit = true;
});
app.on('activate', e => {
    if (!mainWindow.isVisible()) {
        mainWindow.show();
    }
});

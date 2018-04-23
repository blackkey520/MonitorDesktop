// 默认窗口参数
export const browserOptions = {
    width: 1000,
    height: 700,
    minWidth: 1000,
    minHeight: 700,
    show: false,
    frame: false,
    resizable: true,
    fullscreenable: true,
    maximizable: true,
    vibrancy: 'medium-light',
    transparent: true,
    titleBarStyle: 'hidden-inset',
    backgroundColor: 'none',
    hasShadow: true,
    webPreferences: {
        scrollBounce: true
    },
    icon: `${__dirname}/src/assets/images/dock.png`,
};

// plase don't import electron here

import is from 'electron-is';

export const isDev = is.dev();
export const isMac = is.macOS();
export const isWin = is.windows();
export const isLinux = is.linux();

export const delay = n => new Promise(resolve => setTimeout(resolve, n));

import { join } from 'path';
import { homedir } from 'os';
import { isDev } from 'shared-md';

export const APP_PATH = isDev ? join(process.cwd(), 'dist') : join(process.resourcesPath, 'dist');
// export const APP_PATH = isDev ? join(process.cwd(), 'app') : join(process.resourcesPath, 'app.asar');
export const NODE_PATH = join(APP_PATH, 'nodes');

export const DOT_NOWA_PATH = join(homedir(), '.MonitorDesktop');
export const USER_CONFIG_PATH = join(DOT_NOWA_PATH, 'user_config.json');

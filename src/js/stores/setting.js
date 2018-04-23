
import { observable, action } from 'mobx';
import { ipcRenderer } from 'electron';

import storage from 'utils/storage';

class Settings {
    @observable globalsetting={
        bannertext: 'VOC监控系统',
        desctext: 'SDL 您身边的环境污染分析专家',
        footertext: 'VOC监控系统   2018 sdl',
        logo: './assets/images/sdl.png',
        httpaddress: 'http://172.16.12.133:4061/'
    };
    @observable filepath = 'D://';
    @observable scanspan = 5;
    @observable datasendspan = 5;
    @observable serverretryspan=5;
    @observable serverip='127.0.0.1';
    @observable serverport='5000';
    @action setScanspan(scanspan) {
        self.scanspan = scanspan;
        self.save();
    }
    @action setFilepath(filepath) {
        self.filepath = filepath;
        self.save();
    }

    @action async init() {
        var settings = await storage.get('settings');
        // var { filepath, scanspan, serverip, serverport, serverretryspan, datasendspan } = self;
        // if (settings && Object.keys(settings).length) {
        // Use !! force convert to a bool value
        self.filepath = 'D://';
        self.scanspan = 5;
        self.serverip = '192.168.177.1';
        self.serverport = 5000;
        self.serverretryspan = 5;
        self.datasendspan = 5;
        // } else {
        //     await storage.set('settings', {
        //         filepath,
        //         scanspan,
        //         serverip,
        //         serverport,
        //         serverretryspan,
        //         datasendspan
        //     });
        // }
        self.save();
        return settings;
    }

    save() {
        var { filepath, scanspan, serverip, serverport, serverretryspan, datasendspan } = self;
        storage.set('settings', {
            filepath,
            scanspan,
            serverip,
            serverport,
            serverretryspan,
            datasendspan
        });
        ipcRenderer.send('settings-apply', {
            settings: {
                filepath,
                scanspan,
                serverip,
                serverport,
                serverretryspan,
                datasendspan
            }
        });
    }
}

const self = new Settings();
export default self;

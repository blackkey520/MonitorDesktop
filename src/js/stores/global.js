import { observable, action } from 'mobx';
import axios from 'axios';
import setting from '../stores/setting';
import DBOpration from 'dbopration';
import { message } from 'antd';
const remote = require('electron').remote;

class Global {
    @observable pollutanttype=[];
    @observable consolelog=[];
    @observable dbready=false;
    @action async initDatabase() {
        DBOpration.initDb(remote.app.getPath('userData'), () => {
            self.dbready = true;
        });
    }
    @action async loadPollutantType() {
        try {
            let url = setting.globalsetting.httpaddress + 'rest/MenuInfo/GetPolluntType?authorCode=48f3889c-af8d-401f-ada2-c383031af92d';
            let response = await axios.get(url);
            if (response.data.requstresult === '1') {
                self.pollutanttype = response.data.data;
            } else {
                message.warning(response.data.reason);
            }
        } catch (error) {
            message.error('系统发生了错误');
        }
    }
    @action async addConsoleLog(logitem) {
        if (self.consolelog.length > 100) {
            self.consolelog.pop();
        }
        self.consolelog.unshift(logitem.msg);
    }
}
const self = new Global();
export default self;

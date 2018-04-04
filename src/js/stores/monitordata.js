import { observable, action } from 'mobx';
import DBOpration from '../../../DBOpration';
import { message } from 'antd';

class MonitorData {
    @observable datalist=[];
    @observable loading=false;
    @action async loadMonitorData() {
        try {
            self.loading = true;
            let data = DBOpration.QueryData('SELECT * FROM `MonitorData` ORDER BY `MonitorTime` Desc');
            self.datalist = data;
            self.loading = false;
        } catch (error) {
            message.error('系统发生了错误');
        }
    }
}
const self = new MonitorData();
export default self;

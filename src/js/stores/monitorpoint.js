import { observable, action } from 'mobx';
import axios from 'axios';
import setting from '../stores/setting';
import global from '../stores/global';
import { message } from 'antd';

class MonitorPoint {
    @observable pointlist=[];
    @observable loading=false;
    @action async loadPointList() {
        try {
            self.loading = true;
            let url = setting.globalsetting.httpaddress + '/rest/OutputAsPointApi/GetPointsByPollutantType?authorCode=48f3889c-af8d-401f-ada2-c383031af92d';
            let response = await axios.get(url, {
                params: {
                    pollutantType: global.pollutanttype[0].ID,
                    pageIndex: 1,
                    pageSize: 10000
                }
            });
            response.data.data.map((item, key) => {
                item.key = key;
            });
            if (response.data.requstresult === '1') {
                self.pointlist = response.data.data;
            } else {
                message.warning(response.data.reason);
            }
            self.loading = false;
        } catch (error) {
            message.error('系统发生了错误');
        }
    }
}
const self = new MonitorPoint();
export default self;

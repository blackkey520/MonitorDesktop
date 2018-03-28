import { observable, action } from 'mobx';
import axios from 'axios';
import {config} from '../config';
import { message } from 'antd';

class Global {
    @observable pollutanttype=[];

    @action async loadPollutantType() {
        try {
            let url = config.httpaddress + 'rest/MenuInfo/GetPolluntType?authorCode=48f3889c-af8d-401f-ada2-c383031af92d';
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
}
const self = new Global();
export default self;

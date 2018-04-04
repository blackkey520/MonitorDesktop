import { observable, action } from 'mobx';
import { message } from 'antd';
import NetcatClient from 'netcat/client';

class SocketClient {
    @observable ip='127.0.0.1';
    @observable port='5000';
    @observable sendText='';
    @observable reciveText='';
    @observable isSuccess=false;
    @observable nc;
    @action async connect() {
        try {
            self.nc = new NetcatClient();
            self.nc.addr('127.0.0.1').port(5000).connect().send('hey~yo what\'s up').on('connect', () => {
                self.isSuccess = true;
                message.success('连接成功');
            }).on('close', () => {
                message.warning('连接断开');
                self.isSuccess = false;
            }).on('data', (msg) => {
                self.reciveText = msg.toString();
            }).on('waitTimeout', () => {
                message.warning('通讯超时');
            }).on('error', (err) => {
                message.error(err);
            });
        } catch (error) {
            message.error('系统发生了错误');
        }
    }
    @action async sendmsg() {
        try {
            self.nc.send(self.sendText, () => {
                message.success('发送成功');
            });
        } catch (error) {
            message.error('系统发生了错误');
        }
    }
    @action async disconnect() {
        try {
            self.nc.end('bye~');
            self.nc = null;
            self.isSuccess = false;
        } catch (error) {
            message.error('系统发生了错误');
        }
    }
}
const self = new SocketClient();
export default self;

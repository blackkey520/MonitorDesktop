/*
  关闭页面
  断网又无nowa依赖的情况下进入此页面
*/
import React, { Component } from 'react';
import { Tabs, Input, Button, Divider, Layout, List } from 'antd';
import { observer, inject } from 'mobx-react';
const TabPane = Tabs.TabPane;
const { TextArea } = Input;
const { Content, Sider } = Layout;

@inject(stores => ({
    ip: stores.socketclient.ip,
    onipchange: (event) => { stores.socketclient.ip = event.target.value; },
    port: stores.socketclient.port,
    onportchange: (event) => { stores.socketclient.port = event.target.value; },
    sendText: stores.socketclient.sendText,
    onsendtextchange: (event) => { stores.socketclient.sendText = event.target.value; },
    reciveText: stores.socketclient.reciveText,
    isSuccess: stores.socketclient.isSuccess,
    connect: stores.socketclient.connect,
    sendmsg: stores.socketclient.sendmsg,
    disconnect: stores.socketclient.disconnect,
}))
@observer
class SocketTest extends Component {
    render() {
        return (
            <div
                style={{ width: '100%',
                    height: 'calc(100vh - 120px)' }}
            >
                <Tabs defaultActiveKey="1">
                    <TabPane tab="客户端" key="1" style={{backgroundColor: 'white', paddingLeft: 10, paddingRight: 10}}>
                        <Divider orientation="left">发送区</Divider>
                        <div>
                            <div>
                                <Input style={{width: 170}} value={this.props.ip} onChange={this.props.onipchange} placeholder="ip地址" />
                                <Input style={{width: 170, marginLeft: 5}} onChange={this.props.onportchange} value={this.props.port} placeholder="端口号" />
                                <Button style={{marginLeft: 5}}
                                    type="primary" onClick={() => {
                                        if (this.props.isSuccess) {
                                            this.props.disconnect();
                                        } else {
                                            this.props.connect();
                                        }
                                    }}>{this.props.isSuccess ? '断开' : '连接'}</Button>
                                <Button style={{marginLeft: 5}} disabled={!this.props.isSuccess} onClick={() => {
                                    this.props.sendmsg();
                                }}>发送</Button></div>
                            <TextArea rows={7} style={{marginTop: 10}} onChange={this.props.onsendtextchange} />
                        </div>
                        <Divider orientation="left">接收区</Divider>
                        <div title="接收区">
                            <div>
                                <Button style={{marginLeft: 5}}>清空</Button></div>
                            <TextArea rows={7} onChange={this.props.onportchange} style={{marginTop: 10}} value={this.props.reciveText} />
                        </div>
                    </TabPane>
                    <TabPane tab="服务器" key="2">
                        <div><Input style={{width: 170}} placeholder="ip地址" />
                            <Input style={{width: 170, marginLeft: 5}} placeholder="端口号" />
                            <Button style={{marginLeft: 5}} type="primary">监听</Button></div>
                        <Layout style={{ background: '#fff', marginTop: 10 }}>
                            <Sider style={{ background: '#fff' }}><List
                                header={<div>连接</div>}
                                bordered={true}
                                dataSource={[
                                    '187.32.2.1',
                                    '187.32.2.1',
                                    '187.32.2.1',
                                    '187.32.2.1',
                                    '187.32.2.1',
                                ]}
                                renderItem={item => (<List.Item>{item}</List.Item>)}
                            /></Sider>
                            <Content> <Divider orientation="left">发送区</Divider>
                                <div>
                                    <div>
                                        <Button style={{marginLeft: 5}}>发送</Button></div>
                                    <TextArea rows={6} style={{marginTop: 10}} />
                                </div>
                                <Divider orientation="left">接收区</Divider>
                                <div title="接收区">
                                    <div>
                                        <Button style={{marginLeft: 5}}>清空</Button></div>
                                    <TextArea rows={6} style={{marginTop: 10}} />
                                </div></Content>
                        </Layout>
                    </TabPane>
                </Tabs>
            </div>
        );
    }
}

export default SocketTest;

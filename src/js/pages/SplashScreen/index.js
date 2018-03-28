import React from 'react';
import { Spin } from 'antd';

export default class SplashScreen extends React.Component {
    render() {
        return (
            <div style={{ width: '100%', textAlign: 'center', paddingTop: '270px' }}>
                <Spin size="large" />
                <span style={{marginLeft: 10}}>{'正在初始化'}</span>
            </div>
        );
    }
}

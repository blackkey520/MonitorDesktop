
/*
  关闭页面
  断网又无nowa依赖的情况下进入此页面
*/
import React, { Component } from 'react';
import {
    Table,
    Card,
} from 'antd';
import { observer, inject } from 'mobx-react';
import styles from './style.css';

@inject(stores => ({
    datalist: stores.monitordata.datalist.slice(0),
    loading: stores.monitordata.loading,
    loadMonitorData: stores.monitordata.loadMonitorData,
}))
@observer
class DataBase extends Component {
    componentDidMount() {
        this.props.loadMonitorData();
    }
    render() {
        const { datalist, loading } = this.props;
        const SCREEN_HEIGHT = document.querySelector('body').offsetHeight;
        const columns = [{
            title: '监测时间',
            dataIndex: 'MonitorTime',
            width: 120,
        }, {
            title: '污染物',
            dataIndex: 'PollutantCode',
            width: 120,
        }, {
            title: '数值',
            dataIndex: 'MonitorValue',
            width: 120,
        }];
        const listProps = {
            dataSource: datalist,
            columns,
            loading,
            pagination: false,
            bordered: true,
            scroll: {
                y: SCREEN_HEIGHT - 210,
            },
            size: 'middle',
        };
        return (
            <div
                style={{ width: '100%',
                    height: 'calc(100vh - 120px)' }}
                className={styles.standardList}
            >
                <Card
                    bordered={false}
                    bodyStyle={
                        {
                            height: 'calc(100vh -300px)',
                            padding: '0px 20px',
                        }
                    }
                    title={'监测数据列表'}
                >
                    <Table {...listProps} />
                </Card >
            </div>
        );
    }
}

export default DataBase;

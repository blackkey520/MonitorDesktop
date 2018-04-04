
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
    pointlist: stores.monitorpoint.pointlist.slice(0),
    loading: stores.monitorpoint.loading,
    loadPointList: stores.monitorpoint.loadPointList,
}))
@observer
class DashBoard extends Component {
    componentDidMount() {
        this.props.loadPointList();
    }
    render() {
        const { pointlist, loading } = this.props;
        const SCREEN_HEIGHT = document.querySelector('body').offsetHeight;
        const columns = [{
            title: '监测点名称',
            dataIndex: 'pointName',
            width: 120,
        }, {
            title: '监测目标名称',
            dataIndex: 'targetName',
            width: 120,
        }, {
            title: '经度',
            dataIndex: 'longitude',
            width: 120,
        }, {
            title: '纬度',
            dataIndex: 'latitude',
            width: 120,
        }, {
            title: '状态',
            dataIndex: 'status',
            width: 120,
        }, {
            title: '编号',
            dataIndex: 'dgimn',
            width: 120,
        }];
        const listProps = {
            dataSource: pointlist,
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
                    title={'监测点列表'}
                >
                    <Table {...listProps} />
                </Card >
            </div>
        );
    }
}

export default DashBoard;

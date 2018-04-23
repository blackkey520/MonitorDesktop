import DBOpration from 'dbopration';
import moment from 'moment';
import xlsx from 'node-xlsx';
import mainWin from './windowManager';
import log from './applog';
const msgConsole = (arg) => {
    mainWin.send(`main-msg`, { msg: `文件读取-${arg.datetime}=>${arg.title}--${arg.data}--`, arg });
    log.info(`${arg.datetime}=>${arg.title}--${arg.data}--`);
};

export async function readDataFile(filePath) {
    const workSheetsFromFile = xlsx.parse(filePath);
    const Summary = workSheetsFromFile.find((item) => item.name === 'Summary').data;
    const datafileArg = [Summary[4][0], Summary[7][0], Summary[7][1], Summary[7][5], Summary[7][6]];
    let datafilesql = 'INSERT OR REPLACE INTO DataFile (AnalyticsTime,DataFileName,SampleName,SampleType,CollectFun,IsSuccess) VALUES (?,?,?,?,?,?)';
    msgConsole({
        datetime: moment().format('YYYY-MM-DD HH:mm:ss'),
        type: 'info',
        title: '新文件开始入库',
        data: datafileArg.concat([0]),
    });
    if (DBOpration.SaveData(datafilesql, datafileArg.concat([0]))) {
        try {
            Summary.map((item, key) => {
                if (item[0] === Summary[7][0] && item[1] !== Summary[7][1]) {
                    let monitordatasql = 'INSERT OR REPLACE INTO MonitorData (AnalyticsTime,DataFileName,SampleName,SampleType,CollectFun,PollutantName,MonitorValue,MonitorData,Flag) VALUES (?,?,?,?,?,?,?,?,?)';
                    msgConsole({
                        datetime: moment().format('YYYY-MM-DD HH:mm:ss'),
                        type: 'info',
                        title: item[0] + '-新数据开始入库',
                        data: datafileArg.concat([item[1], item[3], item[6], 'N'])
                    });
                    if (DBOpration.SaveData(monitordatasql, datafileArg.concat([item[1], item[3], item[6], 'N']))) {
                        msgConsole({datetime: moment(), type: 'info', title: item[0] + '-数据入库成功', data: datafileArg.concat([item[1], item[3], item[6], 'N'])});
                    }
                }
            });
            if (DBOpration.SaveData(datafilesql, datafileArg.concat([1]))) {
                msgConsole({datetime: moment().format('YYYY-MM-DD HH:mm:ss'), type: 'info', title: '新文件入库完成', data: datafileArg.concat([0])});
            }
        } catch (error) {
            msgConsole({datetime: moment().format('YYYY-MM-DD HH:mm:ss'), type: 'info', title: '新文件入库出错', data: datafileArg.concat([0]), error: error});
        } finally {

        }
    }
}

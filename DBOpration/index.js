'use strict';

const path = require('path');
const fs = require('fs');
const SQL = require('sql.js');
const remote = require('electron').remote;
const app = require('electron').app;
/*
  SQL.js returns a compact object listing the columns separately from the
  values or rows of data. This function joins the column names and
  values into a single objects and collects these together by row id.
  {
    0: {first_name: "Jango", last_name: "Reinhardt", person_id: 1},
    1: {first_name: "Svend", last_name: "Asmussen", person_id: 2},
  }
  This format makes updating the markup easy when the DOM input id attribute
  is the same as the column name. See view.showPeople() for an example.
*/
let _rowsFromSqlDataObject = function(object) {
    let data = [];
    let i = 0;
    let j = 0;
    for (let valueArray of object.values) {
        let item = {};
        item.key = i;
        j = 0;
        for (let column of object.columns) {
            Object.assign(item, {[column]: valueArray[j]});
            j++;
        }
        data.push(item);
        i++;
    }
    return data;
};
SQL.DBPath = remote ? path.join(remote.app.getPath('userData'), 'monitor.db') : path.join(app.getPath('userData'), 'monitor.db');
SQL.dbOpen = function(databaseFileName) {
    try {
        return new SQL.Database(fs.readFileSync(databaseFileName));
    } catch (error) {
        console.log("Can't open database file.", error.message);
        return null;
    }
};

SQL.dbClose = function(databaseHandle, databaseFileName) {
    try {
        let data = databaseHandle.export();
        let buffer = Buffer.alloc(data.length, data);
        fs.writeFileSync(databaseFileName, buffer);
        databaseHandle.close();
        return true;
    } catch (error) {
        console.log("Can't close database file.", error);
        return null;
    }
};

/*
  A function to create a new SQLite3 database from schema.sql.

  This function is called from main.js during initialization and that's why
  it's passed appPath. The rest of the model operates from renderer and uses
  window.model.db.
*/
module.exports.initDb = function(appPath, callback) {
    let dbPath = path.join(appPath, 'monitor.db');
    let createDb = function(dbPath) {
    // Create a database.
        let db = new SQL.Database();
        let result = db.exec('CREATE TABLE "MonitorData" ("AnalyticsTime" TEXT(255,0) NOT NULL,"DataFileName" TEXT(255,0) NOT NULL,"SampleName" TEXT(255,0) NOT NULL,"SampleType" TEXT(255,0) NOT NULL,"CollectFun" TEXT(255,0) NOT NULL,"PollutantName" TEXT(255,0) NOT NULL,"MonitorValue" REAL(1000,10) NOT NULL,"MonitorData" REAL(1000,10) NOT NULL,"Flag" TEXT(255,0) NOT NULL,PRIMARY KEY ("AnalyticsTime", "PollutantName") ); CREATE INDEX "MonitorTime_index" ON MonitorData ("AnalyticsTime" COLLATE NOCASE DESC); CREATE TABLE "DataFile" ("AnalyticsTime" TEXT(255,0) NOT NULL PRIMARY KEY,"DataFileName" TEXT(255,0) NOT NULL,"SampleName" TEXT(255,0) NOT NULL,"SampleType" TEXT(255,0) NOT NULL,"CollectFun" TEXT(255,0) NOT NULL,"IsSuccess" INTEGER NOT NULL); CREATE INDEX "DataFile_index" ON DataFile ("AnalyticsTime" COLLATE NOCASE DESC)');
        if (Object.keys(result).length === 0
      && typeof result.constructor === 'function'
      && SQL.dbClose(db, dbPath)) {
            console.log('Created a new database.');
        } else {
            console.log('model.initDb.createDb failed.');
        }
    };
    let db = SQL.dbOpen(dbPath);
    if (db === null) {
    /* The file doesn't exist so create a new database. */
        createDb(dbPath);
    } else {
    /*
      The file is a valid sqlite3 database. This simple query will demonstrate
      whether it's in good health or not.
    */
        let query = 'SELECT count(*) as `count` FROM `sqlite_master`';
        let row = db.exec(query);
        let tableCount = parseInt(row[0].values);
        if (tableCount === 0) {
            console.log('The file is an empty SQLite3 database.');
            createDb(dbPath);
        } else {
            console.log('The database has', tableCount, 'tables.');
        }
    }
    if (typeof callback === 'function') {
        callback();
    }
};
/*
  Populates the People List.
*/
module.exports.QueryData = function(sql) {
    let db = SQL.dbOpen(SQL.DBPath);
    if (db !== null) {
        try {
            let row = db.exec(sql);
            if (row !== undefined && row.length > 0) {
                row = _rowsFromSqlDataObject(row[0]);
                return row;
            }
        } catch (error) {
            console.log('model.getPeople', error.message);
        } finally {
            SQL.dbClose(db, SQL.DBPath);
        }
    }
};
module.exports.SaveData = function(sql, values) {
    let db = SQL.dbOpen(SQL.DBPath);
    if (db !== null) {
        let statement = db.prepare(sql);
        try {
            if (statement.run(values)) {
                return true;
            } else {
                return false;
            }
        } catch (error) {
            console.log('model.saveFormData', error.message);
        } finally {
            SQL.dbClose(db, SQL.DBPath);
        }
    }
};

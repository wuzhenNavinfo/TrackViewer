var sqlite = require('spatialite');
var FilePathResolve = require('./utils/FilePathResolve.js');

// import sqlite from 'spatialite';
// import FilePathResolve from './utils/FilePathResolve';

var logger = require('../log4js').logger;
var fs = require('fs')

class NewSqlite {
    constructor(dirIndex) {
        dirIndex = parseInt(dirIndex);
        var filePathResoleve = new FilePathResolve();
        var sourceArr = filePathResoleve.getSourceArr();
        var fileDirObj;
        for (let i = 0; i < sourceArr.length; i++) {
            if (sourceArr[i].dirIndex === dirIndex) {
                fileDirObj = sourceArr[i];
                break;
            }
        }
        this.fileUrl = fileDirObj.sqlPath;
    }

    /**
     *
     * @param sqlPath 数据库文件的路径
     * @return {sqlite.Database} 数据连接实例
     */
    static getConnect(sqlPath) {
        var exists = fs.existsSync(sqlPath);
        if (!exists) {
            throw new Error('路径 ' + this.fileUrl + ' 下数据库文件不存在');
        }
        return new sqlite.Database(sqlPath);
    };

    /**
     * 建立数据库连接
     * @returns {sqlite.Database}
     */
    newConnect() {
        var exists = fs.existsSync(this.fileUrl);
        if (!exists) {
            throw new Error('路径 ' + this.fileUrl + ' 下数据库文件不存在');
        }
        return new sqlite.Database(this.fileUrl);
    }
}
// export default NewSqlite;
module.exports = NewSqlite;
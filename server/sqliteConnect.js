import sqlite from 'spatialite';
import FilePathResolve from './utils/FilePathResolve';
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
        this.fileUrl = fileDirObj.fileDir + '/playback-img.sqlite';
    }

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
export default NewSqlite;
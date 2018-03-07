import sqlite from 'spatialite';

class NewSqlite {
    constructor() {
        this.fileUrl = __dirname + '../../playback-img.sqlite';
    }

    newConnect() {
        // 建立数据库连接
        return new sqlite.Database(this.fileUrl);
    }
}
export default NewSqlite;
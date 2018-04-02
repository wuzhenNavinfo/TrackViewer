var fs = require('fs');
var sqlite = require('spatialite');

class NewSqlite {
    static getConnect(sqlPath) {
        var exists = fs.existsSync(sqlPath);
        if (!exists) {
            throw new Error('路径 ' + sqlPath + ' 下数据库文件不存在');
        }
        if (!this.connection) { // 数据源不能重复创建，否则会出现同一接口和参数返回数据不一致的问题
            this.connection = new sqlite.Database(sqlPath);
        }
        return this.connection;
    };
}
module.exports = NewSqlite;
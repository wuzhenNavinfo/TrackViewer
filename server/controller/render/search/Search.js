import NewSqlite from '../../../sqliteConnect.js';
var logger = require('../../../../log4js').logger;

class Search {
    constructor (dirIndex, type) {
        this.type = type;
        if (!this.db) {
            this.db = new NewSqlite(dirIndex).newConnect();
        }
    }

    /**
     * 根据参数查询瓦片数据
     * @param x
     * @param y
     * @param z
     * @param {String} mode 照片模式或者视频模式
     */
    getByTileByMode(x, y, z, mode){

    }

    executeSql(sql) {
        const self = this;
        return new Promise((resolve, reject) => {
            this.db.spatialite(function(er) {
                if (er) {
                    logger.error(er);
                    reject(er);
                } else {
                    self.db.all(sql, function(err, rows) {
                        if (err) {
                            logger.error(err);
                            reject(err);
                        } else {
                            resolve(rows);
                        }
                    });
                }
            });
        })
    }
}
export default Search;
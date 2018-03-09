import NewSqlite from './../sqliteConnect.js';
import ResJson from '../utils/ResJson';
import FilePathResolve from '../utils/FilePathResolve';
var logger = require('../../log4js').logger;

class Business {

    constructor(req, res) {
        this.res = res;
        this.dirIndex = req.query.dirIndex;
        this.db = new NewSqlite(this.dirIndex).newConnect();
        this.closeDb = function() {
            this.db.close();
        }
    }

    /**
     * 根据轨迹信息列表的额索引查询单个轨迹线以及对应的照片
     */
    getPhotosByIndex() {
        let self = this;
        let sql = `select a.id, AsGeoJSON(a.geometry) AS geometry, a.deviceNum, b.url,  b.shootTime  
                from  track_collection a left join track_collection_photo b where a.id = b.id `
        this.db.spatialite(function(err) {
            self.db.all(sql, function(err, rows) {

                var fileObjs = new FilePathResolve().getSourceArr();
                var fileObj = fileObjs[self.dirIndex];
                logger.info(fileObjs);
                var data = {
                    node: rows,
                    baesPath: fileObj.fileDir,
                    flag: fileObj.flag,
                    dirIndex: self.dirIndex
                }

                var resJson = new ResJson();
                resJson.data = data;
                self.res.json(resJson);
            });
        });
        self.closeDb();
    }
}

export default Business;
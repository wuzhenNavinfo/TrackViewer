import conf from '../../config/config'
import NewSqlite from './../sqliteConnect';
var logger = require('../../log4js').logger;
var dateFormat = require('dateformat');
var fs = require('fs');
var path = require('path');


/**
 * 文件夹路径解析类 (单例类)
 * @author    wuzhen
 * @date      2018/03/08
 * @copyright @Navinfo, all rights reserved.
 */
export default class Config {
    /**
     * 类的实例对象
     * @type {null}
     */
    static instance = null;

    /**
     * 遍历目录后的数据
     * @type {Array}
     * @private
     */
    _sourceArr = [];

    /**
     * 构造方法.
     *
     * @returns {undefined}
     */
    constructor () {
        this._sourceArr = [];
        // this._db =
        this.fileDisplay(conf.dataRoot);
    }

    /**
     * 根据一个几何范围和geoLiveType选择要素
     * @param {String} string
     * @param {Array} geoLiveTypes - geoLiveType数组
     * @returns {Array} 所有被选中的feature数组
     */
    fileDisplay = function (filePath) {
        var self = this;
        var folder = ['center', 'left', 'right'];
        folder.forEach(function (item, index) {
            let baseDir = path.join(filePath,item);
            if (fs.existsSync(baseDir)){
                let sqlPath = path.join(baseDir, 'playback.sqlite');
                let dir = path.join(baseDir, 'videomode');
                if (fs.existsSync(dir)) {
                    var files = fs.readdirSync(dir);
                    files.forEach(function (name) {
                        let d = path.join(dir, name);
                        let t = fs.statSync(d);
                        if (t.isDirectory()) {
                            let fp = path.join(dir, name);
                            let fileStat = fs.statSync(fp);
                            var temp = {
                                dirIndex: index,
                                baseDir: baseDir,
                                filePath: fp,
                                sqlPath: sqlPath,
                                createTime: dateFormat(fileStat.ctime, 'yyyy-mm-dd'),
                                flag: item
                            };
                            self._sourceArr.push(temp);
                        }
                    });
                }
            }
        });
        // this.createTempTable();
        // this.queryLink();
    };

    queryLink () {
        let sqlPath = this._sourceArr[1].sqlPath;
        sqlPath = path.join('./', sqlPath);
        let db = NewSqlite.getConnect(sqlPath);
        let sql = `select a.sNodePid, AsGeoJSON(a.geometry) AS geometry from link_temp a`;
        db.spatialite(function(err) {
            if (err) {
                return;
            }
            db.all(sql, function(err, rows) {
                logger.info(err,rows)
            });
        });
    };

    createTempTable () {
        let sqlPath = this._sourceArr[0].sqlPath;
        sqlPath = path.join('./', sqlPath);
        let db = NewSqlite.getConnect(sqlPath);

        db.spatialite(function(err) {
            if (err) {
                return;
            }
            let sql = 'drop table if exists link_temp';
            db.all(sql ,function (err, rows) {
                sql = `create table link_temp (
                        'id' integer  PRIMARY key autoincrement,
                        'sNodePid' text not null,
                        'eNodePid' text not null,
                        'geometry' GEOMETRY )`;
                db.all(sql ,function (err, rows) {
                    sql = `select a.id, AsGeoJSON(a.geometry) AS geometry, a.recordTime
                    from track_collection a , track_collection_photo b where a.id = b.id order by a.recordTime`;
                    db.all(sql, function(err, rows) {
                        if (rows.length < 1) {
                            return;
                        }
                        let sqlStr = `insert into link_temp ('sNodePid', 'eNodePid', 'geometry') values `;
                        for (let i = 0; i < rows.length - 1; i++) {
                            let sId = rows[i].id;
                            let eId = rows[i + 1].id;
                            let sDate = rows[i].recordTime.substr(0, 8);
                            let eDate = rows[i + 1].recordTime.substr(0, 8);
                            let sCoordinates = JSON.parse(rows[i].geometry).coordinates;
                            let eCoordinates = JSON.parse(rows[i + 1].geometry).coordinates;
                            let geo = {
                                type: 'LineString',
                                coordinates: [sCoordinates, eCoordinates]
                            };
                            if (sDate === eDate) {
                                geo = JSON.stringify(geo);
                                sqlStr += ` ('${sId}', '${eId}', GeomFromGeoJSON('${geo}') ), `;
                            }
                        }
                        sqlStr = sqlStr.substring(0, sqlStr.lastIndexOf(','));
                        logger.info(sqlStr);
                        db.all(sqlStr, function(err, rows) {
                            logger.info(err,rows)
                        });
                    });
                });
            });
        });
        // let geo = {
        //     type: 'LineString',
        //     coordinates: [[116.3374, 39.99565], [116.33739, 39.99587]]
        // };
        // let temp = JSON.stringify(geo);
        // sql = `insert into link_temp ('sNodePid', 'eNodePid', 'geometry')
        //             values ('7A6B619ED1F34A9BA0CBF5CB705266F8', '45CD00B3EF8C42CDBCB1BCDC045D72C6', GeomFromGeoJSON('${temp}') )`;
        // logger.info(sql);
        // db.spatialite(function(err) {
        //     if (err) {
        //         return;
        //     }
        //     db.all(sql, function(err, rows) {
        //         logger.info(err,rows)
        //     });
        // });
    };

    /**
     * 获取默认配置路径下的文件夹路径
     * @returns {Array}
     */
    getSourceArr () {
        return this._sourceArr;
    };

    static getInstance() {
        if (!Config.instance) {
            Config.instance = new Config();
        }
        return Config.instance;
    }
}
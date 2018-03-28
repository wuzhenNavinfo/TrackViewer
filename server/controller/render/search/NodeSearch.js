import MercatorProjection from '../../../utils/MercatorProjection.js';
import ResJson from '../../../utils/ResJson';
import Search from "./Search";
var logger = require('../../../../log4js').logger;

class SearchNode extends Search{
    constructor(dirIndex, type) {
        super(dirIndex, type);
        // this.db = null;
        // if (!this.db) {
        //     this.db = new NewSqlite(dirIndex).newConnect();
        // }
        // this.closeDb = function() {
        //     this.db.close();
        // }

    }
    async getByTileByMode(x, y, z, mode) {
        let self = this;
        let  resJson = new ResJson();
        let trackTable = '';
        let photoTable = '';
        const wkt = MercatorProjection.getWktWithGap(x, y, z, 0);

        if (mode === 'videomode') {
            trackTable = 'track_collection';
            photoTable = 'track_collection_photo';
        } else if (mode === 'photomode') {
            trackTable = 'track_contshoot';
            photoTable = 'track_contshoot_photo';
        } else {
            resJson.errmsg = 'mode参数有误！';
            resJson.errcode = -1;
            self.res.json(resJson);

            // -------此处需要改善
        }

        let sql = `select a.id as id, AsWKT(a.geometry) AS geometry from ${trackTable} a,  ${photoTable} b
                where a.id = b.id and Contains(GeomFromText('${wkt}'), a.geometry)`;
        const px = MercatorProjection.tileXToPixelX(x);
        const py = MercatorProjection.tileYToPixelY(y);

        const rows = await this.executeSql(sql);

        let dataArray = [];
        for(let i = 0; i < rows.length; i++){
            if (rows[i].geometry) {
                let snapShot = {
                    g: MercatorProjection.coord2Pixel(rows[i].geometry, px, py, z),
                    t: 1, // 表示点
                    i: rows[i].id,
                    m: {}
                };
                snapShot.m.a = rows[i].linkId;
                dataArray.push(snapShot);
            }
        }
        let returnData = {};
        returnData.data = dataArray;
        returnData.type = self.type;
        return returnData;
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

export default SearchNode;
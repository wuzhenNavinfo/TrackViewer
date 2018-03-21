import NewSqlite from './../sqliteConnect.js';
import MercatorProjection from '../utils/MercatorProjection.js';
import ResJson from '../utils/ResJson';
var logger = require('../../log4js').logger;

class SearchNode {
    constructor(req, res, next) {
        this.req = req;
        this.res = res;
        let parm = JSON.parse(req.query.parameter);
        let dirIndex = parm.dirIndex;
        this.db = null;
        if (!this.db) {
            this.db = new NewSqlite(dirIndex).newConnect();
        }
        this.closeDb = function() {
            this.db.close();
        }
    }
    searchByTile(x, y, z, gap) {
        let self = this;
        const wkt = MercatorProjection.getWktWithGap(x, y, z, 0);
        let sql = `select a.id as id, AsWKT(a.geometry) AS geometry from track_collection a,  track_collection_photo b 
                where a.id = b.id and Contains(GeomFromText('${wkt}'), a.geometry)`;
        // logger.info(sql);
        const px = MercatorProjection.tileXToPixelX(x);
        const py = MercatorProjection.tileYToPixelY(y);
        this.db.spatialite(function(err) {
            self.db.all(sql, function(err, rows) {
                var resJson = new ResJson();
                if (!err) {
                    let dataArray = [];
                    for(let i = 0; i < rows.length; i++){
                        if (rows[i].geometry) {
                            let snapShot = {
                                g: MercatorProjection.coord2Pixel(rows[i].geometry, px, py, z),
                                t: 1,
                                i: rows[i].id,
                                m: {}
                            };
                            snapShot.m.a = rows[i].linkId;
                            dataArray.push(snapShot);
                        }
                    }

                    resJson.data = dataArray;
                } else {
                    resJson.errcode = -1;
                    resJson.errmsg = err.message;
                }
                self.res.json(resJson);
            });
        });
        // self.closeDb();
    }
}

export default SearchNode;
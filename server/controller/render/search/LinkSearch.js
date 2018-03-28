import MercatorProjection from '../../../utils/MercatorProjection.js';
import ResJson from '../../../utils/ResJson';
import Search from "./Search";
var logger = require('../../../../log4js').logger;

class LinkSearch extends Search{
    constructor(dirIndex, type) {
        super(dirIndex, type);
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

        // let sql = `select a.id as id, AsWKT(a.geometry) AS geometry from ${trackTable} a,  ${photoTable} b
        //         where a.id = b.id and Contains(GeomFromText('${wkt}'), a.geometry)`;

        let sql = `select a.id, a.sNodePid, a.eNodePid, AsWKT(a.geometry) AS geometry from link_temp a 
                where Intersects(GeomFromText('${wkt}'), a.geometry) `;
        logger.info(sql);
        const px = MercatorProjection.tileXToPixelX(x);
        const py = MercatorProjection.tileYToPixelY(y);

        const rows = await this.executeSql(sql);

        let dataArray = [];
        for(let i = 0; i < rows.length; i++){
            if (rows[i].geometry) {
                let snapShot = {
                    g: MercatorProjection.coord2Pixel(rows[i].geometry, px, py, z),
                    t: 1,
                    i: rows[i].id,
                    m: {}
                };
                snapShot.m.s = rows[i].sNodePid;
                snapShot.m.e = rows[i].eNodePid;
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
                    reject(er);
                } else {
                    self.db.all(sql, function(err, rows) {
                        if (err) {
                            reject(err);
                        } else {
                            logger.info(rows);
                            resolve(rows);
                        }
                    });
                }
            });
        })
    }
}

export default LinkSearch;
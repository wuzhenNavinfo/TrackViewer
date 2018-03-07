import NewSqlite from './../sqliteConnect.js';
import MercatorProjection from '../utils/MercatorProjection.js';

class SearchNode {
    constructor(req, res, next) {
        this.req = req;
        this.res = res;
        this.next = next;
        this.db = new NewSqlite().newConnect();
        console.log(this.db);
        this.closeDb = function() {
            this.db.close();
        }
    }
    searchByTile(x, y, z, gap) {
        let self = this;
        const wkt = MercatorProjection.getWktWithGap(x, y, z, 0);
        // console.info('111111111111' + wkt);
        let sql = `select spatialite_version() from track_collection LIMIT 2`;
        sql = `select AsGeoJSON(geometry) AS geometry from track_collection LIMIT 1`;

        sql = 'select id, linkId, AsWKT(a.geometry) AS geometry from track_collection a where  PtDistWithin(a.geometry, GeomFromText("' + wkt + '"), 1)';
        // console.info('==========', sql);

        const px = MercatorProjection.tileXToPixelX(x);
        const py = MercatorProjection.tileYToPixelY(y);
        this.db.spatialite(function(err) {
            self.db.all(sql, function(err, rows) {
                self.closeDb();
                let dataArray = [];
                for(let i = 0; i < rows.length; i++){
                    if (rows[i].geometry) {
                        let snapShot = {
                            g: MercatorProjection.coord2Pixel(rows[i].geometry, px, py, z),
                            i: rows[i].id,
                            m: {}
                        };
                        snapShot.m.a = rows[i].linkId;
                        dataArray.push(snapShot);
                    }
                }
                self.res.json({ errorCode: 0, data: dataArray });
            });
        });
    }
}

export default SearchNode;
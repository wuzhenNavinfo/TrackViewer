import NewSqlite from './../sqliteConnect.js';

class Test {
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

    queryRow() {
        let self = this;
        this.db.spatialite(function(err) {
            // 为jade显示的sql
            let sql = `SELECT rowid, AsGeoJSON(geometry) AS geometry, "id", "direction",
            "speed", "recordTime", "userId", "deviceNum", "hdop", "altitude",
             "posType", "satNum", "mediaFlag", "prjName", "weekSeconds", "linkId", "plateNum"
               FROM track_collection c where exists (select 1 from track_collection_photo p where c.id=p.id) ORDER BY ROWID LIMIT 30`;
            // 实际sql
            // let sql =`SELECT rowid, AsGeoJSON(geometry) AS geometry, "id", "direction",
            // "speed", "recordTime", "userId", "deviceNum", "hdop", "altitude",
            //  "posType", "satNum", "mediaFlag", "prjName", "weekSeconds", "linkId", "plateNum"
            //    FROM "track_collection" ORDER BY ROWID LIMIT 30`;
            self.db.all(sql, function(err, rows) {
                rows.forEach(row => {
                    row.geometry = JSON.parse(row.geometry);
                });
                // 正式返回时
                // self.res.json({ errorCode: 0, data: rows });
                console.log(rows);
                self.res.render('test', { infoList: rows });
                self.closeDb();
            });
        });
    }
}

export default Test;
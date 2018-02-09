import NewSqlite from './../sqliteConnect.js';
var fs = require("fs")

class Photo {
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

    queryPhoto() {
        let self = this;
        this.db.spatialite(function(err) {
            let id = self.req.query.id;
            if (typeof id != 'string') {
                id += '';
            }
            let sql = `SELECT ROWID, "id", "url", "shootTime" FROM "track_collection_photo" WHERE id='${id}'`;
            self.db.all(sql, function(err, rows) {
                console.log(rows);
                if (!rows) {
                    rows = [];
                    self.res.render('photo', { photoInfo: null });
                } else {
                    // self.res.json({ errorCode: 0, data: rows });
                    let urlList = rows[0].url.split(';');
                    let imgFile = [];
                    for (let i = 0; i < urlList.length - 1; i++) {
                        imgFile.push(fs.readFileSync(__dirname + '../../../frames/' + urlList[i], "binary"));
                    }
                    //设置请求的返回头type,content的type类型
                    self.res.setHeader("Content-Type", 'jpg');
                    //格式必须为 binary 否则会出错
                    // 两张图片只拿一个 正式时一个get请求只有一张图片
                    var content = imgFile[0];
                    self.res.writeHead(200, "Ok");
                    self.res.write(content, "binary"); //格式必须为 binary，否则会出错
                    self.res.end();
                }
                self.closeDb();
            });
        });
    }
}

export default Photo;
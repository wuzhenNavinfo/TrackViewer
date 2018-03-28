import Render from '../server/controller/render/render';
import express from 'express';
var logger = require('../log4js').logger;
var router = express.Router();


// http://localhost:5000/trackView/search/getObjByTile?_a=1&parameter={%22dirIndex%22:1,%22mode%22:%22videomode%22,%22types%22:[%22TRACKPOINT%22,%22TRACKLINK%22],%22x%22:216024,%22y%22:113551,%22z%22:18}

import MercatorProjection from '../server/utils/MercatorProjection'
import NewSqlite from './../server/sqliteConnect.js';
import ResJson from "../server/utils/ResJson";

// router.get('/getObjByTile', function(req, res, next) {
//     try {
//         // let test = new Node(req, res, next);
//         let parm = JSON.parse(req.query.parameter);
//         let x = parm.x;
//         let y = parm.y;
//         let z = parm.z;
//         let mode = parm.mode;
//
//         let db = new NewSqlite(0).newConnect();
//
//         const wkt = MercatorProjection.getWktWithGap(x, y, z, 0);
//         // let sql = `select a.id, a.sNodePid, a.eNodePid, AsWKT(a.geometry) AS geometry from link_temp a
//         //         where Intersects( a.geometry, GeomFromText('${wkt}')) `;
//
//         let sql = `select a.id as id, AsWKT(a.geometry) AS geometry from track_collection a,  track_collection_photo b
//                 where a.id = b.id and Contains(GeomFromText('${wkt}'), a.geometry)`;
//         logger.info(sql);
//         const px = MercatorProjection.tileXToPixelX(x);
//         const py = MercatorProjection.tileYToPixelY(y);
//
//         let json = new ResJson();
//         db.spatialite(function(er) {
//             db.all(sql, function(err, rows) {
//                 if (!err) {
//                     let dataArray = [];
//                     for(let i = 0; i < rows.length; i++){
//                         if (rows[i].geometry) {
//                             let snapShot = {
//                                 g: MercatorProjection.coord2Pixel(rows[i].geometry, px, py, z),
//                                 t: 1,
//                                 i: rows[i].id,
//                                 m: {}
//                             };
//                             snapShot.m.a = rows[i].linkId;
//                             dataArray.push(snapShot);
//                         }
//                     }
//                     json.data = dataArray;
//                     res.json(json);
//                 } else {
//                     logger.error(err);
//                 }
//             });
//         });
//     } catch (error) {
//         logger.info(error);
//         next(error);
//     }
// });

router.get('/getObjByTile', function (req, res, next) {
    try {
        let renderManager = new Render(req, res, next);
        renderManager['getObjByTile']();
    } catch (error) {
        logger.error(error);
        next (error);
    }
});

export default router;
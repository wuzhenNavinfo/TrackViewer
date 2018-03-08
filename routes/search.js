import Node from '../server/controller/node.js';
import express from 'express';
var router = express.Router();

router.get('/node', function(req, res, next) {
    console.info('----', JSON.parse(req.query.parameter));
    try {
        let test = new Node(req, res, next);
        let parm = JSON.parse(req.query.parameter);
        let x = parm.x;
        let y = parm.y;
        let z = parm.z;
        // test.searchByTile(210, 110, 8);
        // test.searchByTile(3375, 1774, 12);
        test.searchByTile(x, y, z);
    } catch (error) {
        next(error);
    }
});

export default router;
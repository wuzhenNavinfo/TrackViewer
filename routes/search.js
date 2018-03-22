import Node from '../server/controller/node.js';
import express from 'express';
var logger = require('../log4js').logger;
var router = express.Router();

router.get('/node', function(req, res, next) {
    try {
        let test = new Node(req, res, next);
        let parm = JSON.parse(req.query.parameter);
        let x = parm.x;
        let y = parm.y;
        let z = parm.z;
        let mode = parm.mode;
        test.searchByTile(x, y, z, mode);
    } catch (error) {
        logger.info(error);
        next(error);
    }
});

export default router;
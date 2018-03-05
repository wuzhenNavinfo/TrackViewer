import SearchNode from '../server/controller/searchNode.js';
var express = require('express');
var router = express.Router();
require('spatialite');

/* GET test listing. */
router.get('/searchNode', function(req, res, next) {
    // res.send('respond with a resource');
    console.info('----', JSON.parse(req.query.parameter));
    try {
        let test = new SearchNode(req, res, next);
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

module.exports = router;
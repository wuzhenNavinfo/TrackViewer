import Test from '../server/controller/test.js';
var express = require('express');
var router = express.Router();
require('spatialite');

/* GET test listing. */
router.get('/test', function(req, res, next) {
    // res.send('respond with a resource');
    try {
        let test = new Test(req, res, next);
        test.queryRow();
    } catch (error) {
        next(error);
    }
});

module.exports = router;
import Photo from '../server/controller/photo.js';
var express = require('express');
var router = express.Router();
require('spatialite');

/* GET test listing. */
router.get('/photo', function(req, res, next) {
    // res.send('respond with a resource');
    try {
        let test = new Photo(req, res, next);
        test.queryPhoto();
    } catch (error) {
        next(error);
    }
});

module.exports = router;
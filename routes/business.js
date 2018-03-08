import FilePathResolve from '../server/utils/FilePathResolve';
import express from 'express';
var logger = require('../log4js').logger;
var router = express.Router();

router.get('/list', function(req, res, next) {
    try {
        let filePathResolve = new FilePathResolve();
        let sourceArr = filePathResolve.getSourceArr();
        let list = [];
        sourceArr.forEach(function (item, index, items) {
             item['type'] = '照片';
             list.push(item);
        })
        res.json(sourceArr);
    } catch (error) {
        logger.error('接口' + req.originalUrl + '请求失败!', error);
        next(error);
    }

    // try {
    //     let business = new Business(req, res, next);
    //     let parm = JSON.parse(req.query.parameter);
    //     let x = parm.x;
    //     let y = parm.y;
    //     let z = parm.z;
    //     business.list(x, y, z);
    //     res.json()
    // } catch (error) {
    //     next(error);
    // }
});

export default router;
import FilePathResolve from '../server/utils/FilePathResolve';
import express from 'express';
var logger = require('../log4js').logger;
var router = express.Router();

/**
 * 轨迹信息列表
 */
router.get('/list', function(req, res, next) {
    try {
        let filePathResolve = new FilePathResolve();
        let sourceArr = filePathResolve.getSourceArr();
        let list = [];
        sourceArr.forEach(function (item, index, items) {
             item['type'] = '照片';
             list.push(item);
        })
        res.json({ errcode: 0, data: list });
    } catch (error) {
        logger.error('接口' + req.originalUrl + '请求失败!', error);
        next(error);
    }
});

export default router;
import FilePathResolve from '../server/utils/FilePathResolve';
import ResJson from '../server/utils/ResJson';
import Business from '../server/controller/Business';
import express from 'express';
var logger = require('../log4js').logger;
var router = express.Router();

/**
 * 根据index获取轨迹的所有照片信息
 */
router.get('/getPhotosByIndex', function(req, res, next) {
    try {
        let business = new Business(req, res);
        business.getPhotosByIndex();
        // var resJson = new ResJson();
        // res.json(resJson);
    } catch (error) {
        logger.error('接口' + req.originalUrl + '请求失败!', error);
        next(error);
    }
});

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

        var resJson = new ResJson();
        resJson.data = list;
        res.json(resJson);
    } catch (error) {
        logger.error('接口' + req.originalUrl + '请求失败!', error);
        next(error);
    }
});

export default router;
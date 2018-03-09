import FilePathResolve from '../server/utils/FilePathResolve';
import ResJson from '../server/utils/ResJson';
import Business from '../server/controller/Business';
import express from 'express';
var fs = require('fs');
var logger = require('../log4js').logger;
var router = express.Router();



/**
 * 根
 */
router.get('/queryImage', function(req, res, next) {
    try {
        var dirIndex = req.query.dirIndex;
        var image = req.query.image;
        var fileObjs = FilePathResolve.getInstance().getSourceArr();
        var fileObj = fileObjs[dirIndex];
        var imagePath = fileObj.fileDir + '/frames/' + image;
        res.setHeader('Content-Type', 'image/jpeg');
        var content = fs.readFileSync(imagePath, 'binary');
        res.writeHead(200, 'OK');
        res.write(content, 'binary');
        res.end();
    } catch (error) {
        logger.error('接口' + req.originalUrl + '请求失败!', error);
        next(error);
    }
});

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
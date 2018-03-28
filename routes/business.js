import FilePathResolve from '../server/utils/FilePathResolve';
import ResJson from '../server/utils/ResJson';
import Business from '../server/controller/business/Business';
import express from 'express';
import needle from 'needle';
import conf from '../config/config';

var path = require('path');
var fs = require('fs');
var logger = require('../log4js').logger;
var router = express.Router();

/**
 * 根据照片的文件名获取照片
 */
router.get('/queryImage', function(req, res, next) {
    try {
        var dirIndex = req.query.dirIndex;
        var image = req.query.image;
        var fileObjs = FilePathResolve.getInstance().getSourceArr();
        var fileObj = fileObjs[dirIndex];
        var imagePath = path.join(fileObj.baseDir, image);
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
        let parm = JSON.parse(req.query.parameter);
        let mode = parm.mode;
        business.getPhotosByIndex(mode);
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
        const filePathResolve = new FilePathResolve();
        const sourceArr = filePathResolve.getSourceArr();
        const list = [];
        sourceArr.forEach(function (item, index, items) {
            item['type'] = '照片';
            list.push(item);
        })

        const resJson = new ResJson();
        resJson.data = list;
        res.json(resJson);
    } catch (error) {
        logger.error('接口' + req.originalUrl + '请求失败!', error);
        next(error);
    }
});

/**
 * 根据照片的文件名上传照片
 */
router.post('/uploadImage', function (req, res, next) {
    try {
        const {
            dirIndex,
            image,
            accessToken,
            dbId,
            objectPid
        } = req.body;
        
        const fileObjs = FilePathResolve.getInstance().getSourceArr();
        const fileObj = fileObjs[dirIndex];
        const imagePath = path.join(fileObj.baseDir, image);     

        const data = {
            parameter: JSON.stringify({
                filetype: 'photo',
                dbId: dbId,
                pid: objectPid
            }),
            image: { file: imagePath, content_type: 'image/jpg' }
        }

        needle.post(conf.uploadUrl + '?access_token=' + accessToken, data, { multipart: true }, function (err, resp, body) {
            res.json(resp.body);
        });
    } catch (error) {
        logger.error('接口' + req.originalUrl + '请求失败!', error);
        next(error);
    }
});

export default router;
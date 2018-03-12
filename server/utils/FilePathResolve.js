import conf from '../../config/config';
var logger = require('../../log4js').logger;
var dateFormat = require('dateformat');
var fs = require('fs');
var path = require('path');


/**
 * 文件夹路径解析类 (单例类)
 * @author    wuzhen
 * @date      2018/03/08
 * @copyright @Navinfo, all rights reserved.
 */
export default class Config {
    /**
     * 类的实例对象
     * @type {null}
     */
    static instance = null;

    /**
     * 遍历目录后的数据
     * @type {Array}
     * @private
     */
    _sourceArr = [];

    /**
     * 构造方法.
     *
     * @returns {undefined}
     */
    constructor () {
        this._sourceArr = [];
        let filePath = conf.fileUrl;
        this.fileDisplay(filePath);
    }

    /**
     * 根据一个几何范围和geoLiveType选择要素
     * @param {String} string
     * @param {Array} geoLiveTypes - geoLiveType数组
     * @returns {Array} 所有被选中的feature数组
     */
    fileDisplay = function (filePath) {
        var self = this;
        var folder = ['center', 'left', 'right'];
        folder.forEach(function (item, index) {
            let baseDir = path.join(filePath,item);
            let sqlPath = path.join(baseDir, 'playback.sqlite');

            let dir = path.join(baseDir, 'videomode');
            var files = fs.readdirSync(dir);
            files.forEach(function (name) {
                let d = path.join(dir, name);
                let t = fs.statSync(d);
                if (t.isDirectory()) {
                    let fp = path.join(dir, name);
                    let fileStat = fs.statSync(fp);
                    var temp = {
                        dirIndex: index,
                        baseDir: baseDir,
                        filePath: fp,
                        sqlPath: sqlPath,
                        createTime: dateFormat(fileStat.ctime, 'yyyy-mm-dd'),
                        flag: item
                    };
                    self._sourceArr.push(temp);
                }
            });
        });
    }

    /**
     * 获取默认配置路径下的文件夹路径
     * @returns {Array}
     */
    getSourceArr = function () {
        return this._sourceArr;
    }

    static getInstance() {
        if (!Config.instance) {
            Config.instance = new Config();
        }
        return Config.instance;
    }
}
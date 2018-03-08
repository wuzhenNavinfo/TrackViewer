import conf from '../../config/config';
var logger = require('../../log4js').logger;
var dateFormat = require('dateformat');
var fs = require('fs');
var path = require('path');

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
        this.sourceArr = [];
        let filePath = conf.fileUrl;
        this.fileDisplay(filePath);
    }

    /**
     * 根据一个几何范围和geoLiveType选择要素
     * 如果geoLiveTypes为undefined或null,则查找所有类型要素
     * 如果未找到匹配feature返回[].
     * @param {Object} geometry 支持所有geoJson几何类型
     * @param {Array} geoLiveTypes - geoLiveType数组
     * @returns {Array} 所有被选中的feature数组
     */
    fileDisplay = function (filePath) {
        var files = fs.readdirSync(filePath);
        files.forEach((filename, index) => {
            let fileDir = path.join(filePath, filename);
            let stat = fs.statSync(filePath);
            var dirObj = {
                index: index,
                fileDir: fileDir,
                createTime: dateFormat(stat.ctime, 'yyyy-mm-dd')
            }
            this.sourceArr.push(dirObj);
        });
    }

    /**
     * 获取默认配置路径下的文件夹路径
     * @returns {Array}
     */
    getSourceArr = function () {
        return this.sourceArr;
    }

    static getInstance() {
        if (!Config.instance) {
            Config.instance = new Config();
        }
        return Config.instance;
    }
}
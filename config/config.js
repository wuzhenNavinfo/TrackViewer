/**
 * 项目中的一些常量配置类（单例类）
 */
const conf = Object.freeze({
    // 图片上传服务接口
    uploadUrl: 'http://fs-road.navinfo.com/dev/trunk/service/dropbox/upload/resource',
    // 数据文件根目录
    dataRoot: './data',
});

// export default conf;
module.exports = conf;
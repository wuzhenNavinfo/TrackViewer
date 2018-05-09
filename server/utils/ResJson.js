/**
 * 接口返回的数据格式类
 * @author    wuzhen
 * @date      2018/03/08
 * @copyright @Navinfo, all rights reserved.
 */
class ResJson {
    /**
     * 构造方法.
     * @returns {undefined}
     */
    constructor (errcode = 0, errmsg = '', data = {}) {
        this.errcode = errcode;
        this.errmsg = errmsg;
        this.data = data;
    }
}

// export default ResJson;
module.exports = ResJson;
import NewSqlite from './../../../sqliteConnect.js';

class Search {
    constructor (dirIndex, type) {
        this.type = type;
        if (!this.db) {
            this.db = new NewSqlite(dirIndex).newConnect();
        }
    }

    /**
     * 根据参数查询瓦片数据
     * @param x
     * @param y
     * @param z
     * @param {String} mode 照片模式或者视频模式
     */
    getByTileByMode(x, y, z, mode){

    }
}
export default Search;
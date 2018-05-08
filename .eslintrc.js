module.exports = {
    "env": {
        "es6": true
    },
    "extends": "airbnb-base",
    "parserOptions": { },
    /**
     * "off" 或 0 - 关闭规则
     * "warn" 或 1 - 开启规则，使用警告级别的错误：warn (不会导致程序退出),
     * "error" 或 2 - 开启规则，使用错误级别的错误：error (当被触发的时候，程序会退出)
     */
    "rules": {
        // 'no-console': 'off',
        "indent": [
            "error",
            4
        ],
        "linebreak-style": [
            "error",
            "windows"
        ],
        "quotes": [
            "error",
            "single"
        ],
        "semi": [2, "always"],//语句强制分号结尾
        // 修改规则,每行最多140个字符
        "max-len": [ "error",  140 ]
    }
};
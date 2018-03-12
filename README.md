# TrackViewer
轨迹照片查看

sqlite为数据库文件
另外由于太大屏蔽了跟目录下的frames文件夹，需要的话单独获取

注意事项：
1：首先是文件路径和目录的约定
 a:修改congif/congif.js文件配置文件夹的基本路径(basePath)
 b:基本路径下的文件格式必须是
    basePath/center
            /center/playback.sqlite
            /center/videomode/20171106
            /center/videomode/20171105
    basePath/left
            /left/playback.sqlite
            /left/videomode/20171106
            /left/videomode/20171105
    basePath/right
            /right/playback.sqlite
            /right/videomode/20171106
            /right/videomode/20171105
2:nodejs服务开启
    首先在项目的根目录下执行npm install
    然后执行npm start
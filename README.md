# TrackViewer
##注意事项：
+ ###1：首先是文件路径和目录的约定
 + #### a:根目录是当前项目的data目录
 + #### b:基本路径下的文件格式必须是
        /data/center
            /center/playback.sqlite
            /center/videomode/20171106
            /center/videomode/20171105

        data/left
            /left/playback.sqlite
            /left/videomode/20171106
            /left/videomode/20171105

        data/right
            /right/playback.sqlite
            /right/videomode/20171106
            /right/videomode/20171105
+ ###2:nodejs服务开启
    + 首先在项目的根目录下执行npm install
    + 然后执行npm start
# TrackViewer
轨迹照片查看nodejs服务程序

# 安装部署
1. 安装nodejs程序

2. 安装TrackViewer  
将TrackViewer拷贝到任意目录，进入TrackViewer根目录，打开命令提示窗口，执行如下命令:
```
npm install
```
3. 启动TrackViewer  
进入TrackViewer根目录，打开命令提示窗口，执行如下命令:
```
npm start
```

# 注意事项：
轨迹文件和照片文件的目录的约定  
1. 修改config/config.js文件配置文件夹的基本路径(`basePath`)
2. 基本路径下的文件路径必须符合以下格式：
```
basePath/center
        /center/playback.sqlite
        /center/videomode/20171106
        /center/videomode/20171105
        /center/videomode/........
basePath/left
        /left/playback.sqlite
        /left/videomode/20171106
        /left/videomode/20171105
        /left/videomode/........
basePath/right
        /right/playback.sqlite
        /right/videomode/20171106
        /right/videomode/20171105
        /right/videomode/........
```

var express = require('express');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var router = require('./routes');
const cluster = require('cluster');
const cpuNums = require('os').cpus().length;

var app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

/* 增加跨域处理 */
let allowCrossDomain = function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    res.header('Access-Control-Allow-Credentials','true');
    res.header("Content-Type", "application/json;charset=utf-8");
    if(req.method === 'OPTIONS') {
        res.sendStatus(200);
    } else {
        next();
    }
};
app.use(allowCrossDomain);

router(app);

app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handler
app.use(function(err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    res.status(err.status || 500).send('出错啦:' + err.stack);
});

if(cluster.isMaster){
    for(let i=0;i<cpuNums;i++){
        cluster.fork();
    }
    cluster.on('exit',(worker)=>{
        console.log(`worker${worker.id} exit.`)
    });
    cluster.on('fork',(worker)=>{
        console.log(`fork：worker${worker.id}`)
    });
    cluster.on('listening',(worker,addr)=>{
        console.log(`worker${worker.id} listening on ${addr.port}`)
    });
    cluster.on('online',(worker)=>{
        console.log(`worker${worker.id} is online now`)
    });
}else{
    app.listen(5000);
}
console.log("服务已经启动： 端口为 5000");


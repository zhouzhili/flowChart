/**
 * Created by zzl on 2017/7/24.
 */
var express = require('express');
var app = express();
var http = require('http').Server(app);
var path = require('path');
var io = require('socket.io')(http);

http.listen(3000, function () {
    console.log('listening on *:3000');
});

app.use(express.static(path.join(__dirname, '/public')));

app.get('/test', function (req, res) {
    res.sendFile(__dirname + '/test.html');
});


app.get('/serverInfo', function (req, res) {
    var data3 = [
        {
            id: 0,
            parentId: null,
            nType: 'server',
            value: 'root',
            state: 'normal',
            inData: [0]
        }, {
            id: 1,
            parentId: [0],
            nType: 'pc',
            value: 'node1',
            state: 'normal',
            inData: [240]
        }, {
            id: 2,
            parentId: [0],
            nType: 'pc',
            value: 'node2',
            state: 'normal',
            inData: [220]
        }, {
            id: 3,
            parentId: [0],
            nType: 'pc',
            value: 'node3',
            state: 'normal',
            inData: [100]
        }, {
            id: 4,
            parentId: [1],
            nType: 'pc',
            value: 'node4',
            state: 'warning',
            inData: [50]
        }, {
            id: 5,
            parentId: [2],
            nType: 'pc',
            value: 'node5',
            state: 'normal',
            inData: [300]
        }, {
            id: 6,
            parentId: [3],
            nType: 'pc',
            value: 'node6',
            state: 'error',
            inData: [20]
        }
    ];
    res.send({'data': data3});
});

var nType = ['pc', 'server', 'cloud', 'global'];
var value = ['主机1', 'pc2', 'pcss', 'ssasd', 'dhhh', '主机33', 'aadssd', 'dasd', 'syyy',
    '2222', 'wew', 'tttt', 'iiii', 'mmm'];
var state = ['normal', 'error', 'warning'];
var inData = [30, 50, 100, 120, 230, 340, 405, 0];

function getRandom(max) {
    return parseInt(Math.random() * max, 10);
}

function getServerInfo() {
    var data = [];
    for (var i = 0; i < 10; i++) {
        var item = {};
        item.id = i;
        item.nType = nType[getRandom(4)];
        item.value = value[getRandom(14)];
        item.runState = state[getRandom(3)];
        item.inData = [inData[getRandom(8)]];
        data.push(item);
    }
    return data;
}


io.on('connection', function (socket) {
    //console.log('连接',socket.id);
    var interval;

    socket.on('refreshData', function (msg) {
        console.log('连续发送数据');
        //每5秒发送一次数据
        interval = setInterval(function () {
            var data = getServerInfo();
            io.emit('sendData', data);
            console.log('发送数据');
        }, 5000);

    });
    //停止发送数据
    socket.on('stop', function (data) {
        if(interval){
            clearInterval(interval);
        }
        console.log('停止刷新数据');
    });

    //发送一次数据
    socket.on('onceData', ()=>{
        if(interval){
            clearInterval(interval);
        }
        var data=getServerInfo();
        io.emit('sendOnceData',data);
    });

    //断开连接
    socket.on('disconnect', function () {
       console.log('断开连接');
    });
});

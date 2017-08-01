/**
 * Created by zzl on 2017/7/28.
 */
define(['jquery', 'js/utils/common', 'socket.io', 'jquery-confirm','jquery-showLoading', 'bootstrap', 'domReady!'],
    function ($, common, socketio) {
        var graph = null,
            socket = null;

        var init = function () {
            if (!mxClient.isBrowserSupported()) {
                mxUtils.error("浏览器不支持!");
            } else {
                //设置graph以及设置共有属性
                graph = new mxGraph($('#graphicContainer')[0]);

                graph.dropEnabled = false;
                graph.setCellsLocked(true);
                //读取节点图
                common.configVertexStyle(graph);
                common.readXML('../js/test.xml', graph);
                //添加状态
                var cells = graph.getModel().cells;
                for (var i in cells) {
                    var cell = cells[i];
                    if (cell.vertex) {
                        if (cell.runState != null) {
                            common.showNodeChange(graph, cell, 'runState', cell.runState);
                        }
                    }
                }

            }
            addEvents();
            graph.addMouseListener(mouseLister);
            graph.addListener(mxEvent.CLICK,cellClickEvent);

            socket = socketio();
        };

        var mouseLister = {
            cell: null,
            circles: [],
            runState: {
                'error': '运行出错',
                'warning': '运行故障',
                'normal': '运行正常'
            },
            infoDom: $("<table class='infoTable table-bordered'>" +
                "<tbody>" +
                "<tr><td>节点名称:</td><td class='cellName'></td></tr>" +
                "<tr><td>节点状态:</td><td class='cellState'></td></tr>" +
                "</tbody>" +
                "</table>"),

            mouseDown: function (sender, me) {
                if (this.circles.length > 0) {
                    for (var i = 0; i < this.circles.length; i++) {
                        this.circles[i].remove();
                    }
                }
                var tmp = me.getCell();
                if (tmp && tmp.vertex) {
                    var edges = graph.getOutgoingEdges(tmp);
                    if (edges && edges.length > 0) {
                        this.circles = common.setEdgesAnimate(graph, edges);
                    }
                    //var _this=this;
                    //$.alert({
                    //    title:'节点信息',
                    //    content:'<div>节点名称：'+tmp.value+'</div>'+
                    //        '<div>节点状态：'+_this.runState[tmp.runState]+'</div>'
                    //})
                }

            },

            mouseMove: function (sender, me) {
                var tmp = me.getCell();
                if (tmp != this.cell) {
                    this.cell = tmp;
                    if (tmp && tmp.vertex) {
                        me.getState().setCursor('pointer');
                        // this.infoDom.find('.cellId')[0].innerText = tmp.dId;
                        this.infoDom.find('.cellName')[0].innerText = tmp.value;
                        //this.infoDom.find('.cellType')[0].innerText = tmp.nType;
                        this.infoDom.find('.cellState')[0].innerText = this.runState[tmp.runState];

                        var geo = tmp.geometry;
                        this.infoDom.css({'left': geo.x + 80 + 'px', 'top': geo.y + 40 + 'px'});
                        this.infoDom.appendTo($('body'));
                        this.infoDom.css('display', 'block');
                    } else {
                        this.infoDom.css('display', 'none');
                    }
                }
                me.consume();
            },
            mouseUp: function (sender, me) {
            }
        };

        var cellClickEvent = function (sender, evt) {
            var cell = evt.getProperty('cell');
            if (cell != null) {
                var ip = cell.ip;
                if (ip != '') {
                    $('body').showLoading();
                    doAjax({'ip':ip}, function (result) {
                        $('body').hideLoading();
                        $.alert({
                            title: '节点信息',
                            type: 'green',
                            content: '<div>节点IP: ' + result.ip + '</div>' +
                            '<div>CPU空闲率: ' + result.cpuIdlePct + '</div>' +
                            '<div>CPU系统使用率: ' + result.cpuSystemPct + '</div>' +
                            '<div>CPU用户使用率: ' + result.cpuUserPct + '</div>' +
                            '<div>硬盘总容量: ' + result.fsstatTotal + 'G</div>' +
                            '<div>硬盘用户已使用容量: ' + result.fsstatUsed + 'G</div>' +
                            '<div>硬盘剩余容量: ' + result.fsstatFree + 'G</div>' +
                            '<div>内存总容量: ' + result.memoryTotal + 'M</div>' +
                            '<div>内存用户已使用容量: ' + result.memoryUsed + 'M</div>' +
                            '<div>内存剩余容量: ' + result.memoryUsed + 'M</div>'
                        });
                        if(cell.runState==='error'){
                            cell.runState='normal';
                            common.showNodeChange(graph,cell,'runState','normal');
                        }
                    }, function (result) {
                        $('body').hideLoading();
                        $.alert({
                            title:'信息',
                            type:'red',
                            content:'获取信息失败'
                        });

                        if(cell.runState!='error'){
                            cell.runState='error';
                            common.showNodeChange(graph,cell,'runState','error');
                        }
                        console.log(result);
                    });
                }else {
                    $.alert({
                        title:'警告',
                        type:'orange',
                        content:'当前节点IP值未设置'
                    })
                }
            }
        };

        var doAjax = function (data, successCallback, errorCallback) {
            $.ajax({
                type: 'POST',
                url: 'http://192.168.80.150:8080/testmaven/search/listInfo',
                data: data,
                dataType: 'json',
                success: function (result) {
                    successCallback(result);
                },
                error: function (error) {
                    errorCallback(error);
                }
            })
        };


        /**
         * 根据传入的数据对节点运行状态进行更新
         * @param {Array} data
         */
        var updateNodeInfo = function (data) {
            if (data && data.length > 0) {
                for (var i = 0; i < data.length; i++) {
                    var item = data[i];
                    var cellId = item.id;
                    if (cellId != null) {
                        var cell = graph.getModel().getCell(cellId + 2);
                        common.showNodeChange(graph, cell, 'runState', item.runState);
                    }
                }
            }
        };

        //开始获取数据,长期刷新
        var startGetData = function () {
            socket.emit('refreshData', function (result) {
                console.log('emit refresh data');
            });

            //接受数据
            socket.on('sendData', function (result) {
                console.log('接收数据');
                updateNodeInfo(result);
            });
        };

        //获取一次数据
        var getDataOnce = function () {
            socket.emit('onceData', function () {
            });

            socket.on('sendOnceData', function (data) {
                updateNodeInfo(data);
            });
        };

        //停止获取数据，发送停止事件,让服务器停止发送
        var stopGetData = function () {
            socket.emit('stop', function () {
                console.log('停止获取数据');
            });
        };

        var addEvents = function () {
            $('#viewXML').click(function () {
                common.viewXML(graph);
            });
            $('#startGetData').click(startGetData);
            $('#stopGetData').click(stopGetData);
            $('#getDataOnce').click(getDataOnce);
            $('#test').click(test)
        };


        //动画
        var test = function () {

            var edge = graph.getSelectionCell();
            var node = graph.view.getState(edge).shape.node;
            var p = $(node).find('path')[0];
            var totalLength = p.getTotalLength();
            var startPoint = p.getPointAtLength(0);
            var endPoint = p.getPointAtLength(totalLength);

        };

       return{
           'init':init
       }
    });
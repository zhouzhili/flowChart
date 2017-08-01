/**
 * Created by zzl on 2017/7/28.
 */
define(['svg','jquery'], function (svg,$) {
    var doDraw = function (graph, data) {
        var vertices = {},
            i = 0,
            item;
        if (data) {
            for (i = 0; i < data.length; i++) {
                item = data[i];
                var v1 = setVertex(item);
                vertices[item.id] = v1;
                //添加状态图标
                graph.addCellOverlay(v1, createOverlay(item.state));
            }

            for (i = 0; i < data.length; i++) {
                item = data[i];
                var source = vertices[item.id];
                if (item.parentId != null && item.parentId.length > 0) {
                    var parentIdArray = item.parentId;
                    for (var j = 0; j < parentIdArray.length; j++) {
                        var target = vertices[parentIdArray[j]];
                        var style = getEdgeStyle(item.inData[j]);
                        var e = graph.insertEdge(parent, null, '', target, source, style);
                    }
                }

            }
        }
    };

    var setVertex = function (graph, info) {
        var v1 = graph.insertVertex(parent, null, info.value, 0, 0, 48, 48, info.nType);
        v1.dId = info.id;
        v1.pId = info.parentId;
        v1.inData = info.inData;
        v1.nType = info.nType;
        v1.runState = info.state;
        return v1;
    };

    //根据传入数据量，获取边样式
    var getEdgeStyle = function (inData) {
        if (inData === 0) {
            var style = 'dot';
        } else if (inData < 100) {
            style = '';
        } else if (inData < 200) {
            style = 'bold1';
        } else if (inData < 300) {
            style = 'bold2';
        } else {
            style = 'bold3';
        }
        return style;
    };

    //根据状态，添加状态小图标
    var createOverlay = function (state) {
        var overlay;
        var errorImg = new mxImage('../../image/error.gif', 14, 14);
        var waringImg = new mxImage('../../image/warning.png', 14, 14);
        var runImg = new mxImage('../../image/run.png', 14, 14);
        if (state === 'warning') {
            overlay = new mxCellOverlay(waringImg, '警告');
        } else if (state === 'error') {
            overlay = new mxCellOverlay(errorImg, '错误');
        } else if (state === 'normal') {
            overlay = new mxCellOverlay(runImg, '正常');
        }
        return overlay;
    };

    var configVertexStyle = function (graph) {
        var style = graph.getStylesheet().getDefaultVertexStyle();
        style = mxUtils.clone(style);
        //设置节点为图片
        style[mxConstants.STYLE_SHAPE] = mxConstants.SHAPE_IMAGE;
        style[mxConstants.STYLE_PERIMETER] = mxPerimeter.RectanglePerimeter;
        style[mxConstants.STYLE_IMAGE] = '../../image/pc.svg';
        //设置标签位置和颜色
        style[mxConstants.STYLE_VERTICAL_LABEL_POSITION] = 'bottom';
        style[mxConstants.STYLE_FONTCOLOR] = 'black';
        style[mxConstants.STYLE_LABEL_BACKGROUNDCOLOR] = '#fff';

        style[mxConstants.STYLE_IMAGE] = '../../image/server.svg';
        graph.getStylesheet().putCellStyle('server', style);

        style = mxUtils.clone(style);
        style[mxConstants.STYLE_IMAGE] = '../../image/pc.svg';
        graph.getStylesheet().putCellStyle('pc', style);

        style = mxUtils.clone(style);
        style[mxConstants.STYLE_IMAGE] = '../../image/cloud.svg';
        graph.getStylesheet().putCellStyle('cloud', style);

        style = mxUtils.clone(style);
        style[mxConstants.STYLE_IMAGE] = '../../image/global.svg';
        graph.getStylesheet().putCellStyle('global', style);

        style = mxUtils.clone(style);
        style[mxConstants.STYLE_IMAGE] = '../../image/normal.png';
        graph.getStylesheet().putCellStyle('normal', style);

        style = mxUtils.clone(style);
        style[mxConstants.STYLE_IMAGE] = '../../image/warning.png';
        graph.getStylesheet().putCellStyle('warning', style);

        style = mxUtils.clone(style);
        style[mxConstants.STYLE_IMAGE] = '../../image/error.png';
        graph.getStylesheet().putCellStyle('error', style);
    };

    //设置样式
    var configureEdgeStyle = function (graph) {
        //修改默认
        var defaultStyle = graph.getStylesheet().getDefaultEdgeStyle();
        defaultStyle[mxConstants.STYLE_ROUNDED] = false;
        defaultStyle[mxConstants.STYLE_EDGE] = mxEdgeStyle.ElbowConnector;
        defaultStyle[mxConstants.STYLE_STROKEWIDTH] = 1;
        //连接线颜色
        defaultStyle[mxConstants.STYLE_STROKECOLOR] = '#0077ff';

        //1.5倍粗
        var bold1 = mxUtils.clone(defaultStyle);
        bold1[mxConstants.STYLE_STROKEWIDTH] = 1.5;
        graph.getStylesheet().putCellStyle('bold1', bold1);
        //3倍粗
        var bold2 = mxUtils.clone(defaultStyle);
        bold2[mxConstants.STYLE_STROKEWIDTH] = 3;
        graph.getStylesheet().putCellStyle('bold2', bold2);
        //4.5倍粗
        var bold3 = mxUtils.clone(defaultStyle);
        bold3[mxConstants.STYLE_STROKEWIDTH] = 4.5;
        graph.getStylesheet().putCellStyle('bold3', bold3);
        //虚线样式
        var dot = mxUtils.clone(defaultStyle);
        dot[mxConstants.STYLE_DASHED] = 1;
        dot[mxConstants.STYLE_STROKECOLOR] = 'red';
        graph.getStylesheet().putCellStyle('dot', dot);
    };

    //查看XML
    var viewXML = function (graph) {
        var encoder = new mxCodec();
        var node = encoder.encode(graph.getModel());
        mxUtils.popup(mxUtils.getPrettyXml(node));
    };

    /**
     * 根据传入的参数，修改cell的属性和状态
     * @param graph
     * @param cell
     * @param type
     * @param value
     * @returns {null}
     */
    var showNodeChange = function (graph, cell, type, value) {
        if (cell) {
            //改变节点的类型值，同时改变外观
            if (type === 'type') {
                cell.nType = value;
                graph.setCellStyle(value, [cell]);

                //改变节点值，同时改变节点label值
            } else if (type === 'value') {
                cell.value = value;
                graph.cellLabelChanged(cell, value, false);

                //改变节点的运行状态，同时改变运行状态图标
            } else if (type === 'runState') {
                cell.runState = value;
                var overlays = graph.getCellOverlays(cell);
                if (overlays && overlays.length > 0) {
                    $(overlays).each(function (index, overlay) {
                        if (overlay.tooltip != "编辑属性") {
                            graph.removeCellOverlay(cell, overlay);
                            graph.addCellOverlay(cell, createOverlay(value));
                        }
                    })
                }else {
                    graph.addCellOverlay(cell, createOverlay(value));
                }
            } else if (type === 'inData') {
                cell.inData = value;
                if (cell.pId != null) {
                    if (cell.pId.length != value.length) {
                        console.error('数据不一致');
                        return null;
                    } else {
                        for (var i = 0; i < value.length; i++) {
                            var modal = graph.getModel();
                            var parentCell = modal.getCell(cell.pId[i] + 2);
                            var edge = modal.getEdgesBetween(cell, parentCell)[0];
                            graph.setCellStyle(getEdgeStyle(value[0]), [edge]);
                        }
                    }
                }
            }
        }
    };


    //根据传入的文件名，读取XML配置
    var readXML = function (filePath, graph) {
        var req = mxUtils.load(filePath);
        var root = req.getDocumentElement();
        var dec = new mxCodec(root.ownerDocument);
        dec.decode(root, graph.getModel());
    };

    /**
     * 根据传入的边和SVG DOM节点，生成动画点
     * @param graph
     * @param edges
     */
    var setEdgesAnimate= function (graph,edges) {
        var draw = svg($('svg')[0]);
        var circles=[];
        for(var i=0;i<edges.length;i++){
            var edge=edges[i];
            var node = graph.view.getState(edge).shape.node;
            var p = $(node).find('path')[0];
            var totalLength = p.getTotalLength();
            var startPoint = p.getPointAtLength(0);
            var endPoint = p.getPointAtLength(totalLength);
            var circle = draw.circle(5).fill('red').move(startPoint.x - 2, startPoint.y - 2);
            var a = circle.animate(2000).move(endPoint.x - 2, endPoint.y - 2).loop();
            circles.push(circle);
        }
        return circles;
    };

    return {
        'doDraw': doDraw,
        'setVertex': setVertex,
        'getEdgeStyle': getEdgeStyle,
        'createOverlay': createOverlay,
        'configVertexStyle': configVertexStyle,
        'configureEdgeStyle': configureEdgeStyle,
        'viewXML': viewXML,
        'showNodeChange': showNodeChange,
        'readXML': readXML,
        'setEdgesAnimate':setEdgesAnimate
    }

});
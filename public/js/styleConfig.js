/**
 * Created by zzl on 2017/7/27.
 */
var configureStylesheet = function (graph) {
    //默认的节点样式
    var style = graph.getStylesheet().getDefaultVertexStyle();
    //设置节点为图片
    style=mxUtils.clone(style);
    style[mxConstants.STYLE_SHAPE] = mxConstants.SHAPE_IMAGE;
    style[mxConstants.STYLE_PERIMETER] = mxPerimeter.RectanglePerimeter;
    //style[mxConstants.STYLE_IMAGE] = '../image/pc.svg';
    //设置标签位置和颜色
    style[mxConstants.STYLE_VERTICAL_LABEL_POSITION] = 'bottom';
    style[mxConstants.STYLE_FONTCOLOR] = 'black';
    style[mxConstants.STYLE_LABEL_BACKGROUNDCOLOR] = '#fff';

    style[mxConstants.STYLE_IMAGE] = '../image/server.svg';
    graph.getStylesheet().putCellStyle('server', style);

    style = mxUtils.clone(style);
    style[mxConstants.STYLE_IMAGE] = '../image/pc.svg';
    graph.getStylesheet().putCellStyle('pc', style);

    style = mxUtils.clone(style);
    style[mxConstants.STYLE_IMAGE] = '../image/cloud.svg';
    graph.getStylesheet().putCellStyle('cloud', style);

    style = mxUtils.clone(style);
    style[mxConstants.STYLE_IMAGE] = '../image/global.svg';
    graph.getStylesheet().putCellStyle('global', style);

    style = mxUtils.clone(style);
    style[mxConstants.STYLE_IMAGE] = '../image/normal.png';
    graph.getStylesheet().putCellStyle('normal', style);

    style = mxUtils.clone(style);
    style[mxConstants.STYLE_IMAGE] = '../image/warning.png';
    graph.getStylesheet().putCellStyle('warning', style);

    style = mxUtils.clone(style);
    style[mxConstants.STYLE_IMAGE] = '../image/error.png';
    graph.getStylesheet().putCellStyle('error', style);

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

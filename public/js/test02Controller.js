/**
 * Created by zzl on 2017/7/27.
 */
$(function () {
    var graph, parent, layout, graphModel;

    var initVariable = function (container) {
        if (!mxClient.isBrowserSupported()) {
            mxUtils.error("浏览器不支持!");
        } else {
            //设置graph以及设置共有属性
            graph = new mxGraph(container);
            parent = graph.getDefaultParent();
            graphModel = graph.getModel();

            graph.dropEnabled = true;
        }
        //configureStylesheet(graph);
        configStyle();
        graph.setConnectable(true);
        readXML();
    };

    var configStyle= function () {
        var defaultStyle = graph.getStylesheet().getDefaultEdgeStyle();
        defaultStyle[mxConstants.STYLE_ROUNDED] = false;
        defaultStyle[mxConstants.STYLE_EDGE] = mxEdgeStyle.OrthConnector;
        defaultStyle[mxConstants.STYLE_STROKEWIDTH] = 1;
    };

    var readXML= function () {
        var req=mxUtils.load('../js/test.xml');
        var root = req.getDocumentElement();
        var dec = new mxCodec(root.ownerDocument);
        dec.decode(root, graph.getModel());
    };

    initVariable($('#graphicContainer')[0]);

    var addButtonEvents= function () {
        $('#viewXML').click(showXML);
    }


});
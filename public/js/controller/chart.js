/**
 * Created by zzl on 2017/8/1.
 */
define(['echarts', 'jquery'], function (echarts, $) {
    function init() {
        var myChart = echarts.init(document.getElementById('container'));

        //获取虚拟的日期数据
        function getVirtualData() {
            var date = +echarts.number.parseDate('2017-01-01');
            var end = +echarts.number.parseDate('2017-12-31');
            var dayTime = 3600 * 24 * 1000;
            var data = [];
            for (var time = date; time <= end; time += dayTime) {
                data.push([
                    echarts.format.formatTime('yyyy-MM-dd', time),
                    Math.floor(Math.random() * 10000)
                ]);
            }
            return data;
        }

        //将pie数据转换到日期
        function getPieSeries(scatterData, chart) {
            return echarts.util.map(scatterData, function (item, index) {
                //重点
                var center = chart.convertToPixel('calendar', item);
                return {
                    id: index + 'pie',
                    type: 'pie',
                    //设置饼图中心的坐标，转换到日历中
                    center: center,
                    radius: 30,
                    data: [
                        {name: '工作', value: Math.round(Math.random() * 24)}
                    ]
                };
            });
        }

        var scatterData = getVirtualData();

        var heatMapData = [];
        for (var i = 0; i < scatterData.length; i++) {
            heatMapData.push([
                scatterData[i][0],
                Math.floor(Math.random() * (2 + 1))
            ]);
        }
        console.log(heatMapData);

        var runState = ['运行错误', '运行正常', '运行故障'];

        var options = {
            tooltip: {
                formatter: function (params) {
                    return runState[params.value[1]];
                }
            },
            visualMap: {
                type: 'piecewise',
                show: false,
                pieces: [
                    {value: 0, color: '#CC0033'},
                    {value: 1, color: '#009966'},
                    {value: 2, color: '#CCCC66'}
                ],
                inRange: {
                    color: ['#e0ffff', '#006edd'],
                    //opacity: 0.3
                },
                controller: {
                    inRange: {
                        opacity: 0.5
                    }
                },
                calculable: true
            },

            calendar: {
                dayLabel: {
                    margin: 20,
                    firstDay: 1,
                    nameMap: ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六']
                },
                monthLabel: {
                    nameMap: 'cn'
                },
                //orient: 'vertical',
                range: '2017',
                cellSize: [20, 20]
            },
            series: [
                {
                    type: 'scatter',
                    coordinateSystem: 'calendar',
                    symbolSize: 1,
                    label: {
                        normal: {
                            show: true,
                            formatter: function (params) {
                                var d = echarts.number.parseDate(params.value[0]);
                                return d.getDate();
                            }
                        },
                        textStyle: {
                            color: '#fff'
                        }
                    },
                    data: heatMapData
                },
                {
                    type: 'heatmap',
                    coordinateSystem: 'calendar',
                    data: heatMapData
                }
            ]
        };

        myChart.setOption(options);

        $('#btn').click(function () {
            var s = $('#fromDate').val();
            var e = $('#endDate').val();
            if (s !== "" && e !== "") {
                myChart.setOption({
                    calendar: {
                        range: [s, e]
                    }
                });
            }
        });
    }

    return {
        'init': init
    }
});
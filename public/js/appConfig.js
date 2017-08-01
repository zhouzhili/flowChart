/**
 * Created by zzl on 2017/7/28.
 */
require.config({
    baseUrl:(function () {
        return location.origin ;
    })(),

    shim:{
        'bootstrap':{
            'deps':['jquery']
        },
        'jquery-confirm':{
            'deps':['jquery']
        },
        'jquery-showLoading':{
            'deps':['jquery']
        },
        'socket.io':{
            exports:'socket.io'
        }
    },
    paths:{
        'jquery':'/lib/jquery/dist/jquery.min',
        'bootstrap':'/lib/bootstrap/dist/js/bootstrap.min',
        'jquery-confirm':'/lib/jquery-confirm/dist/jquery-confirm.min',
        'jquery-showLoading':'lib/jquery-showLoading/jquery.showLoading.min',
        'domReady':'/lib/requirejs/domReady',
        'socket.io':'/lib/socket.io/socket.io',
        'svg':'/lib/svg/svg',
        'echarts':'/lib/echart/echarts'
    },
    packages:[
        {
            name:'js',
            location:'js'
        }
    ]
});

import highcharts from 'highcharts';

highcharts.setOptions({
    global: {
        useUTC: false
    },
    // lang: {
    //     thousandsSep: '',
    //     noData: '暂无数据',
    //     months: ['1月','2月','3月','4月','5月','6月','7月','8月','9月','10月','11月','12月'],
    //     shortMonths: ['1月','2月','3月','4月','5月','6月','7月','8月','9月','10月','11月','12月'],
    //     weekdays: ['周日','周一','周二','周三','周四','周五','周六'],
    //     shortWeekdays: ['日','一','二','三','四','五','六']
    // }
});

let defaultOptions = {
    chart: {
        type: 'column',
        backgroundColor: '#fcfcfc',
        borderColor: '#d8d8d8',
        borderWidth: 1,
    },
    
    tooltip: {
        borderColor: '#bfbfbf',
        shadow: false,
        valueSuffix: '',
        shared: true,
    },
    credits: {
        enabled: true
    },
    plotOptions: {
        column: {
            dataLabels: {
                enabled: true,
                inside: true
            }
        }
    },
    exporting: {
        enabled: false
    },
    legend: {
        enabled: true,
    },
    navigator: {
        margin: 10
    },
    rangeSelector: {
        enabled: false
    },
    title: {
        align: 'left',
        text: ''
    },
}

export default {
    render(container, op) {
        op = _.assign({}, defaultOptions, op);
        highcharts.chart(container, op);
    },
    options: function(op) {
        return _.assign({}, defaultOptions, op);
    }
};
import chartService from '../../services/chart';
import apiService from '../../services/apis';
export default {
    data () {
        return {
            
        }
    },
    components: {
        
    },
    watch: {
        
    },
    created () {
        this.access();
    },
    methods: {
        render(data) {
            chartService.render($('.access-history').get(0), {
                chart: {
                    type: 'line',
                },
                title: {
                    text: '往届就业率数据对比展示'
                },
                xAxis: {
                    categories: data.xAxis
                },
                series: data.yAxis,
                tooltip:  {
                    valueSuffix: '%',
                    valueDecimals: 2
                },
            })
        },
        access() {
            apiService.logHistory().then(res => {
                if(res.success === 0) {
                    this.render(res)
                }
            })
        }
    }
}
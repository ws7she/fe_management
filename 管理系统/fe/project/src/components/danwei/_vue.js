import chartService from '../../services/chart';
import apiService from '../../services/apis';

export default {
    data () {
        return {
            value: 'company',
        }
    },
    created () {
        this.access();
    },
    methods: {
        handleClick(tab, e) {
            console.log(tab, e)
        },
        access() {
            apiService.logData({
                type: this.value
            }).then(res => {
                if(res.success === 0) {
                    this.render(res)
                }
            })
        },
        render(data) {
            chartService.render($('.access-' + this.value).get(0), {
                title: {
                    text: '统计条形图展示'
                },
                xAxis: {
                    categories: data.xAxis
                },
                series: data.yAxis
            })
        }
    },
    watch: {
        value(val) {
            this.access();
        }
    }
}
import apiService from '../../services/apis';
import chartService from '../../services/chart';

export default {
    data () {
        return {
            
        }
    },
    created () {
       this.accessnation(); 
       this.accessbirth();
    },
    methods: {
        accessnation() {
            apiService.logNation().then(res => {
                this.rendernation(res.series)
            }).catch(e =>{

            })
        },
        accessbirth() {
            apiService.logBirth().then(res => {
                this.renderbirth(res)
            }).catch(e =>{
                console.log(e)
            })
        },
        renderbirth(data) {
            chartService.render($('.access-data').get(0), {
                title: {
                    text: '学生生源地占比详情'
                },
                xAxis: {
                    categories: data.xAxis
                },
                series: data.yAxis,
                tooltip:  {
                    // valueSuffix: '%',
                    // valueDecimals: 2
                },
            })
        },
        rendernation(data) {
            chartService.render($('.access-nation').get(0), {
                chart: {
                    type: 'pie',
                },
                title: {
                    text: '学生民族占比展示'
                },
                series: data,
                tooltip:  {
                    valueSuffix: '%',
                    valueDecimals: 2
                },
            })
        }
    }
}
import apiService from '../../services/apis';
import exportCSV from '../../services/exportCSV';
import moment from 'moment';
export default {
    name: 'mainView',
    data () {
        return {
            collegeKey: '',
            majorKey: '',
            yearKey: '',
            tableData: [],
            isAdmin: localStorage.getItem('isAdmin') === 'true',
            loading: false
        }
    },
    components: {
        
    },
    watch: {
        
    },
    created () {
        this.refresh();
    },
    methods: {
        refresh() {
            let id = this.$route.query.id,
            isAdmin = localStorage.getItem('isAdmin') === 'true' ;
            this.loading = true;
            let params = {
                id: id,
                isAdmin: isAdmin,
            }
            if(this.collegeKey) params.college = this.collegeKey
            if(this.majorKey) params.major = this.majorKey
            if(this.yearKey) params.year = moment(this.yearKey).year()
            console.log(params)
            apiService.getInfo(params).then(data => {
                this.tableData = data.arr;
            }).catch(e => {
                console.log(e)
            }).then(() =>{
                this.loading = false;
            })
        },
        go2detail(data) {
            this.$router.push({
                path: '/jiuye/detail',
                query: {
                    id: data.id
                }
            });
        },
        go2create() {
            this.$router.push('/jiuye/create');
        },
        handleSelect(idx) {
            this.$router.push({
                name: idx
            })
        },
        deleteBtn(data) {
            debugger
            apiService.delete({
                id: data.id
            }).then(res => {
                this.refresh()
            }).catch(e => {
                this.$message({
                    type: 'error',
                    message: '删除失败'
                });
            })
        },
        logout() {},
        exportCSV() {
            exportCSV(this.$refs.exportTable.$el, '就业管理表格明细', true, this.isAdmin);
        },
    }
}
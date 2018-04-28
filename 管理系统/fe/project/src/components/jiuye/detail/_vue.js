import apiService from '../../../services/apis';
import moment from 'moment';

export default {
    name: 'detail',
    data () {
        return {
            data: {},
            editStatus: false,
            isAdmin: localStorage.getItem('isAdmin') === 'true' 
        }
    },
    created () {
        let id = this.$route.query.id;
        apiService.getInfo({
            id: id
        }).then(data => {
            delete data.arr[0]._id
            this.data = data.arr[0];
        }).catch(e => {

        })        
    },
    methods: {
        edit() {
            this.editStatus = true;
        },
        save() {
            let me = this, id = this.$route.query.id;
            // console.log(moment().year())
            this.data.graduation = moment(this.data.graduation).year();
            apiService.jiuyeUpdate(this.data).then(data => {
                this.$message({
                    type: 'success',
                    message: '保存成功！'
                });
                me.editStatus= false;
                setTimeout(function() {
                    if(me.isAdmin) {
                        me.$router.push({
                            path: '/jiuye'
                        })
                    } else {
                        me.$router.push({
                            path: '/jiuye',
                            query: {
                                id: id
                            }
                        })
                    }
                    
                }, 2000)
                
            }).catch(e=> {
                this.$message({
                    type: 'error',
                    message: '保存失败！' + e
                });
            })
        }
    }
}
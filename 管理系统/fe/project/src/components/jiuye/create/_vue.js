import apiService from '../../../services/apis';
import moment from 'moment';
export default {
    name: 'create',
    data () {
        return {
            sname:'',
            sex: '男',
            snation: '',
            school: '',
            scollege: '',
            smajor: '',
            sid: '',
            scard: '',
            scompany: '',
            scompanyaddress: '',
            sindustry: '',
            sposition: '',
            companyphone: '',
            companyower: '',
            shixistatus: false,
            graduation: '',
            shixideadline: '',
            birthplace: '',
            isAdmin: localStorage.getItem('isAdmin') === 'true' 
        }

    },

    created () {
        this.sid = this.$route.query.id;  
    },
    methods: {
        save() {
            let base = {
                id: this.sid,
                uname: this.sname,
                sex: this.sex,
                nation: this.snation,
                school: this.school,
                major: this.smajor,
                college: this.scollege,
                card: this.scard,
                graduation: moment(this.graduation).year(),
                birthplace: this.birthplace,
                // status: this.scompany ? true : false
            }, me = this;
            if(this.shixistatus) base.shixideadline = this.shixideadline;
            if(_.every(base, item => {return item})) {
                base.company = this.scompany;
                base.position = this.sposition;
                base.industry = this.sindustry;
                base.companyphone = this.companyphone;
                base.companyower = this.companyower;
                base.shixistatus = this.shixistatus;
                if(!this.isAdmin) {
                    apiService.jiuyeUpdate(base).then(data => {
                        this.$message({
                            type: 'success',
                            message: '保存成功！'
                        });
                        this.$router.push({
                            path: '/jiuye',
                            query: {
                                id: this.sid
                            }
                        })
                    }).catch(e=> {
                        this.$message({
                            type: 'error',
                            message: '保存失败！' + e
                        });
                    })
                } else {
                    apiService.jiuyeCreate(base).then(data => {
                        this.$message({
                            type: 'success',
                            message: '保存成功！'
                        });
                        this.$router.push({
                            path: '/jiuye',
                        })
                    }).catch(e=> {
                        this.$message({
                            type: 'error',
                            message: '保存失败！' + e
                        });
                    })
                }
            } else {
                this.$message({
                    type: 'error',
                    message: '请补全基本信息'
                })
            }
           
        }
    }
}
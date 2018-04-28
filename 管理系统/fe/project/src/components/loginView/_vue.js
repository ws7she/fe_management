import apiService from '../../services/apis';

export default {
    name: 'LoginView',
    data() {
        return {
            password: '',
            username: '',
            loading: false,
            error: false,
            isAdmin: false
        };
    },
    methods: {
        setCookie(c_name, value, expiredays) {
            var exdate = new Date();
            exdate.setDate(exdate.getDate() + expiredays);
            document.cookie =
              c_name +
              "=" +
              escape(value) +
              (expiredays == null ? "" : ";expires=" + exdate.toGMTString());
          },
        submit(e) {
            e.preventDefault();
            let me = this;
            let id = _.trim(this.username);
            let password = _.trim(this.password);
            let isAdmin = this.isAdmin;
            if (!id) {
                this.$message({
                    type: 'error',
                    message: '请输入学号'
                });
                return;
            }
            if (!password) {
                this.$message({
                    type: 'error',
                    message: '请输入密码'
                });
                return;
            }
            apiService.login({
                id,
                password,
                isAdmin
            }).then(data => {
                if(data.success === 0) {
                    this.$message({
                        type: 'success',
                        message: '登录成功！'
                    });
                    localStorage.setItem('isAdmin', me.isAdmin);
                    // if(me.isAdmin) 
                    this.setCookie('uname', id, 1);
                    setTimeout(function() {
                        if(isAdmin) {
                            me.$router.push({
                                path: '/jiuye',
                            });
                        } else {
                            me.$router.push({
                                path: '/jiuye',
                                query:{
                                    id: id
                                }
                            });
                        }
                    }, 1000);
                } else {
                    this.$message({
                        type: 'error',
                        message: data.msg
                    });
                }
            }).catch(e => {
                this.loading = false;
                this.$message({
                    type: 'error',
                    message: '登录失败！' + e
                });
            })
        },
        go2register(){
            this.$router.push('/register')
        }
    },
}
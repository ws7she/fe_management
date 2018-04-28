import apiService from '../../services/apis';

export default{
    name: 'RegisterView',
    data() {
        return {
            username: '',
            password: '',
            repassword: '',
            loading: false,
            error: false
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
            let id = _.trim(this.username);
            let password = _.trim(this.password);
            let repassword = _.trim(this.repassword);     
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
            if (password != repassword) {
                this.$message({
                    type: 'error',
                    message: '两次输入密码不一致，请重试'
                });
                return;
            }
            apiService.register({
                id,
                password,
                isadmin: false
            }).then(data => {
                this.loading = false;
                if(data.success === 0) {
                    this.$message({
                        type: 'success',
                        message: '注册成功！'
                    });
                    localStorage.setItem('isAdmin', false);
                    this.setCookie('uname', id, 1)
                    
                    this.$router.push({
                        path: 'jiuye/create',
                        query: {
                            id: id
                        }
                    })
                } else {
                    this.$message({
                        type: 'error',
                        message: '注册失败！' + data.msg
                    });
                }
            }).catch(e => {
                this.loading = false;
                this.$message({
                    type: 'error',
                    message: '注册失败！' + e
                });
            })
        }
    },
}
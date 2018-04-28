<template lang='pug'>
    .geren
        .geren-row
            span 用户id：{{uinfo.id}}
        .geren-row
            span(v-if='uinfo.name') 用户名：{{uinfo.name}}
        .geren-row
            el-radio(v-model="isChangePsd", :label='true') 修改密码
            el-radio(v-model="isChangePsd", :label='false') 不修改密码
        div(v-if='isChangePsd')
            .geren-row
                span 重置密码：
                input.form-control(v-model="psd" type='password')
            .geren-row
                span 再次确认密码：
                input.form-control(v-model="repsd" type='password')
            .geren-row(style='text-align: center')
                button.btn.btn-primary.btn-sm.btn-block(type='submit' @click='submit')
                    span 确定
</template>
<style lang='sass'>
    .geren
        width: 300px
        margin: 100px auto
        // font-size: 16px
        .geren-row
            padding-bottom: 10px
        input.form-control
            width: 238px
            padding: 5px 10px
            height: 20px
            border: 1px solid #434857
            border-radius: 0
            line-height: 1.42857
            font-size: 12px
        .btn-primary
            width: 100px
            height: 35px
            color: #fff
            background-color: #1ca8dd
            border-color: transparent
            cursor: pointer
            margin: 0 auto

</style>
<script>
import apiService from "../../services/apis";
export default {
  data() {
    return {
      isAdmin: localStorage.getItem("isAdmin") === "true",
      uinfo: {},
      isChangePsd: false,
      psd: "",
      repsd: ""
    };
  },
  methods: {
    getCookie(c_name) {
      let c_start, c_end;
      if (document.cookie.length > 0) {
        c_start = document.cookie.indexOf(c_name + "=");
        if (c_start != -1) {
          c_start = c_start + c_name.length + 1;
          c_end = document.cookie.indexOf(";", c_start);
          if (c_end == -1) c_end = document.cookie.length;
          return unescape(document.cookie.substring(c_start, c_end));
        }
      }
      return "";
    },
    delCookie(name) {
      var exp = new Date();
      exp.setTime(exp.getTime() - 1);
      var cval = this.getCookie(name);
      if (cval != null)
        document.cookie = name + "=" + cval + ";expires=" + exp.toGMTString();
      this.$router.push("/login");
    },
    submit() {
      if (this.psd.length <= 0) {
        this.$message({
          type: "error",
          message: "密码不能为空，请重试"
        });
        return;
      }
      if (this.psd != this.repsd) {
        this.$message({
          type: "error",
          message: "两次输入密码不一致，请重试"
        });
        return;
      } else {
        apiService
          .updatePsd({
            id: this.uinfo.id,
            password: this.psd,
            isAdmin: this.isAdmin
          })
          .then(res => {
            if (res.success === 0) {
              this.$message({
                type: "success",
                message: "修改成功"
              });
            } else {
              this.$message({
                type: "error",
                message: res.message
              });
            }

            setTimeout(this.delCookie("uname"), 2000);
          })
          .catch(e => {
            this.$message({
              type: "error",
              message: "修改失败"
            });
          });
      }
    },
    refresh() {
      let params = {
        id: this.uname,
        isAdmin: this.isAdmin
      };
      apiService.queryme(params).then(data => {
        if (data.success === 0) {
          this.uinfo = data.data;
        } else {
          this.$message({
            type: "error",
            message: "用户信息查询失败"
          });
        }
      });
    }
  },
  created() {
    this.refresh();
  },
  props: {
    uname: {
      type: String,
      default: ""
    }
  },
  computed: {}
};
</script>
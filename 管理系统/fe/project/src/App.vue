<template lang='pug'>
  div(id='app')
    .main-view-container
      .main-view-sider-nav
          h1
              i.fa.fa-area-chart.mr5 
              |就业管理
          el-menu(:default-active='$route.path', mode='vertical', '@select'='handleSelect', theme='dark')
              el-menu-item(index='/jiuye') 就业信息管理
              el-menu-item(index='/danwei' v-if='isAdmin') 单位数据统计
              el-menu-item(index='/shengyuan' v-if='isAdmin') 生源数据统计
              el-menu-item(index='/lishi' v-if='isAdmin') 历史数据统计
              el-menu-item(index='/geren') 个人信息管理
          .username-box
              p {{username}}
              p
                  a.logout-btn(href='javascript:;', '@click'='logout()') 退出
      .main-view-wraps
        router-view(:uname='username')
</template>

<script>
export default {
  name: "App",
  data() {
    return {
      username: "",
      isAdmin: false
    };
  },
  methods: {
    handleSelect(idx) {
      if (!this.isAdmin) {
        this.$router.push({
          path: idx,
          query: {
            id: this.$route.query.id
          }
        });
      } else {
        this.$router.push({
          path: idx
        });
      }
    },
    logout() {
      this.delCookie("uname");
    },
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
    checkCookie() {
      let uname = this.getCookie("uname");
      this.username = uname;
      console.log(uname, 11223344);
      if (uname != null && uname != "") {
        if (this.$route.query.id) {
          if (uname == this.$route.query.id && !this.isAdmin) {
          } else {
            this.$router.push("/login");
          }
        } else {
          if (!this.isAdmin) this.$router.push("/login");
        }
      } else {
        this.$router.push("/login");
      }
    },
    delCookie(name) {
      var exp = new Date();
      exp.setTime(exp.getTime() - 1);
      var cval = this.getCookie(name);
      if (cval != null)
        document.cookie = name + "=" + cval + ";expires=" + exp.toGMTString();
      this.$router.push("/login");
    }
  },

  created() {
    this.isAdmin = localStorage.getItem("isAdmin") === "true";
    console.log(this.$route.path)
    this.checkCookie();
  },
  watch: {
    '$route.path'() {
      this.isAdmin = localStorage.getItem("isAdmin") === "true";
      let uname = this.getCookie("uname");
      this.username = uname;
    },
  }
};
</script>

<style lang='sass'>
  .main-view-container
    margin: 0
    .main-view-sider-nav
        background: #324057
        position: fixed
        width: 150px
        top: 0
        bottom: 0
        h1
            color: #c0ccda
            padding: 10px
            font-size: 16px
    .main-view-wraps
       padding-left: 150px
    .el-menu-item,
    .el-submenu__title
        font-size: 12px
        height: 40px
        line-height: 40px
    .main-view-wrap
        margin-left: 150px
    .username-box
        position: absolute
        bottom: 10px
        text-align: center
        color: #c0ccda
        width: 100%
        word-break: break-all
        word-wrap: break-word
        .logout-btn,
        .logout-btn:hover,
        .logout-btn
            color: #c0ccda
        p
            margin-bottom: 0

</style>

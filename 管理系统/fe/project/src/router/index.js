import Vue from 'vue'
import Router from 'vue-router'
// import mainView from '@/components/mainView/index.vue'
import LoginView from '@/components/loginView/index.vue'
import RegisterView from '@/components/registerView/index.vue'
import jiuye from '@/components/jiuye/index.vue'
import danwei from '@/components/danwei/index.vue'
import shengyuan from '@/components/shengyuan/index.vue'
import jiutedetail from '@/components/jiuye/detail/index.vue'
import jiutecreate from '@/components/jiuye/create/index.vue'
import geren from '@/components/geren/index.vue'
import lishi from '@/components/lishi/index.vue'

Vue.use(Router)

export default new Router({
  routes: [{
      path: '/login',
      name: 'loginView',
      component: LoginView
    },
    {
      path: '/register',
      name: 'registerView',
      component: RegisterView
    },
    {
      path: '/jiuye',
      name: 'jiuye',
      component: jiuye
    },
    {
      path: '/danwei',
      name: 'danwei',
      component: danwei
    },
    {
      path: '/shengyuan',
      name: 'shengyuan',
      component: shengyuan
    },
    {
      path: '/jiuye/detail',
      name: 'jiutedetail',
      component: jiutedetail
    },
    {
      path: '/jiuye/create',
      name: 'jiutecreate',
      component: jiutecreate
    },
    {
      path: '/geren',
      name: 'geren',
      component: geren
    },
    {
      path: '/lishi',
      name: 'lishi',
      component: lishi
    },
  ]
})

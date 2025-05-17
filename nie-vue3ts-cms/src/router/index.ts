import { createRouter, createWebHashHistory } from 'vue-router'
import { LOGIN_TOKEN } from '@/types/constants'
import { localCache } from '@/utils/cache'
import { firstMenu } from '@/utils/map-menus'
const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    {
      path: '/',
      redirect: '/main'
    },
    {
      name: 'main', //必须添加，不然动态添加路由找不到main
      path: '/main',
      component: () => import('@/views/main/main.vue')
    },
    {
      path: '/login',
      component: () => import('@/views/login/login.vue')
    },
    {
      path: '/:pathMatch(.*)',
      component: () => import('@/views/not-found/NotFound.vue')
    }
  ]
})
// 导航守卫
// 参数: to(跳转到的位置)/from(从哪里跳转过来)
// 返回值: 返回值决定导航的路径(不返回或者返回undefined, 默认跳转)
// 举个栗子: / => /main
// to: /main from: / 返回值: /abc
router.beforeEach((to) => {
  // 只有登录成功(token), 才能真正进入到main页面
  const token = localCache.getCache(LOGIN_TOKEN)
  if (to.path.startsWith('/main') && !token) {
    return '/login'
  }

  // 如果是进入到main，如果firstMenu 存在
  // 返回firstMenu的url属性作为重定向目标，自动跳转到第一个子菜单页面
  if (to.path === '/main') {
    return firstMenu?.url
  }
})
export default router

import router from '@/router'
import { accountLoginRequest, getRoleMenus, getUserById } from '@/service/login/login'
import { localCache } from '@/utils/cache'
import { defineStore } from 'pinia'
import { LOGIN_TOKEN } from '@/types/constants'
import useMainStore from '@/store/main/main'
//动态添加路由
import { mapMenusToPermissions, mapMenusToRoutes } from '@/utils/map-menus'
interface ILoginState {
  token: string
  userInfo: any
  userMenus: any
  permissions: string[]
}

const useLoginStore = defineStore('login', {
  state: (): ILoginState => ({
    token: localStorage.getItem('token') ?? '',
    //token: '',
    //id: '',
    //name: ''
    //存放用户登录的详细信息和菜单信息
    //userInfo: {},
    //userMenus: []
    //进行本地缓存后，改为这样
    userInfo: localCache.getCache('userInfo') ?? {},
    userMenus: localCache.getCache('userMenus') ?? [],
    permissions: []
  }),
  actions: {
    //async accountLoginAction(account: any) {
    //原来是any现在做优化
    async accountLoginAction(account: { name: string; password: string }) {
      //1.拿到登录信息发送请求
      // 加上await不需要再写.then了
      const loginRes = await accountLoginRequest(account)
      console.log('登录请求放在登录仓库，loginRes:', loginRes)
      //2.登录成功，把返回的结果保存到仓库
      this.token = loginRes.data.data.token
      //this.id = loginRes.data.data.id
      // this.name = loginRes.data.data.name
      //console.log('token', this.token, this.id, this.name)
      const id = loginRes.data.id
      //3. 本地永久保存用户token
      localCache.setCache(LOGIN_TOKEN, this.token)

      // 4.获取用户详细信息，通过getUserById(id)方法
      const userInfoResult = await getUserById(id)
      const userInfo = userInfoResult.data
      this.userInfo = userInfo
      console.log('userInfo', userInfo)

      //console.log('userInfo.role', userInfo.data.role.id)
      // 5.根据role的id获取菜单
      const roleId = userInfo.data.role.id
      const userMenusResult = await getRoleMenus(roleId)
      //到底用几个.data的数据，这里出问题了，挨个打印检查
      //而且不该const userMenu接收data后的数据，和仓库定义数据重名我后面会乱
      // console.log('userMenusResult', userMenusResult)
      //console.log('userMenus（ userMenusResult.data）', userMenus)
      // console.log('userMenus', userMenus)
      //console.log('userMenus.data（ userMenusResult.data.data）', userMenus.data)
      //console.log('this.userMenus', this.userMenus)
      const userMenusData = userMenusResult.data.data
      console.log('userMenusData', userMenusData) //这个是期望保存的数据
      this.userMenus = userMenusData
      //6. 保存获取的结果到本地缓存
      //放到store中的数据是一种内存缓存，刷新会消失，
      //要一直存在要进行本地缓存
      //这里的拼写错了啊啊啊啊，是userInfo，不是userinfo
      localCache.setCache('userInfo', this.userInfo)
      localCache.setCache('userMenus', this.userMenus)

      //9.获取用户按钮权限
      const permissions = mapMenusToPermissions(userMenusData)
      this.permissions = permissions

      //7. 动态添加路由
      //这里开始卡住，因为传的少了.data,重新修改让userMenu存的就是.data后的数据
      //const routes = mapMenusToRoutes(userMenus.data)
      const routes = mapMenusToRoutes(this.userMenus)
      routes.forEach((route) => router.addRoute('main', route))

      //8.请求所有roles/departments数据
      const mainStore = useMainStore()
      mainStore.fetchEntireDataAction()
      // 跳转到首页
      router.push('/main')
    },

    loadLocalCacheAction() {
      // 用户进行刷新时，默认加载数据
      const token = localCache.getCache(LOGIN_TOKEN)
      const userInfo = localCache.getCache('userInfo')
      const userMenus = localCache.getCache('userMenus')
      //如果这三个同时有值，说明用户现在是登录的
      if (token && userInfo && userMenus) {
        this.token = token
        this.userInfo = userInfo
        this.userMenus = userMenus
        //刷新后再请求所有roles/departments数据
        const mainStore = useMainStore()
        mainStore.fetchEntireDataAction()
        //后增，用户刷新时也能获取到按钮权限
        const permissions = mapMenusToPermissions(userMenus)
        this.permissions = permissions

        //此时再动态添加路由
        const routes = mapMenusToRoutes(userMenus)
        routes.forEach((route) => router.addRoute('main', route))
      }
    }
  }
})

export default useLoginStore

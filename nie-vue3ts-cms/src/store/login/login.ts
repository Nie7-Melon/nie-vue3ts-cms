import router from '@/router'
import { accountLoginRequest, getRoleMenus, getUserById } from '@/service/login/login'
import { localCache } from '@/utils/cache'
import { defineStore } from 'pinia'
import { LOGIN_TOKEN } from '@/types/constants'

interface ILoginState {
  token: string
  userInfo: any
  userMenus: any
  // id: string
  //name: string
}

const useLoginStore = defineStore('login', {
  state: (): ILoginState => ({
    token: localStorage.getItem('token') ?? '',
    //token: '',
    //id: '',
    //name: ''
    //存放用户登录的详细信息和菜单信息
    userInfo: {},
    userMenus: []
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
      const userMenus = userMenusResult.data
      this.userMenus = userMenus
      console.log('userMenus', userMenus)
      //保存获取的结果到缓存
      localCache.setCache('useInfo', this.userInfo)
      localCache.setCache('userMenus', userMenus)
      // 跳转到首页
      router.push('/main')
    },

    loadLocalDataAction() {
      //this.token = localCache.getCache('token')
      //this.userInfo = localCache.getCache('userInfo')
      // this.userMenus = localCache.getCache('userMenus')
      console.log('------')
    }
  }
})

export default useLoginStore

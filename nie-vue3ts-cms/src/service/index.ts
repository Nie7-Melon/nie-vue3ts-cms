import { LOGIN_TOKEN } from '@/types/constants'
import { localCache } from '@/utils/cache'
import { BASE_URL, TIME_OUT } from './config'
import HYRequest from './request'
// 实际使用流程：
// 1. 用户登录成功后，后端返回token
// 2. token被存储在本地缓存中（使用 localCache.setCache(LOGIN_TOKEN, token) ）
// 3. 之后的每次请求，这个拦截器都会自动运行
// 4. 拦截器从缓存中获取token，并添加到请求头中
// 5. 服务器接收到带有token的请求，验证用户身份
const hyRequest = new HYRequest({
  baseURL: BASE_URL,
  //如果请求超过这个时间还没有响应，就会自动失败
  timeout: TIME_OUT,
  //interceptors拦截器配置
  interceptors: {
    //requestSuccessFn是一个请求成功的拦截器函数，
    //它的作用是在每个请求发送之前自动添加认证头token
    requestSuccessFn: (config) => {
      // 每一个请求都自动携带token
      const token = localCache.getCache(LOGIN_TOKEN)
      //如果请求头存在且token也存在，就将token添加到请求头中
      if (config.headers && token) {
        // 类型缩小，确保每个里面都有值
        //使用 Bearer 认证方式，这是一种常见的JSON Web Token认证方式
        config.headers.Authorization = 'Bearer ' + token
      }
      return config
    }
  }
})

export default hyRequest

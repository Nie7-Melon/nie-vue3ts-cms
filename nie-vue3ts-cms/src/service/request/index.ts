import axios from 'axios'
import type { AxiosInstance } from 'axios'
import type { HYRequestConfig } from './type'

// 拦截器: 蒙版Loading/token/修改配置

/**
 * 两个难点:
 *  1.拦截器进行精细控制
 *    > 全局拦截器
 *    > 实例拦截器
 *    > 单次请求拦截器
 *
 *  2.响应结果的类型处理(泛型)
 */

class HYRequest {
  instance: AxiosInstance

  // request实例 => axios的实例
  constructor(config: HYRequestConfig) {
    this.instance = axios.create(config)

    // 先添加实例拦截器（后添加的拦截器会先执行）
    // 针对特定的hyRequest实例添加拦截器
    //下面第二行一直报错，在type.ts修改进行下面修改，不再报错
    //requestSuccessFn?: (config: AxiosRequestConfig) => AxiosRequestConfig
    //requestSuccessFn?: (err: any) => any
    this.instance.interceptors.request.use(
      config.interceptors?.requestSuccessFn,
      config.interceptors?.requestFailureFn
    )
    this.instance.interceptors.response.use(
      config.interceptors?.responseSuccessFn,
      config.interceptors?.responseFailureFn
    )
    // 后添加全局拦截器
    // 每个instance实例都添加拦截器
    this.instance.interceptors.request.use(
      (config) => {
        // loading/token
        // 全局请求成功拦截逻辑
        console.log('全局请求拦截器')
        return config
      },
      (err) => {
        //return err
        // 必须返回拒绝的Promise链
        return Promise.reject(err) // 修改点：错误冒泡处理
      }
    )
    this.instance.interceptors.response.use(
      (res) => {
        //return res.data
        // 全局响应成功拦截逻辑
        console.log('全局响应拦截器')
        return res // 修改点：保留完整响应结构
      },
      (err) => {
        //return err
        return Promise.reject(err) // 修改点：错误冒泡处理
      }
    )
  }

  // 封装网络请求的方法
  // T => IHomeData
  request<T = any>(config: HYRequestConfig<T>) {
    // 单次请求的成功拦截处理
    if (config.interceptors?.requestSuccessFn) {
      config = config.interceptors.requestSuccessFn(config)
    }

    // 返回Promise
    return new Promise<T>((resolve, reject) => {
      this.instance
        .request<any, T>(config)
        .then((res) => {
          // 单词响应的成功拦截处理
          if (config.interceptors?.responseSuccessFn) {
            res = config.interceptors.responseSuccessFn(res)
          }
          resolve(res)
        })
        .catch((err) => {
          //reject(err)
          // 单次请求的错误拦截
          if (config.interceptors?.responseFailureFn) {
            err = config.interceptors.responseFailureFn(err)
          }
          reject(err)
        })
    })
  }

  get<T = any>(config: HYRequestConfig<T>) {
    return this.request({ ...config, method: 'GET' })
  }

  //增强POST方法
  post<T = any>(config: HYRequestConfig<T>) {
    //return this.request({ ...config, method: 'POST' })
    return this.request<T>({
      ...config,
      method: 'POST',
      // 自动处理JSON序列化
      data: config.data instanceof Object ? JSON.stringify(config.data) : config.data,
      headers: {
        'Content-Type': 'application/json',
        //'Content-Type': 'text/plain',
        ...config.headers
      }
    })
  }
  delete<T = any>(config: HYRequestConfig<T>) {
    return this.request({ ...config, method: 'DELETE' })
  }
  patch<T = any>(config: HYRequestConfig<T>) {
    return this.request({ ...config, method: 'PATCH' })
  }
}

export default HYRequest

import hyRequest from '..'
import type { Account } from './types'
//封装关于登录的网络请求
//用enum这样更规范
enum LoginAPI {
  AccountLogin = '/login',
  UserInfo = '/users/',
  UserMenus = '/role/'
}
export function accountLoginRequest(account: Account) {
  const requestBody = JSON.stringify(account)
  console.log('实际发送的请求体:', requestBody) // 添加日志
  return hyRequest.post({
    url: LoginAPI.AccountLogin,
    data: account
    //解决啦这个问题，和下面的无关
    //data: JSON.stringify(account), //手动序列化，还是不行
    //transformResponse: [(res) => res], // 禁止转换响应
    //一直报错400加headers试试，下面的加了没效果
    // headers: {
    //'Content-Type': 'application/json' // 明确指定JSON格式
    // Accept: 'application/json' // 确保服务端返回JSON
    //}
  })
}

export function getUserById(id: number) {
  return hyRequest.get({
    //url: '/users/' + id
    url: LoginAPI.UserInfo + id
  })
}

export function getRoleMenus(id: number) {
  return hyRequest.get({
    url: LoginAPI.UserMenus + id + '/menu'
    //url: `/role/${id}/menu`
  })
}

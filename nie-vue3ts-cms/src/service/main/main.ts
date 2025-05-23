import hyRequest from '..'

//获取所有用户角色
export function getEntireRoles() {
  return hyRequest.post({
    url: '/role/list'
  })
}
//获取所有部门信息
export function getEntireDepartments() {
  return hyRequest.post({
    url: '/department/list'
  })
}
export function getEntireMenus() {
  return hyRequest.post({
    url: '/menu/list'
  })
}

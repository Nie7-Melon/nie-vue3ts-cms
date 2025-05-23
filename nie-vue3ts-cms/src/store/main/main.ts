import { getEntireDepartments, getEntireRoles, getEntireMenus } from '@/service/main/main'
import { defineStore } from 'pinia'
//获取用户角色和部门类别应该再用户登录后就发送请求获取信息
//记得在store/login中添加调用请求的代码
interface IMainState {
  entireRoles: any[]
  entireDepartments: any[]
  entireMenus: any[]
}

const useMainStore = defineStore('main', {
  state: (): IMainState => ({
    entireRoles: [],
    entireDepartments: [],
    entireMenus: []
  }),
  actions: {
    async fetchEntireDataAction() {
      const rolesResult = await getEntireRoles()
      const departmentsResult = await getEntireDepartments()
      const menuResult = await getEntireMenus()
      console.log('rolesResult', rolesResult)
      console.log('departmentsResult', departmentsResult)
      // 保存数据
      this.entireRoles = rolesResult.data.data.list
      this.entireDepartments = departmentsResult.data.data.list
      this.entireMenus = menuResult.data.list
    }
  }
})

export default useMainStore

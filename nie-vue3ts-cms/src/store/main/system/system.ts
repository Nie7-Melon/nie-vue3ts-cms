import {
  postUsersListData,
  deleteUserById,
  newUserData,
  editUserData,
  // 上面用户，下面页面
  newPageData,
  postPageListData,
  editPageData,
  deletePageById
} from '@/service/main/system/system'
import { defineStore } from 'pinia'
import type { ISystemState } from './type' //类型规范
import useMainStore from '../main'

const useSystemStore = defineStore('system', {
  state: (): ISystemState => ({
    usersList: [],
    usersTotalCount: 0,
    //分页查询添加
    pageList: [],
    pageTotalCount: 0
  }),
  actions: {
    //开始postUsersListAction()没形参，直接获取了所有数据展示所有数据
    //组件中，queryInfo = { ...pageInfo, ...formData }
    //现在放形参，表示要获取的数据的页数
    //获取用户数据请求
    async postUsersListAction(queryInfo: any) {
      //const usersListResult = await postUsersListData()
      //console.log(usersListResult)
      // console.log('usersListResult.data', usersListResult.data)
      // console.log(usersListResult.data.data)
      // console.log(usersListResult.data.totalCount) //undefined
      //console.log(usersListResult.data.data.list)
      const usersListResult = await postUsersListData(queryInfo)
      const { totalCount, list } = usersListResult.data.data
      this.usersTotalCount = totalCount
      this.usersList = list
      console.log(this.usersList)
    },
    //删除用户数据请求
    async deleteUserByIdAction(id: number) {
      //调用service删除接口，记得先导入
      const deleteResult = await deleteUserById(id)
      console.log(deleteResult)

      // 重新请求新的数据
      this.postUsersListAction({ offset: 0, size: 10 })
    },
    //新增用户数据请求
    async newUserDataAction(userInfo: any) {
      //发送建立新用户请求
      const newResult = await newUserData(userInfo)
      console.log(newResult)

      // 重新获取数据
      this.postUsersListAction({ offset: 0, size: 10 })
    },
    //编辑用户数据请求
    async editUserDataAction(id: number, userInfo: any) {
      // 1.更新用户的数据
      const editResult = await editUserData(id, userInfo)
      console.log(editResult)

      // 2.重新请求新的数据
      this.postUsersListAction({ offset: 0, size: 10 })
    },
    //下面是关于页面的
    /** 针对页面的数据: 增删改查 */
    async postPageListAction(pageName: string, queryInfo: any) {
      const pageListResult = await postPageListData(pageName, queryInfo)
      const { totalCount, list } = pageListResult.data.data

      this.pageList = list
      this.pageTotalCount = totalCount
    },
    async deletePageByIdAction(pageName: string, id: number) {
      const deleteResult = await deletePageById(pageName, id)
      console.log('deleteResult', deleteResult)
      this.postPageListAction(pageName, { offset: 0, size: 10 })
    },
    async newPageDataAction(pageName: string, pageInfo: any) {
      const newResult = await newPageData(pageName, pageInfo)
      console.log('newResult', newResult)
      this.postPageListAction(pageName, { offset: 0, size: 10 })
      //重新获取完整的数据
      const mainStore = useMainStore()
      mainStore.fetchEntireDataAction()
    },
    async editPageDataAction(pageName: string, id: number, pageInfo: any) {
      const editResult = await editPageData(pageName, id, pageInfo)
      console.log('editResult', editResult)
      this.postPageListAction(pageName, { offset: 0, size: 10 })
      //重新获取完整的数据
      const mainStore = useMainStore()
      mainStore.fetchEntireDataAction()
    }
  }
})

export default useSystemStore

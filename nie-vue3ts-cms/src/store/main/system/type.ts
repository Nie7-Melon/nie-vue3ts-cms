export interface IUser {
  id: number
  name: string
  realname: string
  cellphone: number
  enable: number
  departmentId: number
  roleId: number
  createAt: string
  updateAt: string
}

export interface ISystemState {
  usersList: IUser[]
  usersTotalCount: number
  // 分页查询添加
  pageList: any[]
  pageTotalCount: number
}

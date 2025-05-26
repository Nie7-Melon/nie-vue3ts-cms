import useLoginStore from '@/store/login/login'

function usePermissions(permissionID: string) {
  const loginStore = useLoginStore()
  const { permissions } = loginStore
  //注意这里哦，想要发挥的一定是一个布尔类型
  //第一种方法
  //return Boolean(permissions.find((item) => item.includes(permissionID)))
  // 第二种方法：
  //两个感叹号，第一个感叹号取反，第二个再取反，转回对应的boolean类型
  return !!permissions.find((item) => item.includes(permissionID))
}
export default usePermissions

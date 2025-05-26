import type { RouteRecordRaw } from 'vue-router'

function loadLocalRoutes() {
  // 1.动态获取所有的路由对象, 放到数组中
  // * 路由对象都在独立的文件中
  // * 从文件中将所有路由对象先读取数组中
  const localRoutes: RouteRecordRaw[] = []

  // 1.1.读取router/main所有的ts文件
  // 使用 Vite 的 import.meta.glob 动态导入路由文件
  const files: Record<string, any> = import.meta.glob('../router/main/**/*.ts', {
    eager: true
  })
  // 1.2.将将所有路由配置添加到数组localRoutes中
  for (const key in files) {
    const module = files[key]
    localRoutes.push(module.default)
  }

  return localRoutes
}
// firstMenu记录第一个被匹配到的菜单项
// 用于实现进入 /main 路径时的自动重定向
export let firstMenu: any = null
//userMenus是用户的菜单列表数组
export function mapMenusToRoutes(userMenus: any[]) {
  // 1.加载本地路由
  const localRoutes = loadLocalRoutes()

  // 2.根据菜单去匹配正确的路由
  const routes: RouteRecordRaw[] = []
  for (const menu of userMenus) {
    for (const submenu of menu.children) {
      //用户菜单中的url和本地路由的path进行匹配，如果本地路由地址和用户菜单地址一样
      //那么就把这个菜单对应的路由添加到数组routes中
      //目标：完善首页头部面包屑
      const route = localRoutes.find((item) => item.path === submenu.url)
      //如果用户菜单中的 URL 和本地路由的 path 相匹配
      if (route) {
        // 1.给route的顶层菜单增加重定向功能(但是只需要添加一次即可)
        //检查是否已经为当前一级菜单设置了重定向，如果没有设置过，就添加一个重定向配置
        //一级菜单重定向
        if (!routes.find((item) => item.path === menu.url)) {
          routes.push({ path: menu.url, redirect: route.path })
        }
        // 添加二级菜单路由
        //直接将匹配到的路由配置添加到路由数组中
        routes.push(route)
      }
      // 记录第一个被匹配到的菜单，这个 firstMenu 会用于进入 /main 路径时的自动重定向
      //如果 firstMenu 还没有值，并且找到了匹配的路由，就把当前的子菜单记录为第一个菜单
      if (!firstMenu && route) firstMenu = submenu
    }
  }
  return routes
}

/**
 * 根据路径去匹配需要显示的菜单
 * @param path 需要匹配的路径
 * @param userMenus 所有的菜单
 */
export function mapPathToMenu(path: string, userMenus: any[]) {
  for (const menu of userMenus) {
    for (const submenu of menu.children) {
      //子菜单的路径等于要匹配的路径，返回这个子菜单给main-menu.vue
      if (submenu.url === path) {
        return submenu
      }
    }
  }
  //return null //AI检查添加，明确返回null，而不是undefined
}

interface IBreadcrumbs {
  name: string
  path: string
}
export function mapPathToBreadcrumbs(path: string, userMenus: any[]) {
  // 1.定义面包屑
  const breadcrumbs: IBreadcrumbs[] = []

  // 2.遍历获取面包屑层级
  for (const menu of userMenus) {
    for (const submenu of menu.children) {
      if (submenu.url === path) {
        // 面包屑里先加父级菜单
        breadcrumbs.push({ name: menu.name, path: menu.url })
        // 再加子菜单
        breadcrumbs.push({ name: submenu.name, path: submenu.url })
      }
    }
  }
  return breadcrumbs
}
/**
 * 菜单映射到id的列表
 * @param menuList
 */
export function mapMenuListToIds(menuList: any[]) {
  //要拿到所有的id组合的数组
  const ids: number[] = []
  //递归获取id
  function recurseGetId(menus: any[]) {
    for (const item of menus) {
      if (item.children) {
        //如果遍历的有子菜单，那么再遍历一次
        recurseGetId(item.children)
      } else {
        //如果遍历的没有子菜单，进入了最底部的id，把最底部的id取出来
        //目标是找到最底层的菜单对应的id，不要父菜单的id，
        //因为选中父菜单的id会自动把它的子菜单全部选中
        ids.push(item.id)
      }
    }
  }
  recurseGetId(menuList)
  return ids
}

/**
 * 从菜单里映射出按钮的权限
 * @param menuList 菜单的列表
 * @returns 按钮权限的数组(字符串数组)
 */
export function mapMenusToPermissions(menuList: any[]) {
  const permissions: string[] = []
  //用递归，遍历传进来的menus
  //在storage保存的json数据中，有关按钮权限的数据type=3
  //所以，在递归函数中，判断type=3，就push到permissions中
  //如果不是第三级，那么可能是第一级可能第二级，拿出来继续做递归
  //有的只有第二层，没有第三层，再找children为null
  //此时const item of null会报错，所以如果没有chidren用空数组代替
  //const item of [] 什么都不会做，相当于不遍历直接结束循环，不会报错
  function recurseGetPermission(menus: any[]) {
    for (const item of menus) {
      if (item.type === 3) {
        permissions.push(item.permission)
      } else {
        recurseGetPermission(item.children ?? [])
      }
    }
  }
  recurseGetPermission(menuList)

  return permissions
}

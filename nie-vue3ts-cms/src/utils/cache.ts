//1. 定义 CacheType 枚举：区分两种缓存类型（local/session）
//2. 创建 HYCache 类：封装通用的缓存操作方法（set/get/delete/clear）
//3. 根据传入的 CacheType 决定使用 localStorage 还是 sessionStorage
//4. 提供 setCache / getCache / deleteCache / clearCache 方法
//5. 创建两个实例：localCache 和 sessionCache
//6. 导出这两个实例，供其他模块使用

enum CacheType {
  local = 'local',
  session = 'session'
}
//localStorage：数据永久保存，除非手动清除。
//sessionStorage：数据只在当前会话有效，关闭浏览器后清除
// HYCache它封装了对浏览器本地存储的操作
class HYCache {
  storage: Storage

  //构造函数 constructor 接收一个参数 type（也就是上面定义的 CacheType）
  //根据这个参数决定使用哪种存储方式
  constructor(type: CacheType) {
    this.storage = type === CacheType.local ? localStorage : sessionStorage
  }

  setCache(key: string, value: any) {
    this.storage.setItem(key, JSON.stringify(value))
  }

  getCache(key: string) {
    const value = this.storage.getItem(key)
    if (value) {
      return JSON.parse(value)
    }
  }

  deleteCache(key: string) {
    this.storage.removeItem(key)
  }

  clearCache() {
    this.storage.clear()
  }
}
//创建两个实例并导出
const localCache = new HYCache(CacheType.local)
const sessionCache = new HYCache(CacheType.session)

export { localCache, sessionCache }

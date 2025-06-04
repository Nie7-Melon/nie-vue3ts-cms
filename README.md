### 登录模块
**技术栈**：Vue3 + TypeScript + Pinia + Element Plus + Axios  
#### 核心实现  
1. **Element Plus组件化登录架构**  
   - 采用组件化思想拆解登录页为`登录面板容器`+`账号登录`+`手机登录`三大模块
   - 采用`el-tabs`实现账号/手机登录模式切换，通过`v-model="activeName"`动态控制激活面板
2. **账号密码表单校验**  
   - 基于`el-form`+`el-input`组件构建表单体系，配置可扩展的`rules`验证规则集
3. **登录按钮--父子组件通信**  
   - 通过`defineExpose`暴露子组件方法，实现父组件触发登录验证，解决父子组件通信问题：  
     ```ts
      // 子组件暴露方法
     defineExpose({ validateForm: () => {...} })
     // 父组件触发验证
     accountRef.value?.validateForm()
     ```
4. **类型抽取与token常量安全**  
   - 抽离`IAccount`对象类型，便于复用，约束账号密码结构
   - 用常量管理关键字段（如`LOGIN_TOKEN`），防止拼写错误，降低维护成本
5. **Token保存与Cache封装**
   - 设计`localStorage + Pinia`双缓存持久化Token 
   - 封装通用缓存工具类`cache.ts`，实现`JSON.stringify()``	JSON.parse()`自动处理对象数据，提升代码复用性与健壮性
### 权限管理模块
#### 核心实现：
1. **通过 Axios 请求拦截器自动携带 token**
   - 避免手动添加 token 的冗余操作，提升开发效率
2. **导航守卫设计**
   - 校验`/main`开头的路径，未登录用户强制跳转至登录页，防止越权访问\
3. **用户-角色-菜单映射机制**
   - 登录成功后，先根据用户ID获取用户信息，再通过角色ID请求菜单数据
   - 对用户的userInfo和userMenu数据进行本地缓存和store缓存
4. **动态路由(基于角色菜单)**
   - 通过`mapMenusToRoutes`工具将菜单路径转换为路由对象
   - 使用`addRoute`动态将子路由添加到main路由下，实现不同角色加载不同菜单与路由
### 首页模块
#### 核心实现：
1. **组件化首页布局设计**
   - 整体布局ElContainer； 侧边栏菜单Menu组件；头部Header组件
2. **组件化菜单交互机制**
   - 通过Header子组件的图标的切换，实现动态控制菜单组件的折叠与展开
   - 父子组件通信：Header组件通过`defineEmits`触发折叠事件，父组件监听事件并更新折叠状态`isFold`
   - 父组件根据`isFold`状态控制菜单组件的宽度
   - 父子组件通信：父组件通过`props`将`isFold`传递给Menu子组件，控制`el-menu`的`collapse`属性实现折叠与展开
3. **菜单与路由动态绑定**
   - 实现菜单点击与页面跳转的无缝衔接,通过router.push(submenu.url)跳转

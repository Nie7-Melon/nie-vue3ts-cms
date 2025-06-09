[详细笔记请见我的文章](https://nie7-melon.github.io/2025/04/15/23-nievuets/)
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
### 项目架构优化：组件复用与网络请求封装
#### 核心实现：
1. **网络请求三层复用架构**
   - 三层架构：页面 → Store → Service → 后端API
   - 页面层：通过pageName参数传递业务标识（如users/departments），触发增删查改操作
   - Store 层：统一管理请求逻辑，携带pageName调用 Service
   - Service 层：基于pageName动态拼接 URL，实现接口通用化
   - 通过 config.ts 传递 pageName，实现不同业务模块的请求复用
2. **高阶组件复用方案**
   - 消除重复代码：将搜索表单、表格内容、操作按钮等通用组件抽离为可配置组件
   - Search 组件：动态生成搜索表单（支持 Input / 日期选择等组件）
   - Content 组件：动态渲染表格列（支持自定义插槽、操作列）
   - Modal 组件：通过配置文件定义表单字段及联动逻辑
   - 动态配置驱动：通过search.config.ts和content.config.ts定义不同模块页面的展示规则
### 数据可视化模块
#### 核心实现：
1. **动态数据展示**
   - 轻量级库 CountUp.js 实现数字滚动效果（如商品销量从起始值平滑过渡至目标值）
   - 支持自定义前缀（如人民币符号¥），通过配置项动态切换展示格式
   - 使用 Element Plus Tooltip 组件，鼠标悬停时展示数据说明
2. **ECharts图表三层封装**
   - 第一层封装：基础组件封装，统一图表初始化与更新逻辑
   - 第二层封装：不同类型的echarts图标封装不同的子组件（如pie-echart，rose-echart）
   - 第三层封装：抽离数据，把数据部分单独封装，传入第二层封装的options里（数据从service里面拿到，然后放到store里，再传到页面，页面再传递给它调用的组件里）

### 登录模块
**技术栈**：Vue3 + TypeScript + Pinia + Element Plus + Axios  
#### 核心实现  
1. **Element Plus组件化登录架构**  
   - 采用组件化思想拆解登录页为`登录面板容器`+`账号登录`+`手机登录`三大模块
   - 采用`el-tabs`实现账号/手机登录模式切换，通过`v-model="activeName"`动态控制激活面板
2. **账号密码表单校验**  
   - 基于`el-form`+`el-input`组件构建表单体系，配置可扩展的`rules`验证规则集
3. **组件通信机制**  
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
#### 登录模块我最满意的三点：
1. **组件化登录架构**: 拆解登录页为`登录面板容器`+`账号登录`+`手机登录`三大模块，用`el-tabs`实现切换
2. **封装缓存工具**：封装了支持自动序列化的缓存类，源码在`utils/cache.ts`
3. **类型安全实践**：抽离`IAccount`类型和token常量管理

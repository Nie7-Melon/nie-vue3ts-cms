<template>
  <div class="login-panel">
    <h2 class="title">小聂后台管理系统</h2>

    <!-- 切换帐号登录和手机登录的tab -->
    <div class="tab">
      <!-- stretch属性来自这个组件下面的属性文档，目的是让tabs平均占满宽 -->
      <!-- v-model="activeName"为了登录判断 -->
      <el-tabs type="border-card" stretch v-model="activeName">
        <!-- 帐号登陆部分 -->
        <!-- 添加name属性，目的点击后能把值传递给 tabs组件，
         方便登录时通过name判断是帐号还是手机 -->
        <el-tab-pane label="帐号登录" name="account">
          <!-- 使用插槽，替代label，这样能把icon和文字一起放进去 -->
          <template #label>
            <span class="icon">
              <div class="label">
                <el-icon><Watermelon /></el-icon>
                <span calss="text">帐号登录</span>
              </div>
            </span>
          </template>
          <!-- 导入组件--帐号密码表单部分 -->
          <!--把获取子组件的实例accountRef绑定到子组件上 -->
          <pane-account ref="accountRef" />
        </el-tab-pane>
        <!-- 手机号登录部分，依然使用插槽，替代label -->
        <el-tab-pane label="手机登录" name="phone">
          <template #label>
            <span class="icon">
              <div class="label">
                <el-icon><IceTea /></el-icon>
                <span calss="text">手机登录</span>
              </div>
            </span>
          </template>
          <!-- 导入组件--手机号登录下表单部分 -->
          <pane-phone />
        </el-tab-pane>
      </el-tabs>
    </div>

    <div>
      <div class="control-acc">
        <el-checkbox v-model="isRemPwd" label="记住密码" size="large" />
        <el-link type="warning">忘记密码</el-link>
      </div>
    </div>
    <div>
      <el-button class="login-btn" type="primary" @click="handleLoginBtnClick">立即登录</el-button>
    </div>
  </div>
</template>

<script setup lang="ts" name="pane">
import { ref, watch } from 'vue'
//引入缓存
import { localCache } from '@/utils/cache'
//activeName绑定帐号登录和手机登录的tab
// 这步完成后，F12Vue调试工具检查，能看到数据会随鼠标点击变化
const activeName = ref('account')
import PaneAccount from './pane-account.vue'
import PanePhone from './pane-phone.vue'
//判断是否记住密码
//const isRemPwd = ref(false)
//进阶：记住密码按钮状态保持
const isRemPwd = ref<boolean>(localCache.getCache('isRemPwd') ?? false)
watch(isRemPwd, (newValue) => {
  localCache.setCache('isRemPwd', newValue)
})
const account = ref('')
const password = ref('')
//获取子组件的实例accountRef，注意要把它绑定到子组件上
//不能直接ref<PanelAccount>,accountRef是由PanelAccount创建的实例对象
//构造器返回值的实例
//PaneAccoun相当于一个类
//这里一知半解的感觉，没关系，记住用法就可以
const accountRef = ref<InstanceType<typeof PaneAccount>>()
//点击登录后
function handleLoginBtnClick() {
  if (activeName.value === 'account') {
    //1. 获取子组件的实例，通过accountRef
    //上面要声明实例，把它绑定到子组件上，就可以拿取到值使用
    accountRef.value?.loginAction(isRemPwd.value)
    //2. 调用子组件中的方法进行登录
  } else {
    console.log('手机登录')
  }
}
</script>

<style lang="less" scoped>
.login-panel {
  color: rgb(98, 106, 239);
  width: 330px;
  margin-bottom: 150px;
}
.title {
  text-align: center;
  margin-bottom: 15px;
}

.control-acc {
  margin-top: 12px;
  display: flex;
  justify-content: space-between;
}
.icon {
  display: flex;
  align-items: center;
  justify-content: center;

  .text {
    margin-left: 5px;
  }
}
.login-btn {
  margin-top: 10px;
  width: 100%;
}
.el-button--primary {
  --el-button-bg-color: rgb(98, 106, 239);
}
.el-checkbox {
  --el-checkbox-text-color: rgb(238, 190, 119);
}
</style>

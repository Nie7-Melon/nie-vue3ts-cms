<template>
  <!-- tab下帐号登录的表单部分 -->
  <div class="pane-account">
    <!--label-width调整宽度 -->
    <!-- :model="account"绑定表单，获取整个对象 -->
    <el-form
      :model="account"
      :rules="accountRules"
      label-width="60px"
      size="large"
      status-icon
      ref="formRef"
    >
      <!--prop="name"目的：进行标识，方便校验规则找到对谁起作用  -->
      <el-form-item label="帐号" prop="name">
        <el-input v-model="account.name" />
      </el-form-item>

      <el-form-item label="密码" prop="password">
        <!--这俩后加的，不加也可以type="password" show-password  -->
        <el-input v-model="account.password" type="password" show-password />
      </el-form-item>
    </el-form>
  </div>
</template>

<script setup lang="ts" name="account">
import { reactive, ref } from 'vue'
//FormRules校验规则，需要导入
import type { FormRules, FormInstance } from 'element-plus'
//弹窗提示框搭导入ElMessage，它的样式要在main.ts里引入
import { ElMessage } from 'element-plus'
//引入缓存
import { localCache } from '@/utils/cache'
//发送登录请求的请求(后来移到登录仓库了     )
import { accountLoginRequest } from '@/service/login/login'
//导入用户登录仓库
//代码优化，把登录请求放在登户登录仓库中进行
import useLoginStore from '@/store/login/login'
// 1. 定义accout数据
//4.记住密码--如果cache里有保存用户的数据，用用户的数据填空，否则再用''
// ?? 非空断言
const account = reactive({
  name: localCache.getCache('name') ?? '',
  password: localCache.getCache('password') ?? ''
})

//2. 定义校验规则，看官方文档，模仿人家的写法
//数组类型：多个校验规则，一个表单可以放多个
//required: true必须填，如果不填，那么trigger: 'blur'，意思是失去焦点的时候触发
//记得要绑定到表单上，给表单添加属性:rules="accountRules"
const accountRules: FormRules = {
  name: [
    { required: true, message: '必须输入帐号信息哦', trigger: 'blur' },
    { pattern: /^[a-z0-9]{6,20}$/, message: '帐号必须是6~20个字母或数字', trigger: 'blur' }
  ],
  password: [
    { required: true, message: '必须输入密码哦', trigger: 'blur' },
    { pattern: /^[a-z0-9]{4,12}$/, message: '密码必须是4~12个字母或数字', trigger: 'blur' }
  ]
}

//3. 执行帐号登录逻辑
// 先理解一下：用户填写完帐号密码，点击登录
//此时数据在pane - account组件中，而登录按钮在pane - account组件的父组件里
//方法1：把子组件的数组传递给父组件（这里不用它）
//方法2：父组件中的登录按钮触发后，传递给子组件，让子组件执行方法（用这个）

const formRef = ref<FormInstance>()
//从useLoginStore里取出loginStore方法，方便发送请求用
const loginStore = useLoginStore()
function loginAction(isKeep: boolean) {
  console.log('子组件收到的参数,是否保存:', isKeep)
  console.log('当前账号数据:', account)

  //1. 是否通过了验证，这个isValid就是表单校验的结果,组件提供给我们的
  formRef.value?.validate((isValid) => {
    console.log('表单校验结果:', isValid)
    if (isValid) {
      //2.获取一下用户的账号密码
      console.log('isValid验证成功')

      const name = account.name
      const password = account.password
      console.log('account:', account)
      console.log('name, password:', name, password)

      // 2.向服务器发送网络请求，携带name和password
      //开始没指定类型，参数可以直接用account，但是account是响应式对象
      //我学习的老师喜欢把数据取出来，我也这样
      //下面是成功的代码，后面完善放仓库里了
      //accountLoginRequest({ name, password }).then((res) => {
      //  console.log('res:', res)
      //})

      //2进阶 =》3，不再直接发送请求，而是放在store/login仓库中
      //通过loginStore向服务器发送网络请求
      loginStore.accountLoginAction({ name, password })

      // 4.判断是否要记住密码
      if (isKeep) {
        localCache.setCache('name', name)
        localCache.setCache('password', password)
      } else {
        //不记住密码时会清空
        localCache.deleteCache('name')
        localCache.deleteCache('password')
      }
    } else {
      //如果用户点击提交时输入内容不符合规则，弹窗提示用户
      ElMessage.warning({ message: '账号或密码输入的规则错误哦' })
    }
  })
}

// 定义暴露的属性和方法
defineExpose({
  loginAction
})
</script>

<style lang="less" scoped></style>

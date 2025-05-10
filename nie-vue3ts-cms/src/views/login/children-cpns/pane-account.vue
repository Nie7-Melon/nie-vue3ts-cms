<template>
  <!-- tab下账号登录的表单部分 -->
  <div class="pane-account">
    <!--label-width调整宽度，  -->
    <el-form label-width="60px" size="large" status-icon ref="formRef">
      <el-form-item label="帐号" prop="name">
        <el-input />
      </el-form-item>
      <el-form-item label="密码" prop="password">
        <el-input />
      </el-form-item>
    </el-form>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
</script>

<style lang="less" scoped>
.pane-account {
  color: red;
}
</style>

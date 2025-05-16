<template>
  <!-- tab下电话登录的表单部分 -->

  <div class="panel-phone">
    <el-form label-width="60px" size="large">
      <el-form-item label="手机号">
        <el-input />
      </el-form-item>
      <el-form-item label="验证码">
        <div class="verify-code">
          <el-input />
          <el-button class="get-btn" type="primary">获取验证码</el-button>
        </div>
      </el-form-item>
    </el-form>
  </div>
</template>

<script setup lang="ts"></script>

<style lang="less" scoped>
.panel-phone {
  color: red;
}
.el-button--primary {
  --el-button-bg-color: rgb(98, 106, 239);
}
.verify-code {
  display: flex;

  .get-btn {
    margin-left: 8px;
  }
}
</style>

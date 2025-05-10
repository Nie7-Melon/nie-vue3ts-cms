<template>
  <div class="login">
    <login-panel></login-panel>
  </div>
</template>

<script setup lang="ts">
import LoginPanel from './children-cpns/login-panel.vue'
</script>

<style lang="less" scoped>
.login {
  color: rgb(178, 139, 203);
  display: flex;
  justify-content: center;
  align-items: center;

  width: 100%;
  height: 100%;
  //background: url('../../assets/img/login-bg.svg');
  //background: url('@/assets/img/sky2.png');
}
</style>

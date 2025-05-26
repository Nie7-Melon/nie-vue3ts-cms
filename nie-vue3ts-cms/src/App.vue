<script setup lang="ts">
import router from './router'
import { ElConfigProvider } from 'element-plus'
import zhCn from 'element-plus/es/locale/lang/zh-cn'
</script>

<template>
  <el-config-provider :locale="zhCn">
    <div class="app">
      <router-view></router-view>
    </div>
  </el-config-provider>
</template>

<style scoped>
.app {
  width: 100vw;
  height: 100vh;
}
</style>

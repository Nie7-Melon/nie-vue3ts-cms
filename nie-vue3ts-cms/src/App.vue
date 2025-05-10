<script setup lang="ts">
import router from './router'
</script>

<template>
  <div class="app">
    Hello小聂同学
    <!-- <router-link to="/main">去main页面</router-link>-->
    <router-link to="/login">去login页面</router-link>
    <router-view></router-view>
  </div>
</template>

<style scoped>
.app {
  width: 100vw;
  height: 100vh;
}
</style>

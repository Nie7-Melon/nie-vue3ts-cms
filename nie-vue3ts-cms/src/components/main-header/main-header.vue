<template>
  <div class="main-header">
    <!-- 首页头部面包屑 -->
    <div class="menu-icon" @click="handleMenuIconClick">
      <!-- 希望展开状态下展示第一个，折叠状态展示第二个 -->
      <!-- <el-icon size="28px"><Fold /></el-icon>
      <el-icon size="28px"><Expand /> </el-icon> -->
      <!-- 用动态组件来完成 -->
      <el-icon size="28px">
        <component :is="isFold ? 'Expand' : 'Fold'" />
      </el-icon>
    </div>
    <div class="content">
      <div class="breadcrumb">面包屑</div>
      <header-info />
    </div>
  </div>
</template>
<!-- -->
<script setup lang="ts">
import { Expand } from '@element-plus/icons-vue'
import { ref } from 'vue'
import HeaderInfo from './c-cpns/header-info.vue'
const isFold = ref(false)

// 子组件内部自定义事件
const emit = defineEmits(['foldChange'])

function handleMenuIconClick() {
  //切换是否折叠状态isFold,配合动态组件使用
  isFold.value = !isFold.value
  // 2.将事件和状态传递给父组件
  emit('foldChange', isFold.value)
}
</script>

<style lang="less" scoped>
.main-header {
  display: flex;
  align-items: center;
  flex: 1;
  height: 100%;

  .menu-icon {
    display: flex;
    align-items: center;
    cursor: pointer;
  }

  .content {
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex: 1;
    padding: 0 18px;
  }
}
</style>

<template>
  <div class="user">
    <user-search @query-click="handleQueryClick" @reset-click="handleResetClick" />
    <user-content ref="contentRef" @new-click="handleNewClick" @edit-click="handleEditClick" />
  </div>
  <user-modal ref="modalRef" />
</template>

<script setup lang="ts">
import { ref } from 'vue'
import UserSearch from './c-cpns/user-search.vue'
import UserContent from './c-cpns/user-content.vue'
import UserModal from './c-cpns/user-modal.vue'
// 先拿到content组件，再对content组件操作
const contentRef = ref<InstanceType<typeof UserContent>>()
//把search传递的formData传给content组件的fetchUserListData()方法
//要子组件中把这个方法暴露出去才能让父组件调用
//子组件要记得defineExpose({ fetchUserListData })
function handleQueryClick(formData: any) {
  console.log('user.vue的formData', formData)
  contentRef.value?.fetchUserListData(formData)
}
//重置操作
function handleResetClick() {
  contentRef.value?.fetchUserListData()
}

// 新增对modal组件的操作
const modalRef = ref<InstanceType<typeof UserModal>>()
function handleNewClick() {
  modalRef.value?.setModalVisible()
}
//编辑功能
function handleEditClick(itemData: any) {
  console.log(itemData)
  modalRef.value?.setModalVisible(false, itemData)
}
</script>

<style lang="less" scoped>
.user {
  border-radius: 8px;
  overflow: hidden;
}
</style>

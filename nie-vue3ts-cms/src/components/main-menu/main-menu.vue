<template>
  <div class="main-menu">
    <!-- 菜单栏上侧logo -->
    <div class="logo">
      <img class="img" src="@/assets/img/cake1.png" alt="" />
      <h2 class="title" v-show="!isFold">聂聂管理系统</h2>
    </div>
    <!-- 菜单栏内容 -->
    <div class="menu">
      <el-menu
        :default-active="defaultActive"
        :collapse="isFold"
        text-color="#b7bdc3"
        active-text-color="#fff"
        background-color="#001529"
      >
        <!-- 动态获取菜单：先遍历整个菜单，用id作为Key， -->
        <template v-for="item in userMenus" :key="item.id">
          <!-- 加上 :index="item.id + ''" 这样就知道要展开哪个，不会全部展开了 -->
          <el-sub-menu :index="item.id + ''">
            <template #title>
              <!-- 字符串: el-icon-monitor => 组件 component动态组件 -->
              <el-icon>
                <component :is="item.icon.split('-icon-')[1]" />
              </el-icon>
              <span>{{ item.name }}</span>
            </template>
            <!-- 继续获取子菜单 -->
            <template v-for="subitem in item.children" :key="subitem.id">
              <!-- <el-menu-item :index="subitem.path" @click="handleItemClick(subitem)"> -->
              <!-- 被选中子菜单不高亮展示的原因：上边错误代码，下面正确代码 -->
              <el-menu-item :index="subitem.id + ''" @click="handleItemClick(subitem)">
                {{ subitem.name }}
              </el-menu-item>
            </template>
          </el-sub-menu>
        </template>
        <!--  把之前静态搭的菜单注释掉了换动态的
        <el-sub-menu>
          <template #title>
            <el-icon><Monitor /></el-icon>
            <span>系统总览</span>
          </template>
          <el-menu-item>核心技术</el-menu-item>
          <el-menu-item>商品统计</el-menu-item>
        </el-sub-menu>
  

        <el-sub-menu>
          <template #title>
            <el-icon><Setting /></el-icon>
            <span>系统管理</span>
          </template>
          <el-menu-item>用户管理</el-menu-item>
          <el-menu-item>部门管理</el-menu-item>
          <el-menu-item>菜单管理</el-menu-item>
          <el-menu-item>角色管理</el-menu-item>
        </el-sub-menu>

        <el-sub-menu>
          <template #title>
            <el-icon><ShoppingBag /></el-icon>
            <span>商品中心</span>
          </template>
          <el-menu-item>商品类别</el-menu-item>
          <el-menu-item>商品信息</el-menu-item>
        </el-sub-menu>

        <el-sub-menu>
          <template #title>
            <el-icon><Monitor /></el-icon>
            <span>随便聊聊</span>
          </template>
          <el-menu-item>你的故事</el-menu-item>
          <el-menu-item>故事列表</el-menu-item>
        </el-sub-menu> -->
      </el-menu>
    </div>
  </div>
</template>

<script setup lang="ts">
import useLoginStore from '@/store/login/login'
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { mapPathToMenu } from '@/utils/map-menus'

// 1.获取动态的菜单
const loginStore = useLoginStore()
//获取菜单，同时使用loginStore了，现在页面的pinia里有菜单的数据
const userMenus = loginStore.userMenus
//接受父组件传递的数组决定是否折叠菜单
defineProps({
  isFold: {
    type: Boolean,
    default: false
  }
})
// 2.监听item的点击
const router = useRouter()
function handleItemClick(item: any) {
  const url = item.url
  router.push(url)
}
// 3.ElMenu的默认菜单
const route = useRoute()
const defaultActive = computed(() => {
  const pathMenu = mapPathToMenu(route.path, userMenus)
  //console.log('pathMenu', pathMenu)
  //console.log("pathMenu.id + ''", pathMenu.id + '') //返回一个数字字符串
  return pathMenu.id + ''
})
</script>
<style lang="less" scoped>
.main-menu {
  height: 100%;
  background-color: rgb(124, 90, 144);
  .el-sub-menu__title {
    color: #fff;
  }
}

.logo {
  display: flex;
  height: 28px;
  padding: 12px 10px 8px 10px;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  overflow: hidden;

  .img {
    height: 100%;
    margin: 0 10px;
  }

  .title {
    font-size: 20px;
    font-weight: 700;
    color: white;
    white-space: nowrap;
  }
}

.el-menu {
  border-right: none;
  user-select: none;
  .el-menu-item {
    color: #fff;
  }
}

.el-sub-menu {
  --el-menu-text-color: #fff;
  .el-menu-item {
    padding-left: 50px !important;
    background-color: rgb(163, 153, 192);
  }
  background-color: rgb(110, 95, 151);
  .el-menu-item:hover {
    color: #fff;
  }

  .el-menu-item.is-active {
    background-color: rgb(232, 217, 195);
  }
}
</style>

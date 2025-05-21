<template>
  <div class="content">
    <div class="header">
      <h3 class="title">用户列表</h3>
      <el-button type="primary" @click="handleNewUserClick">新建用户</el-button>
    </div>
    <div class="table">
      <el-table :data="usersList" border style="width: 100%">
        <!-- 多选列 -->
        <el-table-column align="center" type="selection" width="50px" />
        <el-table-column align="center" type="index" label="序号" width="60px" />

        <el-table-column align="center" label="用户名" prop="name" width="150px" />
        <el-table-column align="center" label="真实姓名" prop="realname" width="150px" />
        <el-table-column align="center" label="手机号码" prop="cellphone" width="150px" />
        <el-table-column align="center" label="状态" prop="enable" width="100px">
          <!-- 作用域插槽 -->
          <template #default="scope">
            <el-button size="small" :type="scope.row.enable ? 'primary' : 'danger'" plain>
              {{ scope.row.enable ? '启用' : '禁用' }}
            </el-button>
          </template>
        </el-table-column>
        <el-table-column align="center" label="创建时间" prop="createAt">
          <template #default="scope">
            {{ formatUTC(scope.row.createAt) }}
          </template>
        </el-table-column>
        <el-table-column align="center" label="更新时间" prop="updateAt">
          <template #default="scope">
            {{ formatUTC(scope.row.updateAt) }}
          </template>
        </el-table-column>

        <el-table-column align="center" label="操作" width="150px">
          <template #default="scope">
            <el-button
              size="small"
              icon="Edit"
              type="primary"
              text
              @click="handleEditBtnClick(scope.row)"
            >
              编辑
            </el-button>
            <el-button
              size="small"
              icon="Delete"
              type="danger"
              text
              @click="handleDeleteBtnClick(scope.row.id)"
            >
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="pagination">
      <el-pagination
        v-model:current-page="currentPage"
        v-model:page-size="pageSize"
        :page-sizes="[10, 20]"
        layout="total, sizes, prev, pager, next, jumper"
        :total="usersTotalCount"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref } from 'vue'
import { storeToRefs } from 'pinia'
import useSystemStore from '@/store/main/system/system'
//使用Day.js库格式化时间
import { formatUTC } from '@/utils/format'
// 定义事件
const emit = defineEmits(['newClick', 'editClick'])

// 1.调用仓库的查询数据请求，发起action，请求usersList的数据
const systemStore = useSystemStore()
//systemStore.postUsersListAction()
//3， 因为展示数据要用所以要放在前面，当前页面，每页数量
//页码从1开始
const currentPage = ref(1)
//pageSize每页展示数据数
const pageSize = ref(10)
//进来先获取一次数据
fetchUserListData()

// 2.获取usersList数据,进行展示
const { usersList, usersTotalCount } = storeToRefs(systemStore)
// 3.每页展示数量变化
function handleSizeChange() {
  fetchUserListData()
}
//当前页码改变
function handleCurrentChange() {
  fetchUserListData()
}
// 封装函数, 用于发送网络请求更新表格
// 现在一进页面要查询数据，分页数量变要查询，页码变要查询，
//总查询，所以给查询请求封装一个函数进行网络请求
//formData继续完善，不光要携带页码和分页两个参数，还要包含查询组件传过来的参数
function fetchUserListData(formData: any = {}) {
  // size每页的数据数
  const size = pageSize.value
  //offset偏移量，第一页偏移0条数据，第二页偏移第一页展示的数据量以此类推
  const offset = (currentPage.value - 1) * size
  const pageInfo = { size, offset }
  //queryInfo把两部分要传的参数综合起来
  const queryInfo = { ...pageInfo, ...formData }
  console.log('queryInfo', queryInfo)
  // 发起网络请求
  systemStore.postUsersListAction(queryInfo)
}
//删除
function handleDeleteBtnClick(id: number) {
  console.log('触发ID', id)
  systemStore.deleteUserByIdAction(id)
}
//新建
function handleNewUserClick() {
  emit('newClick')
}
//编辑
function handleEditBtnClick(itemData: any) {
  emit('editClick', itemData)
}
//把这个方法暴露出去才能让父组件调用
defineExpose({ fetchUserListData })
</script>

<style lang="less" scoped>
.content {
  margin-top: 20px;
  padding: 20px;
  background-color: #fff;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  margin-bottom: 10px;
  .el-button--primary {
    --el-button-bg-color: rgb(98, 106, 239);
  }
  .title {
    font-size: 22px;
  }
}

.table {
  :deep(.el-table__cell) {
    padding: 12px 0;
  }

  .el-button {
    margin-left: 0;
    padding: 5px 8px;
  }
}
// 让底部分页查询去右边
.pagination {
  display: flex;
  justify-content: flex-end;
  margin-top: 10px;
}
</style>

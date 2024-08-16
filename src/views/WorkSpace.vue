<template>
  <el-container class="layout-container-demo" style="height: 100%">
    <el-aside width="200px">
      <el-scrollbar>
        <el-menu :default-openeds="['1', '2', '3']" :router="true">
          <el-sub-menu index="1">
            <template #title>
              <el-icon>
                <message />
              </el-icon>图书管理
            </template>
            <el-menu-item-group title="库存管理">
              <el-menu-item index="/workspace/inventory-manage">书库管理</el-menu-item>
              <el-menu-item index="/workspace/book-manage">图书管理</el-menu-item>
            </el-menu-item-group>
            <el-menu-item-group title="查询与统计">
              <el-menu-item index="1-4-1">信息查询</el-menu-item>
              <el-menu-item index="1-4-1">数据统计</el-menu-item>
            </el-menu-item-group>
          </el-sub-menu>
          <el-menu-item index="/workspace/user-manage">
            <el-icon>
              <User />
            </el-icon>
            读者管理
          </el-menu-item>
          <!-- <el-sub-menu index="2">
            <template #title>
              <el-icon><icon-menu /></el-icon>读者管理
            </template>
            <el-menu-item-group>
              <template #title></template>
              <el-menu-item index="2-2">授权设定</el-menu-item>
            </el-menu-item-group>
            <el-menu-item-group title="">
              <el-menu-item index="2-3">新注册授权</el-menu-item>
            </el-menu-item-group>
            <el-menu-item-group title="">
              <el-menu-item index="2-4">权限管理</el-menu-item>
            </el-menu-item-group>
          </el-sub-menu> -->
          <el-sub-menu index="3">
            <template #title>
              <el-icon>
                <setting />
              </el-icon>借阅管理
            </template>
            <el-menu-item-group>
              <!-- <template #title>Group 1</template> -->
              <el-menu-item index="/workspace/borrow-record-manage">历史记录</el-menu-item>
              <el-menu-item index="3-2">逾期不还管理</el-menu-item>
            </el-menu-item-group>
          </el-sub-menu>
        </el-menu>
      </el-scrollbar>
    </el-aside>

    <el-container>
      <el-header style="text-align: right; font-size: 12px">
        <div class="toolbar">
          <el-dropdown>
            <el-icon style="margin-right: 8px; margin-top: 1px">
              <setting />
            </el-icon>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item>View</el-dropdown-item>
                <el-dropdown-item>Add</el-dropdown-item>
                <el-dropdown-item>Delete</el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
          <span>管理员：Tom</span>
        </div>
      </el-header>

      <el-main>
        <el-scrollbar>
          <RouterView></RouterView>
        </el-scrollbar>
      </el-main>
    </el-container>
  </el-container>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { Menu as IconMenu, Message, Setting } from '@element-plus/icons-vue'
import InventoryManage from './InventoryManage.vue';

const item = {
  date: '2016-05-02',
  name: 'Tom',
  address: 'No. 189, Grove St, Los Angeles',
}
const tableData = ref(Array.from({ length: 20 }).fill(item))
</script>

<style scoped>
.layout-container-demo .el-header {
  position: relative;
  background-image: -webkit-linear-gradient(10deg, #A0FAFF, #E1F59A);
  /* background-color: var(--el-color-primary-light-7); */
  color: var(--el-text-color-primary);
}

.layout-container-demo .el-aside {
  color: var(--el-text-color-primary);
  background-image: -webkit-linear-gradient(10deg, #C2FCFF, #F8FFDE);
  /* background: var(--el-color-primary-light-8); */
}

.layout-container-demo .el-menu {
  border-right: none;
}

.layout-container-demo .el-main {
  padding: 0;
}

.layout-container-demo .toolbar {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  right: 20px;
}
</style>

<template>
  <el-container class="layout-container-demo" style="height: 100%">
    <el-aside width="160px">
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
              <el-menu-item index="/workspace/category-manage">分类管理</el-menu-item>
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
          <el-menu-item index="/workspace/permission-manage">
            <el-icon>
              <User />
            </el-icon>
            权限管理
          </el-menu-item>
          <el-sub-menu index="3">
            <template #title>
              <el-icon>
                <setting />
              </el-icon>借阅管理
            </template>
            <el-menu-item-group>
              <!-- <template #title>Group 1</template> -->
              <el-menu-item index="/workspace/borrow-record-manage">历史记录</el-menu-item>
              <el-menu-item index="/workspace/overdue-manage">逾期不还管理</el-menu-item>
            </el-menu-item-group>
          </el-sub-menu>
        </el-menu>
      </el-scrollbar>
    </el-aside>

    <el-container>
      <el-header style="text-align: right; font-size: 12px; height: 10%;">

        <div class="toolbar">
          <el-dropdown>
            <el-icon style="margin-right: 8px; margin-top: 1px">
              <setting />
            </el-icon>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item @click="adminLogout">退出登录</el-dropdown-item>
                <!-- <el-dropdown-item>Add</el-dropdown-item>
                <el-dropdown-item>Delete</el-dropdown-item> -->
              </el-dropdown-menu>
            </template>
          </el-dropdown>
          <span>管理员：{{ admin.adminInfo.username }}</span>
        </div>
      </el-header>

      <el-main>
        <el-scrollbar class="scroll-area">
          <RouterView></RouterView>
        </el-scrollbar>
      </el-main>

      <el-footer>
        <div style="
        margin-top: 20px;
        text-align: center;
        font-size: 15px;
        background-clip: text;
        background-image: -webkit-linear-gradient(0deg, #313435, #252523);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;">
          Firefly-Library 管理系统
        </div>
      </el-footer>
    </el-container>
  </el-container>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { Menu as IconMenu, Message, Setting } from '@element-plus/icons-vue'
import { useAdminStore } from '@/stores/admin';
import { useRouter } from 'vue-router';


const router = useRouter()
const admin = useAdminStore()

const adminLogout = () => {
  admin.logout()
  router.push('/admin-login')
}

</script>

<style scoped>
.toolbar {
  font-size: medium;
}

.scroll-area {
  background-color: rgb(245, 239, 239);
  background-position: center;
  background-size: 100%;
  /* background-image: url("../assets/firefly.png"); */
}

.layout-container-demo .el-header {
  position: relative;
  background-image: -webkit-linear-gradient(10deg, #97e6e9f8, #d7e0b8);
  /* background-color: var(--el-color-primary-light-7); */
  color: var(--el-text-color-primary);
}

.layout-container-demo .el-aside {
  color: var(--el-text-color-primary);
  background-position: center;
  background-image: -webkit-linear-gradient(10deg, #ee8071, #e1eb62);
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

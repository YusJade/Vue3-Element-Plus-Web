<template>
  <span>Hi {{ btnTip }}!</span>
  <el-button type="primary" text @click="logout">退出登录</el-button>
  <el-button type="primary" text @click="onEditBtnClicked">编辑</el-button>
  <el-descriptions
  title="个人面板"
  direction="vertical"
  :column="2"
  border
  >
    <el-descriptions-item label="用户名">
      <template v-if="!isEditState">
        {{ user.username }}
      </template>
      <template v-else>
        <el-input :v-model="user.username"></el-input>
      </template>
    </el-descriptions-item>
    <el-descriptions-item label="电话">{{ user.phone }}</el-descriptions-item>
    <el-descriptions-item label="邮箱" :span="2">{{ user.email }}</el-descriptions-item>
    <el-descriptions-item label="姓名">
      <el-tag size="small">{{ user.name }}</el-tag>
      <el-tag size="small">{{ user.gender }}</el-tag>
    </el-descriptions-item>
  </el-descriptions>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { User } from '@/type';

let isEditState = false;
const btnTip = ref('登录');
const drawer = ref(false);
const user = ref<User>({
  id: 0,
  email: 'Unknown',
  gender: 'Unknown',
  name: 'Unknown',
  password: 'Unknown',
  phone: 'Unknown',
  username: 'Unknown'
})

function onEditBtnClicked() {
  isEditState = !isEditState
}
</script>

<style>

</style>
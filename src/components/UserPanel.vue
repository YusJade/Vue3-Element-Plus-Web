<template>
  <span>Hi {{ btnTip }}!</span>
  <el-button type="primary" text @click="logout">�˳���¼</el-button>
  <el-button type="primary" text @click="onEditBtnClicked">�༭</el-button>
  <el-descriptions
  title="�������"
  direction="vertical"
  :column="2"
  border
  >
    <el-descriptions-item label="�û���">
      <template v-if="!isEditState">
        {{ user.username }}
      </template>
      <template v-else>
        <el-input :v-model="user.username"></el-input>
      </template>
    </el-descriptions-item>
    <el-descriptions-item label="�绰">{{ user.phone }}</el-descriptions-item>
    <el-descriptions-item label="����" :span="2">{{ user.email }}</el-descriptions-item>
    <el-descriptions-item label="����">
      <el-tag size="small">{{ user.name }}</el-tag>
      <el-tag size="small">{{ user.gender }}</el-tag>
    </el-descriptions-item>
  </el-descriptions>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { User } from '@/type';

let isEditState = false;
const btnTip = ref('��¼');
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
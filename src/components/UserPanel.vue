<template>
  <span>Hi {{ userStore.userInfo.username }}!</span>
  <el-button type="primary" text @click="logout">退出登录</el-button>
  <el-button type="primary" text @click="onEditBtnClicked">{{ !isEditState ? "编辑" : "退出编辑"
    }}</el-button>
  <el-button v-if="isEditState" type="primary" text @click="saveEdit">保存</el-button>
  <!-- <button type="button" @click="console.log(user)"></button> -->
  <el-descriptions title="个人面板" direction="vertical" :column="2" border>
    <el-descriptions-item label="用户名">
      <span v-if="!isEditState"> {{ userStore.userInfo.username }} </span>
      <ValidatedInput v-else size="small" id="username" :clearable="false"
                      v-model:model-value="user.username"
                      :validate="validateUsernameLogined">
      </ValidatedInput>
    </el-descriptions-item>
    <el-descriptions-item label="电话">
      <span v-if="!isEditState"> {{ userStore.userInfo.phone }} </span>
      <ValidatedInput v-else size="small" id="phone" :clearable="false"
                      v-model:model-value="user.phone" :validate="validatePhone"
                      </ValidatedInput>
    </el-descriptions-item>
    <el-descriptions-item label="邮箱" :span="2">
      <span v-if="!isEditState"> {{ userStore.userInfo.email }} </span>
      <ValidatedInput v-else size="small" id="email" :clearable="false"
                      v-model:model-value="user.email" :validate="validateEmail">
      </ValidatedInput>
    </el-descriptions-item>
    <el-descriptions-item label="姓名">
      <span v-if="!isEditState"> {{ userStore.userInfo.name }} </span>
      <ValidatedInput v-else size="small" id="name" :clearable="false"
                      v-model:model-value="user.name">
      </ValidatedInput>
    </el-descriptions-item>
    <el-descriptions-item label="性别">
      <span v-if="!isEditState"> {{ userStore.userInfo.gender }} </span>
      <el-select v-else v-model="user.gender" size="middle" style="width: 240px"
                 placeholder="性别">
        <el-option v-for="item in genderOptions" :key="item.value" :label="item.label"
                   :value="item.value" />
      </el-select>
    </el-descriptions-item>
  </el-descriptions>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { User } from '@/type';
import { useUserStore } from '@/stores/user';
import ValidatedInput from './ValidatedInput.vue';
import router from '@/router';
import { api } from '@/https';
import { validateEmail, validatePhone, validateUsername } from '@/utils/validator';
import { queryUserId, updateUserInfo } from '@/api/user';

let isEditState = ref(false);
const btnTip = ref('登录');
const drawer = ref(false);
const userStore = useUserStore();
let username = "test"
let user = ref<User>({
  userId: 0,
  email: 'Unknown',
  gender: 'Unknown',
  name: 'Unknown',
  password: 'Unknown',
  phone: 'Unknown',
  username: 'Unknown'
})

const genderOptions = [
  {
    value: "男",
    label: "男",
  },
  {
    value: "女",
    label: "女",
  },
]

onMounted(() => {
  if (userStore.isLogined) {
    user.value = Object.assign({}, userStore.userInfo)
  }
})

const validateUsernameLogined = async (value: string) => {
  const error = validateUsername(value);
  if (error != '') {
    return error;
  }
  const res = await queryUserId(value);
  if (res.data.code == api.code.SUCCESS && res.data.data.userId != user.value.userId) {
    return '用户名已存在';
  }
  return '';
}

async function saveEdit() {
  console.log(user.value)
  let res = await updateUserInfo(userStore.userInfo.userId.toString(), user.value);
  if (res.data.code == api.code.SUCCESS) {


    userStore.userInfo = user.value; // 更新 pinia
    isEditState.value = !isEditState.value; // 退出编辑
    console.info("退出编辑模式");
  }
}

function logout() {
  userStore.logout();
  location.reload();
}

function onEditBtnClicked() {
  isEditState.value = !isEditState.value;
  console.info(isEditState.value ? "编辑模式" : "展示模式");
}
</script>

<style></style>
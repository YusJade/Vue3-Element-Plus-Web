<template>
  <div
    style="min-height: 100vh; display: flex; align-items: center; justify-content: center; background-image: url('src/assets/register_background.jpg'); background-size: cover; background-position: center;">
    <div class="login_box">
      <div style="text-align: center; margin-bottom: 0rem; margin-left: -10px; margin-right: -10px;">
        <div style="
      text-align: center;
      font-size: 65px;
      background-clip: text;
      background-image: -webkit-linear-gradient(0deg, #2AD5DE, #E1E87E);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;">
          Firefly-Library
        </div>
      </div>
      
      <!-- 注册表单 -->
      <form>
        <h2 style="font-size: 1.50rem; font-weight: 600; color: #62646B;">用户注册</h2>
        <div class="mb-4">
          <label for="username" class="font-semibold text-gray-700">用户名</label>
          <el-input v-model="username" size="middle" type="username" placeholder="用户名" clearable="true" />
        </div>
        <div class="mb-4">
          <label for="username" class="font-semibold text-gray-700">邮箱</label>
          <ValidatedInput
          label=""
          id="email"
          v-model="email"
          placeholder="邮箱"
          clearable="true"
          :validate="validateEmail"
          />
          <!-- <el-input v-model="username" size="middle" type="username" placeholder="邮箱" clearable="true" />
          <span v-if="emailError" class="font-semibold text-gray-500">
            <el-icon><CircleClose color="red" style="margin-top: 0px" /></el-icon>
            {{ emailError }}
          </span> -->
        </div>
        <div class="mb-4">
          <label for="username" class="font-semibold text-gray-700">电话（可选）</label>
          <el-input v-model="username" size="middle" type="username" placeholder="电话" clearable="true" />
        </div>
        <div class="mb-4">
          <label for="username" class="font-semibold text-gray-700">姓名（可选）</label>
          <el-input v-model="username" size="middle" type="username" placeholder="姓名" clearable="true" />
        </div>
        <div class="mb-4">
          <!-- <span style="padding-right: 1.5rem;">性别</span> -->
          <label for="username" class="block font-semibold text-gray-700">性别</label>
          <el-select
          v-model="gender"
          size="middle"
          style="width: 240px"
          placeholder="性别">
          <el-option
            v-for="item in genderOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"/>
          </el-select>
        </div>
        <div class="mb-4">
          <label for="username" class="block font-semibold text-gray-700">密码</label>
          <el-input v-model="username" size="middle" type="username" placeholder="密码" clearable="true" />
        </div>
        <div class="mb-4">
          <label for="username" class="font-semibold text-gray-700">确认密码</label>
          <el-input v-model="username" size="middle" type="username" placeholder="确认密码" clearable="true" />
        </div>
        <button type="button" @click="onRegisterBtnClick" class="login-btn">注册</button>
      </form>
      <!-- 返回登录界面 -->
      <div style="margin-top: 1rem; text-align: center;">
        <p style="font-size: 0.875rem;">什么？想起了自己的账户？
          <el-button text @click="onRegisterBtnClick"
            style="color: #2563eb; transition: color 0.3s; text-decoration: none; padding-left: 0;">
            登录！
          </el-button>
        </p>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import ValidatedInput from '../components/ValidatedInput.vue';

const usernameError = "请输入正确的格式！"
const emailError = "请输入正确的格式！"
const phoneError = "请输入正确的格式！"
const nameError = "请输入正确的格式！"
const genderError = "请输入正确的格式！"
const passwordError = "请输入正确的格式！"
const confirmPasswordError = "请输入正确的格式！"

const username = ref<String>("")
const email = ref<String>("")
const phone = ref<String>("")
const name = ref<String>("")
const gender = ref<String>("男")
const password = ref<String>("")
const confirmPassword = ref<String>("")

const validateEmail = (value: string): string => {
  const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
  if (!emailPattern.test(value)) {
    return '请输入有效的邮箱地址';
  }
  return '';
};

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
</script>

<style scoped>
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(300px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.login_box {
  background-color: rgba(255, 255, 255, 0.95);
  padding: 2rem;
  border-radius: 0.6rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  max-width: 28rem;
  width: 100%;
  animation: fadeIn 0.3s ease-in-out;
}

.login-btn {
  width: 100%;
  height: 50px;
  font-size: 14px;
  font-weight: 700;
  border: none;
  padding: 0.75rem;
  border-radius: 0.5rem;
  background-image: -webkit-linear-gradient(0deg, #2AD5DE, #E1E87E);
  color: #ffffff;
  position: relative;
  cursor: pointer;
  z-index: 0;
}

.login-btn:before {
  content: '';
  width: 0%;
  height: inherit;
  position: absolute;
  top: 0;
  left: 0;
  opacity: 0;

  padding: 0.75rem;
  border-radius: 0.5rem;
  background-image: -webkit-linear-gradient(0deg, #EF412B, #E1E87E);
  z-index: -1;
  transition: all 0.4s;
}

.login-btn:hover:before {
  width: 100%;
  opacity: 1;
}
</style>
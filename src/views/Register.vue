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
        <ValidatedInput
          label="用户名"
          id="username"
          v-model="username"
          placeholder="用户名"
          clearable="true"
          :validate="validateUsername"
          @on-validate="handleOnValidate"
        />
        <ValidatedInput
          label="邮箱"
          id="email"
          v-model="email"
          placeholder="邮箱"
          :clearable="true"
          :validate="validateEmail"
          @on-validate="handleOnValidate"
        />
        <ValidatedInput
          label="电话（可选）"
          id="phone"
          v-model="email"
          placeholder="电话"
          :clearable="true"
          :validate="validatePhone"
          @on-validate="handleOnValidate"
        />
        <ValidatedInput
          label="姓名（可选）"
          id="name"
          v-model="email"
          placeholder="姓名"
          :clearable="true"
        />
        <div class="mb-2">
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
        <ValidatedInput
          label="密码"
          id="password"
          v-model="password"
          placeholder="密码"
          :clearable="true"
          :validate="validatePassword"
          @on-validate="handleOnValidate"
          :show-password="true"
        />
        <div class="mb-4">
          <ValidatedInput
            label="确认密码"
            id="confirmPassword"
            v-model="confirmPassword"
            placeholder="确认密码"
            :clearable="true"
            :validate="validateConfrimPassword"
            @on-validate="handleOnValidate"
            :show-password="true"
          />
        </div>
        <button type="button" 
          @click="onRegisterBtnClicked" 
          :class="{'disabled-button': !isValidState, 'login-btn': isValidState}">注册</button>
      </form>
      <!-- 返回登录界面 -->
      <div style="margin-top: 1rem; text-align: center;">
        <p style="font-size: 0.875rem;">什么？想起了自己的账户？
          <el-button text @click="onLoginBtnClicked"
            style="color: #2563eb; transition: color 0.3s; text-decoration: none; padding-left: 0;">
            登录！
          </el-button>
        </p>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed, reactive, ref } from 'vue';
import { useRouter } from "vue-router"
import { User } from '@/type';
import { api, userRegister } from '@/https';
import ValidatedInput from '../components/ValidatedInput.vue';
import { validateUsername, validateEmail, validatePassword, validatePhone } from '../utils/validator'
import { Message } from '@/utils/message';

const router = useRouter();

const username = ref<String>("");
const email = ref<String>("");
const phone = ref<String>("");
const name = ref<String>("");
const gender = ref<String>("男");
const password = ref<String>("");
const confirmPassword = ref<String>("");

// 初始化验证状态对象
let validationState = ref({
  email: false,
  username: false,
  phone: false,
  password: false,
  confirmPassword: false
});

// // 模拟验证逻辑，例如在某个条件下设置字段的验证状态
// setTimeout(() => {
//   validationState.value.email = true;
//   validationState.value.username = true;
//   validationState.value.phone = true;
//   validationState.value.password = true;
//   validationState.value.confirmPassword = true;
// }, 2000); // 2 秒后模拟设置字段为通过验证状态

const handleOnValidate = (field: string, isValid: boolean) => {
  // console.log(field)
  // console.info(validationState[field], validationState[data.field])
  validationState.value[field] = isValid;
  // console.info(isValidState.value, validationState.value)
}

const isValidState = computed(() => {
  // console.info(Object.values(validationState.value))
  return !Object.values(validationState.value).some(isValid => { return isValid == false })
})

const validateConfrimPassword = (value: string) => {
  let error: string = validatePassword(value);
  if (error != '') {
    return error;
  }
  if (value != password.value) {
    console.log(value + "!=" + password.value);
    return '两次密码不一致'
  }
  return ''
}

const onRegisterBtnClicked = () => {
  console.log(validationState)
  let user: User = {
    username: username.value,
    email: email.value,
    phone: phone.value,
    name: name.value,
    gender: gender.value,
    password: password.value
  }
  userRegister(user)
    .then((response) => {
      if (response.data.code == api.code.SUCCESS) {
        Message('注册成功！');
      }
  })
}

const onLoginBtnClicked = () => {
  router.push('/login')
}

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
</script >

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

@keyframes flyColor {
  from {
    opacity: 0.4;
  }
  to {
    opacity: 1;
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
  font-size: 16px;
  font-weight: 700;
  border: none;
  padding: 0.75rem;
  border-radius: 0.5rem;
  background-image: -webkit-linear-gradient(0deg, #2AD5DE, #E1E87E);
  color: #ffffff;
  position: relative;
  cursor: pointer;
  z-index: 0;
  transition: all 0.4s;
  animation: flyColor 0.6s ease-in;
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

.disabled-button {
  width: 100%;
  height: 50px;
  font-size: 16px;
  font-weight: 700;
  border: none;
  padding: 0.75rem;
  border-radius: 0.5rem;
  background-image: -webkit-linear-gradient(0deg, #676E6E, #E0E0D6);
  color: #ffffff;
  position: relative;
  cursor: pointer;
  z-index: 0;
  transition: all 0.4s;
  /* animation: flyColor 0.6s ease-in; */
}

/* 使用最新的 :deep 语法覆盖自动填充样式 */
:deep(.el-input__inner:-webkit-autofill),
:deep(.el-input__inner:-webkit-autofill:hover),
:deep(.el-input__inner:-webkit-autofill:focus),
:deep(.el-input__inner:-webkit-autofill:active) {
  -webkit-box-shadow: 0 0 0px 1000px white inset !important;
  -webkit-text-fill-color: black !important;
}
</style>
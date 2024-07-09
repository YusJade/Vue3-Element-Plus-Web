
<template>
<div style="min-height: 100vh; display: flex; align-items: center; justify-content: center; background-image: url('src/assets/login_background.jpg'); background-size: cover; background-position: center;">
  <div class="login_box">
    <div style="text-align: center; margin-bottom: 0rem; margin-left: -10px; margin-right: -10px;">
      <div
      style="
      text-align: center;
      font-size: 65px;
      background-clip: text;
      /* 将背景设为渐�? */
      background-image: -webkit-linear-gradient(0deg, #2AD5DE, #E1E87E);
      /* 规定背景绘制区域 */
      -webkit-background-clip: text;
      /* 将文字隐�? */
      -webkit-text-fill-color: transparent;">
      Firefly-Library
      </div>
    </div>
    <form>
      <h2 style="font-size: 1.50rem; font-weight: 600; color: #62646B;">用户登录</h2>
      <div style="margin-bottom: 1rem;">
        <el-input v-model="username" 
        :focus="onUsernameInputFocus" 
        v-on:blur="onInputBlur"
        size="large"  type="username" placeholder="您的用户名" clearable="true"/>
      </div>
      <div style="margin-bottom: 1rem; position: relative;">
        <el-input v-model="password" 
        :focus="onPasswordInputFocus"
        v-on:blur="onInputBlur" 
        size="large" type="password" placeholder="您的密码" clearable="true" show-password="true"/>
      </div>
      <div style="display: flex; align-items: center; margin-bottom: 1rem;">
        <el-checkbox style="margin-right: auto;">请记住我......</el-checkbox>
        <!-- <input type="checkbox" id="remember" style="margin-right: 0.5rem;"> -->
        <!-- <label for="remember" style="font-size: 0.875rem; margin-right: auto;">Remember me</label> -->
        <div style="display: flex; text-align: right;">
          <a href="#" style="right: 0; font-size: 0.875rem; color: #4a5568; transition: color 0.3s;">忘记密码了吗?</a>
        </div>
      </div>
      <div style="margin-bottom: 1rem; display: flex; align-items: center; justify-content: space-between;">
        <div style="display: flex; align-items: center;">
          <!-- <img src="https://placehold.co/20x20" alt="Success" style="margin-right: 0.5rem;">
          <span>Success!</span> -->
        </div>
        <span v-show="firefiyLookingUsername" style="right: 0; display: flex; align-items: center; padding-right: 0.75rem;">
          <img src="../assets/username.png" style="height: 100px;" alt="Show Password">
        </span>
        <span v-show="firefiyLookingPassword" style="right: 0; display: flex; align-items: center; padding-right: 0.75rem;">
          <img src="../assets/password.png" style="height: 100px;" alt="Show Password">
        </span>
        <span v-show="firefiyLookingLogin" style="right: 0; display: flex; align-items: center; padding-right: 0.75rem;">
          <img src="../assets/looking_login.png" style="height: 100px;" alt="Show Password">
        </span>
      </div>
      <button type="button" @onmouseover="onSubmitBtnHover" @click="onLoginBtnClick" class="login-btn">登录</button>
    </form>
    <div style="margin-top: 1rem; text-align: center;">
      <p style="font-size: 0.875rem;">什么？还没有账户？ 
        <el-button 
        text 
        @click="onRegisterBtnClick" 
        style="color: #2563eb; transition: color 0.3s; text-decoration: none; padding-left: 0;">
        注册！
        </el-button>
      </p>
    </div>
  </div>
</div>
</template>



<script lang="ts" setup>
import { useRouter } from "vue-router"
import request from "@/https"
import { api } from "@/https"
import { ref } from "vue"
import { ElMessage } from 'element-plus'
import { h } from 'vue'
import { storage } from '@/utils/storage'

const router = useRouter()
const username = ref('')
const password = ref('')

async function onLoginBtnClick() {
  const data = {
    username: username,
    password: password
  }
  try {
    const response = await api.userLogin(username.value, password.value)
    // const response = await request.post<number>('/user/login', data)
    switch (response.data.code) {
      case 500: {
        const userId = response.data.result
        const user = await (await api.queryUser(userId)).data.result 
        storage.set('userId', userId)
        storage.set('username', user.username)
        storage.set('userInfo', JSON.stringify(user))
        ElMessage({
          message: h('p', { style: 'line-height: 1; font-size: 14px' }, [
            h('span', null, '登录成功:> ')
          ]),
        })
        router.push({
          path: '/home'
        })
        break
      }
      case 701: {
        ElMessage({
          message: h('p', { style: 'line-height: 1; font-size: 14px' }, [
            h('span', null, '账户不存在:> ')
          ]),
        })
        router.push('/login')
        break
      }
      case 702: {
        ElMessage({
          message: h('p', { style: 'line-height: 1; font-size: 14px' }, [
            h('span', null, '密码错误:> ')
          ]),
        })
        router.push('/login')
        break
      }
    }
  } catch (error) {
    
  }
}

function onRegisterBtnClick() {
  router.push({path: '/register'})
}


let firefiyLookingUsername = ref(true)
let firefiyLookingPassword = ref(false)
let firefiyLookingLogin = ref(false)

function onPasswordInputFocus() {
  firefiyLookingPassword.value = true
  firefiyLookingLogin.value = false
  firefiyLookingUsername.value = false
}

function onUsernameInputFocus() {
  firefiyLookingPassword.value = false
  firefiyLookingLogin.value = false
  firefiyLookingUsername.value = true
}

function onSubmitBtnHover() {
  firefiyLookingPassword.value = false
  firefiyLookingLogin.value = true
  firefiyLookingUsername.value = false
}

function onInputBlur() {
  console.log(username.value.length)
  console.log(password.value.length)
  if (username.value.length == 0) {
    
    firefiyLookingUsername.value = true
    firefiyLookingLogin.value = false
    firefiyLookingPassword.value = false
  } else if (password.value.length == 0) {
    firefiyLookingUsername.value = false
    firefiyLookingLogin.value = false
    firefiyLookingPassword.value = true
  } else {
    firefiyLookingPassword.value = false
    firefiyLookingLogin.value = true
    firefiyLookingUsername.value = false  
  }
  console.log("firefiyLookingUsername: " + firefiyLookingUsername.value)
  console.log("firefiyLookingPassword: " + firefiyLookingPassword.value)
  console.log("firefiyLookingLogin: " + firefiyLookingLogin.value)
}

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
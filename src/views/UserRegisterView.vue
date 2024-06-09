<template>
<div class="container">
  <div class="card">
    <div class="header">
      <img src="https://placehold.co/50" alt="Google Logo">
      <h1>创建 FireFly-Lib 账号</h1>
    </div>
    <div class="form-group">
      <router-view :user="user" v-slot="{ Component, route }" >
        <Transition name="slide-fade" mode="out-in">
          <component :is="Component" :key="route.path"/>
        </Transition>
      </router-view>
      <!-- <NameGenderInputBox></NameGenderInputBox> -->
    </div>

  </div>
</div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { User } from '@/type'
import NameGenderInputBox from '@/views/NameGenderInputBox.vue'
import router from '@/router';

const user: User = {
  id: -1,
  email: 'Unknow',
  gender: 'Unknow',
  name: 'Unknow',
  password: 'Unknow',
  phone: 'Unknow',
  username: 'Unknow'
}

setTimeout(() => {
  router.push({name: 'input-name-gender'})
  // router.push({name: 'input-email-phone'})
}, 500)

// function onNextBtnClick() {
  
// }
// const ref nameGenderComp = ref('')
// const ref nameGenderComp = ref('')
</script>

<style scoped>

/*
  进入和离开动画可以使用不同
  持续时间和速度曲线。
*/
.slide-fade-enter-active {
  transition: all 0.7s ease;
}

.slide-fade-leave-active {
  transition: all 0.3s cubic-bezier(1, 0.6, 0.6, 1);
}

.slide-fade-enter-from,
.slide-fade-leave-to {
  transform: translateX(20px);
  opacity: 0;
}

.slide-fade-enter-to,
.slide-fade-leave-from {
  opacity: 1;
}

.container {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background-color: #f4f4f5;
}

.container.dark {
  background-color: #292524;
}

.card {
  background-color: #ffffff;
  padding: 2rem;
  border-radius: 1.675rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1), 0 1px 2px rgba(0, 0, 0, 0.06);
  width: 100%;
  max-width: 28rem;
}

.card.dark {
  background-color: #1f2937;
}

.header {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 1rem;
}

.header img {
  margin-bottom: 1rem;
}

.header h1 {
  font-size: 1.125rem;
  font-weight: 600;
  color: #374151;
  margin-bottom: 0.5rem;
}

.header h1.dark {
  color: #e5e7eb;
}

.header p {
  color: #4b5563;
}

.header p.dark {
  color: #9ca3af;
}

.form-group {
  align-self: center;
  margin-bottom: 1rem;
}

.form-group label {
  color: #4b5563;
}

.form-group label.dark {
  color: #9ca3af;
}

.form-group el-input {
  margin-top: 0.25rem;
  width: 100%;
  padding: 0.5rem;
  background-color: #ffffff;
  border: 1px solid #d1d5db;
  border-radius: 0.125rem;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
  outline: none;
  transition: all 0.3s ease-in-out;
  font-size: 0.875rem;
}

.form-group input:focus {
  border-color: #3b82f6;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
}

.form-actions button {
  background-color: #3b82f6;
  color: #ffffff;
  padding: 0.5rem;
  border-radius: 0.125rem;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
  cursor: pointer;
  transition: all 0.3s ease-in-out;
  outline: none;
}

.form-actions button:hover {
  background-color: #2563eb;
}
</style>
<template>
<div class="container">
  <div class="right-div">
      1123
  </div>
  <div class="card">
    <div class="header">
      <img src="https://placehold.co/50" alt="Google Logo">
      <h1>创建 FireFly-Lib 账号</h1>
    </div>
    <div class="form-group">
      <router-view :user="user" v-slot="{ Component}" >
        <Transition mode="out-in"
        enter-active-class="animate__animated animate__slideInRight" 
        leave-active-class="animate__animated animate__slideOutLeft">
          <component :is="Component"/>
        </Transition>
      </router-view>
      <!-- <NameGenderInputBox></NameGenderInputBox> -->
    </div>
  </div>
  <div class="right-div">
      1123
  </div>
</div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { User } from '@/type'
import NameGenderInputBox from '@/views/NameGenderInputBox.vue'
import router from '@/router';
import 'animate.css'

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
}, 100)

// function onNextBtnClick() {
  
// }
// const ref nameGenderComp = ref('')
// const ref nameGenderComp = ref('')
</script>

<style scoped>

.container {
  /* display: grid;
  grid-template-columns: auto 1fr; */
  /* display: flex; */
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background-color: #f4f4f5;
}

.container.dark {
  background-color: #292524;
}

.right-div {
    padding: 2rem;
    background-color: #f4f4f5;
    color: white;
    text-align: center;
    border-radius: 1.675rem;
    height: 50vh;
    /* width: 30vh; */
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 2;
}

.card {
  display: flex;
  flex: 2;
  background-color: #ffffff;
  padding: 2rem;
  padding-left: 0;
  border-radius: 1.675rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1), 0 1px 2px rgba(0, 0, 0, 0.06);
  /* width: 40vh; */
  height: 50vh;
  /* max-width: 40rem; */
  max-height: 30rem;
}

.card.dark {
  background-color: #1f2937;
}

.header {
  background-color: #ffffff;
  display: flex;
  flex: 2;
  flex-direction: column;
  align-items: center;
  margin-top: 3rem;
  /* margin-left: 0.5rem; */
  margin-bottom: 1rem;
  z-index: 2;
}

.header img {
  margin-bottom: 1rem;
}

.header h1 {
  font-size: 1.125rem;
  font-weight: 600;
  color: #374151;
  margin-left: 0.6rem;
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
  z-index: 1;
  align-self: center;
  margin-left: -1.2rem;
  margin-top: 5rem;
  margin-bottom: 1rem;
}

/* .form-group label {
  color: #4b5563;
}

.form-group label.dark {
  color: #9ca3af;
} */

/* .form-group el-input {
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
} */

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
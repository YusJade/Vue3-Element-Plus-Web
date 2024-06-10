<template>
  <div>
    <MultiInputBox 
    :inputParams="[usernameConfig, passwordConfig]">
    </MultiInputBox>
    <div class="form-actions">
        <el-button type="primary" @click="onNextBtnClick">注册</el-button>
    </div>
  </div>
  </template>
    
    <script lang="ts" setup>
    import MultiInputBox from '@/components/MultiInputBox.vue'
    import { InputConfig }  from '@/components/MultiInputBox.vue'
    import { User } from '@/type';
    import { Ref, ref } from 'vue';
    import router from '@/router';
    import { api } from '@/https'
    
    const props = defineProps<{ user: User }>()
   
    const usernameConfig = ref<InputConfig>({
      vModel: '',
      placeholder: '您的用户名',
      label: '用户名',
    })
    const passwordConfig = ref<InputConfig>({
      vModel: '',
      placeholder: '您的联系密码',
      label: '密码',
    })
    
    async function onNextBtnClick() {
      props.user.username = usernameConfig.value.vModel 
      props.user.password = passwordConfig.value.vModel
      const response = await api.userRegister(props.user)
      switch (response.data.code) {
        case 401:
          break;
        case 400:
          break;
        case 500:
          break;
      }
      // console.log(response)
      // router.push({name: 'input-name-gender'})
      // router.push({ path: '' })
    }
    
    const genderOptions = [
      {
        label: '男',
        value: '男',
      },
      {
        label: '女',
        value: '女',
      },
    ]
    
    </script>
    
    <style>
    .form-actions button {
      margin-top: 2rem;
      background-color: #3b82f6;
      color: #ffffff;
      padding: 0.5rem;
      border-radius: 0.125rem;
      box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
      cursor: pointer;
      transition: all 0.3s ease-in-out;
      outline: none;
    }
    .form-actions {
      display: flex;
      justify-content: flex-end;
    }
    </style>
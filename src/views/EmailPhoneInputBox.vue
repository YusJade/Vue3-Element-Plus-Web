<template>
  <div>
    <MultiInputBox :inputParams="[emailConfig, phoneConfig]">
    </MultiInputBox>
    <div class="form-actions">
      <el-button type="primary" @click="onNextBtnClick">下一步</el-button>
    </div>
  </div>
</template>

<script lang="ts" setup>
import MultiInputBox from '@/components/MultiInputBox.vue'
import { type InputConfig } from '@/components/MultiInputBox.vue'
import { type User } from '@/type';
import { ref } from 'vue';
import router from '@/router';

const props = defineProps<{ user: User }>()

const emailConfig = ref<InputConfig>({
  vModel: '',
  placeholder: '您的邮箱',
  label: '邮箱',
})
const phoneConfig = ref<InputConfig>({
  vModel: '',
  placeholder: '您的联系电话',
  label: '联系电话',
})

function onNextBtnClick() {
  props.user.email = emailConfig.value.vModel
  props.user.phone = phoneConfig.value.vModel
  router.push({ name: 'input-username-password' })
  // router.push({ path: '' })
}


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
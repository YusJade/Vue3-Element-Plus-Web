<template>
  <div>
    <MultiInputBox :inputParams="[nameConfig]">
      <label style="text-align: right; width: 6rem; margin-top: 0.7rem">您的性别</label>
      <el-select v-model="gender" style=" margin-left: auto;
    flex: 1;
    width: 15rem;
    padding: 0.5rem;
    font-size: 0.875rem;">
        <el-option v-for="option in genderOptions" :key="option.value"
                   :value="option.value" :label="option.label">
        </el-option>
      </el-select>
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

const gender = ref('')
const nameConfig = ref<InputConfig>({
  vModel: '',
  placeholder: '您的姓名',
  label: '姓名',
})

function onNextBtnClick() {
  props.user.gender = gender.value
  props.user.name = nameConfig.value.vModel
  router.push({ name: 'input-email-phone' })
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
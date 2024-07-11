<template>
  <div class="mb-2">
    <label v-if="label" :for="id" class="font-semibold text-gray-700">{{ label }}</label>
    <el-input
      v-model="inputValue"
      :size="size"
      :type="type"
      :placeholder="placeholder"
      :clearable="clearable"
      :show-password="showPassword"
    />
    <span v-if="errorMessage" class="font-semibold text-gray-500 flex">
      <el-icon><circle-close color="red" style="margin-right: 2px" /></el-icon>
      {{ errorMessage }}
    </span>
    <span v-if="successMessage" class="font-semibold text-gray-500 flex">
      <el-icon><CircleCheck color="green" style="margin-right: 2px" /></el-icon>
      {{ label + successMessage }}
    </span>
  </div>
</template>

<script lang="ts" setup>
import { ref, watch } from 'vue';
import { ElInput, ElIcon } from 'element-plus';
import { CircleClose } from '@element-plus/icons-vue';
import { error } from 'console';

const props = withDefaults(defineProps<{
  label: string;
  type?: string;
  id: string;
  modelValue: string;
  placeholder?: string;
  clearable: boolean;
  size?: string;
  showPassword?: boolean;
  // 验证方法，默认不作验证
  validate: (value: string) => string
}>(), {
  validate: (value) => '',
  showPassword: false
});

const emit = defineEmits(['update:modelValue', 'on-validate']);

const inputValue = ref(props.modelValue);
const errorMessage = ref('');
const successMessage = ref('');

watch(inputValue, (newValue) => {
  emit('update:modelValue', newValue);
  validateInput(newValue);
});

const validateInput = (value: string) => {
  errorMessage.value = props.validate(value) || '';
  successMessage.value = errorMessage.value == '' ? '有效' : ''; 
  emit('on-validate', props.id, errorMessage.value == '')
};
</script>

<style scoped>
.font-semibold {
  font-weight: 600;
}
.text-gray-700 {
  color: #4a5568;
}
.text-gray-500 {
  color: #a0aec0;
}

.flex {
  display: flex;
  align-items: center;
}
</style>

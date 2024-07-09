<template>
  <div class="mb-4">
    <label v-if="label" :for="id" class="font-semibold text-gray-700">{{ label }}</label>
    <el-input
      v-model="inputValue"
      :size="size"
      :type="type"
      :placeholder="placeholder"
      :clearable="clearable"
    />
    <span v-if="errorMessage" class="font-semibold text-gray-500">
      <el-icon>
        <circle-close color="red" style="margin-top: 0px" />
      </el-icon>
      {{ errorMessage }}
    </span>
  </div>
</template>

<script lang="ts" setup>
import { ref, watch } from 'vue';
import { ElInput, ElIcon } from 'element-plus';
import { CircleClose } from '@element-plus/icons-vue';

const props = defineProps<{
  label: string;
  type?: string;
  id: string;
  modelValue: string;
  placeholder?: string;
  clearable?: boolean;
  size?: string;
  validate: (value: string) => string;
}>();

const emit = defineEmits(['update:value']);

const inputValue = ref(props.modelValue);
const errorMessage = ref('');

watch(inputValue, (newValue) => {
  emit('update:value', newValue);
  validateInput(newValue);
});

const validateInput = (value: string) => {
  errorMessage.value = props.validate(value) || '';
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
</style>

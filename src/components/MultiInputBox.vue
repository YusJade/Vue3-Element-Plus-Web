<template>
  <el-form>
    <template v-for="param in inputParams">
      <div style="display: flex;">
        <label style="text-align: right; width: 6rem; margin-top: 0.7rem">{{ param.label }}</label>
        <el-input 
        style=" margin-left: auto;
                flex: 1;
                width: 15rem;
                padding: 0.5rem;
                font-size: 0.875rem;" 
                v-model="param.vModel" :placeholder="param.placeholder"/>
      </div>
    </template>
    <div style="display: flex;">
      <slot></slot>
    </div>
  </el-form>  
</template>

<script lang="ts" setup>
import { Ref, ref } from 'vue';

interface InputConfig  {
  vModel: string,
  placeholder: string,
  label: string
}

defineProps({
  inputParams: Array<InputConfig>
})

defineEmits(['name', ''])
</script>

<style scoped>



</style>

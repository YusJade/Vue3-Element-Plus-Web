<template>
  <ElDialog :title="props.dialogTitle" style=" font-weight: bolder;" width="400"
            v-model="visable">
    <div style="margin-bottom: 12px;">
      <template v-for=" item in props.propertyConfigs">

        <div v-if="item.unchangeable" style="margin-bottom: 10px;">
          <span style="margin-bottom: 10px; font-weight: bold;"> {{ item.label }} </span>
          此项不可修改
        </div>
        <div v-else-if="item.datepicker" style="margin-bottom: 10px;">
          <div class="block">
            <span style="margin-bottom: 10px; font-weight: bold;"> {{ item.label }}
            </span>
            <div>
              <el-date-picker v-model="edit[item.key]" type="date" placeholder="选择日期"
                              size="default" />
            </div>
          </div>
        </div>
        <div v-else-if="item.options" style="margin-bottom: 10px;">
          <span style="margin-bottom: 10px; font-weight: bold;"> {{ item.label }} </span>
          <div>
            <el-select v-model="edit[item.key]" :placeholder="item.placeholder"
                       size="default" style="width: 240px">
              <el-option v-for="option in item.options.value" :key="option.value"
                         :label="option.key" :value="option.value" />
            </el-select>
          </div>
        </div>
        <div v-else style="margin-bottom: 10px;">
          <span style="margin-bottom: 10px; font-weight: bold;"> {{ item.label }} </span>
          <div v-if="item.numberInput">
            <el-input-number v-model="edit[item.key]" :min="0" controls-position="right"
                             class="">
            </el-input-number>
          </div>
          <el-input v-else v-model="edit[item.key]"
                    :placeholder="item.placeholder"></el-input>
        </div>
      </template>
    </div>
    <el-button type="primary" @click="onOkBtnClicked">{{ props.okBtnText }}</el-button>
    <el-button type="info" @click="onNoBtnClicked">{{
      props.noBtnText }}</el-button>
  </ElDialog>

</template>

<script lang="ts" setup>
import { Message } from '@/utils/message';
import { ElInputNumber } from 'element-plus';
import { onMounted, Ref, toRef } from 'vue';

/**
 * TODO:数据与配置分离
 */
export interface EditPropertyConfig {
  key: string,
  label: string,
  placeholder: string,
  numberInput?: boolean,
  options?: Ref<Array<{ key, value }>>
  unchangeable?: boolean,
  datepicker?: boolean
}


export interface EditDialogConfig {
  /** 被编辑的对象 ref */
  // objEdited: Ref<unknown>,
  modelValue?: Ref<unknown>,
  // 既能由子组件控制，又能有父组件控制
  isVisable?: Ref<boolean>, // ?将Ref传递给Eldialog
  dialogTitle: string,
  okBtnText: string,
  noBtnText: string,
  /** 确认按钮点击时触发的回调 */
  onOkBtnClicked: (obj: unknown) => void,
  /** 否认按钮点击时触发的回调 */
  onNoBtnClicked: (obj: unknown) => void,
  /** 配置被编辑对象中的各个属性 */
  propertyConfigs: Array<EditPropertyConfig>,
}

const edit = defineModel('edit')
const visable = defineModel("visable")

const props = withDefaults(defineProps<EditDialogConfig>(), {
  dialogTitle: "这是个标题~",
  noBtnText: "取消",
  okBtnText: "确定",
  onNoBtnClicked(obj) {
    Message('来自组件：你点了一下 noBtn ~')
  },
  onOkBtnClicked(obj) {
    Message('来自组件：你点了一下 okBtn ~')
  },
});

</script>
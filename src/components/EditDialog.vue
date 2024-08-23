<template>
  <ElDialog :title="props.dialogTitle" style=" font-weight: bolder;" width="400"
            v-model="props.visableCtl.value">
    <div style="margin-bottom: 12px;">
      <template v-for=" item in props.propertyConfigs">

        <div v-if="item.unchangeable" style="margin-bottom: 10px;">
          <span style="margin-bottom: 10px; font-weight: bold;"> {{ item.label }} </span>
          此项不可修改
        </div>
        <div v-else-if="item.options" style="margin-bottom: 10px;">
          <span style="margin-bottom: 10px; font-weight: bold;"> {{ item.label }} </span>
          <div>
            <el-select v-model="props.modelValue[item.key]" placeholder="选择分类"
                       size="medium" style="width: 240px">
              <el-option v-for="option in item.options.value" :key="option.value"
                         :label="option.key" :value="option.value" />
            </el-select>
          </div>
        </div>
        <div v-else style="margin-bottom: 10px;">
          <span style="margin-bottom: 10px; font-weight: bold;"> {{ item.label }} </span>
          <div v-if="item.numberInput">
            <el-input-number v-model="props.modelValue[item.key]" :min="0"
                             controls-position="right" class="">
            </el-input-number>
          </div>
          <el-input v-else v-model="props.modelValue[item.key]"
                    :placeholder="item.placeholder"></el-input>
        </div>
      </template>
    </div>
    <el-button type="primary" @click="onOkBtnClicked">{{ props.okBtnText }}</el-button>
    <el-button type="info" @click="onNoBtnClicked; console.log(props.modelValue)">{{
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
}


export interface EditDialogConfig {
  /** 被编辑的对象 ref */
  // objEdited: Ref<unknown>,
  modelValue?: unknown,
  visableCtl: Ref<boolean>, // 将Ref传递给Eldialog
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
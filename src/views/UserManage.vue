<template>
  <ElDialog v-model="editDialogVisable" title="编辑库存信息" width="400">
    <div style="margin-bottom: 12px;">
      <ValidatedInput label="用户名" id="username" v-model="userInfoSelected.username" placeholder="用户名" clearable="true"
        :validate="validateUsername" @on-validate="handleOnValidate" />
      <ValidatedInput label="邮箱" id="email" v-model="userInfoSelected.email" placeholder="邮箱" :clearable="true"
        :validate="validateEmail" @on-validate="handleOnValidate" />
      <ValidatedInput label="电话（可选）" id="phone" v-model="userInfoSelected.phone" placeholder="电话" :clearable="true"
        :validate="validatePhone" @on-validate="handleOnValidate" />
      <ValidatedInput label="姓名（可选）" id="name" v-model="userInfoSelected.name" placeholder="姓名" :clearable="true" />
      <div class="mb-2">
        <label for="username" class="block font-semibold text-gray-700">性别</label>
        <el-select v-model="userInfoSelected.gender" size="middle" style="width: 240px" placeholder="性别">
          <el-option v-for="item in genderOptions" :key="item.value" :label="item.label" :value="item.value" />
        </el-select>
      </div>
      <ValidatedInput label="密码" id="password" v-model="userInfoSelected.password" placeholder="密码" :clearable="true"
        :validate="validatePassword" @on-validate="handleOnValidate" :show-password="true" />
    </div>
    <el-button type="primary" @click="saveUserEdit">保存</el-button>
    <el-button type="info" @click="editDialogVisable = false">取消</el-button>
  </ElDialog>
  <TableC v-bind="tableConfig">
  </TableC>
</template>

<script lang="ts" setup>
import TableC from '@/components/TableC.vue'
import { TableConfigInterface } from '@/components/TableC.vue'
import request, { updateUserInfo } from '@/https'
import { Book, BookInventory, User } from '@/type'
import dateUtils from '@/utils/date'
import { Message } from '@/utils/message'
import { computed, onMounted, ref, toRaw } from 'vue'
import ValidatedInput from '@/components/ValidatedInput.vue'
import { validateUsername, validateEmail, validatePassword, validatePhone } from '@/utils/validator'

// 初始化验证状态对象
let validationState = ref({
  email: false,
  username: false,
  phone: false,
  password: false,
});
let editDialogVisable = ref<boolean>(false)
let userInfoSelected = ref<User>()
const isValidState = computed(() => {
  // console.info(Object.values(validationState.value))
  return !Object.values(validationState.value).some(isValid => { return isValid == false })
})
const genderOptions = [
  {
    value: "男",
    label: "男",
  },
  {
    value: "女",
    label: "女",
  },
]
const tableConfig: TableConfigInterface = {
  api: '/user/list',
  columns: [
    {
      prop: 'userId',
      label: '用户编号',
    },
    {
      prop: 'permissionName',
      label: '权限',
      formatter: (col: string) => {
        return col || "暂无"
      }
    },
    {
      prop: 'username',
      label: '用户名',
    },
    {
      prop: 'password',
      label: '密码',
    },
    {
      prop: 'gender',
      label: '性别',
    },
    {
      prop: 'name',
      label: '姓名',
    },
    {
      prop: 'email',
      label: '邮箱',
    },
    {
      prop: 'phone',
      label: '电话',
    },
    {
      prop: 'createdAt',
      label: '注册日期',
      formatter: (date: string) => {
        return dateUtils.formatDateFromStr(date)
      }
    },
  ],
  operation: {
    columns: [
      {
        click: (row: User) => {
          userInfoSelected.value = toRaw(row)
          editDialogVisable.value = true
          Message('编辑用户信息')
        },
        text: '编辑',
        // icon: '', 
        type: 'primary'
      },
      {
        click: () => { },
        text: '删除',
        type: 'danger'
      },
    ]
  }
}

const saveUserEdit = async () => {
  const respone = await updateUserInfo(userInfoSelected.value.userId.toString(), userInfoSelected.value);
  Message(respone.data.msg)
  if (respone.data.code == 1) {
    editDialogVisable.value = false
  }
}

const handleOnValidate = (field: string, isValid: boolean) => {
  // console.log(field)
  // console.info(validationState[field], validationState[data.field])
  validationState.value[field] = isValid;
  // console.info(isValidState.value, validationState.value)
}

</script>

<style></style>
<template>
  <ElDialog v-model="isUpdateDialogVisable" title="编辑用户信息" width="400">
    <div style="margin-bottom: 12px;">
      <ValidatedInput label="用户名" id="username" v-model="userSelected.username"
                      placeholder="用户名" :clearable="true" :validate="validateUsername"
                      @on-validate="handleOnValidate" />
      <ValidatedInput label="邮箱" id="email" v-model="userSelected.email" placeholder="邮箱"
                      :clearable="true" :validate="validateEmail"
                      @on-validate="handleOnValidate" />
      <ValidatedInput label="电话（可选）" id="phone" v-model="userSelected.phone"
                      placeholder="电话" :clearable="true" :validate="validatePhone"
                      @on-validate="handleOnValidate" />
      <ValidatedInput label="姓名（可选）" id="name" v-model="userSelected.name"
                      placeholder="姓名" :clearable="true" />
      <div class="mb-2">
        <label for="username" class="block font-semibold text-gray-700">性别</label>
        <el-select v-model="userSelected.gender" size="middle" style="width: 240px"
                   placeholder="性别">
          <el-option v-for="item in genderOptions" :key="item.value" :label="item.label"
                     :value="item.value" />
        </el-select>
      </div>
      <ValidatedInput label="密码" id="password" v-model="userSelected.password"
                      placeholder="密码" :clearable="true" :validate="validatePassword"
                      @on-validate="handleOnValidate" :show-password="true" />
    </div>
    <el-button type="primary" @click="saveUserEdit">保存</el-button>
    <el-button type="info" @click="isUpdateDialogVisable = false">取消</el-button>
  </ElDialog>
  <ElDialog v-model="isAddDialogVisable" title="添加用户信息" width="400">
    <div style="margin-bottom: 12px;">
      <ValidatedInput label="用户名" id="username" v-model="userAdded.username"
                      placeholder="用户名" :clearable="true" :validate="validateUsername"
                      @on-validate="handleOnValidate" />
      <ValidatedInput label="邮箱" id="email" v-model="userAdded.email" placeholder="邮箱"
                      :clearable="true" :validate="validateEmail"
                      @on-validate="handleOnValidate" />
      <ValidatedInput label="电话（可选）" id="phone" v-model="userAdded.phone" placeholder="电话"
                      :clearable="true" :validate="validatePhone"
                      @on-validate="handleOnValidate" />
      <ValidatedInput label="姓名（可选）" id="name" v-model="userAdded.name" placeholder="姓名"
                      :clearable="true" />
      <div class="mb-2">
        <label for="username" class="block font-semibold text-gray-700">性别</label>
        <el-select v-model="userAdded.gender" size="middle" style="width: 240px"
                   placeholder="性别">
          <el-option v-for="item in genderOptions" :key="item.value" :label="item.label"
                     :value="item.value" />
        </el-select>
      </div>
      <ValidatedInput label="密码" id="password" v-model="userAdded.password"
                      placeholder="密码" :clearable="true" :validate="validatePassword"
                      @on-validate="handleOnValidate" :show-password="true" />
    </div>
    <el-button type="primary" @click="addUserInfo">保存</el-button>
    <el-button type="info" @click="isAddDialogVisable = false">取消</el-button>
  </ElDialog>
  <div class="flex items-center justify-between bg-primary p-2">
    <div class="flex items-center">
      <el-input placeholder="搜索" />
      <el-button type="primary">搜索</el-button>
      <el-button type="success" @click="isAddDialogVisable = true">新增</el-button>
    </div>
  </div>
  <TableC v-bind="tableConfig">
  </TableC>
</template>

<script lang="ts" setup>
import TableC from '@/components/TableC.vue'
import { TableConfigInterface } from '@/components/TableC.vue'
import { updateUserInfo, userRegister } from '@/api/user'
import { Book, BookInventory, User } from '@/type'
import dateUtils from '@/utils/date'
import { Message } from '@/utils/message'
import { computed, onMounted, reactive, ref, toRaw } from 'vue'
import ValidatedInput from '@/components/ValidatedInput.vue'
import { validateUsername, validateEmail, validatePassword, validatePhone } from '@/utils/validator'

// 初始化验证状态对象
let validationState = ref({
  email: false,
  username: false,
  phone: false,
  password: false,
})

let isUpdateDialogVisable = ref<boolean>(false)
let isAddDialogVisable = ref<boolean>(false)

let userAdded = ref<User>({
  username: '',
  userId: -1,
  email: '',
  gender: '男',
  name: '',
  password: '',
  phone: '',
})
let userSelected = ref<User>()

// const isValidState = computed(() => {
//   // console.info(Object.values(validationState.value))
//   return !Object.values(validationState.value).some(isValid => { return isValid == false })
// })
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
          // 浅拷贝
          userSelected.value = reactive({ ...toRaw(row) })
          isUpdateDialogVisable.value = true
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
  const response = await updateUserInfo(userSelected.value.userId.toString(), userSelected.value);
  Message(response.data.msg)
  if (response.data.code == 1) {
    isUpdateDialogVisable.value = false
  }
}

const addUserInfo = async () => {
  const response = await userRegister(userAdded.value)
  Message(response.data.msg)
  if (response.data.code == 1) {
    isAddDialogVisable.value = false
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
<template>
  <EditDialog v-bind="updateDialogConfig">
  </EditDialog>
  <EditDialog v-bind="addDialogConfig">
  </EditDialog>
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
import EditDialog, { EditDialogConfig } from '@/components/EditDialog.vue'
import TableC from '@/components/TableC.vue'
import { TableConfigInterface } from '@/components/TableC.vue'
import request, { updateUserInfo, updateBorrowRecord, removeBorrowRecord, updatePermission, addPermission, removePermission } from '@/https'
import { Book, BookInventory, User, Borrow, Permission } from '@/type'
import dateUtils from '@/utils/date'
import { Message } from '@/utils/message'
import { computed, onMounted, ref, toRaw } from 'vue'
import ValidatedInput from '@/components/ValidatedInput.vue'
import { validateUsername, validateEmail, validatePassword, validatePhone } from '@/utils/validator'
import { useRouter } from 'vue-router'

// 初始化验证状态对象
// let validationState = ref({
//   email: false,
//   username: false,
//   phone: false,
//   password: false,
// });
let isUpdateDialogVisable = ref<boolean>(false)
let isAddDialogVisable = ref<boolean>(false)

let permissionSelected = ref<Permission>()
let permissionAdded = ref<Permission>({
  permissionName: '',
  permissionDesc: '',
  maxBorrowDay: 0,
  maxBorrowBooks: 0,
})

const tableConfig: TableConfigInterface = {
  api: '/permission/list',
  columns: [
    {
      prop: 'permissionName',
      label: '权限名',
    },
    {
      prop: 'permissionDesc',
      label: '权限描述',
      // formatter: (col: string) => {
      //   return col || "暂无"
      // }
    },
    {
      prop: 'maxBorrowDay',
      label: '最长借阅天数',
    },
    {
      prop: 'maxBorrowBooks',
      label: '最多可同时借阅数',
    },
    // {
    //   prop: '',
    //   label: '',
    // },
  ],
  operation: {
    columns: [
      {
        click: (row: Permission) => {
          permissionSelected.value = toRaw(row)
          isUpdateDialogVisable.value = true
          Message('编辑权限')
        },
        text: '编辑',
        // icon: '', 
        type: 'primary'
      },
      {
        click: (row: Permission) => {
          removePermission(row.permissionName)
          Message('删除权限')
          window.location.reload()
        },
        text: '删除',
        type: 'danger'
      },
    ]
  }
}

const addDialogConfig: EditDialogConfig = {
  visableCtl: isAddDialogVisable,
  objEdited: permissionAdded,
  dialogTitle: "添加权限~",
  noBtnText: "取消",
  okBtnText: "确定",
  onOkBtnClicked(obj) {
    addPermission(permissionAdded.value).catch((error) => {
      Message(error)
    }).then((response) => {
      if (response && response.data) {
        Message(response.data.msg)
        if (response.data.code == 1) {
          isAddDialogVisable.value = false
        }
      }
    })
  },
  onNoBtnClicked(obj) {
    isAddDialogVisable.value = false
  },
  propertyConfigs: [
    {
      key: "permissionName",
      label: "权限名",
      placeholder: "",
    },
    {
      key: "permissionDesc",
      label: "权限描述",
      placeholder: "",
    },
    {
      key: "maxBorrowDay",
      label: "最大借阅天数",
      placeholder: "",
      numberInput: true,
    },
    {
      key: "maxBorrowBooks",
      label: "最大同时借阅本数",
      placeholder: "",
      numberInput: true,
    }
  ]
}

const updateDialogConfig: EditDialogConfig = {
  visableCtl: isUpdateDialogVisable,
  objEdited: permissionSelected,
  dialogTitle: "修改权限~",
  noBtnText: "取消",
  okBtnText: "确定",
  onOkBtnClicked(obj) {
    updatePermission(permissionSelected.value.permissionName, permissionSelected.value).catch((error) => {
      Message(error)
    }).then((response) => {
      if (response && response.data) {
        Message(response.data.msg)
        if (response.data.code == 1) {
          isUpdateDialogVisable.value = false
        }
      }
    })
  },
  onNoBtnClicked(obj) {
    isUpdateDialogVisable.value = false
  },
  propertyConfigs: [
    {
      key: "permissionName",
      label: "权限名",
      placeholder: "",
      unchangeable: true,
    },
    {
      key: "permissionDesc",
      label: "权限描述",
      placeholder: "",
    },
    {
      key: "maxBorrowDay",
      label: "最大借阅天数",
      placeholder: "",
      numberInput: true,
    },
    {
      key: "maxBorrowBooks",
      label: "最大同时借阅本数",
      placeholder: "",
      numberInput: true,
    }
  ]
}

const savePermissionEdit = async () => {
  const respone = await updatePermission(permissionSelected.value.permissionName, permissionSelected.value);
  Message(respone.data.msg)
  if (respone.data.code == 1) {
    isUpdateDialogVisable.value = false
  }
}

const handleOnValidate = (field: string, isValid: boolean) => {
  // console.log(field)
  // console.info(validationState[field], validationState[data.field])
  // validationState.value[field] = isValid;
  // console.info(isValidState.value, validationState.value)
}

</script>
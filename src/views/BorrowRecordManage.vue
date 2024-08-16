<template>
  <ElDialog v-model="editDialogVisable" title="编辑历史记录" width="400">
    <div style="margin-bottom: 12px;">
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
import request, { updateUserInfo, updateBorrowRecord, removeBorrowRecord } from '@/https'
import { Book, BookInventory, User, Borrow } from '@/type'
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
let editDialogVisable = ref<boolean>(false)
let recordInfoSelected = ref<Borrow>()
// const isValidState = computed(() => {
//   // console.info(Object.values(validationState.value))
//   return !Object.values(validationState.value).some(isValid => { return isValid == false })
// })
// const genderOptions = [
//   {
//     value: "男",
//     label: "男",
//   },
//   {
//     value: "女",
//     label: "女",
//   },
// // ]
// +--------------------+----------+------+-----+-------------------+-------------------+
// | Field              | Type     | Null | Key | Default           | Extra             |
// +--------------------+----------+------+-----+-------------------+-------------------+
// | record_id          | bigint   | NO   | PRI | NULL              | auto_increment    |
// | user_id            | bigint   | NO   | MUL | NULL              |                   |
// | book_id            | bigint   | NO   | MUL | NULL              |                   |
// | borrow_date        | datetime | NO   |     | CURRENT_TIMESTAMP | DEFAULT_GENERATED |
// | ought_return_date  | datetime | YES  |     | NULL              |                   |
// | actual_return_date | datetime | YES  |     | NULL              |                   |
// +--------------------+----------+------+-----+-------------------+-------------------+
const tableConfig: TableConfigInterface = {
  api: '/borrow/list',
  columns: [
    {
      prop: 'recordId',
      label: '记录编号',
    },
    {
      prop: 'userId',
      label: '用户Id',
      // formatter: (col: string) => {
      //   return col || "暂无"
      // }
    },
    {
      prop: 'bookId',
      label: '书籍Id',
    },
    {
      prop: 'borrowDate',
      label: '借阅日期',
      formatter: (date: string) => {
        return dateUtils.formatDateFromStr(date)
      }
    },
    {
      prop: 'oughtReturnDate',
      label: '截止归还日期',
      formatter: (date: string) => {
        return dateUtils.formatDateFromStr(date)
      }
    },
    {
      prop: 'actualReturnDate',
      label: '实际归还日期',
      formatter: (date: string) => {
        return dateUtils.formatDateFromStr(date)
      }
    },
    // {
    //   prop: '',
    //   label: '',
    // },
  ],
  operation: {
    columns: [
      {
        click: (row: Borrow) => {
          recordInfoSelected.value = toRaw(row)
          editDialogVisable.value = true
          Message('编辑借阅记录')
        },
        text: '编辑',
        // icon: '', 
        type: 'primary'
      },
      {
        click: (row: Borrow) => {
          removeBorrowRecord(row.recordId)
          Message('删除借阅记录')
          window.location.reload()
        },
        text: '删除',
        type: 'danger'
      },
    ]
  }
}

const saveUserEdit = async () => {
  const respone = await updateBorrowRecord(recordInfoSelected.value.userId, recordInfoSelected.value);
  Message(respone.data.msg)
  if (respone.data.code == 1) {
    editDialogVisable.value = false
  }
}

const handleOnValidate = (field: string, isValid: boolean) => {
  // console.log(field)
  // console.info(validationState[field], validationState[data.field])
  // validationState.value[field] = isValid;
  // console.info(isValidState.value, validationState.value)
}

</script>
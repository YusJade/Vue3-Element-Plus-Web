<template>
  <div class="flex items-center justify-between bg-primary p-2">
    <div class="flex items-center">
      <el-input placeholder="搜索" prefix-icon="search" />
      <el-button type="success" @click="isAddDialogVisable = true"
                 style="margin-left: 10px;" size="small">新增</el-button>
    </div>
  </div>
  <EditDialog v-bind="updateDialogConfig" v-model:edit="recordSelected"
              v-model:visable="isUpdateDialogVisable"></EditDialog>
  <EditDialog v-bind="addDialogConfig" v-model:edit="recordAdded"
              v-model:visable="isAddDialogVisable"></EditDialog>
  <TableC v-bind="tableConfig">
  </TableC>
</template>

<script lang="ts" setup>
import TableC from '@/components/TableC.vue'
import { TableConfigInterface } from '@/components/TableC.vue'
import request from '@/https'
import { updateBorrowRecord, removeBorrowRecord, returnBorrowRecord, renewBorrowRecord, addBorrowRecord } from '@/api/borrow'
import { Book, BookInventory, User, Borrow } from '@/type'
import dateUtils from '@/utils/date'
import { Message } from '@/utils/message'
import { computed, onMounted, ref, toRaw } from 'vue'
import ValidatedInput from '@/components/ValidatedInput.vue'
import { validateUsername, validateEmail, validatePassword, validatePhone } from '@/utils/validator'
import { useRouter } from 'vue-router'
import EditDialog from '@/components/EditDialog.vue'
import { EditDialogConfig } from '@/components/EditDialog.vue'

let isUpdateDialogVisable = ref<boolean>(false)
let isAddDialogVisable = ref<boolean>(false)
let recordSelected = ref<Borrow>()
let recordAdded = ref<Borrow>()

const tableConfig: TableConfigInterface = {
  api: '/borrow/list',
  columns: [
    {
      prop: 'recordId',
      label: '记录编号',
      sortable: true,
    },
    {
      prop: 'userId',
      label: '用户编号',
      sortable: true,
      // formatter: (col: string) => {
      //   return col || "暂无"
      // }
    },
    {
      prop: 'bookId',
      label: '书籍编号',
      sortable: true,
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
          recordSelected.value = toRaw(row)
          isUpdateDialogVisable.value = true
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
      {
        isRefresh: true,
        click: (row: Borrow) => {
          returnBorrowRecord(row.recordId)
            .then((res) => {
              if (res && res.data) {
                Message(res.data.msg)
              }
            })
        },
        text: '已归还',
        // icon: 'sun',
        visible: (row: Borrow) => {
          row = toRaw(row)
          // console.info(row.actualReturnDate)
          return row.actualReturnDate == null
        },
      },
      {
        click: async (row: Borrow) => {
          Message('续借')
          row = toRaw(row)
          const response = await renewBorrowRecord(row.recordId)
          Message(response.data.msg)
        },
        text: '续借',
        // icon: 'sunrise',
        visible: (row: Borrow) => {
          row = toRaw(row)
          // console.info(row.actualReturnDate)
          return row.actualReturnDate == null
        }
      },
    ]
  }
}

const addDialogConfig: EditDialogConfig = {
  isVisable: isAddDialogVisable,
  /**
   * 直接传categoryAdded（ref） 与 
   * .value（ypeError: Cannot read properties of undefined (reading 'name')） 区别？
   * 后者疑似构造了一个新的对象
   */
  // objEdited: categoryAdded,
  dialogTitle: "添加借阅记录~",
  noBtnText: "取消",
  okBtnText: "确定",
  onOkBtnClicked(obj) {
    addBorrowRecord(recordAdded.value.userId, recordAdded.value.bookId).catch((error) => {
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
      key: "borrowDate",
      label: "借阅日期",
      placeholder: "",
      datepicker: true
    },
    {
      key: "oughtReturnDate",
      label: "截止日期",
      placeholder: "",
      datepicker: true
    },
    {
      key: "actualReturnDate",
      label: "归还日期",
      placeholder: "",
      datepicker: true
    },
  ]
}

const updateDialogConfig: EditDialogConfig = {
  isVisable: isUpdateDialogVisable,
  modelValue: recordSelected,
  dialogTitle: "修改借阅记录~",
  noBtnText: "取消",
  okBtnText: "确定",
  onOkBtnClicked(obj) {
    updateBorrowRecord(recordSelected.value.recordId, recordSelected.value).catch((error) => {
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
      key: "borrowDate",
      label: "借阅日期",
      placeholder: "",
      datepicker: true
    },
    {
      key: "oughtReturnDate",
      label: "截止日期",
      placeholder: "",
      datepicker: true
    },
    {
      key: "actualReturnDate",
      label: "归还日期",
      placeholder: "",
      datepicker: true
    },
  ]
}


</script>
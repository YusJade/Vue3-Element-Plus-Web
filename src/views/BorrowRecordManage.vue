<template>
  <div class="flex items-center justify-between bg-primary p-2">
    <div class="flex items-center">
      <el-input placeholder="搜索" prefix-icon="search" />
      <el-button type="success" @click="isAddDialogVisable = true; keywordInventory = ''"
                 style="margin-left: 10px;" size="default">新增</el-button>
    </div>
  </div>
  <el-dialog title="查询书库" v-model="isAddDialogVisable" width="800px">
    <div style="margin-bottom: 10px;">
      <el-input style="width: 270px; height: 30px;" v-model="keywordInventory"
                type="text" />
      <el-button style="height: 30px" color="#40E2A6" type="primary" plain
                 @click="searchInventory">
        搜索
      </el-button>
      <span style="margin-left: 18px; margin-right: 5px; font-size: medium;"> 用户</span>
      <el-select v-model="userSelected" placeholder="选择用户" size="default"
                 style="width: 240px">
        <el-option v-for="option in userOptions" :key="option.value" :label="option.key"
                   :value="option.value" />
      </el-select>
    </div>
    <transition name="fade">
      <div>
        <TableC v-bind="inventoryTableConfig"></TableC>
        <el-dialog v-model="inventoryDialogVisable" title="库存信息" width="400">
          <p>{{ latestViewInventory.bookTitle }}</p>
          <el-table :data="inventoryData">
            <el-table-column property="bookId" label="图书编号" width="100" />
            <el-table-column prop="isBorrowed" label="状态" width="100" :filters="[
              { text: '可借阅', value: false },
              { text: '不可用', value: true },
            ]" :filter-method="filterTag" filter-placement="bottom-end">
              <template #default="scope">
                <el-tag v-if="!scope.row.isBorrowed" type="success">
                  可借阅
                </el-tag>
                <el-tag v-else type="info">
                  不可用
                </el-tag>
              </template>
            </el-table-column>
            <el-table-column label="操作">
              <template #default="scope">
                <el-button type="primary" @click="borrow(scope.row)" size="small"
                           :disabled="isBorrowBtnDisabled(scope.row)">借阅</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-dialog>
      </div>
    </transition>
  </el-dialog>
  <EditDialog v-bind="updateDialogConfig" v-model:edit="recordSelected"
              v-model:visable="isUpdateDialogVisable"></EditDialog>
  <!-- <EditDialog v-bind="addDialogConfig" v-model:edit="recordAdded"
              v-model:visable="isInventoryDialogVisable">
  </EditDialog> -->
  <TableC v-bind="tableConfig">
    <template #username="{ row }">
      {{ userMap.get(row.userId) }}
    </template>
    <!-- <template #title="{ row }">
      {{ inventoryMap.get(row.inventoryId) }}
    </template> -->
  </TableC>
</template>

<script lang="ts" setup>
import TableC from '@/components/TableC.vue'
import { TableConfigInterface } from '@/components/TableC.vue'
import request from '@/https'
import { listBook } from '@/api/book'
import { updateBorrowRecord, removeBorrowRecord, returnBorrowRecord, renewBorrowRecord, addBorrowRecord } from '@/api/borrow'
import { type Book, type BookInventory, type Borrow, type InventoryPage } from '@/type'
import dateUtils from '@/utils/date'
import { Message } from '@/utils/message'
import { ref, toRaw } from 'vue'
import EditDialog from '@/components/EditDialog.vue'
import { EditDialogConfig } from '@/components/EditDialog.vue'
import { listUser, queryUser } from '@/api/user'
import { useInventoryMapStore } from '@/stores/inventoryMap'

let isUpdateDialogVisable = ref<boolean>(false)
let isAddDialogVisable = ref<boolean>(false)
let isInventoryDialogVisable = ref<boolean>(false)
let recordSelected = ref<Borrow>()
let recordAdded = ref<Borrow>({
  borrowdate: null,
  oughtReturnDate: null,
  recordId: null,
  bookId: null,
})

let userSelected = ref<number>(-1)
let userMap = ref<Map<number, string>>(new Map())
let userOptions = ref<Array<{ key, value }>>([
  { key: 'test', value: -1 },
])
listUser()
  .then((res) => {
    if (res && res.data) {
      userOptions.value = res.data.data.map(item => ({ key: item.username, value: item.userId }))
      userMap.value = new Map(userOptions.value.map(option => [option.value, option.key]))
    }
  })
  .catch((e) => console.info(e))

let inventoryMap = ref<Map<number, string>>(new Map())
inventoryMap.value = useInventoryMapStore().idToNameMap

const bookPage = ref<InventoryPage>({ size: 0 })
const inventoryDialogVisable = ref<boolean>(false)
let inventoryData = ref<Array<Book>>([])
let latestViewInventory: BookInventory = {}
const keywordInventory = ref("")

const tableConfig: TableConfigInterface = {
  api: '/borrow/list',
  columns: [
    {
      prop: 'recordId',
      label: '记录编号',
    },
    {
      prop: 'userId',
      label: '用户编号',
    },
    {
      prop: 'username',
      label: '用户名',
    },
    {
      prop: 'bookId',
      label: '书籍编号',
      sortable: true,
    },
    {
      prop: 'inventoryId',
      label: '书库编号'
    },
    {
      prop: 'title',
      label: '标题'
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

const inventoryTableConfig = ref<TableConfigInterface>({
  api: '/book-inventory/list?keyword=',
  columns: [
    {
      prop: 'inventoryId',
      label: '书库编号',
    },
    {
      prop: 'bookTitle',
      label: '图书标题',
    },
    {
      prop: 'author',
      label: '作者',
    },
    {
      prop: 'publisher',
      label: '出版社',
    },
    {
      prop: 'categoryId',
      label: '分类编号',
    },
    {
      prop: 'quantity',
      label: '在库数目',
    }
  ],
  operation: {
    columns: [
      {
        click: (row: BookInventory) => {
          openInventory(row)
        },
        text: '查看',
        // icon: '', 
        type: 'primary'
      },
    ]
  }
})


// const addDialogConfig: EditDialogConfig = {
//   /**
//    * 直接传categoryAdded（ref） 与 
//    * .value（ypeError: Cannot read properties of undefined (reading 'name')） 区别？
//    * 后者疑似构造了一个新的对象
//    */
//   // objEdited: categoryAdded,
//   dialogTitle: "添加借阅记录~",
//   noBtnText: "取消",
//   okBtnText: "确定",
//   onOkBtnClicked(obj) {
//     addBorrowRecord(userSelected.value, recordAdded.value.bookId).catch((error) => {
//       Message(error)
//     }).then((response) => {
//       if (response && response.data) {
//         Message(response.data.msg)
//         if (response.data.code == 1) {
//           isAddDialogVisable.value = false
//         }
//       }
//     })
//   },
//   onNoBtnClicked(obj) {
//     isAddDialogVisable.value = false
//   },
//   propertyConfigs: [
//     {
//       key: "borrowDate",
//       label: "借阅日期",
//       placeholder: "",
//       datepicker: true
//     },
//     {
//       key: "oughtReturnDate",
//       label: "截止日期",
//       placeholder: "",
//       datepicker: true
//     },
//     {
//       key: "actualReturnDate",
//       label: "归还日期",
//       placeholder: "",
//       datepicker: true
//     },
//   ]
// }

const updateDialogConfig: EditDialogConfig = {
  // isVisable: isUpdateDialogVisable,
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

function borrow(row: Book) {
  addBorrowRecord(userSelected.value, row.bookId)
    .then((response) => {
      if (response && response.data) {
        Message(response.data.msg)
        if (response.data.code == 1) {
          return listBook(null, row.inventoryId, null, null)
        }
      }
    })
    .then((response) => {
      if (response && response.data) {
        Message(response.data.msg)
        if (response.data.code == 1) {
          inventoryData.value = response.data.data
        }
      }
    })
    .catch((e) => {
      console.log(e)
    })
}

function isBorrowBtnDisabled(row: Book) {
  return row.isBorrowed || row.isDiscarded;
}

const filterTag = (value: boolean, row: Book) => {
  return row.isBorrowed === value
}

async function openInventory(inventory: BookInventory) {
  console.log("打开库存信息对话框");
  inventoryDialogVisable.value = true;
  latestViewInventory = inventory;
  const res = await request.get<Array<Book>>("/book/list", {
    params: { 'inventoryId': inventory.inventoryId }
  });
  inventoryData.value = res.data.data;
  console.info(inventoryData);
}

async function searchInventory() {
  inventoryTableConfig.value.api = `/book-inventory/list?keyword=${keywordInventory.value}`
}
</script>
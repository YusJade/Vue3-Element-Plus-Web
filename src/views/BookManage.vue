<template>
  <TableC v-bind="tableConfig">
    <!-- 动态具名插槽 + 作用域插槽 -->
    <template #isBorrowed="{ row }">
      <el-tag v-if="!row.isBorrowed" type="success">在库</el-tag>
      <el-tag v-if="row.isBorrowed" type="warning">借出</el-tag>
    </template>
    <template #isDiscarded="{ row }">
      <el-tag v-if="!row.isDiscarded" type="primary">可用</el-tag>
      <el-tag v-if="row.isDiscarded" type="danger">弃置</el-tag>
    </template>
    <template #inventoryName="{ row }">
      {{ inventoryMapStore.idToNameMap.get(row.inventoryId) }}
    </template>
  </TableC>
  <el-dialog v-model="isDeleteNoticeVisable">
    与图书相关的借阅记录将会一并删除
    <el-button type="danger" @click="stockOut">确定</el-button>
    <el-button type="primary" @click="isDeleteNoticeVisable = false">取消</el-button>
  </el-dialog>
</template>

<script lang="ts" setup>
import TableC from '@/components/TableC.vue'
import { TableConfigInterface } from '@/components/TableC.vue'
import { updateBook } from '@/api/book';
import { queryBorrowRecordList } from '@/api/borrow';
import { useInventoryMapStore } from '@/stores/inventoryMap';
import { Book, BookInventory, Borrow } from '@/type';
import { Message } from '@/utils/message';
import { error, log } from 'console';
import { onMounted, ref, toRaw } from 'vue';
import { removeBook } from '@/api/book';

const inventoryMapStore = useInventoryMapStore()
inventoryMapStore.updateMap()

let bookSelecteds = ref<Array<Book>>()
let borrwowReturned: Borrow
let isDeleteNoticeVisable = ref<boolean>(false)

const tableConfig: TableConfigInterface = {
  api: '/book/list',
  selectable: (row: Book) => !row.isBorrowed,
  columns: [
    {
      prop: 'bookId',
      label: '图书编号'
    },
    {
      prop: 'inventoryId',
      label: '书库编号'
    },
    {
      prop: 'inventoryName',
      label: '书库名称',
    },
    {
      prop: 'isBorrowed',
      label: '借阅状态',
    },
    {
      prop: 'isDiscarded',
      label: '弃置状态',
    },
  ],
  operation: {
    columns: [
      {
        visible: (row: Book) => {
          console.log(row)
          console.log(toRaw(row))
          return row.isBorrowed
        },
        click: (row: Book) => {
          queryBorrowRecordList(null, null, row.bookId, true)
            .then((response) => {
              if (response && response.data) {
                if (response.data.data.length > 0) {
                  borrwowReturned = response.data.data.at(0)
                  isDeleteNoticeVisable = true
                } else {
                  let book = toRaw(row)
                  book.isBorrowed = false
                  // 发送请求
                  return updateBook(row.bookId, book)
                }
              }
            })
            .then((response) => {
              if (response && response.data) {
                Message(response.data.msg)
              }
            })
            .catch((error) => {
              Message(error)
            })
        },
        text: '后台归还',
        // icon: '',
        type: 'primary'
      },
      {
        visible: (row: Book) => !row.isBorrowed,
        click: (row: Book) => {
          removeBook(row.bookId)
        },
        text: '出库',
        // icon: '',
        type: 'warning'
      },
    ]
  },
  footer: {
    operations: [
      {
        click: (rows: Array<Book>) => {
          isDeleteNoticeVisable.value = true
          bookSelecteds.value = rows
        },
        text: '出库',
        // icon: '',
        type: 'warning'
      }
    ]
  }
}

const stockOut = () => {
  for (const row of bookSelecteds.value) {
    removeBook(row.bookId)
  }
  isDeleteNoticeVisable.value = false
}

</script>


<style></style>
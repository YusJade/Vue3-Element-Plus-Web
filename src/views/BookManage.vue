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
</template>

<script lang="ts" setup>
import TableC from '@/components/TableC.vue'
import { TableConfigInterface } from '@/components/TableC.vue'
import request from '@/https';
import { useInventoryMapStore } from '@/stores/inventoryMap';
import { Book, BookInventory } from '@/type';
import { Message } from '@/utils/message';
import { log } from 'console';
import { onMounted, toRaw } from 'vue';

const inventoryMapStore = useInventoryMapStore()
inventoryMapStore.updateMap()
// let categoryIdMap: Map<number, string> = null
// let inventoryInfo: BookInventory[]
// request.get('/book-inventory/list')
//   .then((respone) => {
//     inventoryInfo = respone.data.data
//     Message(respone.data.msg)
//     categoryIdMap = new Map(inventoryInfo.map(item => [item.inventoryId, item.bookTitle]))
//   })
// console.log(categoryIdMap)

const tableConfig: TableConfigInterface = {
  api: '/book/list',
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
  // operation: {
  //   columns: [
  //     {
  //       click: (row: BookInventory) => { 
  //         inventoryInfoSelected.value = toRaw(row)
  //         editDialogVisable.value = true 
  //         Message('编辑库存信息') 
  //       },
  //       text: '编辑',
  //       // icon: '',
  //       type: 'primary'
  //     },
  //     {
  //       click: () => {},
  //       text: '出入库',
  //       type: 'warning'
  //     },
  //     {
  //       click: (row: BookInventory) => { 
  //         inventoryInfoSelected.value = toRaw(row)
  //         removeDialogVisable.value = true 
  //         Message('删除库存信息') 
  //       },
  //       text: '删除',
  //       type: 'danger'
  //     },
  //   ]
  // }
}


</script>


<style></style>
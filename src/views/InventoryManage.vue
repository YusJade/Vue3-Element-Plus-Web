<template>
  <el-button @click="addDialogVisable = true">新建书库</el-button>
  <TableC v-bind="tableConfig">
  </TableC>

  <ElDialog v-model="removeDialogVisable" title="确定要删除下列库存吗？" width="400">
    <div style="margin-bottom: 12px;">
      <div>标题：{{ inventoryInfoSelected.bookTitle }}</div>
      <div>作者：{{ inventoryInfoSelected.author }}</div>
      <div>出版社：{{ inventoryInfoSelected.publisher }}</div>
    </div>
    <el-button type="danger" @click="removeInventory">确定</el-button>
    <el-button type="info" @click="removeDialogVisable = false">取消</el-button>
  </ElDialog>

  <ElDialog v-model="editDialogVisable" title="编辑库存信息" width="400">
    <div style="margin-bottom: 12px;">
      <span>标题：</span>
      <el-input v-model="inventoryInfoSelected.bookTitle"></el-input>
      <span>作者：</span>
      <el-input v-model="inventoryInfoSelected.author"></el-input>
      <span>出版社：</span>
      <el-input v-model="inventoryInfoSelected.publisher"></el-input>
    </div>
    <el-button type="primary" @click="saveInventoryEdit">保存</el-button>
    <el-button type="info" @click="editDialogVisable = false">取消</el-button>
  </ElDialog>

  <ElDialog v-model="addDialogVisable" title="添加库存信息" width="400">
    <div style="margin-bottom: 12px;">
      <span>标题：</span>
      <el-input v-model="inventoryInfoAdded.bookTitle"></el-input>
      <span>作者：</span>
      <el-input v-model="inventoryInfoAdded.author"></el-input>
      <span>出版社：</span>
      <el-input v-model="inventoryInfoAdded.publisher"></el-input>
    </div>
    <el-button type="primary" @click="addDialogVisable = false">保存</el-button>
    <el-button type="info" @click="addDialogVisable = false">取消</el-button>
  </ElDialog>
</template>

<script lang="ts" setup>
import TableC from '@/components/TableC.vue'
import { TableConfigInterface } from '@/components/TableC.vue'
import { modifyBookInventory, removeBookInventory } from '@/https';
import { Book, BookInventory } from '@/type'
import { Message } from '@/utils/message';
import { ElDialog } from 'element-plus';
import { ref, toRaw } from 'vue'

const inventoryInfoSelected = ref<BookInventory>()
const inventoryInfoAdded = ref<BookInventory>({

})
let editDialogVisable = ref<boolean>(false)
let addDialogVisable = ref<boolean>(false)
let removeDialogVisable = ref<boolean>(false)

const tableConfig: TableConfigInterface = {
  api: '/book-inventory/list',
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
          inventoryInfoSelected.value = toRaw(row)
          editDialogVisable.value = true 
          Message('编辑库存信息') 
        },
        text: '编辑',
        // icon: '',
        type: 'primary'
      },
      {
        click: () => {},
        text: '出入库',
        type: 'warning'
      },
      {
        click: (row: BookInventory) => { 
          inventoryInfoSelected.value = toRaw(row)
          removeDialogVisable.value = true 
          Message('删除库存信息') 
        },
        text: '删除',
        type: 'danger'
      },
    ]
  }
}

const saveInventoryEdit = async () => {
  const respone = await modifyBookInventory(inventoryInfoSelected.value)
  Message(respone.data.msg)
  if (respone.data.code == 1) {
    editDialogVisable.value = false
  }
}

const removeInventory = async () => {
  const respone = await removeBookInventory(inventoryInfoSelected.value.inventoryId)
  Message(respone.data.msg)
  removeDialogVisable.value = false
}

</script>

<style>
</style>
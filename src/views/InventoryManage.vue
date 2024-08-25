<template>
  <div class="flex items-center justify-between bg-primary p-2">
    <div class="flex items-center ">
      <el-input v-model="keyword" placeholder="搜索" />
      <el-button @click="tableConfig.api = `/book-inventory/list?keyword=${keyword}`"
                 type="primary">搜索</el-button>
      <el-button type="success" @click="isAddDialogVisable = true">新增</el-button>
    </div>
  </div>
  <TableC v-bind="tableConfig">
    <template #categoryName="{ row }">
      {{ categoryMap.get(row.categoryId) }}
    </template>
  </TableC>
  <EditDialog v-bind="addDialogConfig" v-model:visable="isAddDialogVisable"
              v-model:edit="inventoryAdded">
  </EditDialog>
  <EditDialog v-bind="updateDialogConfig" v-model:visable="isUpdateDialogVisable"
              v-model:edit="inventorySelected">
  </EditDialog>
  <ElDialog v-model="removeDialogVisable" title="确定要删除下列库存吗？" width="400">
    <div style="margin-bottom: 12px;">
      <div>标题：{{ inventorySelected.bookTitle }}</div>
      <div>作者：{{ inventorySelected.author }}</div>
      <div>出版社：{{ inventorySelected.publisher }}</div>
    </div>
    <el-button type="danger" @click="removeInventory">确定</el-button>
    <el-button type="info" @click="removeDialogVisable = false">取消</el-button>
  </ElDialog>
  <ElDialog v-model="isEnterInventoryDialogVisable">
    <span style="margin-left: 18px; margin-right: 5px; font-size: medium;"> 入库数目</span>
    <div style="margin-bottom: 12px;">
      <ElInputNumber v-model="enterQuantity"></ElInputNumber>
    </div>
    <el-button type="danger" @click="enterInventory">确定</el-button>
    <el-button type="info" @click="isEnterInventoryDialogVisable = false">取消</el-button>
  </ElDialog>
</template>

<script lang="ts" setup>
import TableC from '@/components/TableC.vue'
import { TableConfigInterface } from '@/components/TableC.vue'
import { updateBookInventory, removeBookInventory, addBookInventory } from '@/https';
import { addBook } from '@/api/book'
import { Book, BookInventory, Category } from '@/type'
import { Message } from '@/utils/message';
import { ElDialog, ElInputNumber } from 'element-plus';
import { reactive, Ref, ref, toRaw } from 'vue'
import EditDialog, { EditDialogConfig } from '@/components/EditDialog.vue';
import { listCategory } from '@/api/category';

const inventorySelected = ref<BookInventory>()
const inventoryAdded = ref<BookInventory>({

})

const categoriesOpt = ref<Array<{ key: string, value: number }>>()
let categories: Array<Category>
let categoryMap = ref<Map<number, string>>(new Map())
listCategory('')
  .then((res) => {
    if (res && res.data) {
      categories = res.data.data
      categoriesOpt.value = categories.map(item => ({ key: item.name, value: item.categoryId }))
      categories.forEach(item => {
        categoryMap.value.set(item.categoryId, item.name)
      })
    }
  })
  .catch((e) => console.log(e))
  .finally(() => {
    categoriesOpt.value = categoriesOpt.value.concat([{ key: '无', value: null }])
  })

let isUpdateDialogVisable = ref<boolean>(false)
let isAddDialogVisable = ref<boolean>(false)
let isEnterInventoryDialogVisable = ref<boolean>(false)

let enterQuantity = ref<number>(0);

let removeDialogVisable = ref<boolean>(false)

let keyword = ref<string>('')

const tableConfig = ref<TableConfigInterface>({
  api: `/book-inventory/list?keyword=${keyword.value}`,
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
      prop: 'categoryName',
      label: '分类名',
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
          inventorySelected.value = toRaw(row)
          isUpdateDialogVisable.value = true
          Message('编辑库存信息')
        },
        text: '编辑',
        // icon: '',
        type: 'primary'
      },
      {
        click: (row: Book) => {
          isEnterInventoryDialogVisable.value = true
          inventorySelected.value = reactive({ ...row })
        },
        text: '入库',
        type: 'warning'
      },
      {
        click: (row: BookInventory) => {
          inventorySelected.value = reactive({ ...row })
          removeDialogVisable.value = true
          Message('删除库存信息')
        },
        text: '删除',
        type: 'danger'
      },
    ]
  }
})

const addDialogConfig: EditDialogConfig = {
  isVisable: isAddDialogVisable,
  modelValue: inventoryAdded,
  dialogTitle: "添加书库~",
  noBtnText: "取消",
  okBtnText: "确定",
  onOkBtnClicked(obj) {
    addBookInventory(inventoryAdded.value).catch((error) => {
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
      // categoryId?: number;
      key: "categoryId",
      label: "分类编号",
      placeholder: "",
      options: categoriesOpt
    },
    {
      // bookTitle?: string;
      key: "bookTitle",
      label: "标题",
      placeholder: "",
    },
    {
      // author?: string;
      key: "author",
      label: "作者",
      placeholder: "",
    },
    {
      // publisher?: string;
      key: "publisher",
      label: "出版社",
      placeholder: "",
    },
  ]
}

const updateDialogConfig: EditDialogConfig = {
  isVisable: isUpdateDialogVisable,
  modelValue: inventorySelected,
  dialogTitle: "修改书库~",
  noBtnText: "取消",
  okBtnText: "确定",
  onOkBtnClicked(obj) {
    updateBookInventory(inventorySelected.value).catch((error) => {
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
      // inventoryId?: number;
      key: "inventoryId",
      label: "书库编号",
      placeholder: "",
      unchangeable: true,
    },
    {
      // categoryId?: number;
      key: "categoryId",
      label: "分类编号",
      placeholder: "",
      options: categoriesOpt
    },
    {
      // bookTitle?: string;
      key: "bookTitle",
      label: "标题",
      placeholder: "",
    },
    {
      // author?: string;
      key: "author",
      label: "作者",
      placeholder: "",
    },
    {
      // publisher?: string;
      key: "publisher",
      label: "出版社",
      placeholder: "",
    },
  ]
}


const saveInventoryEdit = async () => {
  const respone = await updateBookInventory(inventorySelected.value)
  Message(respone.data.msg)
  if (respone.data.code == 1) {
    isUpdateDialogVisable.value = false
  }
}

const removeInventory = async () => {
  const respone = await removeBookInventory(inventorySelected.value.inventoryId)
  Message(respone.data.msg)
  removeDialogVisable.value = false
}

const enterInventory = async () => {
  addBook(inventorySelected.value.inventoryId, enterQuantity.value)
}

</script>

<style></style>
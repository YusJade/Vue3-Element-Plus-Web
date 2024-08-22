<template>
  <div v-loading="loading" class="table-wrapper">
    <el-table :data="tableData" :max-height="props.maxHeight"
              :default-sort="props.defaultSort" @selection-change="handleSelectionChange"
              @sort-change="handleSortChange" @row-click="goDetail"
              :row-style="{ cursor: 'pointer' }" table-layout="auto" ref="tableRef">
      <el-table-column fixed :selectable="setSelectable" type="selection"
                       v-if="showSelectBox" />
      <el-table-column v-for="item in props.columns" :key="item.prop" :prop="item.prop"
                       :label="item.label" :sortable="item.sortable ? 'custom' : false"
                       :width="item.width">
        <template #header>
          <slot name="header">
            <div class="inline-flex" :style="item.labelStyle">
              <span>{{ item.label }}</span>
              <el-tooltip popper-class="table-tooltip" effect="dark" placement="top-start"
                          :content="item.tooltip" v-if="item.tooltip">
                <el-icon><i-ep-Warning /></el-icon>
              </el-tooltip>
            </div>
          </slot>
        </template>
        <template #default="scope">
          <slot :name="item.prop" :row="scope.row">
            <div :style="item.style">
              <span v-if="item.formatter">{{ item.formatter(scope.row[item.prop])
                }}</span>
              <span v-else>{{ scope.row[item.prop] }}</span>
            </div>
          </slot>
        </template>
      </el-table-column>
      <el-table-column fixed="right" label="操作" :width="props.operation?.width"
                       v-if="props.operation?.columns">
        <template #default="scope">
          <slot name="operations" :row="scope.row">
            <span v-for="item in props.operation?.columns" :key="item.text || item.icon">
              <el-button v-if="setVisible(scope.row, item.visible)" :type="item.type"
                         :link="item.link" :plain="item.plain"
                         @click="refreshableClick(scope.row, item.isRefresh, item.click)"
                         size="small" style="margin-right: 4px">
                <!-- <i v-if="item.icon" :class="item.icon"></i> -->
                <el-icon v-if="item.icon">
                  <component :is="item.icon"></component>
                </el-icon>
                {{ item.text }}
              </el-button>
            </span>
          </slot>
        </template>
      </el-table-column>
    </el-table>
    <div v-if="showSelectBox" class="p-14">
      <el-checkbox v-model="isSelected" @click="tableRef?.toggleAllSelection()"
                   :indeterminate="indeterminate" label="全选"
                   style="vertical-align: middle; margin-right: 10px" />
      <slot name="footer" :rows="selectionRows">
        <span v-for="item in props.footer?.operations" :key="item.text || item.icon">
          <el-button v-if="item.visible ? item.visible() : true"
                     :type="item.type || 'primary'" :link="item.link" :plain="item.plain"
                     :disabled="!selectionRows.length" @click="item.click(selectionRows)"
                     style="margin-left: 10px">
            <el-icon v-if="item.icon" :class="item.icon"></el-icon>
            {{ item.text }}
          </el-button>
        </span>
      </slot>
    </div>
  </div>
  <el-pagination background :total="tableData.length" :layout="props.layout"
                 v-model:current-page="pagination.currentPage"
                 v-model:page-size="pagination.pageSize" @current-change="getTableData"
                 @size-change="getTableData" class="p-y-20" />
</template>

<script lang="ts" setup>
import request, { api, } from '@/https';
import { reactive, Ref, ref, computed, watch } from 'vue';
export interface OperationInterface {
  click: (row: unknown) => void // 按钮点击方法，参数为当前行数据
  text?: string // 按钮显示文字
  icon?: string // 按钮 icon
  visible?: (row?: unknown) => boolean // 设置按钮是否可见，参数为当前行数据，默认为 true
  type?: string // 按钮类型['primary'| 'success'| 'warning'| 'danger'| 'info']
  link?: boolean // 是否为链接按钮
  plain?: boolean // 是否为朴素按钮
  isRefresh?: boolean // 操作后是否刷新数据
}
export interface TableConfigInterface {
  api: string // 表格数据获取接口
  refreshTrigger?: boolean
  rowKey?: string // 行数据的 Key
  columns: {
    // 显示列
    /** 键名 */
    prop: string
    label?: string // 表头显示名称
    /** 自定义单元格格式化方法，参数为当前列数据 */
    formatter?: (col: unknown) => string
    tooltip?: string // 表头 tooltip
    sortable?: boolean // 是否可以排序
    width?: number | string // 宽度
    style?: string // 单元格样式
    labelStyle?: string // 表头样式
  }[]
  selectable?: boolean | ((row: unknown) => boolean) // 当前行多选框是否可以勾选，参数为当前行数据，默认为 false
  operation?: {
    // 操作列
    columns: OperationInterface[]
    width?: number | string // 宽度
  }
  footer?: {
    // 操作列
    operations: OperationInterface[]
  }
  defaultSort?: {
    // 默认排序
    prop: string // 默认排序的列
    order?: string // ['ascending'| 'descending'], 没有指定 order, 则默认顺序是 ascending
  }
  maxHeight?: number | string // 表格最大高度
  layout?: string
}


const props = withDefaults(defineProps<TableConfigInterface>(), {
  rowKey: 'id',
  layout: 'prev, pager, next, total',
})


const pagination = ref({
  currentPage: 1,
  pageSize: 10
})
const tableRef = ref()
// let tableData = reactive<unknown[]>([])
let tableData = ref<unknown[]>([])

// 多选框逻辑
const isSelected = ref(false) // 是否有选中数据
const selectionRows = ref<unknown[]>([]) // 当前选中的数据
const handleSelectionChange = (rows: unknown[]) => {
  selectionRows.value = rows
  isSelected.value = rows.length > 0
}
const disabledList = reactive<string[]>([]) // 禁止勾选的数据
const setSelectable = (row: unknown) => {
  const selectable =
    typeof props.selectable === 'boolean' ? props.selectable : props.selectable?.(row)
  if (!selectable && !disabledList.includes(row?.[props.rowKey])) {
    disabledList.push(row?.[props.rowKey])
  }
  return selectable
}
const indeterminate = computed(
  () =>
    selectionRows.value.length > 0 &&
    selectionRows.value.length < tableData.value.length - disabledList.length
)
const showSelectBox = computed(() => props.selectable && disabledList.length < tableData.value.length)


// 操作框逻辑
const showOperation = ref(false)

const setVisible = (row: unknown, visible?: (row: unknown) => boolean) => {
  if (!visible || visible(row)) {
    showOperation.value = true
    return true
  }
  return false
}


// 进一步封装 click ，添加刷新功能
const refreshableClick = async (row: unknown, isRefresh: boolean, click: (row: unknown) => unknown) => {
  await Promise.resolve(click(row)).then(() => {
    if (isRefresh) {
      getTableData()
    }
  })

}

// 排序
const handleSortChange = (data: { prop: string; order: string | null }) => {
  const { prop, order } = data
  console.log(prop, order)
  // getTableData
}

// 跳转详情页
const goDetail = (row: unknown) => {
  console.log(row)
}

// 发送接口
const loading = ref(true)
const getTableData = async () => {
  loading.value = true
  showOperation.value = false
  const res = await request.get(props.api)
  tableData.value = res.data.data
  loading.value = false
}
getTableData()

watch(() => props.refreshTrigger, () => {
  getTableData()
    .then(() => {
      console.log('刷新表格')
      console.log(tableData)
    })

})

</script>

<style lang="scss" scoped>
.table-wrapper {
  border-top: 1px solid #eaeaea;
  border-left: 1px solid #eaeaea;
  border-right: 1px solid #eaeaea;
}

.inline-flex {
  display: inline-flex;
  align-items: center;
}

.p-14 {
  border-bottom: 1px solid #eaeaea;
  padding: 14px;
}

.p-y-20 {
  padding-top: 20px;
  padding-bottom: 20px;
  justify-content: center;
}
</style>

<style lang="scss">
.table-tooltip {
  max-width: 220px;
}
</style>

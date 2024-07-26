<template>
  <el-table :data="tableData">
    <el-table-column
    v-for="item in props.columnConfigs"
    :width="item.width">
      <template #defualt="scope">
        <slot :name="item.prop" :row="item">
          <span v-if="item.formatter">{{ item.formatter(scope.row) }}</span>
          <span v-else>{{ scope.row[item.prop] }}</span>
        </slot>
      </template>
    </el-table-column>
    <el-table-column
      fixed="right"
      label="操作"
      :width="props.operation?.width"
      v-if="props.operation?.columns"
    >
      <template #default="scope">
        <slot name="operations" :row="scope.row">
          <span v-for="item in props.operation?.columns" :key="item.text || item.icon">
            <el-button
              v-if="setVisible(scope.row, item.visible)"
              :type="item.type"
              :link="item.link"
              :plain="item.plain"
              @click="item.click(scope.row)"
              size="small"
              class="margin-right: 4px"
            >
              <el-icon v-if="item.icon" :class="item.icon"></el-icon>
              {{ item.text }}
            </el-button>
          </span>
        </slot>
      </template>
    </el-table-column>
  </el-table>
</template>

<script lang="ts" setup>

interface ColumnConfig {
  prop: string,
  label: string,
  formatter?: (string) => string,
  width?: number | string
}

interface OperationInterface {
  click: (row: unknown) => void // 按钮点击方法，参数为当前行数据
  text?: string // 按钮显示文字
  icon?: string // 按钮 icon
  visible?: (row?: unknown) => boolean // 设置按钮是否可见，参数为当前行数据，默认为 true
  type?: string // 按钮类型['primary'| 'success'| 'warning'| 'danger'| 'info']
  link?: boolean // 是否为链接按钮
  plain?: boolean // 是否为朴素按钮
}

interface TableConfig {
  tableData: Array<Object>,
  columnConfigs: Array<ColumnConfig>,
  operation?: {
    width?: number | string,
    columns: OperationInterface[]   
  } 
}

const props = defineProps<TableConfig>()

const setVisible = (row: unknown, visible?: (row: unknown) => boolean) => {
  if (!visible || visible(row)) {
    return true
  }
  return false
}

</script>
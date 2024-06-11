<template>
  <el-table :data="tableData">
    <template v-if="tableData.length > 0" v-for="(value, key, index) in tableData[0]" :key="index">
      <el-table-column :prop="key" :label="key"></el-table-column>
    </template>
  </el-table>
</template>

<script lang="ts" setup>
defineProps<{ tableData: Array<Object>}>()

</script>
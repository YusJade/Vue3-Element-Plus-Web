<template>
  <Table :tableData="tableData"></Table>
  <!-- <el-btn @onclick=""></el-btn>
  <a>{{keyword}} 的搜索结果</a>
  <TabelDemo></TabelDemo> -->
</template>

<style>

</style>

<script lang="ts" setup>
import { useRouter } from "vue-router"
import router from "@/router";
import Table from '@/components/Table.vue'
import request from "@/https";
import { ref } from "vue";

let keyword = router.currentRoute.value.query.keyword  

interface BorrowRecord {
    book_id?: number;
    borrow_date?: string;
    id?: number;
    really_return_date?: null;
    return_date?: string;
    user_id?: number;
}

let tableData = ref<Array<BorrowRecord>>([]);

async function fetchAllBorrowRecords() {
  try {
    let response = await request.get<Array<BorrowRecord>>('/borrow')
    tableData.value = response.data.result
    console.log(tableData)   
  } catch (err) {
    console.log(err)
  }
}

setTimeout(()=> {
  fetchAllBorrowRecords()
}, 3000);
</script>
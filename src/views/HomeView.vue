<template>
  <div class="header">  
    <div class="status">
      <div>0 Books</div>
      <div>0 Visists</div>
    </div>
    <!-- <div class="nav"> -->
    <el-button 
    style="margin-top: 20px; float: right;" 
    text 
    size="large" 
    type="primary" 
    @click="toLoginPage">
      登录
    </el-button>
    <!-- </div> -->
  </div>
  <div class="main">
    <div
    style="
      text-align: center;
      font-size: 50px;
      background-clip: text;
      /* 灏嗚儗鏅涓烘笎锟�? */
      background-image: -webkit-linear-gradient(0deg, #2AD5DE, #E1E87E);
      /* 瑙勫畾鑳屾櫙缁樺埗鍖哄煙 */
      -webkit-background-clip: text;
      /* 灏嗘枃瀛楅殣锟�? */
      -webkit-text-fill-color: transparent;">
      Firefly-Library
    </div>
    <div 
    style="color:#90A5A8;
      text-align: center;
      font-weight:400; 
      padding:4px 0 15px 0;
      font-style: italic;">
      Part of Firefly-Library project. The class's largest library system
    </div>
    <el-form>
      <div style="display: flex;">
        <el-form-item style="width: 60%; margin-left: 15%;">
          <el-input style="width: 100%; height: 40px;"
          v-model="searchContent" 
          type="text">
          </el-input>
        </el-form-item>
        <el-button style="height: 40px"
        color="#40E2A6"
        type="primary"
        plain  
        @click="onSubmit">
          搜索
        </el-button>
      </div>
    </el-form>
    <div class="results-container" v-if="tableData.datas.length">
      <h2>Search Books On Z-Library. The World's Largest E-book Library.</h2>
      <div class="tab-container">
        <button class="active">Books <p>{{ tableData.totalPage * tableData.pageSize }}</p></button>
      </div>
      <div class="result-item" v-for="(value, index) in tableData.datas" :key="index">
        <img src="https://via.placeholder.com/100" alt="Book Cover">
        <div>
          <h3><a href="#">{{ value.title }}</a></h3>
          <p>作者：{{ value.author }}</p>
          <p>出版社：{{ value.publisher }}</p>
          <p>在库数目：{{ value.quantity }}</p>
          <p>在库Id:{{ value.id }}</p>
        </div>
      </div>
      <!-- <div class="result-item">
        <img src="https://via.placeholder.com/100" alt="Book Cover">
        <div>
          <h3><a href="#">Dad鈥檚 Expecting Too: Expectant fathers, expectant mothers...</a></h3>
          <p>Publisher</p>
          <p>Author Name</p>
          <p>Edition: Original retail | Year: 2022 | Language: English | File: EPUB</p>
          <p>Rating: 4.0 / 5.0</p>
        </div>
      </div> -->
      <!-- Add more result items as needed -->
    </div>
  </div>
  <div class="footer">
    <p>since 2024.</p>
    <a href="#">SpringBoot-MyBatis-Example</a>
  </div>
</template>

<style>
.header {
  display: flex;
}

.nav {
  margin-top: 20px;
  float: right;
}

.status {
  margin-left: 10px;
  margin-top: 20px;
  /* position: fixed; */
  top: 0;
  left: 0;
  margin-right: auto;
  width: 50%;
  display: flex;
  gap: 10px;
}

.status div {
  background-color: #e9ecef;
  padding: 5px 10px;
  border-radius: 5px;
  font-size: 16px
}

.example-showcase .el-dropdown-link {
  cursor: pointer;
  color: var(--el-color-primary);
  display: flex;
  align-items: center;
}

.main {
  margin-left: 20%; 
  width: 60%;
  vertical-align: top;
  padding-top: 15%;
  padding-bottom: 35%
}

.footer {
  background-color: #f6f6f6;
  padding: 20px;
  text-align: center;
  box-shadow: 0 -2px 4px rgba(0, 0, 0, 0.1);
  position: fixed;
  width: 100%;
  bottom: 0;
  }

.footer a {
  margin: 0 10px;
  color: #4CAF50;
  text-decoration: none;
}

.footer a:hover {
  text-decoration: underline;
}

.search-btn {
  height: 70px;
  border-radius: 2px;
}

.results-container {
  width: 80%;
  margin: 0 auto;
  background-color: #fff;
  border: 1px solid #ccc;
  border-radius: 5px;
  padding: 20px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}
.results-container h2 {
  text-align: center;
  color: #4CAF50;
}
.result-item {
  display: flex;
  padding: 20px;
  border-bottom: 1px solid #eee;
}
.result-item:last-child {
  border-bottom: none;
}
.result-item img {
  max-width: 100px;
  margin-right: 20px;
}
.result-item div {
  flex: 1;
}
.result-item h3 {
  margin: 0;
  font-size: 18px;
  color: #333;
}
.result-item p {
  margin: 5px 0;
  font-size: 14px;
  color: #777;
}
</style>

<script lang="ts" setup>
import { reactive, ref } from 'vue';
import { useRouter } from "vue-router"
import request from "@/https";
import { Book, Page } from "@/type";

const tableData = ref<Page<Book>>({pageOn: 0, pageSize: 0, totalPage: 0, totalSize: 0, datas: []})
const tableDataLen = ref<number>(0)
let router = useRouter()
const searchContent = ref("")
const onSubmit = () => {
  fetchAllBorrowRecords()
}

// setTimeout(()=> {
//   fetchAllBorrowRecords()
// }, 1000);

async function fetchAllBorrowRecords() {
  try {
    let response = await request.get<Page<Book>>('/book', {params: {'keyword': searchContent.value}})
    tableData.value = response.data.result
    console.log(tableData) 
    console.log(tableData.value.datas.length)     
  } catch (err) {
    console.log(err)
  }
}

function toLoginPage() {
  router.push({path: '/login'})
} 

</script>
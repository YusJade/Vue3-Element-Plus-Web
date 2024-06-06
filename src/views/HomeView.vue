<template>
  <el-header>  
    <div class="status">
      <div>0 Books</div>
      <div>0 Visists</div>
    </div>
    <div class="nav">
      <el-dropdown>
        <span class="el-dropdown-link">
          菜单
          <el-icon class="el-icon--right">
            <arrow-down />
          </el-icon>
        </span>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item @click.native="toLoginPage" >登录</el-dropdown-item>
            <el-dropdown-item>Action 2</el-dropdown-item>
            <el-dropdown-item>Action 3</el-dropdown-item>
            <el-dropdown-item disabled>Action 4</el-dropdown-item>
            <el-dropdown-item divided>Action 5</el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>
  </el-header>
  <div class="main">
    <div
    style="
      text-align: center;
      font-size: 50px;
      background-clip: text;
      /* 将背景设为渐�? */
      background-image: -webkit-linear-gradient(0deg, #2AD5DE, #E1E87E);
      /* 规定背景绘制区域 */
      -webkit-background-clip: text;
      /* 将文字隐�? */
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
    <div class="results-container" v-if="tableData.length > 0">
      <h2>Search Books On Z-Library. The World's Largest E-book Library.</h2>
      <div class="tab-container">
        <button class="active">Books (15+)</button>
        <button>Articles</button>
      </div>
      <div class="result-item" v-for="(value, index) in tableData" :key="index">
        <img src="https://via.placeholder.com/100" alt="Book Cover">
        <div>
          <h3><a href="#">{{ value.id }}</a></h3>
          <p>{{ value.return_date }}</p>
          <p>{{ value.user_id }}</p>
          <p>{{ value.really_return_date }}</p>
          <p>{{ value.borrow_date }}</p>
        </div>
      </div>
      <div class="result-item">
        <img src="https://via.placeholder.com/100" alt="Book Cover">
        <div>
          <h3><a href="#">Dad’s Expecting Too: Expectant fathers, expectant mothers...</a></h3>
          <p>Publisher</p>
          <p>Author Name</p>
          <p>Edition: Original retail | Year: 2022 | Language: English | File: EPUB</p>
          <p>Rating: 4.0 / 5.0</p>
        </div>
      </div>
      <!-- Add more result items as needed -->
    </div>
  </div>
  <div class="footer">
    <p>since 2024.</p>
    <a href="#">SpringBoot-MyBatis-Example</a>
  </div>
</template>

<style>

.nav {
  margin-top: 10px;
  float: right;
}

.status {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
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
import { ref } from 'vue';
import { useRouter } from "vue-router"
import request from "@/https";

interface BorrowRecord {
    book_id?: number;
    borrow_date?: string;
    id?: number;
    really_return_date?: null;
    return_date?: string;
    user_id?: number;
}

const tableData = ref<Array<BorrowRecord>>([])
let router = useRouter()
const searchContent = ref("")
const onSubmit = () => {
  console.log("search by keyword: " + searchContent.value)
  router.push({
    path: '/',
    query: { keyword: searchContent.value },
  })
}

setTimeout(()=> {
  fetchAllBorrowRecords()
}, 3000);

async function fetchAllBorrowRecords() {
  try {
    let response = await request.get<Array<BorrowRecord>>('/borrow')
    tableData.value = response.data.result
    console.log(tableData)   
  } catch (err) {
    console.log(err)
  }
}

function toLoginPage() {
  router.push({path: '/login'})
} 

</script>
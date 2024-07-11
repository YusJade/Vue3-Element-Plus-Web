<template>
  <div class="header">  
    <div class="status">
      <div class="books">0 Books</div>
      <div class="visists">0 Visists</div>
    </div>
    <!-- <div class="nav"> -->
    <el-button 
    style="float: right;" 
    text 
    size="large" 
    type="primary" 
    @click="onBtnClick">
      {{ btnTip }}
    </el-button>
    <el-drawer v-model="drawer" title="I am the title" :with-header="false" size="50%">
      <span>Hi {{ btnTip }}!</span>
      <el-button type="primary" text @click="logout">退出登录</el-button>
      <el-descriptions
      title="个人面板"
      direction="vertical"
      :column="2"
      border
      >
        <el-descriptions-item label="用户名">{{ user.username }}</el-descriptions-item>
        <el-descriptions-item label="电话">{{ user.phone }}</el-descriptions-item>
        <el-descriptions-item label="邮箱" :span="2">{{ user.email }}</el-descriptions-item>
        <el-descriptions-item label="姓名">
          <el-tag size="small">{{ user.name }}</el-tag>
          <el-tag size="small">{{ user.gender }}</el-tag>
        </el-descriptions-item>
      </el-descriptions>
      <el-form>
        <el-form-item label="用户名">
          <el-input ></el-input>
        </el-form-item>
        <el-form-item label="电话">
          <el-input ></el-input>
        </el-form-item>
        <el-form-item label="邮箱">
          <el-input ></el-input>
        </el-form-item>
        <el-form-item label="姓名">
          <el-input ></el-input>
        </el-form-item>
        <el-button type="primary" @click="saveChanges">保存</el-button>
      </el-form>
    <Table :tableData="borrows"></Table>
    </el-drawer>
    <!-- </div> -->
  </div>
  <div class="main">
    <div
    style="
      text-align: center;
      font-size: 50px;
      background-clip: text;
      background-image: -webkit-linear-gradient(0deg, #2AD5DE, #E1E87E);
      -webkit-background-clip: text;
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
    <div class="results-container" v-if="bookPage.datas.length">
      <h2>Search Books On Z-Library. The World's Largest E-book Library.</h2>
      <div class="tab-container">
        <button class="active">Books <p>{{ bookPage.totalSize }}</p></button>
      </div>
      <div class="result-item" v-for="(value, index) in bookPage.datas" :key="index">
        <img src="https://via.placeholder.com/100" alt="Book Cover">
        <div>
          <h3><a href="#">{{ value.title }}</a></h3>
          <p>作者：{{ value.author }}</p>
          <p>出版社：{{ value.publisher }}</p>
          <p>在库数目：{{ value.quantity }}</p>
          <p>在库Id:{{ value.id }}</p>
        </div>
        <el-button @click="borrow(value.id)" v-if="btnTip != '登录'">借阅</el-button>
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

<script lang="ts" setup>
import { reactive, ref } from 'vue';
import { useRouter } from "vue-router"
import request, { api } from "@/https";
import { Book, Borrow, Page, User } from "@/type";
import { storage } from '@/utils/storage';
import Table from '@/components/Table.vue';
import { create } from 'axios';
import { Message } from '@/utils/message';
import { formatDate } from '@/utils/date';

const btnTip = ref('登录')
const drawer = ref(false)
const user = ref<User>({
  id: -1,
  email: 'Unknow',
  gender: 'Unknow',
  name: 'Unknow',
  password: 'Unknow',
  phone: 'Unknow',
  username: 'Unknow'
})
const bookPage = ref<Page<Book>>({pageOn: 0, pageSize: 0, totalPage: 0, totalSize: 0, datas: []})
const router = useRouter()
const searchContent = ref("")
const tableData = ref<Array<Object>>([])
const borrows= ref<Array<Borrow>>([])

const onSubmit = () => {
  fetchAllBorrowRecords()
}

async function refreshBorrows() {
  const id = storage.get('userId')
  const response = await api.queryBorrow(id)
  borrows.value = response.data.result
}

// setTimeout( async ()=> {
//   let id = storage.get('userId')
//   if (id != 'userId') {
//     btnTip.value = storage.get('username')
//     refreshBorrows()
//   }
// }, 10);

function logout() {
  storage.remove('userId')
  location.reload()
}

async function fetchAllBorrowRecords() {
  try {
    let response = await request.get<Page<Book>>('/book', {params: {'keyword': searchContent.value}})
    bookPage.value = response.data.result
    tableData.value = bookPage.value.datas.map(item => ({
      // '编号': item.id,
      // '创建日期': item.created_at,
      id: item.id,
      date: item.created_at,
    }))
    console.log('图书信息')
    console.log(bookPage.value)
    console.log('图书信息提取')
    console.log(tableData.value)     
  } catch (err) {
    console.log(err)
  }
}

async function onBtnClick() {
  if (btnTip.value != '登录') {
    drawer.value = !drawer.value
    user.value = (await api.queryUser(storage.get('userId'))).data.result
  } else {
    router.push({path: '/login'})
  }
} 

async function borrow(bookId: number) {
  let response = await api.addBorrow(Number(storage.get('userId')), bookId)
  Message(response.data.msg)
  refreshBorrows()
}

</script>

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
  margin-top: 10px;
  /* border-bottom: 10px; */
  /* position: fixed; */
  /* top: 0;
  left: 0; */
  margin-right: auto;
  width: 50%;
  display: flex;
  gap: 10px;
}

.visists {
  text-align: center;
  background-color: #13589c;
  height: 2rem;
  width: 5rem;
  border-radius: 5px;
  font-size: 16px
}

.books {
  text-align: center;
  background-color: #13589c;
  height: 2rem;
  width: 5rem;
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
  padding-top: 20vh;
  padding-bottom: 35vh
}

.footer {
  background-color: #f6f6f6;
  padding: 20px;
  text-align: center;
  box-shadow: 0 -2px 4px rgba(0, 0, 0, 0.1);
  /* position: fixed; */
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
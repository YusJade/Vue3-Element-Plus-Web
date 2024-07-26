<template>
  <div class="header">  
    <div class="status">
      <div class="books">0 Books</div>
      <div class="visists">0 Visists</div>
    </div>
    <!-- <div class="nav"> -->
    <el-button v-if="!userStore.isLogined"
    style="float: right;" 
    text 
    size="large" 
    type="primary" 
    @click="onBtnClick">
      登录
    </el-button>
    <el-button v-else
    style="float: right;" 
    text 
    size="large" 
    type="primary" 
    @click="expandInfoDrawer">
      {{ userStore.userInfo.username }}
    </el-button>

    <el-drawer v-model="drawer" title="I am the title" :with-header="false" size="50%">
      <UserPanel></UserPanel>
      <TableC v-bind="tableConfig"></TableC>
    </el-drawer>
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
        @click="searchBook">
          搜索
        </el-button>
      </div>
    </el-form>
    <div class="results-container" v-if="bookPage.size">
      <span class="font-sans text-2xl font-semibold">搜索结果</span>
      <div class="result-item" v-for="(value, index) in bookPage.list" :key="index">
        <div class="result-item-inner">
          <span class="text-xl font-semibold">{{ value.bookTitle }}</span>
          <div class="flex"> 
            <div>
              <div class="text-base text-muted-foreground">作者: {{ value.author }}</div>
              <div class="text-base text-muted-foreground">出版社: {{ value.publisher }}</div>
            </div>
            <div>
              <div class="text-base text-muted-foreground">在库数目: {{ value.quantity }}</div>
              <div class="text-base text-muted-foreground">库存编号: {{ value.inventoryId }}</div>
            </div>
          </div>
        </div>
        <button type="button" @click="openInventory(value)">借阅</button>
      </div>
      <el-dialog v-model="inventoryDialogVisable" title="库存信息" width="400">
        <p>{{ latestViewInventory.bookTitle }}</p>
        <el-table :data="inventoryData">
          <el-table-column property="bookId" label="图书编号" width="100" />
          <el-table-column
            prop="isBorrowed"
            label="状态"
            width="100"
            :filters="[
              { text: '可借阅', value: false },
              { text: '不可用', value: true },
            ]"
            :filter-method="filterTag"
            filter-placement="bottom-end"
          >
            <template #default="scope">
              <el-tag v-if="!scope.row.isBorrowed" type="success">
                可借阅
              </el-tag>
              <el-tag v-else type="info">
                不可用
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column label="操作">
            <template #default="scope">
              <el-button @click="borrow(scope.row.bookId)" :disabled="isBorrowBtnDisabled(scope.row)">借阅</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-dialog>
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
import { onMounted, reactive, ref, toRaw } from 'vue';
import { useRouter } from "vue-router"
import request, { api, addBorrowRecord, queryBorrowRecordList, renewBorrowRecord } from "@/https";
import { Book, BookInventory, Borrow, InventoryPage, Page, User } from "@/type";
import { storage } from '@/utils/storage';
import { TableConfigInterface } from '@/components/TableC.vue'
import TableC from '@/components/TableC.vue';
import { Message } from '@/utils/message';
import { formatDate, formatDateFromStr } from '@/utils/date';
import UserPanel from '@/components/UserPanel.vue';
import { useUserStore } from '@/stores/user';
import { ElButton } from 'element-plus';
import { info } from 'console';
import { fa, ro } from 'element-plus/es/locale';

let isEditState = false;
const btnTip = ref('登录');
const drawer = ref(false);
const userStore = useUserStore();
const user = ref<User>({
  userId: 0,
  email: 'Unknown',
  gender: 'Unknown',
  name: 'Unknown',
  password: 'Unknown',
  phone: 'Unknown',
  username: 'Unknown',
});
const bookPage = ref<InventoryPage>({size: 0});
const router = useRouter();
const searchContent = ref("");
const tableData = ref<Array<Object>>([]);
const borrows= ref<Array<Borrow>>([]);
const inventoryDialogVisable = ref<boolean>(false);
const inventoryData = ref<Array<Book>>([]);
let latestViewInventory: BookInventory = {};

const tableConfig: TableConfigInterface = {
  api: `/borrow/list?userId=${userStore.userInfo.userId}`,
  columns: [
    {
      prop: 'recordId',
      label: '记录编号'
    },
    {
      prop: 'bookId',
      label: '图书编号'
    },
    {
      prop: 'borrowDate',
      label: '借阅日期',
      formatter: formatDateFromStr
    },
    {
      prop: 'oughtReturnDate',
      label: '截止日期',
      formatter: formatDateFromStr
    },
    {
      prop: 'actualReturnDate',
      label: '归还日期',
      formatter: formatDateFromStr
    },
  ],
  operation: {
    columns: [
      {
        click: () => { Message('归还') },
        text: '归还',
        icon: 'sun',
        visible: (row: Borrow) => {
          row = toRaw(row)
          // console.info(row.actualReturnDate)
          return row.actualReturnDate == null 
        },
      },
      {
        click: async (row: Borrow) => { 
          Message('续借') 
          row = toRaw(row)
          const response = await renewBorrowRecord(row.recordId)
          Message(response.data.msg)
        },
        text: '续借',
        icon: 'sunrise',
        visible: (row: Borrow) => {
          row = toRaw(row)
          // console.info(row.actualReturnDate)
          return row.actualReturnDate == null 
        }
      },
    ],
    width: 70,
  }
}

async function borrow(bookId: number) {
  addBorrowRecord(userStore.userInfo.userId, bookId);
}

function isBorrowBtnDisabled(row: Book) {
  return row.isBorrowed || row.isDiscarded;
}

const filterTag = (value: boolean, row: Book) => {
  return row.isBorrowed === value
}

async function openInventory(inventory: BookInventory) {
  console.log("打开库存信息对话框");
  inventoryDialogVisable.value = true;
  latestViewInventory =  inventory;
  const res = await request.get<Array<Book>>("/book/list", {
    params: { 'inventoryId': inventory.inventoryId }
  });
  inventoryData.value = res.data.data;
  console.info(inventoryData);
}


async function searchBook() {
  let response = await request.get<InventoryPage>('/book-inventory/paged', { params: {
      'keyword': searchContent.value
    }})
  bookPage.value = response.data.data
}


async function expandInfoDrawer() {
  drawer.value = true
  const res = await queryBorrowRecordList(null, userStore.userInfo.userId, null, false)
  borrows.value = res.data.data
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
    let response = await request.get<InventoryPage>('/book-inventory/paged', { params: {
      'keyword': searchContent.value
    }});
    bookPage.value = response.data.data
    // tableData.value = bookPage.value.datas.map(item => ({
    //   // '编号': item.id,
    //   // '创建日期': item.created_at,
    //   id: item.id,
    //   date: item.created_at,
    // }))
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
  padding-bottom: 45vh
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
  background-color: #fff;
  border: 1px solid #ccc;
  border-radius: 5px;
  padding: 0px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.result-item div {
  flex: 1;
}

.result-item-inner {
  margin: 20px;
}
</style>
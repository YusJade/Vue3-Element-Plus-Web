<template>
  <div class="header">
    <div class="status">
      <div class="books">{{ bookQuantity }} 图书在库</div>
      <!-- <div class="visists">0 访问量</div> -->
    </div>
    <!-- <div class="nav"> -->
    <el-button v-if="!userStore.isLogined"
               style="float: right; width: 6rem; height: 3rem; font-size: larger;" text
               type="primary" @click="onBtnClick">
      登录
    </el-button>
    <el-button v-else style="float: right;" text size="large" type="primary"
               @click="expandInfoDrawer">
      {{ userStore.userInfo.username }}
    </el-button>

    <el-drawer v-model="isDrawerVisable" title="I am the title" :with-header="false"
               size="50%">
      <UserPanel></UserPanel>
      <TableC v-bind="tableConfig" :refresh-trigger="isDrawerVisable"></TableC>
    </el-drawer>
  </div>
  <div class="main">
    <div style="
      text-align: center;
      font-size: 50px;
      background-clip: text;
      background-image: -webkit-linear-gradient(0deg, #2AD5DE, #E1E87E);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;">
      Firefly-Library
    </div>
    <div style="color:#90A5A8;
      text-align: center;
      font-weight:400; 
      padding:4px 0 15px 0;
      font-style: italic;">
      Part of Firefly-Library project. The class's largest library system
    </div>
    <el-form>
      <div style="display: flex;">
        <el-form-item style="width: 60%; margin-left: 15%;">
          <el-input style="width: 100%; height: 40px;" v-model="searchContent"
                    type="text">
          </el-input>
        </el-form-item>
        <el-button style="height: 40px" color="#40E2A6" type="primary" plain
                   @click="searchBook">
          搜索
        </el-button>
      </div>
    </el-form>
    <transition name="fade">
      <div class="results-container" v-if="bookPage.size">
        <span class="text-2xl font-semibold">搜索结果</span>
        <div class="result-item" v-for="(value, index) in bookPage.list" :key="index">
          <div class="result-item-inner">
            <span class="text-xl font-semibold">{{ value.bookTitle }}</span>
            <div class="flex">
              <div>
                <div class="text-base text-muted-foreground">作者: {{ value.author }}</div>
                <div class="text-base text-muted-foreground">出版社: {{ value.publisher }}
                </div>
              </div>
              <div>
                <div class="text-base text-muted-foreground">在库数目: {{ value.quantity }}
                </div>
                <div class="text-base text-muted-foreground">库存编号: {{ value.inventoryId }}
                </div>
              </div>
            </div>
          </div>
          <button class="search-btn" type="button"
                  @click="openInventory(value)">借阅</button>
        </div>
        <el-dialog v-model="inventoryDialogVisable" title="库存信息" width="400">
          <p>{{ latestViewInventory.bookTitle }}</p>
          <el-table :data="inventoryData">
            <el-table-column property="bookId" label="图书编号" width="100" />
            <el-table-column prop="isBorrowed" label="状态" width="100" :filters="[
              { text: '可借阅', value: false },
              { text: '不可用', value: true },
            ]" :filter-method="filterTag" filter-placement="bottom-end">
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
                <el-button type="primary" @click="borrow(scope.row)" size="small"
                           :disabled="isBorrowBtnDisabled(scope.row)">借阅</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-dialog>
      </div>
    </transition>
  </div>

  <div class="footer">
    <p>since 2024.</p>
    <img style="width: 1%;" src="../assets/github-mark.svg"></img>
    <a
       href="https://github.com/YusJade/SpringBoot-MyBatis-Example">YusJade/SpringBoot-MyBatis-Example</a>
    <img style="width: 1%;" src="../assets/github-mark.svg"></img>
    <a
       href="https://github.com/YusJade/SpringBoot-MyBatis-DBDesign">YusJade/SpringBoot-MyBatis-DBDesign</a>
    <img style="width: 1%;" src="../assets/github-mark.svg"></img>
    <a
       href="https://github.com/YusJade/Vue3-Element-Plus-Web">YusJade/Vue3-Element-Plus-Web</a>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, reactive, ref, toRaw } from 'vue'
import { useRouter } from "vue-router"
import request, { api, } from "@/https"
import { listBook } from '@/api/book'
import { addBorrowRecord, queryBorrowRecordList, renewBorrowRecord, returnBorrowRecord } from "@/api/borrow"
import { type Book, type BookInventory, type Borrow, type InventoryPage, type User } from "@/type"
import { TableConfigInterface } from '@/components/TableC.vue'
import TableC from '@/components/TableC.vue'
import { Message } from '@/utils/message'
import { formatDateFromStr } from '@/utils/date'
import UserPanel from '@/components/UserPanel.vue'
import { useUserStore } from '@/stores/user'
import { ElButton } from 'element-plus'

let bookQuantity = ref<number>(0)
let isEditState = false
const btnTip = ref('登录')
const isDrawerVisable = ref(false)
const userStore = useUserStore()
const user = ref<User>({
  userId: 0,
  email: 'Unknown',
  gender: 'Unknown',
  name: 'Unknown',
  password: 'Unknown',
  phone: 'Unknown',
  username: 'Unknown',
});
const bookPage = ref<InventoryPage>({ size: 0 })
const router = useRouter()
const searchContent = ref("")
const tableData = ref<Array<Object>>([])
const borrows = ref<Array<Borrow>>([])
const inventoryDialogVisable = ref<boolean>(false)
let inventoryData = ref<Array<Book>>([])
let latestViewInventory: BookInventory = {}

onMounted(() => {
  console.info(userStore.isLogined)
  listBook(null, null, null, null)
    .then((response) => {
      if (response && response.data) {
        if (response.data.code == 1) {
          bookQuantity.value = response.data.data.length
          Message(`检索图书完成，欢迎~`)
        } else {
          Message(response.data.msg)
        }
      }
    })
    .then((error) => {
      console.log(error)
    })
})

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
        isRefresh: true,
        click: (row: Borrow) => {
          returnBorrowRecord(row.recordId)
            .then((res) => {
              if (res && res.data) {
                Message(res.data.msg)
              }
            })
        },
        text: '归还',
        // icon: 'sun',
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
        // icon: 'sunrise',
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

function borrow(row: Book) {
  addBorrowRecord(userStore.userInfo.userId, row.bookId)
    .then((response) => {
      if (response && response.data) {
        Message(response.data.msg)
        if (response.data.code == 1) {
          return listBook(null, row.inventoryId, null, null)
        }
      }
    })
    .then((response) => {
      if (response && response.data) {
        Message(response.data.msg)
        if (response.data.code == 1) {
          inventoryData.value = response.data.data
        }
      }
    })
    .catch((e) => {
      console.log(e)
    })
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
  latestViewInventory = inventory;
  const res = await request.get<Array<Book>>("/book/list", {
    params: { 'inventoryId': inventory.inventoryId }
  });
  inventoryData.value = res.data.data;
  console.info(inventoryData);
}


async function searchBook() {
  let response = await request.get<InventoryPage>('/book-inventory/paged', {
    params: {
      'keyword': searchContent.value
    }
  })
  bookPage.value = response.data.data
}


async function expandInfoDrawer() {
  isDrawerVisable.value = true
  const res = await queryBorrowRecordList(null, userStore.userInfo.userId, null, false)
  borrows.value = res.data.data
}

async function refreshBorrows() {
  const id = useUserStore().userInfo.userId
  const response = await api.queryBorrow(String(id))
  borrows.value = response.data.data
}

// setTimeout( async ()=> {
//   let id = storage.get('userId')
//   if (id != 'userId') {
//     btnTip.value = storage.get('username')
//     refreshBorrows()
//   }
// }, 10);


async function fetchAllBorrowRecords() {
  try {
    let response = await request.get<InventoryPage>('/book-inventory/paged', {
      params: {
        'keyword': searchContent.value
      }
    });
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
    const id = useUserStore().userInfo.userId
    isDrawerVisable.value = !isDrawerVisable.value
    user.value = (await api.queryUser(String(id))).data.data
  } else {
    router.push({ path: '/login' })
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
  /* background-color: #13589c; */
  height: 2rem;
  width: 7rem;
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
  /* background-color: #fff; */
  /* border: 1px solid #ccc; */
  border-radius: 5px;
  padding: 20px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.results-container h2 {
  text-align: center;
  color: #4CAF50;
}

.result-item {
  margin-top: 10px;
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

.search-btn {
  width: 10%;
  height: auto;
  font-size: 15px;
  font-weight: 500;
  border: none;
  padding: 0.75rem;
  /* border-radius: 0.5rem; */
  background-image: -webkit-linear-gradient(0deg, #E1E87E, #2AD5DE);
  color: #ffffff;
  position: relative;
  cursor: pointer;
  z-index: 0;
}

.search-btn:before {
  content: '';
  width: 0%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
  opacity: 0;

  padding: 0.75rem;
  /* border-radius: 0.5rem; */
  background-image: -webkit-linear-gradient(0deg, #E1E87E, #EF412B);
  z-index: -1;
  transition: cubic-bezier(0.23, 1, 0.320, 1) 0.2s;
  /* transition: all 0.4s; */
}

.search-btn:hover:before {
  width: 100%;
  height: 100%;
  opacity: 1;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s ease;
}

.fade-enter-from,
.fade-leave-to

/* .fade-leave-active in <2.1.8 */
  {
  opacity: 0;
}
</style>
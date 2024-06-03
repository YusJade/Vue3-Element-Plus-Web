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
            <el-dropdown-item>Action 1</el-dropdown-item>
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
      /* 将背景设为渐变 */
      background-image: -webkit-linear-gradient(0deg, #2AD5DE, #E1E87E);
      /* 规定背景绘制区域 */
      -webkit-background-clip: text;
      /* 将文字隐藏 */
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


</style>

<script lang="ts" setup>
import { ref } from 'vue';
import { useRouter } from "vue-router"

let router = useRouter()
const searchContent = ref("")
const onSubmit = () => {
  console.log("search by keyword: " + searchContent.value)
  router.push({
    path: '/book',
    query: { keyword: searchContent.value },
  })
}
</script>
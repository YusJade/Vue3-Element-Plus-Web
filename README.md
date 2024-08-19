# Vue3-Element-plus-web 仓库浏览指引
这是一个使用 Vue3 + Element-Plus 搭建的 Web 前端应用。
 - > [🍏Vue.js：渐进式 JavaScript 框架](https://cn.vuejs.org/)
 - >[🍎Element Plus：基于 Vue 3，面向设计师和开发者的组件库](https://element-plus.org/zh-CN/)

## 如何运行该工程
请确保你配置了`Node.js`和包管理工具`npm`，然后在终端使用以下指令运行工程：
```sh
npm install
npm run dev
```

## TODOs

- [x] 封装编辑对话框 `EditDialog`
  - [x] 从父组件绑定响应式数据 
  - [x] 支持文本输入 `el-input`
  - [x] 可配置数字输入 `el-number-input`
  - [x] 可配置不可编辑项 `props: unchangeable`
- [ ] 图书分类管理面板
- [ ] 用户编辑界面授予权限
- [ ] 管理员登录
- [ ] 数据可视化
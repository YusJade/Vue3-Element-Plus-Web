import { defineStore } from 'pinia'
import { ref } from 'vue'
import request from '../https'
import { Message } from '@/utils/message';
import type { BookInventory, User } from '@/type';

// defineStore: Pinia 的组件化风格，以 setup 的形式定义 store
export const useInventoryMapStore = defineStore('users', {
  state: () => {
    return {
      // 用户信息
      idToNameMap: {} as Map<number, string>,
    }
  },
  actions: {
    // 定义获取接口数据的 action 函数
    updateMap() {
      let inventoryInfo: BookInventory[]
      request.get('/book-inventory/list')
        .then((respone) => {
          inventoryInfo = respone.data.data
          Message(respone.data.msg)
          this.idToNameMap = new Map(inventoryInfo.map(item => [item.inventoryId, item.bookTitle] as [number, string]))
          return this.idToNameMap
        })
    },
  },
})
import { defineStore } from 'pinia'
import { ref } from 'vue'
import { userLogin } from '../https'

// defineStore: Pinia 的组件化风格，以 setup 的形式定义 store
export const useUserStore = defineStore('user', () => {
    // 定义管理用户数据的 state
    const userInfo = ref({});
    // 定义获取接口数据的 action 函数
    const getUserInfo = async (username, password) => {
      const res = await userLogin(username, password);
      userInfo.value = res.data.data;
      return res.data;
    }
    return { userInfo, getUserInfo }
})

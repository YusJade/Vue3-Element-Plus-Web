import { defineStore } from 'pinia'
import { ref } from 'vue'
import { userLogin, queryUser } from '@/api/user'
import { Message } from '@/utils/message';
import type { User } from '@/type';

// defineStore: Pinia 的组件化风格，以 setup 的形式定义 store
export const useUserStore = defineStore('users', {
  state: () => {
    return {
      // 用户信息
      userInfo: {} as User,
      isLogined: false as boolean,
    }
  },
  actions: {
    // 定义获取接口数据的 action 函数
    async login(username: string, password: string) {
      const res = await userLogin(username, password);
      this.userInfo = (await queryUser(res.data.data)).data.data;
      console.info('from Pinia:', res);
      if (res.data.code == 1) {
        this.isLogined = true;
      }
      return res.data;
    },
    // 定义获取接口数据的 action 函数
    async logout() {
      this.userInfo = {
        userId: 0,
        email: 'Unknown',
        gender: 'Unknown',
        name: 'Unknown',
        password: 'Unknown',
        phone: 'Unknown',
        username: 'Unknown',
      };
      this.isLogined = false;
      Message('退出登录');
    },
  },
  // 持久化配置
  persist: true
})

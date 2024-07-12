import { defineStore } from 'pinia'
import { ref } from 'vue'
import { api, userLogin, queryUser } from '../https'
import { Message } from '@/utils/message';
import type { User } from '@/type';

// defineStore: Pinia ������������ setup ����ʽ���� store
export const useUserStore = defineStore('users', {
  state:  () => {
    return {
      // �û���Ϣ
      userInfo: { } as User,
      isLogined: false as boolean,
    }
  },
  actions: {
    // �����ȡ�ӿ����ݵ� action ����
    async login(username: string, password: string) {
      const res = await userLogin(username, password);
      this.userInfo = (await queryUser(res.data.data)).data.data;
      console.info('from Pinia:', res);
      if (res.data.code == api.code.SUCCESS) {
        this.isLogined = true;
      }
      return res.data;
    },
    // �����ȡ�ӿ����ݵ� action ����
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
      Message('�˳���¼');
    },
  },
})

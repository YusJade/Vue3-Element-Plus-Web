import { defineStore } from 'pinia'
import { ref } from 'vue'
import { userLogin } from '../https'

// defineStore: Pinia ������������ setup ����ʽ���� store
export const useUserStore = defineStore('user', () => {
    // ��������û����ݵ� state
    const userInfo = ref({});
    // �����ȡ�ӿ����ݵ� action ����
    const getUserInfo = async (username, password) => {
      const res = await userLogin(username, password);
      userInfo.value = res.data.data;
      return res.data;
    }
    return { userInfo, getUserInfo }
})

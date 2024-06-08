export const storage = {

  /** �洢���� */
  set(key: string, value: any) {
    localStorage.setItem(key, JSON.stringify(value))
  }

  /** ȡ������ */
  get<T>(key: string) {
    const value = localStorage.getItem(key)
    if (!value) {
      return key;
    }
    return value;
  }

  /** �Ƴ����� */
  remove(key: string) {
    localStorage.removeItem(key)
  }

}
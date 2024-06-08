export const storage = {

  /** 存储数据 */
  set(key: string, value: any) {
    localStorage.setItem(key, JSON.stringify(value))
  }

  /** 取出数据 */
  get<T>(key: string) {
    const value = localStorage.getItem(key)
    if (!value) {
      return key;
    }
    return value;
  }

  /** 移除数据 */
  remove(key: string) {
    localStorage.removeItem(key)
  }

}
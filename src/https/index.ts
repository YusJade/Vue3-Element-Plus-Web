// 接口封装
import { Borrow, type BookInventory, type User } from '@/type';
import axios from 'axios';
import type { AxiosInstance, AxiosRequestConfig, AxiosResponse, InternalAxiosRequestConfig } from 'axios';
import { TIMEOUT } from 'dns/promises';
import { ElMessage } from 'element-plus';
import { get, post } from 'node_modules/axios/index.cjs';
import { h } from 'vue';

type Result<T> = {
  code: number;
  msg: string;
  data: T;
};

// 导出 Request �?
export class Request {
  instance: AxiosInstance;
  baseConfig: AxiosRequestConfig = { baseURL: "/api", timeout: 3000 };

  constructor(config: AxiosRequestConfig) {
    this.instance = axios.create(Object.assign(this.baseConfig, config));

    // 配置请求拦截�?
    this.instance.interceptors.request.use(
      (config: InternalAxiosRequestConfig) => {
        // 在请求前进行拦截，完成鉴权相关的操作
        console.log("请求配置如下")
        console.log(config)
        return config;
      },
      (err: any) => {
        console.log("请求报错如下")
        console.log(err)
        return Promise.reject(err);
      }
    );

    // 配置响应拦截�?
    this.instance.interceptors.response.use(
      (res: AxiosResponse) => {
        console.log("响应如下")
        console.log(res)
        return res;
      },
      (err: any) => {
        let message = '';
        console.log("响应报错如下")
        console.log(err)
        switch (err.response.status) {
          case 400:
            message = "请求错误(400)";
            console.log(message)
            ElMessage({
              message: h('p', { style: 'line-height: 1; font-size: 14px' }, [
                h('span', null, "服务器错误:<")
              ]),
            })
            break;
          case 401:
            message = "未授权，请重新登录(401)";
            // 这里可以做清�? storage 并跳转到登录页的操作
            break;
          case 403:
            message = "拒绝访问(403)";
            break;
          case 404:
            message = "请求出错(404)";
            break;
          case 408:
            message = "请求超时(408)";
            break;
          case 500:
            message = "服务器错误(500)";
            console.log(message)
            ElMessage({
              message: h('p', { style: 'line-height: 1; font-size: 14px' }, [
                h('span', null, "服务器错误 :<")
              ]),
            })
            break;
          case 501:
            message = "服务未实现(501)";
            break;
          case 502:
            message = "网络错误(502)";
            break;
          case 503:
            message = "服务不可用(503)";
            break;
          case 504:
            message = "网络超时(504)";
            break;
          case 505:
            message = "HTTP版本不受支持(505)";
            break;
          default:
            message = `连接出错(${err.response.status})!`;
            ElMessage({
              message: h('p', { style: 'line-height: 1; font-size: 14px' }, [
                h('span', null, "连接出错 :<")
              ]),
            })
        }
        // 可以使用全局弹框展示错误消息
        return Promise.reject(err.response)
      }
    );
  }

  // 进一步封装请求方�?
  public request(config: AxiosRequestConfig): Promise<AxiosResponse> {
    return this.instance.request(config);
  }

  public get<T = any>(
    url: string,
    config?: AxiosRequestConfig
  ): Promise<AxiosResponse<Result<T>>> {
    return this.instance.get(url, config);
  }


  public post<T = any>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<AxiosResponse<Result<T>>> {
    return this.instance.post(url, data, config);
  }

  public put<T = any>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<AxiosResponse<Result<T>>> {
    return this.instance.put(url, data, config);
  }

  public delete<T = any>(
    url: string,
    config?: AxiosRequestConfig
  ): Promise<AxiosResponse<Result<T>>> {
    return this.instance.delete(url, config);
  }
}

const request = new Request({})

export const userLogin = (username: string, password: string) => {
  return request.post('/user/login', { 'username': username, 'password': password })
}

export const userRegister = (data: User) => {
  return request.post('/user/register', {
    "username": data.username,
    "password": data.password,
    "name": data.name,
    "gender": data.gender,
    "phone": data.phone,
    "email": data.email
  })
}

export const queryUser = (id: string) => {
  return request.get<User>(`/user/${Number(id)}`)
}

export const modifyUserInfo = (id: string, info: User) => {
  return request.put(`/user/${id}`, {
    "username": info.username,
    "name": info.name,
    "gender": info.gender,
    "phone": info.phone,
    "email": info.email
  })
}

export const queryUserId = (username: string) => {
  return request.get<User>(`/user/id/${username}`)
}

export const addBorrowRecord = (userId: number, bookId: number) => {
  return request.post('/borrow', {
    bookId: bookId,
    userId: userId
  })
}

export const renewBorrowRecord = (recordId: number) => {
  return request.put(`/borrow/${recordId}/renew`)
}

export const returnBorrowRecord = () => {

}

/** 修改库存信息 */
export const modifyBookInventory = (record: BookInventory) => {
  return request.put(`/book-inventory/${record.inventoryId}`, record)
}

/** 删除库存 */
export const removeBookInventory = (id: number) => {
  return request.delete(`/book-inventory/${id}`)
}

export const queryBorrowRecordList = (recordId: number, userId: number, bookId: number, excludeFinished: boolean) => {
  return request.get<Array<Borrow>>(`/borrow/list`, {
    params: {
      recordId: recordId,
      userId: userId,
      bookId: bookId,
      excludeFinished: excludeFinished
    }
  })
}


export const api = {

  code: {
    INFO_ERROR: 400,
    USERNAME_DUPLICATE: 401,
    SUCCESS: 1,
    SERVER_ERROR: 501,
    TIMEOUT: 502,
    BOOK_NOT_EXIST: 601,
    BOOK_NOT_AVAILIABLE: 602,
    LIMIT_BORROW: 603,
    BORROW_DUPLICATE: 604,
    BORROW_NOT_EXIST: 605,
    RETURN_OVERDUE: 606,
    RETURN_DUPLICATE: 607,
    ACCOUNT_NOT_EXIST: 0,
    PASSWORD_ERROR: 702,
  },
  userLogin(username: string, password: string) {
    return request.post('/user/login', { 'username': username, 'password': password })
  },
  userRegister(data: User) {
    return request.post('/user/register', {
      "username": data.username,
      "password": data.password,
      "name": data.name,
      "gender": data.gender,
      "phone": data.phone,
      "email": data.email
    })
  },
  queryUser(id: string) {

    return request.get<User>(`/user/${Number(id)}`)
  },
  queryBorrow(id: string) {
    return request.get<Array<Borrow>>('/borrow', {
      params: {
        'user_id': id,
        'contain_finished': false
      }
    })
  },
  addBorrow(userId: number, bookId: number) {
    return request.post<number>('/borrow', {
      'user_id': userId,
      'book_id': bookId
    })
  }
}

export default new Request({})
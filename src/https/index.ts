// 接口封装
import axios from 'axios';
import type { AxiosInstance, AxiosRequestConfig, AxiosResponse, InternalAxiosRequestConfig } from 'axios';

type Result<T> = {
  code: number;
  message: string;
  result: T;
};

// 导出 Request 类
export class Request {
  instance: AxiosInstance;
  baseConfig: AxiosRequestConfig = { baseURL: "/api", timeout: 3000 };

  constructor(config: AxiosRequestConfig) {
    this.instance = axios.create(Object.assign(this.baseConfig, config));

    // 配置请求拦截器
    this.instance.interceptors.request.use(
      (config: InternalAxiosRequestConfig) => {
        // 在请求前进行拦截，完成鉴权相关的操作
        return config;
      },
      (err: any) => {
        return Promise.reject(err);
      }
    );

    // 配置响应拦截器
    this.instance.interceptors.response.use(
      (res: AxiosResponse) => {
        return res;
      },
      (err: any) => {
        let message = '';
        switch (err.response.status) {
          case 400:
            message = "请求错误(400)";
            break;
          case 401:
            message = "未授权，请重新登录(401)";
            // 这里可以做清空 storage 并跳转到登录页的操作
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
        }
        // 可以使用全局弹框展示错误消息
        return Promise.reject(err.response)
      }
    );
  }

  // 进一步封装请求方法
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

export default new Request({})

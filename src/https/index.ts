// �ӿڷ�װ
import axios from 'axios';
import type { AxiosInstance, AxiosRequestConfig, AxiosResponse, InternalAxiosRequestConfig } from 'axios';

type Result<T> = {
  code: number;
  message: string;
  result: T;
};

// ���� Request ��
export class Request {
  instance: AxiosInstance;
  baseConfig: AxiosRequestConfig = { baseURL: "/api", timeout: 3000 };

  constructor(config: AxiosRequestConfig) {
    this.instance = axios.create(Object.assign(this.baseConfig, config));

    // ��������������
    this.instance.interceptors.request.use(
      (config: InternalAxiosRequestConfig) => {
        // ������ǰ�������أ���ɼ�Ȩ��صĲ���
        return config;
      },
      (err: any) => {
        return Promise.reject(err);
      }
    );

    // ������Ӧ������
    this.instance.interceptors.response.use(
      (res: AxiosResponse) => {
        return res;
      },
      (err: any) => {
        let message = '';
        switch (err.response.status) {
          case 400:
            message = "�������(400)";
            break;
          case 401:
            message = "δ��Ȩ�������µ�¼(401)";
            // ������������ storage ����ת����¼ҳ�Ĳ���
            break;
          case 403:
            message = "�ܾ�����(403)";
            break;
          case 404:
            message = "�������(404)";
            break;
          case 408:
            message = "����ʱ(408)";
            break;
          case 500:
            message = "����������(500)";
            break;
          case 501:
            message = "����δʵ��(501)";
            break;
          case 502:
            message = "�������(502)";
            break;
          case 503:
            message = "���񲻿���(503)";
            break;
          case 504:
            message = "���糬ʱ(504)";
            break;
          case 505:
            message = "HTTP�汾����֧��(505)";
            break;
          default:
            message = `���ӳ���(${err.response.status})!`;
        }
        // ����ʹ��ȫ�ֵ���չʾ������Ϣ
        return Promise.reject(err.response)
      }
    );
  }

  // ��һ����װ���󷽷�
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

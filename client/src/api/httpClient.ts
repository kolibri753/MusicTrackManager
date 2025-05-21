import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from "axios";

/** 
 * HTTP abstraction 
 */
export interface IHttpClient {
  get<T>(url: string, cfg?: AxiosRequestConfig): Promise<T>;
  post<T>(url: string, data?: unknown, cfg?: AxiosRequestConfig): Promise<T>;
  put<T>(url: string, data?: unknown, cfg?: AxiosRequestConfig): Promise<T>;
  delete<T>(url: string, cfg?: AxiosRequestConfig): Promise<T>;
}

/** 
 * Axios implementation 
 */
export class AxiosHttpClient implements IHttpClient {
  constructor(private readonly axiosInstance: AxiosInstance = axios) {}

  async get<T>(url: string, cfg?: AxiosRequestConfig): Promise<T> {
    const res: AxiosResponse<T> = await this.axiosInstance.get(url, cfg);
    return res.data;
  }

  async post<T>(
    url: string,
    data?: unknown,
    cfg?: AxiosRequestConfig
  ): Promise<T> {
    const res: AxiosResponse<T> = await this.axiosInstance.post(url, data, cfg);
    return res.data;
  }

  async put<T>(
    url: string,
    data?: unknown,
    cfg?: AxiosRequestConfig
  ): Promise<T> {
    const res: AxiosResponse<T> = await this.axiosInstance.put(url, data, cfg);
    return res.data;
  }

  async delete<T>(url: string, cfg?: AxiosRequestConfig): Promise<T> {
    const res: AxiosResponse<T> = await this.axiosInstance.delete(url, cfg);
    return res.data;
  }
}

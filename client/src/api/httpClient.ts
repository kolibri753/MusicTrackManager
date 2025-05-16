import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from "axios";

/**
 * Abstraction for HTTP operations.
 */
export interface IHttpClient {
  get<T>(url: string, config?: AxiosRequestConfig): Promise<T>;
  post<T>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T>;
  put<T>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T>;
  delete<T>(url: string, config?: AxiosRequestConfig): Promise<T>;
}

/**
 * Axios-based implementation of IHttpClient.
 */
export class AxiosHttpClient implements IHttpClient {
  constructor(private readonly axiosInstance: AxiosInstance = axios) {}

  async get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response: AxiosResponse<T> = await this.axiosInstance.get<T>(
      url,
      config
    );
    return response.data;
  }

  async post<T>(
    url: string,
    data?: unknown,
    config?: AxiosRequestConfig
  ): Promise<T> {
    const response: AxiosResponse<T> = await this.axiosInstance.post<T>(
      url,
      data,
      config
    );
    return response.data;
  }

  async put<T>(
    url: string,
    data?: unknown,
    config?: AxiosRequestConfig
  ): Promise<T> {
    const response: AxiosResponse<T> = await this.axiosInstance.put<T>(
      url,
      data,
      config
    );
    return response.data;
  }

  async delete<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response: AxiosResponse<T> = await this.axiosInstance.delete<T>(
      url,
      config
    );
    return response.data;
  }
}

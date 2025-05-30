import axios from "axios";
import type { AxiosInstance, AxiosRequestConfig, AxiosResponse } from "axios";

/**
 * Normalised transport error
 */
export class HttpError extends Error {
  public readonly status: number | undefined;

  constructor(status: number | undefined, message: string = "Request failed") {
    super(message);
    this.status = status;
    Object.setPrototypeOf(this, HttpError.prototype);
  }
}

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
  private readonly axiosInstance: AxiosInstance;

  constructor(axiosInstance: AxiosInstance = axios) {
    this.axiosInstance = axiosInstance;
  }

  private static toHttpError(err: unknown): never {
    if (axios.isAxiosError(err)) {
      const payload = err.response?.data as { error?: string } | undefined;
      const message = payload?.error ?? err.message;
      throw new HttpError(err.response?.status, message);
    }
    throw err;
  }

  async get<T>(url: string, cfg?: AxiosRequestConfig): Promise<T> {
    try {
      const res: AxiosResponse<T> = await this.axiosInstance.get(url, cfg);
      return res.data;
    } catch (err: unknown) {
      return AxiosHttpClient.toHttpError(err);
    }
  }

  async post<T>(
    url: string,
    data?: unknown,
    cfg?: AxiosRequestConfig
  ): Promise<T> {
    try {
      const res: AxiosResponse<T> = await this.axiosInstance.post(
        url,
        data,
        cfg
      );
      return res.data;
    } catch (err: unknown) {
      return AxiosHttpClient.toHttpError(err);
    }
  }

  async put<T>(
    url: string,
    data?: unknown,
    cfg?: AxiosRequestConfig
  ): Promise<T> {
    try {
      const res: AxiosResponse<T> = await this.axiosInstance.put(
        url,
        data,
        cfg
      );
      return res.data;
    } catch (err: unknown) {
      return AxiosHttpClient.toHttpError(err);
    }
  }

  async delete<T>(url: string, cfg?: AxiosRequestConfig): Promise<T> {
    try {
      const res: AxiosResponse<T> = await this.axiosInstance.delete(url, cfg);
      return res.data;
    } catch (err: unknown) {
      return AxiosHttpClient.toHttpError(err);
    }
  }
}

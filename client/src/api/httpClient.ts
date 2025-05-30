import axios from "axios";
import type {
  AxiosError,
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
} from "axios";
import { ok, err, Result } from "neverthrow";
import type { AppError } from "./errors";

/**
 * HTTP abstraction
 */
export interface IHttpClient {
  get<T>(url: string, cfg?: AxiosRequestConfig): Promise<Result<T, AppError>>;
  post<T>(
    url: string,
    data?: unknown,
    cfg?: AxiosRequestConfig
  ): Promise<Result<T, AppError>>;
  put<T>(
    url: string,
    data?: unknown,
    cfg?: AxiosRequestConfig
  ): Promise<Result<T, AppError>>;
  delete<T>(
    url: string,
    cfg?: AxiosRequestConfig
  ): Promise<Result<T, AppError>>;
}

export class AxiosHttpClient implements IHttpClient {
  private readonly ax: AxiosInstance;

  constructor(axiosInstance: AxiosInstance = axios) {
    this.ax = axiosInstance;
  }

  private toError(e: unknown): AppError {
    if (axios.isAxiosError(e)) {
      const ae = e as AxiosError<{ error?: string }>;
      const msg = ae.response?.data?.error ?? ae.message;

      switch (ae.response?.status) {
        case 404:
          return { type: "NotFound", resource: "Unknown", message: msg };
        case 409:
          return { type: "Conflict", resource: "Unknown", message: msg };
        case 400:
          return { type: "Validation", fieldErrors: {}, message: msg };
        default:
          return { type: "Network", status: ae.response?.status, message: msg };
      }
    }
    return { type: "Unknown", cause: e, message: "Unexpected error" };
  }

  private async wrap<T>(
    p: Promise<AxiosResponse<T>>
  ): Promise<Result<T, AppError>> {
    try {
      const res = await p;
      return ok(res.data);
    } catch (e) {
      return err(this.toError(e));
    }
  }

  get = <T>(u: string, c?: AxiosRequestConfig) =>
    this.wrap<T>(this.ax.get(u, c));

  post = <T>(u: string, d?: unknown, c?: AxiosRequestConfig) =>
    this.wrap<T>(this.ax.post(u, d, c));

  put = <T>(u: string, d?: unknown, c?: AxiosRequestConfig) =>
    this.wrap<T>(this.ax.put(u, d, c));

  delete = <T>(u: string, c?: AxiosRequestConfig) =>
    this.wrap<T>(this.ax.delete(u, c));
}

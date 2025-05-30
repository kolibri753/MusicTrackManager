import type { ListParams } from "@/types";
import { type IHttpClient } from "./httpClient";

/**
 * Generic CRUD wrapper
 */
export abstract class BaseService<T, CreateDto = Partial<T>> {
  protected readonly http: IHttpClient;
  protected readonly resource: string;

  protected constructor(http: IHttpClient, resource: string) {
    this.http = http;
    this.resource = resource;
  }

  /**
   * GET /resource
   */
  list<P extends ListParams = ListParams>(params?: P): Promise<T[]> {
    return this.http.get<T[]>(`/api/${this.resource}`, { params });
  }

  /**
   * GET /resource/:id
   */
  getById(id: string): Promise<T> {
    return this.http.get<T>(`/api/${this.resource}/${id}`);
  }

  /**
   * POST /resource
   */
  create(dto: CreateDto): Promise<T> {
    return this.http.post<T>(`/api/${this.resource}`, dto);
  }

  /**
   * PUT /resource/:id
   */
  update(id: string, dto: CreateDto): Promise<T> {
    return this.http.put<T>(`/api/${this.resource}/${id}`, dto);
  }

  /**
   * DELETE /resource/:id
   */
  delete(id: string): Promise<void> {
    return this.http.delete<void>(`/api/${this.resource}/${id}`);
  }
}

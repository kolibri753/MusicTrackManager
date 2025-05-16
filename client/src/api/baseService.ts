import { IHttpClient } from "./httpClient";

/**
 * Generic CRUD service. T is the entity type; CreateDto describes input for create/update.
 */
export abstract class BaseService<T, CreateDto = Partial<T>> {
  constructor(
    protected readonly http: IHttpClient,
    private readonly resource: string
  ) {}

  /**
   * List all resources, with optional query params.
   */
  list(params?: Record<string, unknown>): Promise<T[]> {
    return this.http.get<T[]>(`/api/${this.resource}`, { params });
  }

  /**
   * Get single resource by ID.
   */
  getById(id: string): Promise<T> {
    return this.http.get<T>(`/api/${this.resource}/${id}`);
  }

  /**
   * Create a new resource.
   */
  create(dto: CreateDto): Promise<T> {
    return this.http.post<T>(`/api/${this.resource}`, dto);
  }

  /**
   * Update an existing resource by ID.
   */
  update(id: string, dto: CreateDto): Promise<T> {
    return this.http.put<T>(`/api/${this.resource}/${id}`, dto);
  }

  /**
   * Delete a resource by ID.
   */
  delete(id: string): Promise<void> {
    return this.http.delete<void>(`/api/${this.resource}/${id}`);
  }
}

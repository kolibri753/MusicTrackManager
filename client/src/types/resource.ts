import type { AppError } from "@/api/errors";

export interface ResourceState<T> {
  list: T[];
  loading: boolean;
  error: AppError | null; //null = OK, otherwise carries the reason
}

export interface RefreshableResourceState<T> extends ResourceState<T> {
  refetch(): void;
}

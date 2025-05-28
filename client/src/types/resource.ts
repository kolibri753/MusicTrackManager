export interface ResourceState<T> {
  list: T[];
  loading: boolean;
  error: boolean;
}

export interface RefreshableResourceState<T> extends ResourceState<T> {
  refetch(): void;
}

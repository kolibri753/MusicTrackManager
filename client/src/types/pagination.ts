import type { Meta } from "@/types";

export type ListParams = Record<string, unknown>;

export type Paginated<T, M = Meta> = { data: T[]; meta: M };

export interface TableHookState<T> {
  isDirty: boolean
  items: T[]
  currentPage: number
  limit: number
  total: number
  search: string
  timeout: number
  filters: Record<string, string | string[]> | null
  totalPages: number
  order: Record<string, 'ASC' | 'DESC'> | null
}

export type TableHook = typeof tableHook

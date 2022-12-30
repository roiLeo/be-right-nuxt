export interface TableState {
  currentPage: number
  perPage: number
  totalPages: number
  orderBy: string
  orderDir: string
  filters: Record<string, string | string[]> | null
  search: string
}

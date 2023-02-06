import { defineStore } from 'pinia'
import { useUserStore } from '../user/userStore'
import { useAuthStore } from '../auth'
import { defaultTableState, tableState } from './state'
import type { TableState } from './types'
import { EntitiesEnum } from '@/types'

export const useTableStore = defineStore(EntitiesEnum.TABLE, {
  state: () => ({ ...tableState }),
  getters: {
    getTableState: state => state,
    getCurrentPage: state => state.currentPage,
    getPerPage: state => state.perPage,
    getTotalPages: state => state.totalPages,
    getOrderBy: state => state.orderBy,
    getOrderDir: state => state.orderDir,
    getFilters: state => state.filters,
    getSearch: state => state.search,
    getFinalUrl: state => {
      const userStore = useUserStore()
      const authStore = useAuthStore()

      let url: string | null = null

      if (!authStore.isAuthUserAdmin && userStore.getAuthUserId) {
        url = `filters[createdByUserId]=${userStore.getAuthUserId}`
      }

      if (state.search) {
        if (!url) {
          url = `search=${state.search}`
        } else {
          url += `&search=${state.search}`
        }
      }

      if (state.filters) {
        Object.keys(state.filters).forEach(field => {
          if (state.filters && state.filters[field]) {
            if (url && url.length > 0) {
              url += `filters[${field}]=${state.filters[field]}`
            } else {
              url = `filters[${field}]=${state.filters[field]}`
            }
          }
        })
      }
      return url ? `?${url}&limit=${state.perPage}` : `?limit=${state.perPage}`
    },
  },
  actions: {
    resetTableState() {
      this.$state = defaultTableState()
    },

    setTableState(options: TableState) {
      this.currentPage = options.currentPage
      this.perPage = options.perPage
      this.totalPages = options.totalPages
      this.orderBy = options.orderBy
      this.orderDir = options.orderDir
      this.filters = options.filters
    },

    setSearch(search: string) {
      this.search = search
    },

    setFilters(filters: Record<string, string | string[]> | null) {
      this.search = ''
      this.filters = {
        ...filters,
      }
    },
  },
})

import { useAuthStore } from '~/store'
import { useUiStore } from '~/store/ui'
import type { TableHookState } from '~/types/TableHookTypes'
import type { PaginatedResponse } from '~/types/globals'

export default function tableHook<T>(baseUrl: string, onFetched?: ((items: T[]) => Promise<void>)) {
  const { $api, $router } = useNuxtApp()
  const uiStore = useUiStore()
  const { DecLoading, IncLoading } = uiStore
  const authStore = useAuthStore()

  const query = ref('')

  const state = reactive<TableHookState<T>>({
    isDirty: false,
    search: '',
    timeout: 0,
    items: [],
    currentPage: 0,
    limit: 20,
    total: 0,
    filters: null,
    totalPages: 0,
    order: null,
  })

  onMounted(() => {
    fetchTable()
    // Only watch when mounted to give consumers a chance to change defaults, add filters etc.
    watch(() => [$router.currentRoute.value.query], async () => {
      await fetchTable()
    }, { deep: true })

    // Watch filters separately
    watch(() => state.filters, async () => {
      await fetchTable()
    }, { deep: true })
  })

  async function fetchTable() {
    IncLoading()
    if (authStore.getIsLoggedIn) {
      if (!state.isDirty) {
        state.isDirty = true
      }

      if ($router.currentRoute.value.query) {
        state.currentPage = parseInt($router.currentRoute.value.query?.page?.toString() || state.currentPage.toString())
        state.limit = parseInt($router.currentRoute.value.query?.limit?.toString() || state.limit.toString())
        state.search = $router.currentRoute.value.query?.search?.toString() || ''
      }

      let url = `${baseUrl}/?limit=${state.limit}&page=${state.currentPage}`

      if (state.search) {
        url += `&search=${state.search}`
      }

      if (state.filters) {
        url += `&${Object.keys(state.filters)
          .map(field => {
            let value = state.filters![field]
            if (Array.isArray(value)) {
              value = value.join(',')
            }
            // Don't create empty filters.
            if (value.length) {
              return `filters[${field}]=${value}`
            }
            return null
          })
          .filter((filter: string | null) => filter !== null)
          .join('&')}`
      }

      const { data } = await $api().get<PaginatedResponse<T>>(url)

      if (data) {
        const { currentPage, data: items, limit, total, totalPages, order } = data
        state.currentPage = currentPage || 0
        state.items = items as any[] // FIXME better typing
        state.limit = limit || 20
        state.total = total || 0
        state.totalPages = totalPages || 0
        state.order = order

        if (onFetched) {
          await onFetched(state.items as T[])
        }
      }
    }
    DecLoading()
  }

  function resetFilters() {
    state.filters = null
    $router.push({
      name: $router.currentRoute.value.name!,
      query: {
        page: 1,
        search: '',
        limit: 20,
      },
    })
  }

  function setFilter(value: Record<string, string | string[]>) {
    state.filters = value
  }

  function searchEntity() {
    clearTimeout(state.timeout)
    state.timeout = window.setTimeout(() => {
      query.value = state.search
      $router.push({
        name: $router.currentRoute.value.name!,
        query: {
          ...$router.currentRoute.value.query,
          search: query.value,
        },
      })
    }, 500)
  }

  function updateLimit(limit: number) {
    $router.push({
      name: $router.currentRoute.value.name!,
      query: {
        ...$router.currentRoute.value.query,
        limit,
      },
    })
  }

  return {
    fetchTable,
    query,
    resetFilters,
    searchEntity,
    setFilter,
    state,
    updateLimit,
  }
}

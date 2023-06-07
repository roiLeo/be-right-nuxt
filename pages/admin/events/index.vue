<template>
<PageAuthWrapper>
  <div class="h-full px-4 mt-4 sm:px-6 lg:px-8">
    <div
      v-if="authStore.isAuthUserAdmin"
      class=" sm:flex-col lg:flex-row lg:items-center"
    >
      <div class="w-full mb-4 sm:flex-auto">
        <input
          v-model="state.search"
          class="block w-full px-4 py-2 text-gray-800 border border-gray-300 rounded-md shadow-md appearance-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
          :class="[{ 'cursor-not-allowed border-gray-500 bg-gray-200 opacity-40': uiStore.getUIIsLoading }]"
          :disabled="uiStore.getUIIsLoading"
          type="text"
          placeholder="Recherchez"
          @keyup="searchEntity"
        >
      </div>

      <div class="flex items-center justify-between">
        <EventTableFilters @setFilter="setFilter" />

        <BaseButton
          :is-loading="uiStore.getUIIsLoading"
          :disabled="uiStore.getUIIsLoading"
          @click="resetFilters"
        >
          Reset Filters
        </BaseButton>
      </div>
    </div>

    <BaseTable>
      <template #header>
        <EventTableHeader />
      </template>

      <template #default>
        <div
          v-if="state.items.length <= 0"
          class="flex items-center py-4 pl-4 pr-3 space-x-2 text-sm font-medium text-gray-900 truncate whitespace-nowrap sm:pl-6"
        >
          <p>Aucun événement enregistré!</p>
          <BaseButton :href="{ name: RouteNames.CREATE_EVENT_STEP_1 }">
            Créer un événement
          </BaseButton>
        </div>

        <BaseLoader v-else-if="uiStore.getUIIsLoading" />
        <template v-else>
          <EventItem
            v-for="event in state.items"
            :key="event.id"
            :event="event"
          />
        </template>
      </template>

      <template #footer>
        <EventTablePagination
          :total-pages="state.totalPages"
          :current-page="state.currentPage"
        />
      </template>
    </BaseTable>
  </div>
</PageAuthWrapper>
</template>

<script setup lang="ts">
import PageAuthWrapper from '~/components/Page/PageAuthWrapper.vue'
import BaseButton from '~/components/Base/BaseButton.vue'
import EventItem from '~/components/Event/Table/EventItem.vue'
import BaseLoader from '~/components/Base/BaseLoader.vue'
import BaseTable from '~/components/Base/BaseTable.vue'
import EventTableHeader from '~~/components/Event/Table/Header.vue'
import EventTableFilters from '~~/components/Event/Table/Filters.vue'
import EventTablePagination from '~~/components/Event/Table/Pagination.vue'
import { RouteNames } from '~~/helpers/routes'
import type { EventType } from '~~/store'
import { useAuthStore, useUiStore } from '~~/store'
import type { EventStatusEnum, PaginatedResponse } from '~/types'

const authStore = useAuthStore()
const uiStore = useUiStore()
const { DecLoading, IncLoading } = uiStore
const { fetchManyAnswerForManyEvent } = answerHook()

const query = ref('')
const { $api, $router } = useNuxtApp()

const state = reactive<{
  items: EventType[]
  currentPage: number
  limit: number
  total: number
  isDirty: boolean
  search: string
  timeout: number
  filters: EventStatusEnum | null
  totalPages: number
}>({
  search: '',
  timeout: 0,
  isDirty: false,
  items: [],
  currentPage: 0,
  limit: 1,
  total: 0,
  filters: null,
  totalPages: 0,
})

onMounted(async () => {
  await fetchEvents()
})

watch(() => [query.value, state.filters, $router.currentRoute.value.query], async () => {
  await fetchEvents()
}, { deep: true })

async function fetchEvents() {
  IncLoading()

  if ($router.currentRoute.value.query) {
    state.currentPage = parseInt($router.currentRoute.value.query?.page?.toString() || '1')
    state.limit = parseInt($router.currentRoute.value.query?.limit?.toString() || '20')
    state.search = $router.currentRoute.value.query?.search?.toString() || ''
  }

  let url = `event/?limit=${state.limit}&page=${state.currentPage}`

  if (state.search) {
    url += `&search=${state.search}`
  }

  if (state.filters) {
    url += `&filters[status]=${state.filters}`
  }

  const { data } = await $api().get<PaginatedResponse<EventType>>(url)

  if (data) {
    const { currentPage, data: events, limit, total, totalPages } = data
    state.currentPage = currentPage || 0
    state.items = events
    state.limit = limit || 20
    state.total = total || 0
    state.totalPages = totalPages || 0

    if (state.items.length > 0) {
      await fetchManyAnswerForManyEvent(state.items.map(event => event.id))
    }
  }
  DecLoading()
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

function setFilter(value: any) {
  state.filters = value
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

definePageMeta({
  layout: 'auth',
  isAuth: true,
  isAdmin: true,
  middleware: ['guards-middleware'],
})
</script>

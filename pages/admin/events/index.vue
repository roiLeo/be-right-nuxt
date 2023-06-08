<template>
<PageAuthWrapper>
  <div class="h-full px-4 mt-4 sm:px-6 lg:px-8">
    <div class=" sm:flex-col lg:flex-row lg:items-center">
      <BaseInputSearch
        id="event-search"
        v-model="state.search"
        @update:search-query="searchEntity"
      />

      <div class="flex items-center justify-between">
        <EventTableFilters @setFilter="setEventStatusFilter" />

        <BaseButton
          :is-loading="uiStore.getUIIsLoading"
          :disabled="uiStore.getUIIsLoading"
          @click="resetFilters"
        >
          Reset Filters
        </BaseButton>
      </div>
    </div>

    <BaseLoader
      v-if="uiStore.getUIIsLoading || !state.isDirty"
      class="mt-10"
    />

    <div
      v-else-if="state.items.length <= 0"
      class="flex items-center py-4 pl-4 pr-3 space-x-2 text-sm font-medium text-gray-900 truncate whitespace-nowrap sm:pl-6"
    >
      <p>Aucun événement enregistré!</p>
      <BaseButton :href="{ name: RouteNames.CREATE_EVENT_STEP_1 }">
        Créer un événement
      </BaseButton>
    </div>

    <BaseTable v-else>
      <template #header>
        <EventTableHeader />
      </template>

      <template #default>
        <EventItem
          v-for="event in state.items"
          :key="event.id"
          :event="event"
        />
      </template>

      <template #footer>
        <BasePagination
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
import BasePagination from '~/components/Base/BasePagination.vue'
import BaseInputSearch from '~/components/Base/BaseInputSearch.vue'
import EventItem from '~/components/Event/Table/EventItem.vue'
import BaseLoader from '~/components/Base/BaseLoader.vue'
import BaseTable from '~/components/Base/BaseTable.vue'
import EventTableHeader from '~~/components/Event/Table/Header.vue'
import EventTableFilters from '~~/components/Event/Table/Filters.vue'
import { RouteNames } from '~~/helpers/routes'
import type { EventStatusEnum, EventType } from '~~/store'
import { useUiStore } from '~~/store'

const uiStore = useUiStore()
const { fetchManyAnswerForManyEvent } = answerHook()

async function fetchRelations(items: EventType[]) {
  if (items.length > 0) {
    await fetchManyAnswerForManyEvent(items.map(item => item.id))
  }
}

const {
  state,
  resetFilters,
  setFilter,
  searchEntity,
} = tableHook<EventType>('event', fetchRelations)

function setEventStatusFilter(status: EventStatusEnum | undefined) {
  if (status) {
    setFilter({ status })
  } else {
    state.filters = null
  }
}

definePageMeta({
  layout: 'auth',
  isAuth: true,
  isAdmin: true,
  middleware: ['guards-middleware'],
})
</script>

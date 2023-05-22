<template>
<div class="h-full min-h-screen px-4 sm:px-6 lg:px-8">
  <div
    v-if="authStore.isAuthUserAdmin"
    class=" sm:flex-col lg:flex-row lg:items-center"
  >
    <div class="w-full mb-4 sm:flex-auto">
      <BaseInput
        v-model="state.search"
        name="events"
        type="text"
        placeholder="Recherchez"
        @keyup="searchEntity($event)"
      />
    </div>
    <EventTableFilters />
  </div>

  <BaseTable>
    <template #header>
      <EventTableHeader />
    </template>
    <template #default>
      <div
        v-if="events.length <= 0"
        class="flex items-center py-4 pl-4 pr-3 space-x-2 text-sm font-medium text-gray-900 truncate whitespace-nowrap sm:pl-6"
      >
        <p>{{ noEventMessage }}</p>
        <BaseButton :href="{ name: RouteNames.CREATE_EVENT_STEP_1 }">
          Créer un événement
        </BaseButton>
      </div>

      <EventItem
        v-for="event in events"
        v-else
        :key="event.id"
        :event="event"
      />
    </template>
  </BaseTable>
</div>
</template>

<script setup lang="ts">
import type { EventType } from '@/types'
import { RouteNames } from '~~/helpers/routes'
import { useAuthStore, useTableStore } from '~~/store'

interface Props {
  noEventMessage?: string
  events: EventType[]
}

withDefaults(defineProps<Props>(), {
  noEventMessage: 'Aucun événement enregistré!',
  events: () => [],
})

const { setSearch } = useTableStore()
const authStore = useAuthStore()

const state = reactive({
  search: '',
  timeout: 0,
})

function searchEntity(event: KeyboardEvent) {
  console.warn(event)
  clearTimeout(state.timeout)
  state.timeout = window.setTimeout(() => {
    setSearch(state.search)
  }, 500)
}
</script>

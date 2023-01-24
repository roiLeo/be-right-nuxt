<template>
<div class="h-full min-h-screen px-4 sm:px-6 lg:px-8">
  <div class=" sm:flex-col lg:flex-row lg:items-center">
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
  <table class="w-full mt-8 overflow-visible divide-y divide-gray-300 shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
    <thead class="w-full">
      <EventTableHeader />
    </thead>
    <template v-if="events.length > 0">
      <tbody class="divide-y divide-gray-200">
        <EventItem
          v-for="event in events"
          :key="event.id"
          :event="event"
        />
      </tbody>
    </template>
    <div
      v-else
      class="flex items-center py-4 pl-4 pr-3 space-x-2 text-sm font-medium text-gray-900 truncate whitespace-nowrap sm:pl-6"
    >
      <p>{{ noEventMessage }}</p>
      <BaseButton :href="{ name: 'evenement-create' }">
        Créer un événement
      </BaseButton>
    </div>
  </table>
</div>
</template>

<script setup lang="ts">
import type { EventType } from '@/types'
import { useTableStore } from '~~/store'

interface Props {
  noEventMessage?: string
  events: EventType[]
}

withDefaults(defineProps<Props>(), {
  noEventMessage: 'Aucun événement enregistré!',
  events: () => [],
})

const { setSearch } = useTableStore()

const state = reactive({
  search: '',
  timeout: 0,
})

function searchEntity(event: KeyboardEvent) {
  clearTimeout(state.timeout)
  state.timeout = window.setTimeout(() => {
    setSearch(state.search)
  }, 500)
}
</script>

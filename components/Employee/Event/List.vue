<template>
<table class="w-full mt-8 overflow-visible divide-y divide-gray-300 shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
  <thead class="w-full">
    <EmployeeEventTableHeader />
  </thead>
  <template v-if="events.length > 0">
    <tbody class="divide-y divide-gray-200">
      <EmployeeEventTableItem
        v-for="event in events"
        :key="event.id"
        :event="event"
        :employee-id="employeeId"
      />
    </tbody>
  </template>
  <div
    v-else
    class="flex items-center py-4 pl-4 pr-3 space-x-2 text-sm font-medium text-gray-900 truncate whitespace-nowrap sm:pl-6"
  >
    <p>{{ noEventMessage }}</p>
  </div>
</table>
</template>

<script setup lang="ts">
import type { EventType } from '@/types'

interface Props {
  noEventMessage?: string
  events: EventType[]
  employeeId: number
}

withDefaults(defineProps<Props>(), {
  noEventMessage: 'Aucun événement',
  events: () => [],
})
</script>

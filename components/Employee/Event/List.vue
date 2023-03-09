<template>
<BaseTable>
  <template #header>
    <EmployeeEventTableHeader />
  </template>
  <template #default>
    <div
      v-if="events.length <= 0"
      class="flex items-center py-4 pl-4 pr-3 space-x-2 text-sm font-medium text-gray-900 truncate whitespace-nowrap sm:pl-6"
    >
      <p>{{ noEventMessage }}</p>
    </div>

    <EmployeeEventTableItem
      v-for="event in events"
      v-else
      :key="event.id"
      :event="event"
      :employee-id="employeeId"
    />
  </template>
</BaseTable>
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

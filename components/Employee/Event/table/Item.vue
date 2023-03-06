<template>
<tr>
  <td class="py-4 text-sm font-medium text-gray-900 truncate whitespace-nowrap sm:pl-6">
    {{ event.id }}
  </td>
  <td class="py-4 pl-4 text-sm font-medium text-gray-900 truncate whitespace-nowrap">
    {{ event.name }}
  </td>
  <td class="px-3 py-4 text-sm text-gray-500 truncate whitespace-nowrap">
    <EventStatusTag :status="event.status" />
  </td>
  <td class="relative py-4 pl-3 pr-4 text-sm font-medium text-right whitespace-nowrap sm:pr-6">
    <EmployeeEventTableActionButton
      :event="event"
      :employee-id="employeeId"
    />
  </td>
</tr>
</template>

<script setup lang="ts">
import type { EventType } from '@/types'

interface Props {
  event: EventType
  employeeId: number
}

defineProps<Props>()
</script>

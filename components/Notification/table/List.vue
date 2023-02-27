<template>
<div class="flex justify-center px-6">
  <table class="w-full max-w-4xl mt-8 overflow-visible divide-y divide-gray-300 shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
    <thead class="w-full">
      <NotificationTableHeader />
    </thead>
    <template v-if="notifications.length > 0">
      <tbody class="divide-y divide-gray-200">
        <NotificationTableItem
          v-for="notif in notifications"
          :key="notif.id"
          :notification="notif"
          :event="eventStore.getOne(notif.eventNotification?.eventId)"
        />
      </tbody>
    </template>
    <div
      v-else
      class="flex items-center py-4 pl-4 pr-3 space-x-2 text-sm font-medium text-gray-900 truncate whitespace-nowrap sm:pl-6"
    >
      <p>Vous n'avez pas de notifications</p>
    </div>
  </table>
</div>
</template>

<script setup lang="ts">
import type { NotificationType } from '~~/store'
import { useEventStore } from '~~/store'

interface Props {
  notifications: NotificationType[]
}

withDefaults(defineProps<Props>(), {
  notifications: () => [],
})

const eventStore = useEventStore()
</script>

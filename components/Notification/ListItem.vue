<template>
<MenuItem
  as="div"
>
  <div class="flex justify-between w-full p-2">
    <div class="flex items-center">
      <div
        v-if="!notification.readAt"
        class="w-2 h-2 mr-2 bg-purple-500 rounded-full"
      />
      <div>
        <p class="text-sm">
          {{ notification.title }}
        </p>
        <p class="mt-1 text-xs text-gray-400 font-font-extralight">
          {{ getDateDisplayedNotification(notification) }}
        </p>
      </div>
    </div>

    <NotificationActionButton
      :event-id="notification.eventNotification?.eventId"
      :notification-id="notification.id"
    />
  </div>
</MenuItem>
</template>

<script setup lang="ts">
import type { EventType, NotificationType } from '~~/store'

interface Props {
  notification: NotificationType
  event: EventType
}

defineProps<Props>()

const {
  getDateDisplayedNotification,
} = notificationHook()
</script>

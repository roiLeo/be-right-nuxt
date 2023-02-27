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
          {{ getNotifTranslation({
            type: notification.type,
            eventName: event?.name,
          }) }}
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
import type { NotificationType } from '~~/store'
import { useEventStore } from '~~/store'

interface Props {
  notification: NotificationType
}

const props = defineProps<Props>()

const {
  getNotifTranslation,
  getDateDisplayedNotification,
} = notificationHook()

const eventStore = useEventStore()

const event = computed(() => {
  if (props.notification.eventNotification?.eventId) {
    return eventStore.getOne(props.notification.eventNotification?.eventId)
  }
  return null
})
</script>

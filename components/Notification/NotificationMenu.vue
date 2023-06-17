<template>
<Menu
  as="div"
  class="relative ml-3"
>
  <div>
    <MenuButton
      class="flex items-center flex-shrink-0 p-4"
      data-cy="user-menu-button"
    >
      <NotificationBellBubbleIcon
        :has-red-bubble="hasAtLeastOneNotRead"
        :new-notification-nb="newNotificationNb"
      />
    </MenuButton>
  </div>
  <MenuItems
    class="absolute py-1 bg-white rounded-md shadow-lg w-96 ring-1 ring-black ring-opacity-5 focus:outline-none"
    :class="[isInHeader ? 'origin-top-left -left-80' : 'origin-top-right -top-24']"
    as="div"
  >
    <div class="flex items-center p-2 border-b border-gray-200">
      <span class="text-sm">Notifications</span>
    </div>

    <div class="py-2 space-y-2 divide-y">
      <template v-if="notifications?.length > 0">
        <NotificationListItem
          v-for="notif in notifications"
          :key="notif.id"
          :notification="notif"
          :event="getEventNotif(notif).value"
        />
      </template>
      <div v-else>
        Vous n'avez pas de notifications
      </div>
    </div>

    <div class="flex items-center p-2 border-t border-gray-200">
      <a
        :disabled="areAllRead"
        class="text-xs underline"
        :class="[areAllRead ? 'cursor-not-allowed opacity-40' : 'cursor-pointer']"
        :title="areAllRead ? 'Toutes les notifications ont été lues' : 'Marquer toutes les notifications comme lues'"
        @click="markAllAsRead"
      >Tout marquer comme lu</a>
    </div>
  </MenuItems>
</Menu>
</template>

<script setup lang="ts">
import type { NotificationType } from '~~/store'
import { useEventStore, useNotificationsStore } from '~~/store'

interface Props {
  isInHeader?: boolean
}

withDefaults(defineProps<Props>(), {
  isInHeader: false,
})

const notificationStore = useNotificationsStore()
const eventStore = useEventStore()
const { patchAsRead } = notificationHook()

const notifications = computed(() => notificationStore.getAllSorted)
const hasAtLeastOneNotRead = computed(() => notifications.value.some(notif => !notif.readAt))
const newNotificationNb = computed(() => notifications.value.filter(notif => !notif.readAt)?.length)
const areAllRead = computed(() =>
  notifications.value.every(notif => noNull(notif.readAt) && noUndefined(notif.readAt)))
const getEventNotif = (notif: NotificationType) => computed(() => {
  if (notif.eventNotification?.eventId) {
    return eventStore.getOne(notif.eventNotification?.eventId)
  }
})

async function markAllAsRead() {
  const noReadNotificationIds = notifications.value
    .filter(notif => !notif.readAt)
    .map(notif => notif.id)

  if (noReadNotificationIds?.length > 0) {
    await patchAsRead(noReadNotificationIds)
  }
}
</script>

<template>
<tr>
  <td class="py-4 text-sm font-medium text-gray-900 truncate whitespace-nowrap sm:pl-6">
    {{ notification.id }}
  </td>
  <td class="py-4 pl-4 text-sm font-medium text-gray-900 truncate whitespace-nowrap">
    {{ getNotifTranslation({
      type: notification.type,
      eventName: event?.name,
    }) }}
  </td>
  <td class="px-3 py-4 text-sm text-gray-500 truncate whitespace-nowrap">
    {{ $toFormat(notification.createdAt, 'D/MM/YY') }}
  </td>
  <td class="px-3 py-4 text-sm text-gray-500 truncate whitespace-nowrap">
    <span v-if="notification.readAt">{{ $toFormat(notification.readAt, 'D/MM/YY') }}</span>
    <span v-else>Non lue</span>
  </td>
  <td class="flex items-center justify-end py-4 pl-3 pr-4 space-x-2 text-sm font-medium text-right whitespace-nowrap sm:pr-6">
    <BaseButton
      :href="{
        name: 'evenement-show-id',
        params: {
          id: event?.id,
        },
      }"
    >
      Voir
    </BaseButton>
    <BaseButton
      :disabled="noNull(notification.readAt)"
      color="green"
    >
      Marquer comme vue
    </BaseButton>
  </td>
</tr>
</template>

<script setup lang="ts">
import type { EventType, NotificationType } from '~~/store'

interface Props {
  notification: NotificationType
  event: EventType
}

defineProps<Props>()

const { getNotifTranslation } = notificationHook()
</script>

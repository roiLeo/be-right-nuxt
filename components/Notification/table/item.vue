<template>
<tr>
  <td class="py-4 text-sm font-medium text-gray-900 truncate whitespace-nowrap sm:pl-6">
    {{ notification.id }}
  </td>
  <td class="py-4 pl-4 text-sm font-medium text-gray-900 truncate whitespace-nowrap">
    {{ getNotifTranslation({
      type: notification.type,
      eventName: getEvent?.name,
    }) }}
  </td>
  <td class="px-3 py-4 text-sm text-gray-500 truncate whitespace-nowrap">
    {{ $toFormat(notification.createdAt, 'D/MM/YY') }}
  </td>
  <td class="px-3 py-4 text-sm text-gray-500 truncate whitespace-nowrap">
    <span v-if="notification.readAt">Lue le {{ $toFormat(notification.readAt, 'D/MM/YY') }}</span>
    <span v-else>Non lue</span>
  </td>
  <td class="flex items-center justify-end py-4 pl-3 pr-4 space-x-2 text-sm font-medium text-right whitespace-nowrap sm:pr-6">
    <BaseButton
      :href="getLinkPath"
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
import type { NotificationType } from '~~/store'
import { useAnswerStore, useEventStore } from '~~/store'

interface Props {
  notification: NotificationType
}

const props = defineProps<Props>()

const { getNotifTranslation } = notificationHook()
const eventStore = useEventStore()
const answerStore = useAnswerStore()

const getLinkPath = computed(() => {
  if (props.notification.eventNotification?.eventId) {
    return {
      name: 'evenement-show-id',
      params: {
        id: props.notification.eventNotification?.eventId,
      },
    }
  }
  if (props.notification.eventNotification?.answerId) {
    const answer = answerStore.getOne(props.notification.eventNotification?.answerId)
    if (answer) {
      return {
        name: 'evenement-show-id',
        params: {
          id: answer?.eventId,
        },
      }
    }
  }
})

const getEvent = computed(() => {
  if (props.notification.eventNotification?.eventId) {
    return eventStore.getOne(props.notification.eventNotification?.eventId)
  }
  if (props.notification.eventNotification?.answerId) {
    const answer = answerStore.getOne(props.notification.eventNotification?.answerId)
    return eventStore.getOne(answer?.eventId)
  }
})
</script>

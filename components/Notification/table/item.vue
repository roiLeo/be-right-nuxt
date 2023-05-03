<template>
<tr>
  <td class="py-4 text-sm font-medium text-gray-900 truncate whitespace-nowrap sm:pl-6">
    {{ notification.id }}
  </td>
  <td class="py-4 pl-4 text-sm font-medium text-gray-900 truncate whitespace-nowrap">
    {{ notification.title }}
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
      :to="getLinkPath"
    >
      Voir
    </BaseButton>
    <BaseButton
      v-if="!notification.readAt"
      color="green"
      :is-loading="uiStore.getUIIsLoading"
      :disabled="uiStore.getUIIsLoading"
      @click="patchAsRead([notification.id])"
    >
      Marquer comme vue
    </BaseButton>
  </td>
</tr>
</template>

<script setup lang="ts">
import BaseButton from '~/components/Base/BaseButton.vue'
import type { NotificationType } from '~~/store'
import { useAnswerStore, useUiStore } from '~~/store'

interface Props {
  notification: NotificationType
}

const props = defineProps<Props>()

const answerStore = useAnswerStore()
const uiStore = useUiStore()

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

const { patchAsRead } = notificationHook()
</script>

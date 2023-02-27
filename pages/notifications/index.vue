<template>
<PageAuthWrapper>
  <NotificationTableList
    :notifications="notificationStore.getAllSorted"
  />
</PageAuthWrapper>
</template>

<script setup lang="ts">
import { uniq } from '@antfu/utils'
import {
  useAnswerStore,
  useEventStore,
  useNotificationsStore,
  useUiStore,
} from '~~/store'

const { IncLoading, DecLoading } = useUiStore()
const { fetchUserNotifications } = notificationHook()
const { fetchMany: fetchManyAnswers } = answerHook()
const { fetchMany: fetchManyEvents } = eventHook()

const notificationStore = useNotificationsStore()
const eventStore = useEventStore()
const answerStore = useAnswerStore()

onMounted(async () => {
  IncLoading()
  await fetchUserNotifications()

  const notifications = notificationStore.getAllArray

  if (notifications?.length > 0) {
    const eventIds: number[] = []
    const answerIds: number[] = []

    notifications.forEach(notif => {
      if (notif.eventNotification) {
        const { eventId, answerId } = notif.eventNotification
        if (eventId && !eventStore.isAlreadyInStore(eventId)) {
          eventIds.push(eventId)
        }
        if (answerId && !answerStore.isAlreadyInStore(answerId)) {
          answerIds.push(answerId)
        }
      }
    })

    if (answerIds.length > 0) {
      await fetchManyAnswers(uniq(answerIds))
    }

    if (eventIds.length > 0) {
      await fetchManyEvents(uniq(eventIds))
    }
  }
  DecLoading()
})

definePageMeta({
  layout: 'auth',
  isAuth: true,
  middleware: 'guards-middleware',
})
</script>

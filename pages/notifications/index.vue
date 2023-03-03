<template>
<PageAuthWrapper>
  <NotificationSubscriptionForm />

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
  useNotificationsSubscriptionStore,
  useUiStore,
  useUserStore,
} from '~~/store'

const { IncLoading, DecLoading } = useUiStore()
const { fetchUserNotifications } = notificationHook()
const { fetchSubscriptions } = notificationSubscriptionHook()
const { fetchMany: fetchManyAnswers } = answerHook()
const { fetchMany: fetchManyEvents } = eventHook()

const notificationStore = useNotificationsStore()
const notificationSubscriptionStore = useNotificationsSubscriptionStore()
const eventStore = useEventStore()
const answerStore = useAnswerStore()
const userStore = useUserStore()

onMounted(async () => {
  IncLoading()

  if (!userStore.getAuthUser?.notificationSubscriptionIds.every(id => notificationSubscriptionStore.isAlreadyInStore(id))) {
    await fetchSubscriptions()
  }
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

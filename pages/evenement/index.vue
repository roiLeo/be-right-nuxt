<template>
<PageAuthWrapper>
  <EventList
    :events="events"
  />
</PageAuthWrapper>
</template>

<script setup lang="ts">
import { useAuthStore, useEventStore, useTableStore, useUiStore, useUserStore } from '~~/store'

const eventStore = useEventStore()
const { IncLoading, DecLoading } = useUiStore()
const userStore = useUserStore()
const tableStore = useTableStore()
const authStore = useAuthStore()
const { setFilters } = tableStore

const { fetchEventsByUser, fetchAllEvents } = eventHook()
const { fetchManyAnswerForManyEvent } = answerHook()

const events = computed(() => {
  if (authStore.isAuthUserAdmin) {
    return eventStore.getAllArray
  }
  const userId = userStore.getAuthUserId
  if (userId) {
    return eventStore.getEventsByUserId(userId)
  }
  return []
})

// onBeforeRouteLeave(() => {
//   setFilters(null)
// })

watch(() => tableStore.getFinalUrl, async newValue => {
  IncLoading()
  eventStore.resetState()
  await fetchAllEvents(newValue)
  DecLoading()
})

onMounted(async () => {
  const userId = userStore.getAuthUserId
  const isAdmin = authStore.isAuthUserAdmin

  IncLoading()
  if (isAdmin) {
    await fetchAllEvents()
  }
  else if (userId) {
    const eventIds = userStore.getAuthUser?.eventIds

    if (eventIds && eventIds.length > 0) {
      const missingEventIds = eventIds.filter(id => !eventStore.isAlreadyInStore(id))
      if (missingEventIds && missingEventIds?.length > 0) {
        await fetchEventsByUser(userId)
      }

      await fetchManyAnswerForManyEvent(eventIds)
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

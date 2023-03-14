<template>
<PageAuthWrapper>
  <EventList
    :events="events"
  />
</PageAuthWrapper>
</template>

<script setup lang="ts">
import {
  useAuthStore,
  useEventStore,
  useTableStore,
  useUiStore,
  useUserStore,
} from '~~/store'

const eventStore = useEventStore()
const { IncLoading, DecLoading } = useUiStore()
const userStore = useUserStore()
const tableStore = useTableStore()
const authStore = useAuthStore()
// const { setFilters } = tableStore
const events = computed(() =>
  eventStore.getAllSorted(),
)

const { fetchEventsByUser, fetchAllEvents } = eventHook()
const { fetchManyAnswerForManyEvent } = answerHook()

// onBeforeRouteLeave(() => {
//   setFilters(null)
// })

watch(() => tableStore.getFinalUrl, async newValue => {
  IncLoading()
  if (authStore.isAuthUserAdmin && authStore.getIsLoggedIn) {
    eventStore.resetState()
    await fetchAllEvents(newValue)
  }
  DecLoading()
})

onMounted(async () => {
  const userId = userStore.getAuthUserId

  IncLoading()
  if (authStore.isAuthUserAdmin && authStore.getIsLoggedIn) {
    await fetchAllEvents()
  } else if (userId) {
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

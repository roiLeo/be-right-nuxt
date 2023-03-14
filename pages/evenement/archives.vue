<template>
<PageAuthWrapper>
  <EventList
    :events="events"
  />
</PageAuthWrapper>
</template>

<script setup lang="ts">
import {
  useEventStore,
  useUiStore,
  useUserStore,
} from '~~/store'

const eventStore = useEventStore()
const userStore = useUserStore()
const { IncLoading, DecLoading } = useUiStore()
const { fetchDeleted } = eventHook()

const events = computed(() =>
  eventStore.getAllSorted(true),
)

onMounted(async () => {
  const userId = userStore.getAuthUserId

  IncLoading()
  if (userId) {
    // const eventIds = userStore.getAuthUser?.eventIds

    // if (eventIds && eventIds.length > 0) {
    //   const missingEventIds = eventIds.filter(id => !eventStore.isAlreadyInStore(id))
    //   if (missingEventIds && missingEventIds?.length > 0) {
    await fetchDeleted()
    // }

    // await fetchManyAnswerForManyEvent(eventIds)
    // }
  }
  DecLoading()
})

definePageMeta({
  layout: 'auth',
  isAuth: true,
  middleware: 'guards-middleware',
})
</script>

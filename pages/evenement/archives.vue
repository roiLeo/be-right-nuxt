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
    await fetchDeleted()
  }
  DecLoading()
})

definePageMeta({
  layout: 'auth',
  isAuth: true,
  middleware: 'guards-middleware',
})
</script>

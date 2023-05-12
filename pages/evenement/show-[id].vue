<template>
<PageAuthWrapper>
  <EventDetails
    v-if="!uiStore.isLoading"
    :event-id="eventId"
  />

  <BaseLoader v-else />
</PageAuthWrapper>
</template>

<script setup lang="ts">
import { useEventStore, useUiStore } from '~~/store'

const eventStore = useEventStore()
const uiStore = useUiStore()
const { IncLoading, DecLoading } = uiStore

const { fetchEventWithRelations } = eventHook()

const route = useRoute()

const eventId = route.name === 'evenement-show-id' && parseInt(route.params.id.toString())

onMounted(async () => {
  if (eventId) {
    IncLoading()
    await fetchEventWithRelations(eventId)
    DecLoading()
  }
})

useHead({
  title: eventStore.getOne(eventId).name || 'Voir événement',
})

definePageMeta({
  layout: 'auth',
  isAuth: true,
  middleware: 'guards-middleware',
})
</script>

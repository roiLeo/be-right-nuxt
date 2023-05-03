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
import { useUiStore } from '~~/store'

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

definePageMeta({
  layout: 'auth',
  isAuth: true,
  middleware: 'guards-middleware',
})
</script>

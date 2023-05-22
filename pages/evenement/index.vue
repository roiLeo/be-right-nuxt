<template>
<PageAuthWrapper>
  <EventList
    :events="events"
  />
</PageAuthWrapper>
</template>

<script setup lang="ts">
import {
  useCompanyStore,
  useEventStore,
  useUiStore,
  useUserStore,
} from '~~/store'

const eventStore = useEventStore()
const { IncLoading, DecLoading } = useUiStore()
const userStore = useUserStore()
const companyStore = useCompanyStore()

const events = computed(() =>
  eventStore.getAllSorted(),
)

const { fetchEventsByCompany } = eventHook()
const { fetchManyAnswerForManyEvent } = answerHook()

onMounted(async () => {
  const userId = userStore.getAuthUserId

  IncLoading()
  if (userId) {
    const eventIds = companyStore.getAuthCompany?.eventIds

    if (eventIds && eventIds.length > 0) {
      const missingEventIds = eventIds.filter(id => !eventStore.isAlreadyInStore(id))
      if (missingEventIds && missingEventIds?.length > 0) {
        await fetchEventsByCompany()
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

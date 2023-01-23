<template>
show event
</template>

<script setup lang="ts">
import {
  useAnswerStore,
  useEmployeeStore,
  useEventStore,
  useUiStore,
  useUserStore,
} from '~~/store'

const { IncLoading, DecLoading } = useUiStore()
const eventStore = useEventStore()
const answerStore = useAnswerStore()
const employeeStore = useEmployeeStore()
const userStore = useUserStore()

const { fetchOne } = eventHook()
const { fetchManyAnswerForEvent } = answerHook()
const { fetchEmployeesByEventId } = employeeHook()
const { fetchMany: fetchManyUsers } = userHook()

const route = useRoute()

const eventId = parseInt(route.params.id.toString())

const event = computed(() => {
  if (eventId) {
    return eventStore.getOne(eventId)
  }
  return null
})

onMounted(async () => {
  if (eventId) {
    IncLoading()

    if (!eventStore.isAlreadyInStore(eventId)) {
      await fetchOne(eventId)
    }

    await fetchManyAnswerForEvent(eventId)

    const answers = answerStore.getManyByEventId(eventId)

    if (answers && answers.length > 0) {
      const missingEmployeeIds = answers
        .map(answer => answer.employeeId)
        .filter(id => id && !employeeStore.isAlreadyInStore(id)) as number[]

      if (missingEmployeeIds && missingEmployeeIds.length > 0) {
        await fetchEmployeesByEventId(eventId)
      }
    }

    if (event.value) {
      const ids = [event.value.createdByUserId, event.value.partnerId]
        .filter(id => id && !userStore.isAlreadyInStore(id)) as number[]

      if (ids && ids.length > 0) {
        await fetchManyUsers(ids)
      }
    }

    DecLoading()
  }
})

definePageMeta({
  layout: 'auth',
  isAuth: true,
  middleware: 'guards-middleware',
})
</script>

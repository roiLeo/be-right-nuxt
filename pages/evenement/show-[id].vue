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
import { uniq } from '@antfu/utils'
import {
  useAddressStore,
  useAnswerStore,
  useEmployeeStore,
  useEventStore,
  useFileStore,
  useUiStore,
  useUserStore,
} from '~~/store'

const uiStore = useUiStore()
const { IncLoading, DecLoading } = uiStore
const eventStore = useEventStore()
const answerStore = useAnswerStore()
const employeeStore = useEmployeeStore()
const userStore = useUserStore()
const addressStore = useAddressStore()
const fileStore = useFileStore()

const { fetchOne } = eventHook()
const { fetchManyAnswerForEvent } = answerHook()
const { fetchEmployeesByEventId } = employeeHook()
const { fetchMany: fetchManyUsers } = userHook()
const { fetchMany: fetchManyAddress } = addressHook()
const { fetchManyFiles } = fileHook()

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

    // TODO create a specific endpoint

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

      const missingAddressIds = []

      const user = userStore.getOne(event.value.createdByUserId)
      if (user && user.addressId && !addressStore.isAlreadyInStore(user.addressId)) {
        missingAddressIds.push(user.addressId)
      }

      if (event.value.addressId && !addressStore.isAlreadyInStore(event.value.addressId)) {
        missingAddressIds.push(event.value.addressId)
      }

      employeeStore.getMany(answers
        .map(answer => answer.employeeId)).forEach(emp => missingAddressIds.push(emp.addressId))

      const uniqAddressIds = uniq(missingAddressIds)
      if (uniqAddressIds?.length > 0) {
        await fetchManyAddress(uniqAddressIds)
      }

      if (event.value.filesIds?.length > 0) {
        const missingIds = fileStore.getMissingIds(event.value.filesIds)

        if (missingIds.length > 0) {
          await fetchManyFiles(missingIds)
        }
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

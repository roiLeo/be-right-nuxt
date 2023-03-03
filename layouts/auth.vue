<template>
<main class="flex min-h-screen bg-white dark:bg-blue-dark">
  <MenuDrawer />

  <div class="w-full lg:ml-64">
    <HeaderDashboard />
    <slot />
  </div>

  <EventModal
    v-if="isModalActive(ModalNameEnum.EVENT_FORM).value"
    :is-active="isModalActive(ModalNameEnum.EVENT_FORM).value"
  />

  <EmployeeModal
    v-if="isModalActive(ModalNameEnum.ADD_EMPLOYEE).value"
    :is-active="isModalActive(ModalNameEnum.ADD_EMPLOYEE).value"
    :mode="uiStore.getUiModalState.modalMode"
    :event-id="eventID"
    @close="CloseResetModalState"
  />
</main>
</template>

<script setup lang="ts">
import { uniq } from '@antfu/utils'
import { useAnswerStore, useAuthStore, useEventStore, useNotificationsStore, useUiStore, useUserStore } from '~~/store'
import { ModalNameEnum } from '~~/types'

const uiStore = useUiStore()
const { resetUiModalState } = uiStore
const eventStore = useEventStore()
const authStore = useAuthStore()
const userStore = useUserStore()
const answerStore = useAnswerStore()

const notificationStore = useNotificationsStore()
const { fetchUserNotifications } = notificationHook()
const { fetchMany: fetchManyAnswers } = answerHook()
const { fetchMany: fetchManyEvents } = eventHook()

const isModalActive = (modalName: ModalNameEnum) => computed(() =>
  uiStore.getUiModalState.isActive
  && uiStore.getUiModalState.modalName === modalName
  && !uiStore.getUiModalState.isLoading)

const eventID = computed(() => {
  if (uiStore.getUiModalState.data && uiStore.getUiModalState.data.eventId) {
    return eventStore.entities.byId[uiStore.getUiModalState.data.eventId].id
  }
})

function CloseResetModalState() {
  resetUiModalState()
}

onMounted(async () => {
  if (!authStore.isAuthUserAdmin && userStore.getAuthUser) {
    await fetchUserNotifications()
  }

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
})
</script>

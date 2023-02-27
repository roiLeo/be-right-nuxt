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
import { useAuthStore, useEventStore, useUiStore, useUserStore } from '~~/store'
import { ModalNameEnum } from '~~/types'

const uiStore = useUiStore()
const { resetUiModalState } = uiStore
const eventStore = useEventStore()
const authStore = useAuthStore()
const userStore = useUserStore()
const { fetchUserNotifications } = notificationHook()

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
})
</script>

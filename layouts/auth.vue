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
    v-if="isModalActive(ModalNameEnum.DELETE_EMPLOYEE).value"
    :is-active="isModalActive(ModalNameEnum.DELETE_EMPLOYEE).value"
    :mode="uiStore.getUiModalState.modalMode"
    :event-id="eventID"
    @close="CloseResetModalState"
  />

  <AddEmployeeToEventModal
    v-if="isModalActive(ModalNameEnum.ADD_EMPLOYEE).value && eventID"
    :is-active="isModalActive(ModalNameEnum.ADD_EMPLOYEE).value"
    :event-id="eventID"
  />

  <AddRecipientModal
    v-if="isModalActive(ModalNameEnum.ADD_RECIPIENT_TO_GROUP).value"
    :is-active="isModalActive(ModalNameEnum.ADD_RECIPIENT_TO_GROUP).value"
    :group-id="uiStore.getUiModalState.data?.groupId"
  />

  <DeleteConfirmModal
    v-if="isModalActive(ModalNameEnum.DELETE_CONFIRM_GROUP).value"
    :is-active="isModalActive(ModalNameEnum.DELETE_CONFIRM_GROUP).value"
    :group-id="uiStore.getUiModalState.data?.groupId"
  />

  <UserMissingInfoModal v-if="getMissingsInfos" />
</main>
</template>

<script setup lang="ts">
import AddEmployeeToEventModal from '~/components/Employee/AddEmployeeToEventModal.vue'
import AddRecipientModal from '~/components/Group/AddRecipientModal.vue'
import DeleteConfirmModal from '~/components/Group/DeleteConfirmModal.vue'
import { useEventStore, useUiStore } from '~~/store'
import { ModalNameEnum } from '~~/types'

const uiStore = useUiStore()
const { resetUiModalState } = uiStore
const eventStore = useEventStore()
const { fetchUserNotificationsAndRelations } = notificationHook()
const { getMissingsInfos } = companyHook()

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
  await fetchUserNotificationsAndRelations()
})
</script>

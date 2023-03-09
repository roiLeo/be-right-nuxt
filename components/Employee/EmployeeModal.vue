<template>
<BaseDeleteConfirmModal
  :title="getModalTitle"
  :is-active="isActive"
>
  <p class="text-sm text-gray-500">
    Êtes-vous sûr de vouloir supprimer ce destinataire ? Toutes ses données
    seront définitivement supprimés de nos serveurs pour toujours. Cette action ne peut pas être annulée.
  </p>
  <div class="mt-5 sm:space-x-8 sm:mt-4 sm:flex sm:items-center sm:justify-center">
    <BaseButton
      color="red"
      :is-loading="uiStore.getUIIsLoading"
      @click="deleteEmployee"
    >
      Supprimer
    </BaseButton>
    <BaseButton @click="close">
      Annuler
    </BaseButton>
  </div>
</BaseDeleteConfirmModal>
</template>

<script setup lang="ts">
import type { EmployeeType, ModalModeEnum } from '@/types'
import { useUiStore } from '~~/store'

interface Props {
  mode?: ModalModeEnum
  isActive: boolean
  employee?: EmployeeType
  eventId?: number
  userId?: number
}

const props = withDefaults(defineProps<Props>(), {
  isActive: false,
  employee: undefined,
  mode: undefined,
  eventId: undefined,
  userId: undefined,
})

const emit = defineEmits<{
  (e: 'close'): void
  (e: 'submit'): void
}>()

const uiStore = useUiStore()
const { IncLoading, DecLoading, resetUiModalState } = uiStore
const { deleteOne, getEmployeeFullname } = employeeHook()

async function deleteEmployee() {
  if (uiStore.getUiModalState && uiStore.getUiModalData?.employee) {
    IncLoading()
    const id = uiStore.getUiModalData.employee.id
    if (id) {
      await deleteOne(id)
    }
    DecLoading()
    close()
  }
}

function close() {
  resetUiModalState()
  emit('close')
}

const getModalTitle = computed(() => props.employee
  ? `Supprimer un destinataire ${getEmployeeFullname(props.employee)}`
  : 'Supprimer un destinataire')
</script>

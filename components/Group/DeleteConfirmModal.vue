<template>
<BaseDeleteConfirmModal
  :title="getModalTitle"
  :is-active="isActive"
>
  <p class="text-sm text-gray-500">
    Êtes-vous sûr de vouloir supprimer cette liste ?
  </p>
  <div class="mt-5 sm:space-x-8 sm:mt-4 sm:flex sm:items-center sm:justify-center">
    <BaseButton
      color="red"
      :is-loading="uiStore.getUIIsLoading"
      @click="deletegroupe"
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
import { useGroupStore, useUiStore } from '~~/store'

interface Props {
  isActive: boolean
}

withDefaults(defineProps<Props>(), {
  isActive: false,
})

const emit = defineEmits<{
  (e: 'close'): void
  (e: 'submit'): void
}>()

const groupStore = useGroupStore()
const uiStore = useUiStore()
const { IncLoading, DecLoading, resetUiModalState } = uiStore

const { deleteGroup } = groupHook()

async function deletegroupe() {
  if (uiStore.getUiModalState && uiStore.getUiModalData?.groupId) {
    IncLoading()
    await deleteGroup(uiStore.getUiModalData?.groupId)
    DecLoading()
    close()
  }
}

function close() {
  resetUiModalState()
  emit('close')
}

const getModalTitle = computed(() => uiStore.getUiModalData?.groupId && groupStore.getOne(uiStore.getUiModalData.groupId)
  ? `Supprimer la liste de diffusion: ${groupStore.getOne(uiStore.getUiModalData.groupId).name}`
  : 'Supprimer une liste de diffusion')
</script>

<template>
<BaseModal
  :is-active="isActive"
  @close="close"
>
  <div class="px-4 py-2 overflow-y-visible sm:flex sm:items-start">
    <div
      class="flex items-center justify-center flex-shrink-0 w-12 h-12 mx-auto bg-blue-100 rounded-full sm:mx-0 sm:h-10 sm:w-10"
    >
      <ExclamationTriangleIconOutline
        class="w-6 h-6 text-blue-600"
        aria-hidden="true"
      />
    </div>
    <div class="mt-3 space-y-2 text-center sm:mt-0 sm:ml-4 sm:text-left">
      <DialogTitle
        as="h3"
        class="text-lg font-medium leading-6 text-gray-900"
      >
        Ajouter un destinataire à la liste
      </DialogTitle>
    </div>
  </div>
  <EventFormStep2
    class="px-4 lg:px-8"
  />
</BaseModal>
</template>

<script setup lang="ts">
import { useUiStore } from '~~/store/ui/uiStore'

interface Props {
  isActive: boolean
}

defineProps<Props>()
const emit = defineEmits<{
  (e: 'close'): void
}>()

const uiStore = useUiStore()
const { resetUiModalState } = uiStore

function close() {
  resetUiModalState()
  emit('close')
}
</script>

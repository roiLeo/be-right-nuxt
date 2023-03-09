<template>
<BaseModal
  :is-active="isActive"
  @close="close"
>
  <div class="px-4 py-2 sm:flex sm:items-start">
    <div
      v-if="uiStore.getUiModalState.modalMode === ModalModeEnum.DELETE"
      class="flex items-center justify-center flex-shrink-0 w-12 h-12 mx-auto bg-red-100 rounded-full sm:mx-0 sm:h-10 sm:w-10"
    >
      <ExclamationTriangleIconOutline
        class="w-6 h-6 text-red-600"
        aria-hidden="true"
      />
    </div>
    <div class="mt-3 space-y-2 text-center sm:mt-0 sm:ml-4 sm:text-left">
      <DialogTitle
        as="h3"
        class="text-lg font-medium leading-6 text-gray-900"
      >
        {{ title }}
      </DialogTitle>
      <div
        v-if="uiStore.getUiModalState.modalMode === ModalModeEnum.DELETE"
        class="mt-2 space-y-4"
      >
        <slot />
      </div>
    </div>
  </div>
</BaseModal>
</template>

<script setup lang="ts">
import { ModalModeEnum } from '@/types'
import { useUiStore } from '~~/store'

interface Props {
  isActive: boolean
  title: string
}

withDefaults(defineProps<Props>(), {
  isActive: false,
})

const emit = defineEmits<{
  (e: 'close'): void
  (e: 'submit'): void
}>()

const uiStore = useUiStore()
const { resetUiModalState } = uiStore

function close() {
  resetUiModalState()
  emit('close')
}
</script>

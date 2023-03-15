<template>
<BaseModal
  :is-active="isActive"
  @close="close"
>
  <div class="px-4 py-2 sm:flex sm:items-start">
    <div class="flex items-center justify-center flex-shrink-0 w-12 h-12 mx-auto bg-blue-100 rounded-full sm:mx-0 sm:h-10 sm:w-10">
      <UserPlusIconOutline
        class="w-6 h-6 text-blue-600"
        aria-hidden="true"
      />
    </div>
    <div class="text-center sm:mt-0 sm:ml-4 sm:text-left">
      <DialogTitle
        as="h3"
        class="mt-2 text-lg font-medium leading-6 text-blue-600"
      >
        Créer un photographe
      </DialogTitle>
    </div>
  </div>
  <div class="mt-2 space-y-4">
    <PhotographerForm @submitted="validForm" />
  </div>
</BaseModal>
</template>

<script setup lang="ts">
import { useUiStore } from '~~/store'

interface Props {
  isActive: boolean
}

withDefaults(defineProps<Props>(), {
  isActive: false,
})

const emit = defineEmits<{
  (e: 'submitted'): void
}>()

function validForm() {
  emit('submitted')
  close()
}

const { resetUiModalState } = useUiStore()

function close() {
  resetUiModalState()
}
</script>

<template>
<BaseModal
  :is-active="isActive"
  @close="close"
>
  <div class="px-4 py-2 sm:flex sm:items-start">
    <div
      class="flex items-center justify-center flex-shrink-0 w-12 h-12 mx-auto bg-red-100 rounded-full sm:mx-0 sm:h-10 sm:w-10"
    >
      <ExclamationTriangleIconOutline
        class="w-6 h-6 text-red-600"
        aria-hidden="true"
      />
    </div>
    <div class="mt-3 space-y-4 text-center sm:mt-0 sm:ml-4 sm:text-left">
      <DialogTitle
        as="h3"
        class="text-lg font-medium leading-6 text-gray-900"
      >
        Êtes vous sur de supprimer l'Événement {{ event.name }} ?
      </DialogTitle>
      <div class="mt-2">
        <p class="text-sm text-gray-500">
          La suppression de l'événement entrainera la suppression de toutes les données qui lui sont associées
        </p>
      </div>
    </div>
  </div>
  <div class="mt-5 sm:space-x-8 sm:mt-4 sm:flex sm:items-center sm:justify-center">
    <BaseButton
      color="red"
      :is-loading="uiStore.getUIIsLoading"
      @click="deleteEvent"
    >
      Supprimer
    </BaseButton>
    <BaseButton @click="close">
      Annuler
    </BaseButton>
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
  (e: 'close'): void
}>()

const uiStore = useUiStore()
const { resetUiModalState, IncLoading, DecLoading } = uiStore
const { deleteOne } = eventHook()

const event = computed(() => uiStore.getUiModalData?.event)

async function deleteEvent() {
  const router = useRouter()
  if (uiStore.getUiModalData && uiStore.getUiModalData?.event) {
    IncLoading()
    await deleteOne(uiStore.getUiModalData.event.id)
    router.replace({
      name: 'evenement',
    })
    DecLoading()
  }
  close()
}

function close() {
  emit('close')
  resetUiModalState()
}
</script>

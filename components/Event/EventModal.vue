<template>
<BaseDeleteConfirmModal
  :title="`Êtes vous sur de archiver l'Événement ${event.name} ?`"
  :is-active="isActive"
>
  <p class="text-sm text-gray-500">
    Êtes-vous sûr de vouloir archiver cet événement ?
  </p>
  <div class="mt-5 sm:space-x-8 sm:mt-4 sm:flex sm:items-center sm:justify-center">
    <BaseButton
      color="red"
      :is-loading="uiStore.getUIIsLoading"
      @click="deleteEvent"
    >
      Archiver
    </BaseButton>
    <BaseButton @click="close">
      Annuler
    </BaseButton>
  </div>
</BaseDeleteConfirmModal>
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

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
</main>
</template>

<script setup lang="ts">
import { useUiStore } from '~~/store'
import { ModalNameEnum } from '~~/types'

const uiStore = useUiStore()

const isModalActive = (modalName: ModalNameEnum) => computed(() =>
  uiStore.getUiModalState.isActive
  && uiStore.getUiModalState.modalName === modalName
  && !uiStore.getUiModalState.isLoading)
</script>

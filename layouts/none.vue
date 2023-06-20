<template>
<main class="flex min-h-screen mx-auto bg-white">
  <div class="flex max-w-lg mx-auto">
    <slot />
  </div>

  <ClientOnly>
    <template v-if="isDisplayabled">
      <AnswerDownloadModal
        :answer-id="uiStore.getUiModalData?.answerId"
        :is-active="uiStore.getUiModalState?.isActive"
        :employee="uiStore.getUiModalData?.employee"
        :ref-html="uiStore.getUiModalData?.templateRef"
      />
    </template>
  </ClientOnly>
</main>
</template>

<script setup lang="ts">
import { useUiStore } from '~~/store'

const uiStore = useUiStore()

const isDisplayabled = computed(() =>
  uiStore.getUiModalData?.answerId
&& uiStore.getUiModalState?.isActive
&& uiStore.getUiModalData?.employee
&& uiStore.getUiModalData?.templateRef,
)
</script>

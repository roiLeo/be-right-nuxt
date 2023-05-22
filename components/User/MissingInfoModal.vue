<template>
<BaseModal
  :is-active="isActive"
  @close="close"
>
  <div class="px-4 py-2 sm:flex sm:items-start">
    <div class="flex items-center justify-center flex-shrink-0 w-12 h-12 mx-auto bg-blue-100 rounded-full sm:mx-0 sm:h-10 sm:w-10">
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
        Des informations sont manquantes sur votre compte.
      </DialogTitle>
      <div class="flex flex-col mt-2 space-y-4">
        <p>Plusieurs informations n'ont pas été complétées sur votre compte&nbsp;: </p>
        <ul class="w-full space-y-2 list-disc">
          <li
            v-for="(info, index) in getMissingsInfos"
            :key="index"
            class="flex items-center justify-between"
          >
            <span>-&nbsp;{{ info.label }}</span>
            <NuxtLink
              class="text-indigo-500 underline"
              :to="{ name: info.link.name }"
              @click="close"
            >
              Voir
            </NuxtLink>
          </li>
        </ul>
        <label id="missingInfo">
          <input
            type="checkbox"
            aria-labelledby="missingInfo"
            class="w-4 h-4 -mt-2 text-indigo-600 border-gray-300 rounded left-4 focus:ring-indigo-600"
            :checked="!flag"
            @change="toggleFlag"
          >
          <span class="ml-2">Ne plus demander</span>
        </label>
      </div>
    </div>
  </div>
</BaseModal>
</template>

<script setup lang="ts">
import { useStorage } from '@vueuse/core'

const emit = defineEmits<{
  (e: 'close'): void
}>()

const { getMissingsInfos } = companyHook()

const flag = useStorage('isMissingModalInfoActive', true)
const isOpen = ref(false)

const isActive = computed(() => {
  if (isOpen.value)
    return isOpen.value
  if (flag.value) {
    isOpen.value = getMissingsInfos.value.length > 0
    return isOpen.value
  }
  return flag.value
},
)

function close() {
  isOpen.value = false
  emit('close')
}

function toggleFlag() {
  flag.value = !flag.value
}
</script>

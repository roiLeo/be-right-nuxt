<template>
<div
  class="flex flex-col px-10 mt-4 text-left transition duration-500 ease-in-out transform rounded-lg shadow-2xl lg:mx-0 DarkModeAnimation hover:z-20 hover:scale-105 dark:shadow-2xl"
  :class="[
    isDark ? 'bg-blue-dark dark:bg-white-break dark:text-blue-dark sm:-mt-6' : 'bg-white dark:bg-blue-dark text-gray-600',
  ]"
>
  <div
    class="flex-1 dark:text-white"
    :class="isDark ? 'text-white' : 'text-gray-600'"
  >
    <div
      class="relative py-8 text-3xl font-bold text-left"
      :class="{ 'text-blue': isDark }"
    >
      {{ title }}
      <div
        v-if="nbFreeMonth"
        class="absolute top-0 right-0 px-2 py-3 text-sm text-white rounded-b-lg bg-red-light"
      >
        {{ nbFreeMonth }} mois gratuit
      </div>
    </div>
    <div
      class="w-full pt-4 text-4xl font-bold dark:text-white"
    >
      {{ price }}€
      <span class="text-base">/mois</span>
    </div>
    <slot name="details" />
  </div>
  <div
    class="flex-none p-6 mt-auto rounded-t-none rounded-b"
  >
    <div class="flex items-center justify-center">
      <button
        type="button"
        title="Commencer"
        class="px-8 py-4 mx-auto my-6 font-bold text-black transition duration-300 ease-in-out transform rounded-full shadow-lg lg:mx-0 gradient DarlModeAnimation focus:outline-none focus:shadow-outline hover:scale-105"
        :class="[
          { 'bg-white': isDark },
        ]"
        href="#Newsletter"
      >
        Commencez
      </button>
    </div>
  </div>
</div>
</template>

<script setup lang="ts">
interface Props {
  isDark?: boolean
  nbFreeMonth?: number
  price: number
  title: string
}

withDefaults(defineProps<Props>(), {
  isDark: false,
})
</script>

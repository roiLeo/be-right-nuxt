<template>
<nav class="flex-1 mt-5 space-y-4">
  <NuxtLink
    v-for="(item, index) in MENU_ITEMS"
    :key="index"
    :to="{ name: item.linkName }"
    exact-active-class="active-nuxt-link"
    class="flex items-center px-2 py-2 text-sm font-medium text-gray-600 rounded-md group dark:text-gray-300 hover:bg-gray-700 hover:text-white"
    @click="closeDrawer"
  >
    <component
      :is="item.icon"
      class="flex-shrink-0 w-6 h-6 mr-3 text-gray-600 dark:text-gray-400 group-hover:text-gray-300"
      aria-hidden="true"
    />
    {{ item.label }}
  </NuxtLink>
</nav>
</template>

<script setup lang="ts">
import { MENU_ITEMS } from '@/helpers/menu'
import { useUiStore } from '~~/store'

const uiStore = useUiStore()
const { closeDrawer } = uiStore
</script>

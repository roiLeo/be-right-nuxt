<template>
<div class="w-full max-w-md mx-auto space-y-2 bg-white rounded-2xl">
  <Disclosure
    v-slot="{ open }"
    default-open
  >
    <DisclosureButton
      class="flex justify-between w-full px-4 py-2 text-sm font-medium text-left text-purple-900 bg-purple-100 rounded-lg hover:bg-purple-200 focus:outline-none focus-visible:ring focus-visible:ring-purple-500 focus-visible:ring-opacity-75"
    >
      <span>Administration</span>
      <ChevronUpIcon
        :class="open ? 'rotate-180 transform' : ''"
        class="w-5 h-5 text-purple-500"
      />
    </DisclosureButton>
    <DisclosurePanel class="pt-4 pb-2 text-sm text-gray-500">
      <NuxtLink
        v-for="(item, index) in ADMIN_MENU_ITEMS"
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
    </DisclosurePanel>
  </Disclosure>

  <Disclosure v-slot="{ open }">
    <DisclosureButton
      class="flex justify-between w-full px-4 py-2 text-sm font-medium text-left text-purple-900 bg-purple-100 rounded-lg hover:bg-purple-200 focus:outline-none focus-visible:ring focus-visible:ring-purple-500 focus-visible:ring-opacity-75"
    >
      <span>Menu classique</span>
      <ChevronUpIcon
        :class="open ? 'rotate-180 transform' : ''"
        class="w-5 h-5 text-purple-500"
      />
    </DisclosureButton>
    <DisclosurePanel class="pt-4 pb-2 text-sm text-gray-500">
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
    </DisclosurePanel>
  </Disclosure>
</div>
</template>

<script setup lang="ts">
import { Disclosure, DisclosureButton, DisclosurePanel } from '@headlessui/vue'
import { ChevronUpIcon } from '@heroicons/vue/20/solid'
import { ADMIN_MENU_ITEMS, MENU_ITEMS } from '@/helpers/menu'
import { useUiStore } from '~~/store'

const uiStore = useUiStore()
const { closeDrawer } = uiStore
</script>

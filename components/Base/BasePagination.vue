<template>
<div
  v-if="totalPages > 1"
  class="flex items-center justify-center w-full px-4 py-4 space-x-4"
>
  <NuxtLink
    v-if="currentPage !== 1"
    class="text-sm font-medium text-gray-900 truncate whitespace-nowrap"
    :class="{ 'cursor-not-allowed opacity-50': currentPage === 1 }"
    :disabled="currentPage === 1"
    :to="{
      name: $route.name!,
      query: {
        ...$route.query,
        page: currentPage - 1,
      },
    }"

    @click="emit('pageChange', currentPage - 1)"
  >
    <ChevronLeftIcon class="w-4 h-4" />
  </NuxtLink>

  <NuxtLink
    v-for="nb in totalPages"
    :key="nb"
    class="text-sm font-medium text-gray-900 truncate whitespace-nowrap"
    :class="{ 'cursor-not-allowed opacity-50': currentPage === nb }"
    :disabled="currentPage === nb"
    :to="{
      name: $route.name!,
      query: {
        ...$route.query,
        page: nb,
      },
    }"
    @click="emit('pageChange', nb)"
  >
    {{ nb }}
  </NuxtLink>

  <NuxtLink
    v-if="currentPage !== totalPages"
    class="text-sm font-medium text-gray-900 truncate whitespace-nowrap"
    :class="{ 'cursor-not-allowed opacity-50': currentPage === totalPages }"
    :disabled="currentPage === totalPages"
    :to="{
      name: $route.name!,
      query: {
        ...$route.query,
        page: currentPage + 1,
      },
    }"
    @click="emit('pageChange', currentPage + 1)"
  >
    <ChevronRightIcon class="w-4 h-4" />
  </NuxtLink>
</div>
</template>

<script setup lang="ts">
import {
  ChevronLeftIcon,
  ChevronRightIcon,
} from '@heroicons/vue/24/solid'

interface Props {
  totalPages: number
  currentPage: number
}

defineProps<Props>()

const emit = defineEmits<{
  (e: 'pageChange', page: number): void
}>()
</script>

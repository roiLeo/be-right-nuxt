<template>
<div
  v-if="totalPages > 1"
  class="flex items-center justify-center w-full gap-2 px-4 py-4"
>
  <NuxtLink
    v-if="currentPage !== 1"
    class="flex items-center justify-center w-6 h-6 text-center rounded-full md:w-8 md:h-8 whitespace-nowrap ring-1 ring-inset ring-emerald-500 hover:bg-emerald-100"
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
    <ChevronLeftIcon class="w-4 h-4 font-medium md:w-6 md-h-6 text-emerald-500" />
  </NuxtLink>

  <NuxtLink
    v-for="nb in totalPages"
    :key="nb"
    class="flex items-center justify-center w-6 h-6 text-center text-gray-900 rounded-full md:w-8 md:h-8 whitespace-nowrap ring-1 ring-inset ring-gray-300 focus:outline-none hover:bg-gray-100"
    :class="{ 'cursor-not-allowed bg-emerald-500 ring-emerald-500 text-white hover:bg-emerald-800 hover:ring-emerald-800': currentPage === nb }"
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
    <span class="text-sm font-medium truncate ">{{ nb }}</span>
  </NuxtLink>

  <NuxtLink
    v-if="currentPage !== totalPages"
    class="flex items-center justify-center w-6 h-6 text-center rounded-full md:w-8 md:h-8 whitespace-nowrap ring-1 ring-inset ring-emerald-500 hover:bg-emerald-100"
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
    <ChevronRightIcon class="w-4 h-4 font-medium md:w-6 md-h-6 text-emerald-500" />
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

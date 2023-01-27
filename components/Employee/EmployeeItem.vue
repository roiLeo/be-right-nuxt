<template>
<li
  class="relative flex items-center px-6 py-5 space-x-3 cursor-pointer hover:bg-gray-100 focus-within:ring-2 focus-within:ring-inset focus-within:ring-pink-500"
  @click="clickEmployee"
>
  <div class="flex-shrink-0">
    <!-- <img
        class="w-10 h-10 rounded-full"
        :src="employee.imageUrl"
        alt=""
      > -->
  </div>
  <div class="flex-1 min-w-0">
    <div
      href="#"
      class="focus:outline-none"
    >
      <!-- Extend touch target to entire panel -->
      <span
        class="absolute inset-0"
        aria-hidden="true"
      />
      <p class="text-sm font-medium text-gray-900">
        {{ employee.firstName }} {{ employee.lastName }}
      </p>
      <p class="text-sm text-gray-500 truncate">
        {{ employee.email }}
      </p>
      <p class="text-sm text-gray-500 truncate">
        {{ employee.phone }}
      </p>
    </div>
  </div>
</li>
</template>

<script setup lang="ts">
import type { EmployeeType } from '@/types'

interface Props {
  employee: EmployeeType
}

defineProps<Props>()

const emits = defineEmits<{
  (e: 'click'): void
}>()

function clickEmployee() {
  emits('click')
}
</script>

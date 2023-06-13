<template>
<div
  v-if="employeeCreator && isOnlyForAdmin"
  class="max-w-5xl px-4 mx-auto sm:px-6 lg:px-8"
>
  <h2 class="text-sm font-medium text-gray-500">
    Créé par
  </h2>
  <div class="grid grid-cols-1 gap-4 mt-1 sm:grid-cols-2">
    <div class="relative flex items-center px-6 py-5 space-x-3 bg-white border border-gray-300 rounded-lg shadow-sm hover:border-gray-400 focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-pink-500">
      <div
        v-if="employeeCreator.profilePicture"
        class="flex-shrink-0"
      >
        <img
          class="w-10 h-10 rounded-full"
          :src="employeeCreator.profilePicture"
          alt="Photo de profile du créateur du destinataire"
        >
      </div>
      <div class="flex-1 min-w-0">
        <NuxtLink
          v-if="employeeCreator.id"
          :to="{ name: 'admin-user-show-id', params: { id: employeeCreator.id } }"
          class="focus:outline-none"
        >
          <span
            class="absolute inset-0"
            aria-hidden="true"
          />
          <p class="text-sm font-medium text-gray-900 underline cursor-pointer">
            {{ getUserfullName(employeeCreator) }}
          </p>
          <p class="text-sm text-gray-500 truncate">
            {{ employeeCreator.company?.name }}
          </p>
        </NuxtLink>
      </div>
    </div>
  </div>
</div>
</template>

<script setup lang="ts">
import type { UserType } from '@/types'

interface Props {
  employeeCreator: UserType
  isOnlyForAdmin?: boolean
}

defineProps<Props>()
const { getUserfullName } = userHook()
</script>

<template>
<div class="flex items-center mt-4 sm:mt-0">
  <RadioGroup v-model="filter">
    <RadioGroupLabel class="sr-only">
      Choisissez votre filtre
    </RadioGroupLabel>
    <div class="flex items-center space-x-2">
      <RadioGroupOption
        v-for="role in userRolesArray"
        :key="role"
        as="div"
        :name="role"
        :value="role"
      >
        <RadioGroupLabel
          as="label"
          class="cursor-pointer"
        >
          <UserRoleTag :role="role" />
        </RadioGroupLabel>
      </RadioGroupOption>
      <RadioGroupOption
        v-slot="{ active, checked }"
        as="div"
        :name="null"
        value=""
      >
        <div
          class="flex items-center justify-center px-2 py-2 text-sm font-medium uppercase border rounded-md cursor-pointer focus:outline-none sm:flex-1"
          :class="[active ? 'ring-2 ring-offset-2 ring-indigo-500' : '',
                   checked ? 'bg-indigo-600 border-transparent text-white hover:bg-indigo-700' : 'bg-white border-gray-200 text-gray-900 hover:bg-gray-50']"
        >
          <RadioGroupLabel as="label">
            tout
          </RadioGroupLabel>
        </div>
      </RadioGroupOption>
    </div>
  </RadioGroup>
</div>
</template>

<script setup lang="ts">
import UserRoleTag from '../UserRoleTag.vue'
import type { RoleEnum } from '@/types'
import { userRolesArray } from '@/types'

const emit = defineEmits<{
  (e: 'setFilter', status: RoleEnum | undefined): void
}>()

const filter = ref<undefined | RoleEnum>(undefined)

watch(() => filter.value, val => {
  emit('setFilter', val)
})
</script>

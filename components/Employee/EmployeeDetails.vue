<template>
<main class="relative z-0 flex-1 overflow-y-auto focus:outline-none xl:order-last">
  <EmployeeDetailProfile :employee="employee" />

  <EmployeeDetailTabs
    v-if="employee"
    :employee="employee"
  />
</main>
</template>

<script setup lang="ts">
import type { EmployeeType } from '@/types'

interface Props {
  employee: EmployeeType | null
}

defineProps<Props>()
</script>
